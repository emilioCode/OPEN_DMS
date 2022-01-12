import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEntity } from '../interfaces/ientity';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class EntityService {

  constructor(private commonService: CommonService) { }


  getEntities(api: string, data: string): Observable<IEntity[]> {
    return this.commonService.http.get(this.commonService.baseUrl + api + data);
  }

}
