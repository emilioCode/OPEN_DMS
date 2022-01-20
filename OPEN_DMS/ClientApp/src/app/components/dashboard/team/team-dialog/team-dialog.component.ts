import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CONSTANT } from 'src/app/enums/CONSTANT';
import { ITeam } from 'src/app/interfaces/iteam';
import { CommonService, EntityService } from 'src/app/services/index';

@Component({
  selector: 'app-team-dialog',
  templateUrl: './team-dialog.component.html',
  styleUrls: ['./team-dialog.component.css']
})
export class TeamDialogComponent implements OnInit {
  form:FormGroup;
  textButton: string = "";
  colorButton: string = "";
  hide: boolean = true;
  isDisabled: boolean;
  entities$: Observable<any>;
  session: any; 

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder, 
    private dialogRef: MatDialogRef<any>,
    private commonService: CommonService,
    private entityService: EntityService
  ) { }

  ngOnInit() {
    this.session = this.commonService.sessionStorage.get("user");
    this.swithOption(this.data.action);
    this.getEntities(this.session);
  }

  initializeModalForm(disabled: boolean = false): void {
    this.form = this.formBuilder.group({
      Id: [ { value: this.data.element.Id, disabled: true }  ],
      EntityId: [ this.data.element.EntityId, Validators.required ],
      TeamName: [ this.data.element.TeamName, Validators.required ],
      PathRoot: [ this.data.element.PathRoot, Validators.required ],
      TelephoneNumber: [ this.data.element.TelephoneNumber, Validators.pattern(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g) ],
      HostName: [ this.data.element.HostName ],
      PortNumber: [ this.data.element.PortNumber ],
      Email: [ this.data.element.Email ],
      Pass: [ this.data.element.Pass ],
      Disabled: [ this.data.element.Disabled ]
    });
    this.disableComponents(disabled);
  }

  handleSubmit(): void {
    const request: ITeam = {
      Id: Number(this.form.controls.Id.value),
      EntityId: Number(this.form.controls.EntityId.value),
      TeamName: this.form.controls.TeamName.value,
      PathRoot: this.form.controls.PathRoot.value,
      TelephoneNumber: this.form.controls.TelephoneNumber.value,
      HostName: this.form.controls.HostName.value,
      PortNumber: this.form.controls.PortNumber.value? Number(this.form.controls.PortNumber.value): null,
      Email: this.form.controls.Email.value,
      Pass: this.form.controls.Pass.value,
      Disabled: this.form.controls.Disabled.value,
    };

    const data = {
      operation: this.data.action,
      stringify: JSON.stringify(request)
    }

    this.commonService.postData("api/Teams", data)
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
        const init: ITeam = {
          Id: 0,
          EntityId: Number(this.session.entityId),
          TeamName: null,
          PathRoot: null,
          TelephoneNumber: null,
          HostName: null,
          PortNumber: null,
          Email: null,
          Pass: null,
          Disabled: false
        };
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
      this.form.controls.EntityId.disable();
      this.form.controls.TeamName.disable();
      this.form.controls.PathRoot.disable();
      this.form.controls.TelephoneNumber.disable();
      this.form.controls.HostName.disable();
      this.form.controls.PortNumber.disable();
      this.form.controls.Email.disable();
      this.form.controls.Pass.disable();
      this.form.controls.Disabled.disable();
      this.isDisabled = disabled;
    }

  }

  getEntities(session: any): void{
    this.entities$ =  this.entityService._get(session);
  }

}
