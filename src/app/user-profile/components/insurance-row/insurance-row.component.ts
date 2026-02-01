import { Component, OnInit, Input, ElementRef, ViewChild, HostBinding, Output, EventEmitter } from '@angular/core';
import { Insurance } from '../../models/insurance.model';
import { UserProfileService } from '../../user-profile.service';

@Component({
  selector: 'kit-insurance-row',
  templateUrl: './insurance-row.component.html',
  styleUrls: ['./insurance-row.component.scss']
})
export class InsuranceRowComponent implements OnInit {

  @Input() data: Insurance;
  @ViewChild('closeimageModal', { static: true }) closeimageModal: ElementRef;

  @Output() removeInsurance:EventEmitter<any> = new EventEmitter()
  @HostBinding('class') get getClass() {
    return this.data.is_active ? 'active' : 'inactive';
  }
  statusToClassMap = {
    'Pending': 'orange',
    'Approved': 'green',
    'Expired': 'red'
  }
  constructor(private userProfileService: UserProfileService) { }

  ngOnInit() {
  }

  getStatusClass(status) {
    return this.statusToClassMap[status];
  }

  makeInactive() {
    this.userProfileService.setInsuranceInactive(this.data);
  }
  deleteInsurance(ins_id){
    this.removeInsurance.emit(ins_id)
  }

}
