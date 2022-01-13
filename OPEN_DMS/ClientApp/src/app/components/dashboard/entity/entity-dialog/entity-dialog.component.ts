import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CONSTANT } from 'src/app/enums/CONSTANT';
import { IEntity } from 'src/app/interfaces/ientity';
import { CommonService } from 'src/app/services/common.service';

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
    switch (this.data.action) {
      case CONSTANT.CREATE:
        this.data.element = {
          Id: 0,
          EntityName: '',
          Disabled: false
        }
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
        this.initializeModalForm();
        this.form.controls.Id.disable();
        this.form.controls.EntityName.disable();
        this.form.controls.Disabled.disable();
        this.textButton = this.form.controls.Disabled.value? "Enable": "Disable";
        this.colorButton = "warn";
          break;
      default:
        this.initializeModalForm();
        this.form.controls.Id.disable();
        this.form.controls.EntityName.disable();
        this.form.controls.Disabled.disable();
        break;
    }
  }

  initializeModalForm(): void {
    this.form = this.formBuilder.group({
      Id: [ { value: this.data.element.Id, disabled: true }  ],
      EntityName: [ this.data.element.EntityName , Validators.required ],
      Disabled: [ this.data.element.Disabled ]
    });
  }

  handleSubmit(): void {
    const entityReq: IEntity = {
      Id: Number(this.form.controls.Id.value),
      EntityName: this.form.controls.EntityName.value,
      Disabled: this.form.controls.Disabled.value,
    }

    const data = {
      operation: this.data.action,
      stringify: JSON.stringify(entityReq)
    }

    this.commonService.postData("api/Entities", data)
      .subscribe(res =>{
        this.closeDialog(res.success);
      })
    
  }

  closeDialog(result:any = null){
    this.dialogRef.close(result);
  }

}
