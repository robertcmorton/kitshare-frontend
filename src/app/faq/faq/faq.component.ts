import { Component, OnInit, OnDestroy } from "@angular/core";
import { ApiHandlerComponent } from "../../api-handler.component";
import { BaseService } from "../../services/base.service";
import { getFaqCategory } from "../../shared/constant";
import { FaqCategory } from "../../shared/models/faq.model";

@Component({
  selector: "app-faq",
  templateUrl: "./faq.component.html",
  styleUrls: ["./faq.component.scss"],
})
export class FaqComponent
  extends ApiHandlerComponent
  implements OnInit, OnDestroy
{
  public faqCategory: Array<FaqCategory> = [];

  constructor(public baseService: BaseService) {
    super(baseService);
    this.baseService.global.showLoader();
    this.baseService.global.showFooter = false;
    this.baseService.global.showHeader = false;
  }

  ngOnInit() {
    this.baseService.baseApi.getFaqCategory();
  }
  handleApiResponse(data: any) {
    if (data.resulttype === getFaqCategory) {
      this.faqCategory = data.result.result;
      this.faqCategory.forEach((el) => {
        el.category_slug = el.permalink;
      });
      this.baseService.global.hideLoader();
    }
  }
  ngOnDestroy() {
    this.baseService.global.showFooter = true;
    this.baseService.global.showHeader = true;
  }

  // Slugify a string
  slugify(str) {
    str = str.replace(/^\s+|\s+$/g, "");
    // Make the string lowercase
    str = str.toLowerCase();
    // Remove accents, swap ñ for n, etc
    var from =
      "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
    var to =
      "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }
    // Remove invalid chars
    str = str
      .replace(/[^a-z0-9 -]/g, "")
      // Collapse whitespace and replace by -
      .replace(/\s+/g, "-")
      // Collapse dashes
      .replace(/-+/g, "-");

    return str;
  }
}
