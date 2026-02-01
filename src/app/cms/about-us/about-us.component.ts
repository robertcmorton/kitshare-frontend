import { Component, OnInit } from '@angular/core';
import { CmsService } from '../../services/cms.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {
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
    this.cms.getPagedetails('AU')
      .subscribe((res: any) => {
        this.content = res.result.content;
        this.title   = res.result.page;
        // this.content = this.escapeHTML(this.content);
      });
  }

  escapeHTML(html) {
    let dummy_div: any = document.createElement('div').appendChild(document.createTextNode(html));
    return dummy_div.innerHTML;
  }
}
