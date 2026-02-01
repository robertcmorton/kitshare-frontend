import { Component, OnInit } from '@angular/core';
import { CmsService } from '../../services/cms.service';

@Component({
  selector: 'app-community-rules',
  templateUrl: './community-rules.component.html',
  styleUrls: ['./community-rules.component.css']
})
export class CommunityRulesComponent implements OnInit {

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
    this.cms.getPagedetails('HWW')
      .subscribe((res: any) => {
        this.content = res.result.content;
        this.title   = res.result.page;
        // this.content = this.escapeHTML(this.content);
      });
  }

}
