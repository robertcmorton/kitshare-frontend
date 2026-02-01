import { Component, OnInit, Input } from '@angular/core';
import { ContactInfoData, StateListOption, SuburbListOption } from "../../models/contact-info";

@Component({
  selector: 'app-address-readonly',
  templateUrl: './address-readonly.component.html',
  styleUrls: ['./address-readonly.component.scss']
})
export class AddressReadonlyComponent implements OnInit {

  @Input()
  defaultValue: ContactInfoData = new ContactInfoData();
  @Input() stateList: Array<StateListOption>;
  @Input() suburbList: Array<SuburbListOption>;
  constructor() { }

  ngOnInit() {
  }

}
