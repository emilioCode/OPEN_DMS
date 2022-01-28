import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private spinner: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public spinnerEmmiter: Observable<boolean> = this.spinner.asObservable();

  show = (): void  =>  {
    this.spinner.next(true);
  }

  hide = (): void  => {
    this.spinner.next(false);
  }
}