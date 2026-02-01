import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Pipe,
  PipeTransform,
} from "@angular/core";
import { DashboardService } from "../../services/dashboard.service";
import { BaseService } from "../../services/base.service";
import { AuthService } from "../../services/auth.service";
import { DataService } from "app/shared/data/data.service";

@Pipe({
  name: "ownerreviews",
})
export class OwnerReviewsPipe implements PipeTransform {
  transform(items: Array<any>): Array<any> {
    return items.filter((item) => item.user_type == "Owner");
  }
}

@Pipe({
  name: "renterreviews",
})
export class RenterReviewsPipe implements PipeTransform {
  transform(items: Array<any>): Array<any> {
    return items.filter((item) => item.user_type == "Renter");
  }
}
@Component({
  selector: "kit-reviews",
  templateUrl: "./reviews.component.html",
  styleUrls: ["./reviews.component.scss"],
})
export class ReviewsComponent implements OnInit {
  @ViewChild("closeSubmitReviewModal", { static: true })
  closeSubmitReviewModal: ElementRef;
  isTabActive = true;
  token: string;
  totalItems: number;
  currentPage = 1;
  reviewLists = [];
  totalReviews: number;
  PageNumber = 1;
  reviews_array: Array<any>;
  reviews_count: number;

  reviewsByOwner: Array<Object>;
  reviewsByOwnerReplies: Array<Object>;
  reviewsByRenter: Array<Object>;
  reviewsByRenterReplies: Array<Object>;
  reviewsOrderList: Array<Object>;
  replyReviewText: string;

  currentSelectedOrderIdForGivingReview: string;
  app_user_id_to_review: any;
  app_user_id;
  star_rating: number;
  cust_gear_review_desc: string;
  reset_review: boolean;
  current_order_id: any;

  constructor(
    public dashboard: DashboardService,
    public auth: AuthService,
    public baseService: BaseService,
    public dataService: DataService
  ) {
    this.token = this.auth.userData.auth_token;
    this.currentSelectedOrderIdForGivingReview = "";
    this.reviewsOrderList = [];
    this.star_rating = 0;
    this.cust_gear_review_desc = "";
    this.reviewsByRenter = [];
    this.reviewsByOwner = [];

    this.reviews_array = [];
    this.reviews_count = 0;
    this.replyReviewText = "";
    this.reset_review = true;
    this.current_order_id = 0;
  }

  ngOnInit(): void {
    this.getAllReviews();
    this.reviewOrderList();
    this.getOwnerReview();
  }

  /**
   * get all reviews
   */

  getAllReviews() {
    this.dashboard.getAllReviews(this.token).subscribe((res: any) => {
      // console.log('get all reviews...');
      // console.log(res);

      this.reviews_array = res.result;
      this.reviews_count = this.reviews_array.length;
    });
  }
  getProductReview(page = 1) {
    const dataToSend = {
      app_user_id: "",
      limit: 10,
      page,
      token: this.token,
    };
    this.dashboard.getAllProductReviews(dataToSend).subscribe((res: any) => {
      this.reviewLists = res.result;
      this.totalItems = res.total_reviews;
    });
  }
  pageNumberChanged(event: any) {
    let page = event.page;
    this.getProductReview(page);
    window.scrollTo(0, document.getElementById("start_reviews").offsetTop);
  }
  replyReviewTextKeyUp(e) {
    this.replyReviewText = e.target.value;
    console.log(this.replyReviewText);
  }
  // Open modal for submiting review
  openGiveReviewModal(order_id, app_user_id_to_review) {
    this.currentSelectedOrderIdForGivingReview = order_id;
    this.app_user_id_to_review = app_user_id_to_review;
  }

  onClickStar(e) {
    this.star_rating = e;
  }

  /**
   * reply to a review
   */
  replyToReview(order_id, app_user_id, ks_cust_gear_review_id) {
    if (!this.replyReviewText) {
      this.dataService.openSnackBar("Please provide a review", "snack-error");
      return;
    }
    this.current_order_id = order_id;
    this.dashboard.getUserOnlineStatus(this.token).subscribe((res: any) => {
      let result = res;
      this.dashboard
        .addGearReviews(
          this.token,
          order_id,
          app_user_id,
          this.replyReviewText,
          0,
          ks_cust_gear_review_id
        )
        .subscribe((res: any) => {
          let response = res;

          if (response.status != 200) {
            this.dataService.openSnackBar(
              response.status_message,
              "snack-error"
            );
          } else {
            this.getOwnerReview();
            this.getRenterReviewNew();
          }
        });
    });
  }

  reviewOrderList() {
    this.dashboard.reviewOrderList(this.token).subscribe((res: any) => {
      // let respons = res;
      this.reviewsOrderList = res.result;
    });
  }
  submitReview() {
    this.baseService.global.showLoader();
    this.dashboard
      .addGearReviews(
        this.token,
        this.currentSelectedOrderIdForGivingReview,
        this.app_user_id_to_review,
        this.cust_gear_review_desc,
        this.star_rating,
        0
      )
      .subscribe(
        (res: any) => {
          let response = res;
          this.closeSubmitReviewModal.nativeElement.click();
          this.baseService.global.hideLoader();
          if (response.status != 200) {
            this.dataService.openSnackBar(
              response.status_message,
              "snack-error"
            );
          } else {
            this.dataService.openSnackBar("Success", "snack-success");

            // console.log(res);
            this.cust_gear_review_desc = "";
            this.star_rating = 0;
            this.currentSelectedOrderIdForGivingReview = "";
            this.getOwnerReview();
            // this.getRenterReviewNew();
            this.reviewOrderList();
            this.reset_review = false;
            setTimeout(() => {
              this.reset_review = true;
            }, 50);
          }
        },
        (err) => {
          this.closeSubmitReviewModal.nativeElement.click();
          this.baseService.global.hideLoader();
          this.dataService.openSnackBar(err, "snack-error");
        }
      );
  }

  /**
   * Get owner review
   */
  getOwnerReview() {
    this.dashboard.getOwnerReviews(this.token).subscribe((res: any) => {
      let result = res;

      this.reviews_count = this.reviews_count + result.result.length;
      this.reviewsByOwner = result.result;
      this.reviewsByOwnerReplies = result.result;
      this.reviewsByOwner.forEach((el: any) => {
        el.has_reply = false;
        this.reviewsByOwnerReplies.forEach((elReply: any) => {
          if (el.ks_cust_gear_review_id == elReply.parent_gear_review_id) {
            el.has_reply = true;
          }
        });
      });
      this.getRenterReviewNew();
    });
  }

  /**
   * Get renter review
   */
  getRenterReviewNew() {
    this.dashboard.getRenterReview(this.token).subscribe((res: any) => {
      let result = res;
      this.reviews_count = this.reviews_count + result.result.length;
      this.reviewsByRenter = result.result;
      this.reviewsByRenterReplies = result.result;
      this.reviewsByRenter.forEach((el: any) => {
        el.has_reply = false;
        this.reviewsByRenterReplies.forEach((elReply: any) => {
          if (el.ks_cust_gear_review_id == elReply.parent_gear_review_id) {
            el.has_reply = true;
          }
        });
      });
    });
  }
  openTab() {
    this.isTabActive = !this.isTabActive;
    if (!this.isTabActive) {
      this.getProductReview();
    }
  }
} // end class
