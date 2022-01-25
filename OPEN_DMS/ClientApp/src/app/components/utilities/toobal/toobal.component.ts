import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-toobal',
  templateUrl: './toobal.component.html',
  styleUrls: ['./toobal.component.css']
})
export class ToobalComponent {
  @Input() title: string = null;
  @Input() iconTitle: string = null;
  @Input() colorButton: string = null;
  @Input() iconButton: string = null;
  @Input() textButton: string = null;

  @Output() clickButton = new EventEmitter<boolean>();
  
  constructor() { }
  
  clickBtn() {
    this.clickButton.emit(true);
  };

}
