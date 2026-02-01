import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'kit-address-error',
  templateUrl: './address-error.component.html',
  styleUrls: ['./address-error.component.scss']
})
export class AddressErrorComponent implements OnInit {

  errorMessage:string;

  @Input() set state(res) {
    console.log('res::', res);
    let errorArr = new Set(res.key);
    this.constructMessage([...errorArr]);
  }
  constructor() { }

  ngOnInit() {
  }

  constructMessage(keys) {
    let messageArr = keys;
    console.log('messageArr::', messageArr.length);
    if (keys.length == 1) {
      this.errorMessage = keys[0];
    }
    else if(keys.length == 2 ) {
      this.errorMessage = keys.join(' and ');
    }
    else {
      messageArr = keys.map((item,i) => {
        if(i !== 0 && i !== keys.length-1) {
          return `${item}`;
        }
        if(i === keys.length-1) {
          return `and ${item}`;
        }
        return item;
      });
      this.errorMessage  = messageArr.join(' , ');
    }
    // debugger;
  }

}
