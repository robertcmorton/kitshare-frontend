import { Component, OnInit } from '@angular/core';
import { CmsService } from '../../services/cms.service';

@Component({
  selector: 'app-trust-safety',
  templateUrl: './trust-safety.component.html',
  styleUrls: ['./trust-safety.component.css']
})
export class TrustSafetyComponent implements OnInit {

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
    this.cms.getPagedetails('TS')
      .subscribe((res: any) => {
        this.content = res.result.content;
        this.title   = res.result.page;
        // this.content = this.escapeHTML(this.content);
      });
  }

}
