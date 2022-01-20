import { Injectable } from '@angular/core';
import { CommonService } from './index';
import { IUser } from '../interfaces/iuser';
import { Functionable } from '../interfaces/functionable';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService implements Functionable {

  constructor(private commonService: CommonService) {  }

  loginUser = (user: IUser) => {
    return this.commonService.http
      .post(this.commonService.baseUrl + "api/Login", user);
  }

  _get(session: any): Observable<any> {
    const data = `?userAccount=${session.userName}`;
    return this.commonService.getData("api/Users", data);
  }
}
