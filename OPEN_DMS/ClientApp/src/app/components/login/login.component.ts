import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUser } from 'src/app/interfaces/iuser';
import { CommonService } from 'src/app/services/common.service';
import { ModalMessageService } from 'src/app/services/modal-message.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder, 
    private modalMessageService: ModalMessageService, 
    private userService: UserService,
    private commonService: CommonService
    ) { }

  ngOnInit(): void {
    this.commonService.route.navigate(['dashboard']);
    this.form = this.formBuilder.group({
      user: ['', Validators.required],
      password: ['', Validators.required]
    });

    if( typeof(this.commonService.sessionStorage.get("user")) == "object" ) this.commonService.route.navigate(['dashboard']);
  }

  logIn(){
    const user: IUser = {
      UserAccount: this.form.value.user,
      UserPassword: this.form.value.password
    }
    
    this.userService.loginUser(user)
      .subscribe(res => {
        if(res !== undefined && res !== null && res !== '' ){
          this.commonService.sessionStorage.set("user", res );
          this.commonService.route.navigate(['dashboard']);
        }else{
          this.modalMessageService.error('Please check the user and password and try it again.\nIf the issue continues contact to the administrator.','');
        }
      },error => {
        this.modalMessageService.error('Error: Please contact to the administrator.','');
      });
    
      
  }
 
}
