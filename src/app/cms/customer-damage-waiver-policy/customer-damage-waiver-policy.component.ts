import { Component, OnInit } from '@angular/core';
import { CmsService } from '../../services/cms.service';

@Component({
  selector: 'app-customer-damage-waiver-policy',
  templateUrl: './customer-damage-waiver-policy.component.html',
  styleUrls: ['./customer-damage-waiver-policy.component.css']
})
export class CustomerDamageWaiverPolicyComponent implements OnInit {

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
    this.cms.getPagedetails('DW')
      .subscribe((res: any) => {
        this.content = res.result.content;
        this.title   = res.result.page;
        // this.content = this.escapeHTML(this.content);
      });
  }

}
