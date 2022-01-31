import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SessionStorageService } from 'ngx-webstorage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public route: Router;
  public baseUrl;
  public headers = new HttpHeaders().set("content-type", "application/json");
  public http;

  constructor(
    private _http: HttpClient,  
    @Inject('BASE_URL') _baseUrl: string,  
    private _route: Router,
    private sessionSt: SessionStorageService
    ) {
    this.baseUrl = _baseUrl;
    this.route = _route;
    this.http = _http;
  }

  sessionStorage = {
    set: (name: string, value: Object) => {
      const valueString = value//JSON.stringify(value);
      this.sessionSt.store(name, valueString);
    },

    get: (name: string) => {
      const valueString = this.sessionSt.retrieve(name)? this.sessionSt.retrieve(name) :null;
      
      if(!valueString || valueString === 'undefined') return;

      // return JSON.parse(valueString);
      return valueString;
    },

    delete: (name: string) => {
      this.sessionSt.clear(name);
    },
    
    deleteAll: () => {
      const keys = Object.keys(this.sessionSt);

      keys.forEach(key => {
        this.sessionStorage.delete(key);
      });
    },

    deleteArray: (keyNames: Array<string>) => {
      keyNames.forEach(key => {
        this.sessionStorage.delete(key);
      });
    }
  }

  // Http Services
  getData(api: string, data: string = ''): Observable<any> {
    return this.http.get(this.baseUrl + api + data);
  }
  
  postData(api: string, data: any): Observable<any> {
    return this.http.post(this.baseUrl + api, data);
  }
}
