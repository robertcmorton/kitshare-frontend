import { Component, OnInit } from '@angular/core';
import { CmsService } from '../../services/cms.service';

@Component({
  selector: 'app-what-is-kit-share',
  templateUrl: './what-is-kit-share.component.html',
  styleUrls: ['./what-is-kit-share.component.css']
})
export class WhatIsKitShareComponent implements OnInit {

  content: String;
  title: String;

  constructor(public cms: CmsService) {
    this.content = '';
    this.title = '';
   }

  ngOnInit() {
    this.getPageDetails();
  }

  getPageDetails() {
    this.cms.getPagedetails('WIK')
      .subscribe((res: any) => {
        this.content = res.result.content;
        this.title   = res.result.page;
        // this.content = this.escapeHTML(this.content);
      });
  }

}
