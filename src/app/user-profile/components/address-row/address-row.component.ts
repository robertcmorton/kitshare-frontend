import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { KSAddress } from '../../models/address.model';

@Component({
  selector: 'kit-address-row',
  templateUrl: './address-row.component.html',
  styleUrls: ['./address-row.component.scss']
})
export class AddressRowComponent implements OnInit {

  @Input() address: any;
  @Output() select = new EventEmitter<any>();
  @Output() make_default = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  onDeleteAddress() {
    this.select.emit(this.address.user_address_id);
  }

  makeAddressDefault() {
    this.make_default.emit(this.address.user_address_id);
  }

}
