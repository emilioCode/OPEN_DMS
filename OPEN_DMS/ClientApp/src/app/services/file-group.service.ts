import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Functionable } from '../interfaces/functionable';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class FileGroupService implements Functionable {

  constructor(
    private commonService: CommonService
  ) { }

  _get(session: any, teamId: number = null): Observable<any> {
    // https://localhost:44313/api/File?userAccount=root&passwordAccount=123456&teamId=1
    const extra = teamId? `&teamId=${teamId}`:'';
    const data = `?userAccount=${(session.userName)}&passwordAccount=${session.hashCode}${extra}`;
    return this.commonService.getData("api/File", data);
  }
}
