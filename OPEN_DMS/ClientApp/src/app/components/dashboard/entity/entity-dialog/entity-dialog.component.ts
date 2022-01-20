import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CONSTANT } from 'src/app/enums/CONSTANT';
import { Entity } from 'src/app/classes/entity';
import { CommonService } from 'src/app/services/index';

@Component({
  selector: 'app-entity-dialog',
  templateUrl: './entity-dialog.component.html',
  styleUrls: ['./entity-dialog.component.css']
})
export class EntityDialogComponent implements OnInit {
  form:FormGroup;
  textButton: string = "";
  colorButton: string = "";
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder, 
    private dialogRef: MatDialogRef<any>,
    private commonService: CommonService
    ) { }

  ngOnInit() {
    this.swithOption(this.data.action);
  }

  initializeModalForm(disabled: boolean = false): void {
    this.form = this.formBuilder.group({
      Id: [ { value: this.data.element.Id, disabled: true }  ],
      EntityName: [ this.data.element.EntityName , Validators.required ],
      Disabled: [ this.data.element.Disabled ]
    });
    this.disableComponents(disabled);
  }

  handleSubmit(): void {
    const request: Entity = new Entity(
      Number(this.form.controls.Id.value),
      this.form.controls.EntityName.value,
      this.form.controls.Disabled.value,
    );

    const data = {
      operation: this.data.action,
      stringify: JSON.stringify(request)
    }

    this.commonService.postData("api/Entities", data)
      .subscribe(res =>{
        this.closeDialog(res.success);
      })
    
  }

  closeDialog(result:any = null){
    this.dialogRef.close(result);
  }

  swithOption(option: string){
    switch (option) {
      case CONSTANT.CREATE:
        const init: Entity = new Entity(0, null, false);
        this.data.element =  init;
        this.textButton = "Create";
        this.colorButton = "primary";
        this.initializeModalForm();
        break;
      case CONSTANT.EDIT:
        this.initializeModalForm();
        this.textButton = "Save";
        this.colorButton = "primary";
        break;
      case CONSTANT.DELETE:
        this.initializeModalForm(true);
        this.textButton = this.form.controls.Disabled.value? "Enable": "Disable";
        this.colorButton = "warn";
        break;
      default:
        this.initializeModalForm(true);
        break;
    }
  }

  disableComponents(disabled: boolean = false): void{
    if(disabled){
      this.form.controls.Id.disable();
      this.form.controls.EntityName.disable();
      this.form.controls.Disabled.disable();
    }
  }
}
