import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Functionable } from '../interfaces/functionable';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class EntityService implements Functionable {

  constructor(
    private commonService: CommonService
  ){}

  _get(session: any): Observable<any> {
    const data = `/${(session.entityId? session.entityId: 0)}/${session.accessLevel? session.accessLevel: "NONE"}`;
    return this.commonService.getData("api/Entities", data);
  }

}
