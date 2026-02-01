import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { KSAddress } from '../../models/address.model';

@Component({
  selector: 'kit-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.scss']
})
export class AddressListComponent implements OnInit {

  @Input() list: Array<KSAddress>;
  @Output() select = new EventEmitter<number>();
  @Output() make_default = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  onSelect(id) {
    this.select.emit(id);
  }

  makeDefault(id) {
    this.make_default.emit(id);
  }

}
