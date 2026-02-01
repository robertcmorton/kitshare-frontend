import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'kit-info-window',
  templateUrl: './info-window.component.html',
  styleUrls: ['./info-window.component.scss']
})
export class InfoWindowComponent implements OnInit {

  @Input()
  address;

  constructor() { }

  ngOnInit() {
  }

  getBackgroundStyle(item) {
    return {
      'background-image': `url('${item.gear_display_image}')`,
      'background-repeat': 'no-repeat',
      'background-position': 'center',
      'background-size': 'cover',
    }
  }

}
