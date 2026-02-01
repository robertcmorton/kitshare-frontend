import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Insurance } from '../../models/insurance.model';

@Component({
  selector: 'kit-insurance-list',
  templateUrl: './insurance-list.component.html',
  styleUrls: ['./insurance-list.component.scss']
})
export class InsuranceListComponent implements OnInit {

  @Input() list: Array<Insurance>;
  @Output() deleteInsuranceParent:EventEmitter<any> = new EventEmitter()
  
  constructor() { }

  ngOnInit() {
  }

  deleteInsurance(id) {
  	this.deleteInsuranceParent.emit(id);
  }

}
