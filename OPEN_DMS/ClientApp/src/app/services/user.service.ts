import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { IUser } from '../interfaces/iuser';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private commonService: CommonService) {  }

  loginUser = (user: IUser) => {
    return this.commonService.http
      .post(this.commonService.baseUrl + "api/Login", user);
  }
  
}
