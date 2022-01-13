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
        if(res.success){
            this.commonService.sessionStorage.set("user", res.data);
            this.commonService.route.navigate(['dashboard']);
        }else{
          this.modalMessageService.error(res.message);
        }
      }, error => {
        this.modalMessageService.error(error);
      });
  }
 
}
