import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Functionable } from '../interfaces/functionable';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class TeamService implements Functionable {

  constructor(
    private commonService: CommonService
  ) { }

  _get(session: any): Observable<any> {
    const data = `?entityid=${session.entityId}`;
    return this.commonService.getData("api/Teams", data);
  }
}
