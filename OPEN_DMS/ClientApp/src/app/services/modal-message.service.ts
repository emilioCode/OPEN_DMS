import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ModalMessageService {

  constructor(private _snackBar: MatSnackBar) { }

  error(message: string, action: string, horizontalPosition: any = 'center', verticalPosition: any = 'bottom', duration: number = 5000){
    this._snackBar.open(message, action,{
      duration: duration,
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition
    });
  }

}
