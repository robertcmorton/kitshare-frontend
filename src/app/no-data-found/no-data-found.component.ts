import { Component, OnInit } from '@angular/core';
import { BaseService } from "./../services/base.service";

@Component({
  selector: 'app-no-data-found',
  templateUrl: './no-data-found.component.html',
  styleUrls: ['./no-data-found.component.scss']
})
export class NoDataFoundComponent implements OnInit {

  noDataFoundText : string = "No Data Found.. ";
  constructor(public baseService: BaseService) { }

  ngOnInit() {
  	if(this.baseService.global.noDataText) {
  		this.noDataFoundText = this.baseService.global.noDataText;
  	}
  }

}
