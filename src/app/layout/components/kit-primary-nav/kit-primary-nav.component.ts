import { Component, OnInit, Input, ViewChild } from '@angular/core';
// import { MatMenuTrigger } from '@angular/material';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-kit-primary-nav',
  templateUrl: './kit-primary-nav.component.html',
  styleUrls: ['./kit-primary-nav.component.scss']
})
export class KitPrimaryNavComponent implements OnInit {

  status;
  isOpen: boolean = false;

  @ViewChild(MatMenuTrigger, { static: true }) trigger: MatMenuTrigger;

  @Input() set closeMenu(res) {
    this.status = res;
    this.toggleMenu(this.status);
  }

  togglePrimaryNav() {
    this.isOpen = !this.isOpen;
    if(this.isOpen) {
      this.trigger.openMenu();
    }else {
      this.trigger.closeMenu();
    }
  }

  toggleMenu(status) {
    if(status) {
      this.trigger.closeMenu();
    }
  }
  constructor() { }

  ngOnInit() {

  }

}
