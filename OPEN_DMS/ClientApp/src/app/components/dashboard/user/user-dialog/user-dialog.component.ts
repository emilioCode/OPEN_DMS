import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { User } from 'src/app/classes/user';
import { CONSTANT } from 'src/app/enums/CONSTANT';
import { CommonService, EntityService, TeamService, ModalMessageService } from 'src/app/services';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css']
})
export class UserDialogComponent implements OnInit {
  form:FormGroup;
  textButton: string = "";
  colorButton: string = "";
  hide: boolean = true;
  isDisabled: boolean;
  entities$: Observable<any>;
  teams$: Observable<any>;
  session: any; 
  accessLevels = [
    CONSTANT.NONE,
    CONSTANT.STANDART,
    CONSTANT.ADMINISTRATOR
  ];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder, 
    private dialogRef: MatDialogRef<any>,
    private commonService: CommonService,
    private entityService: EntityService,
    private teams: TeamService,
    private modalMessageService: ModalMessageService
  ) { }

  ngOnInit() {
    this.session = this.commonService.sessionStorage.get("user");
    if(CONSTANT.ROOT == this.session.accessLevel) this.accessLevels.push(CONSTANT.ROOT);
    this.entities$ =  this.entityService._get(this.session);
    this.teams$ =  this.teams._get(this.session);
    this.swithOption(this.data.action);
  }

  initializeModalForm(condition: string = null): void {
    this.form = this.formBuilder.group({
      Id: [ { value: this.data.element.Id, disabled: true } ],
      CompleteName: [ this.data.element.CompleteName, Validators.required ],
      Description: [ this.data.element.Description ],
      UserAccount: [ this.data.element.UserAccount, Validators.required ],
      UserPassword: [ this.data.element.UserPassword, Validators.required ],
      TeamId: [ this.data.element.TeamId, Validators.required ],
      EntityId: [ this.data.element.EntityId, Validators.required ],
      AccessLevel: [ this.data.element.AccessLevel, Validators.required ],
      CreatedDate: [ this.data.element.CreatedDate ],
      ExpirationDate: [ this.data.element.ExpirationDate ],
      Disabled: [ this.data.element.Disabled ]
    });
    this.disableComponents(condition);
  }

  swithOption(option: string){
    switch (option) {
      case CONSTANT.CREATE:
        const today = new Date();
        const init: User = new User(0, null, null, null, null, Number(this.session.teamId), Number(this.session.entityId), null, today, null, false);
        this.data.element =  init;
        this.textButton = "Create";
        this.colorButton = "primary";
        this.initializeModalForm();
        break;
      case CONSTANT.EDIT:
        this.textButton = "Save";
        this.colorButton = "primary";
        this.initializeModalForm('possibles');
        break;
      case CONSTANT.DELETE:
        this.initializeModalForm('all');
        this.textButton = this.form.controls.Disabled.value? "Enable": "Disable";
        this.colorButton = "warn";
        break;
      case "change_password":
        this.textButton = "Save";
        this.colorButton = "primary";
        this.initializeModalForm('change_password');
        break;
      default:
        this.initializeModalForm('all');
        break;
    }
  }

  disableComponents(condition: string = null): void{
    switch (condition) {
      case 'all':
        this.form.controls.Id.disable();
        this.form.controls.CompleteName.disable();
        this.form.controls.Description.disable();
        this.form.controls.UserAccount.disable();
        this.form.controls.UserPassword.disable();
        this.form.controls.TeamId.disable();
        this.form.controls.EntityId.disable();
        this.form.controls.AccessLevel.disable();
        this.form.controls.CreatedDate.disable();
        this.form.controls.ExpirationDate.disable();
        this.form.controls.Disabled.disable();
        this.isDisabled = true;
        break;
      
      case 'possibles':
          this.form.controls.UserAccount.disable();
          this.form.controls.UserPassword.disable();
          this.form.controls.CreatedDate.disable();
          this.isDisabled = true;
          break;
      case 'change_password':
        this.form.controls.Id.disable();
        this.form.controls.CompleteName.disable();
        this.form.controls.Description.disable();
        this.form.controls.UserAccount.disable();
        this.form.controls.UserPassword.setValue(null);
        this.form.controls.TeamId.disable();
        this.form.controls.EntityId.disable();
        this.form.controls.AccessLevel.disable();
        this.form.controls.CreatedDate.disable();
        this.form.controls.ExpirationDate.disable();
        this.form.controls.Disabled.disable();
        break;
      default:
          this.form.controls.CreatedDate.disable();
        break;
    }

  }

  closeDialog(result:any = null){
    this.dialogRef.close(result);
  }

  handleSubmit(): void {
    let sixMothLater = new Date()
    sixMothLater.setMonth(6);

    const request: User = new User(
      Number(this.form.controls.Id.value),
      this.form.controls.CompleteName.value,
      this.form.controls.Description.value,
      this.form.controls.UserAccount.value,
      this.form.controls.UserPassword.value,
      Number(this.form.controls.TeamId.value),
      Number(this.form.controls.EntityId.value),
      this.form.controls.AccessLevel.value,
      this.form.controls.CreatedDate.value,
      this.form.controls.ExpirationDate.value? this.form.controls.ExpirationDate.value: sixMothLater,
      this.form.controls.Disabled.value
    );

    const data = {
      operation: this.data.action,
      stringify: JSON.stringify(request)
    }

    this.commonService.postData("api/Users", data)
      .subscribe(res =>{
        if(res.success)
          this.closeDialog(res.success)
        else
          this.modalMessageService.error(res.message)
      },err=> {
        console.log(err)
        this.modalMessageService.error(err)
      })
    
  }

}
