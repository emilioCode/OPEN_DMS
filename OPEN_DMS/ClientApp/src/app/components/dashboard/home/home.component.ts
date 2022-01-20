import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/index';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  session: any;
  constructor(
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.session = this.commonService.sessionStorage.get("user");
  }

}
