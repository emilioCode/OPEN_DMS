import { Observable } from "rxjs";

export interface Functionable {
    _get(input: any): Observable<any> ;
}