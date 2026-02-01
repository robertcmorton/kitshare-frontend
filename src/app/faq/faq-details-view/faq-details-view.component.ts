import { Component, OnInit, OnDestroy } from "@angular/core";
import { ApiHandlerComponent } from "../../api-handler.component";
import { BaseService } from "../../services/base.service";
import { ActivatedRoute } from "@angular/router";
import { getFaqDetails } from "../../shared/constant";
import { FaqDetails } from "../../shared/models/faq.model";

@Component({
  selector: "app-faq-details-view",
  templateUrl: "./faq-details-view.component.html",
  styleUrls: ["./faq-details-view.component.scss"],
})
export class FaqDetailsViewComponent
  extends ApiHandlerComponent
  implements OnInit, OnDestroy
{
  public faqId: string;
  public faqDetails: FaqDetails = new FaqDetails();
  public faqDetailsNew: any;
  public faq_question: String;
  public title: String;
  public description: String;
  public image: String;
  public writer_name: String;
  public updated_date: String;
  public created_date: String;

  faqCategoryId: any;
  faqCategoryName: string;
  faqCategoryNameSlug: string;

  constructor(public baseService: BaseService, private route: ActivatedRoute) {
    super(baseService);
    this.baseService.global.showLoader();
    this.baseService.global.showFooter = false;
    this.baseService.global.showHeader = false;
    this.route.params.subscribe((params) => {
      this.faqId = params.id ? params.id : "12";
    });
  }

  ngOnInit() {
    this.baseService.baseApi.getFaqDetails(this.faqId);
  }
  handleApiResponse(data: any) {
    if (data.resulttype === getFaqDetails) {
      this.faqDetailsNew = data.result.result;
      this.faq_question = this.faqDetailsNew.details.faq_question;
      this.title = this.faqDetailsNew.details.title;
      this.description = this.faqDetailsNew.details.description;
      this.image = this.faqDetailsNew.details.image;
      this.writer_name = this.faqDetailsNew.details.writer_name;
      this.updated_date = this.faqDetailsNew.details.updated_date;
      this.created_date = this.faqDetailsNew.details.created_date;
      this.faqCategoryId = this.faqDetailsNew.category.id;
      this.faqCategoryName = this.faqDetailsNew.category.category_name;

      this.faqCategoryNameSlug = this.faqDetailsNew.category.permalink;
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
