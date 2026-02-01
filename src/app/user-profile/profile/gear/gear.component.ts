import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-gear',
  templateUrl: './gear.component.html',
  styleUrls: ['./gear.component.scss']
})
export class GearComponent implements OnInit {

  @Input() eachGear : any;
  
  constructor() { }

  ngOnInit() {
  }

}
