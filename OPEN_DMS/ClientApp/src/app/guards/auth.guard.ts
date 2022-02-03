import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CONSTANT } from '../enums/CONSTANT';
import { CommonService, ModalMessageService } from '../services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  session:any;
  constructor(
    private commonService: CommonService,
    private modalMessageService: ModalMessageService
    ){
    this.session = this.commonService.sessionStorage.get("user");
   }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let res = false;
      const isAdministrator = this.session.accessLevel == CONSTANT.ROOT || this.session.accessLevel == CONSTANT.ADMINISTRATOR;
      if(isAdministrator){
        res = true;
      }else{
        res = false;
        this.modalMessageService.error('Do not have permissions to navigate into this module. Please contact to the administrator.', '', 'center', 'top');
      }
      return res;
  }
  
}
