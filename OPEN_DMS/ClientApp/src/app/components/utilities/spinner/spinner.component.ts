import { Component } from '@angular/core';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent {

  public show: boolean;
  constructor(private spinner: SpinnerService) {
    this.spinner.spinnerEmmiter.subscribe( (value: boolean) => {
      this.show = value;
    });
  }
}