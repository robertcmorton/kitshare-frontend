import { Component, OnInit, OnDestroy } from "@angular/core";
import { ApiHandlerComponent } from "../../api-handler.component";
import { BaseService } from "../../services/base.service";
import { getFaqList } from "../../shared/constant";
import { ActivatedRoute } from "@angular/router";
import { FaqDetails } from "../../shared/models/faq.model";

@Component({
  selector: "app-faq-list",
  templateUrl: "./faq-list.component.html",
  styleUrls: ["./faq-list.component.scss"]
})
export class FaqListComponent extends ApiHandlerComponent implements OnInit, OnDestroy {
  public categoryId: string;
  public faqList: any;
  public faqListNew: Array<any>;
  public faqTitle: String;
  public faqCategory: String;

  constructor(public baseService: BaseService, private route: ActivatedRoute) {
    super(baseService);
    this.baseService.global.showLoader();
    this.baseService.global.showFooter = false;
    this.baseService.global.showHeader = false;
    this.route.params.subscribe(params => {
      this.categoryId = params.id ? params.id : "12";
    });
  }

  ngOnInit() {
    this.baseService.baseApi.getFaqList(this.categoryId);
  }

  handleApiResponse(data: any) {
    if (data.resulttype === getFaqList) {
      this.faqList = data.result.result;
      this.faqTitle    = this.faqList.category.title;
      this.faqCategory = this.faqList.category.category_name;
      this.faqListNew  = this.faqList.list;


      this.baseService.global.hideLoader();
    }
  }

  ngOnDestroy() {
    this.baseService.global.showFooter = true;
    this.baseService.global.showHeader = true;
  }

  // Slugify a string
  slugify(str) {
    str = str.replace(/^\s+|\s+$/g, '');
    // Make the string lowercase
    str = str.toLowerCase();
    // Remove accents, swap ñ for n, etc
    var from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
    var to   = "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }
    // Remove invalid chars
    str = str.replace(/[^a-z0-9 -]/g, '')
    // Collapse whitespace and replace by -
    .replace(/\s+/g, '-')
    // Collapse dashes
    .replace(/-+/g, '-');

    return str;
  }

}
