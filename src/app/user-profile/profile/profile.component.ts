import {
  userInfoGearData,
  userInfoProdutReviews,
} from "./../../shared/constant";
import { BaseService } from "./../../services/base.service";
import { BaseComponent } from "../../base.componant";
import { Component, OnInit, Pipe, PipeTransform } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { userInfoForProfile } from "../../shared/constant";
import { UserProfileData } from "../../shared/models/user-profile";

import { DashboardService } from "./../../services/dashboard.service";
import { DataService } from "./../../shared/data/data.service";
import { AuthService } from "./../../services/auth.service";

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
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent extends BaseComponent implements OnInit {
  totalItems: number;
  currentPage: number;

  totalReviews: number;
  PageNumber: number;

  searchgear: string;
  cat_id: string;
  profile_address_state: string;

  show_public_button: boolean;
  show_private_button: boolean;

  is_mobile_verified: boolean;
  digital_id_verified: boolean;
  address_found: boolean;

  forDisplay: boolean = false;
  maxScore: number = 5;
  range = [];
  marked = -1;
  score = 3;

  avg_rating: number;

  public userProfileData: UserProfileData = new UserProfileData();
  public gearData: any;
  public gearCategries: any = [];
  public gearLists: any = [];
  public reviewLists: any = [];

  // protected app_user_id: any;
  public app_user_id: any;

  constructor(
    public baseService: BaseService,
    public dash: DashboardService,
    public auth: AuthService,
    private dataService: DataService,
    private route: ActivatedRoute
  ) {
    super(baseService, false);
    this.currentPage = 1;
    this.PageNumber = 1;
    this.baseService.global.showLoader();

    this.route.params.subscribe((params) => {
      // console.log(params);
      this.app_user_id = params.id ? params.id : 0;
      console.log(this.app_user_id);
      this.ngOnInitOne();
    });

    this.cat_id = "";
    this.profile_address_state = "";
  }
  ngOnInit() {}
  ngOnInitOne() {
    for (var i = 0; i < this.maxScore; i++) {
      this.range.push(i);
    }

    this.app_user_id = this.route.snapshot.paramMap.get("id");
    this.app_user_id = this.app_user_id ? this.app_user_id : 0;

    if (this.baseService.auth.checkLoggedIn() === true) {
      if (
        this.baseService.auth.userinfo.result != undefined &&
        this.app_user_id ==
          this.baseService.auth.userinfo.result[0].app_username
      ) {
        this.app_user_id = 0;
      }
      if (this.app_user_id == 0) {
        this.baseService.baseApi.getUserInfoGearData(this.app_user_id, 0);
        this.baseService.baseApi.getUserInfoForPrfile();
        this.baseService.baseApi.getUserInfoProductReviews(this.app_user_id);
      } else {
        this.dash
          .getUserInfoId(this.auth.userData.auth_token, this.app_user_id)
          .subscribe((res: any) => {
            this.app_user_id = res.result.app_user_id;
            this.baseService.baseApi.getUserInfoGearDatawithPublicPrivateKey(
              "public",
              this.app_user_id,
              0
            );
            this.baseService.baseApi.getUserProfileByID(this.app_user_id);
            this.baseService.baseApi.getUserInfoProductReviews(
              this.app_user_id
            );
          });
        /* */
      }
    } else {
      this.baseService.baseApi.getUserProfileByAppUsername(this.app_user_id);
      this.baseService.baseApi.getUserInfoGearByAppUsername(
        this.app_user_id,
        0
      );
      this.baseService.baseApi.getUserInfoProductReviews(this.app_user_id);
    }
  }

  public isMarked = (index) => {
    if (!this.forDisplay) {
      if (index <= this.marked) {
        return "fa-star";
      } else {
        return "fa-star-o";
      }
    } else {
      if (this.score >= index + 1) {
        return "fa-star";
      } else if (this.score > index && this.score < index + 1) {
        return "fa-star-half-o";
      } else {
        return "fa-star-o";
      }
    }
  };

  handleApiResponse(data: any) {
    if (data.resulttype === userInfoForProfile) {
      this.avg_rating = data.result.result[0].rating;
      if (this.avg_rating == null) {
        this.avg_rating = data.result.result[0].user_rating;
      }

      if (data.result.result[0].aus_post_verified == "Y") {
        this.digital_id_verified = true;
      } else {
        this.digital_id_verified = false;
      }

      if (data.result.result[0].mobile_number_verfiy == "1") {
        this.is_mobile_verified = true;
      } else {
        this.is_mobile_verified = false;
      }

      if (data.result.result[0].address_found == "Y") {
        this.address_found = true;
      } else {
        this.address_found = false;
      }

      this.userProfileData = data.result.result[0];
      // this.userProfileData = this.userProfileData.map();
      this.userProfileData.facebook_link =
        this.userProfileData.facebook_link == null
          ? ""
          : this.userProfileData.facebook_link;
      this.userProfileData.twitter_link =
        this.userProfileData.twitter_link == null
          ? ""
          : this.userProfileData.twitter_link;
      this.userProfileData.youtube_link =
        this.userProfileData.youtube_link == null
          ? ""
          : this.userProfileData.youtube_link;
      this.userProfileData.linkedin_link =
        this.userProfileData.linkedin_link == null
          ? ""
          : this.userProfileData.linkedin_link;
      this.userProfileData.instagram_link =
        this.userProfileData.instagram_link == null
          ? ""
          : this.userProfileData.instagram_link;
      this.userProfileData.user_website =
        this.userProfileData.user_website == null
          ? ""
          : this.userProfileData.user_website;
      this.userProfileData.imdb_link =
        this.userProfileData.imdb_link == null
          ? ""
          : this.userProfileData.imdb_link;
      this.userProfileData.vimeo_link =
        this.userProfileData.vimeo_link == null
          ? ""
          : this.userProfileData.vimeo_link;
      this.baseService.global.hideLoader();
      if (data.result.result[0].address != undefined) {
        if (data.result.result[0].address.length > 0) {
          this.profile_address_state =
            data.result.result[0].address[0].ks_state_name;
        }
      }
    }
    if (data.resulttype === userInfoGearData) {
      this.totalItems = data.result.result.count;
      this.gearCategries = data.result.result.gears.gear_categories;
      this.gearLists = data.result.result.gears.gear_lists;
      this.baseService.global.hideLoader();
    }
    if (data.resulttype === userInfoProdutReviews) {
      this.reviewLists = data.result.result;
      this.totalReviews = data.result.total_reviews;
    }
  }

  /**
   * When search is clicked then call getUserInfoGearDatawithSearchKey()
   * @returns void
   */
  clickSearchGear() {
    // if(this.searchgear != null && this.searchgear != '' && this.searchgear != undefined){

    this.baseService.global.showLoader();

    this.baseService.baseApi.getUserInfoGearDatawithSearchKey(
      this.searchgear,
      this.cat_id,
      0,
      this.app_user_id
    );

    // }
  }

  // category on change
  onChange(catvalue) {
    // if(catvalue != null && catvalue !=''){
    this.cat_id = catvalue;
    // this.baseService.global.showLoader();
    // this.baseService.baseApi.getUserInfoGearDatawithSearchKey(this.searchgear, this.cat_id);
    // }
  }

  //
  onChangePublicPrivate(val) {
    this.baseService.global.showLoader();
    this.baseService.baseApi.getUserInfoGearDatawithPublicPrivateKey(val);
  }

  /**
   * Get active gear list
   * @returns void
   */
  clickGetActiveGear() {
    // if(this.searchgear != null && this.searchgear != '' && this.searchgear != undefined){

    this.baseService.global.showLoader();

    this.baseService.baseApi.getUserActiveGear();

    // }
  }

  /**
   * Get publlic gear list
   * @returns void
   */
  clickGetPublicGear() {
    // if(this.searchgear != null && this.searchgear != '' && this.searchgear != undefined){

    this.baseService.global.showLoader();

    this.baseService.baseApi.getUserInfoGearDatawithSearchKey();

    // }
  }

  /**
   * Star rating click event
   */
  onRatingChange(e) {
    this.dash
      .addRating(this.auth.userData.auth_token, this.app_user_id, e.rating)
      .subscribe((res: any) => {
        this.dataService.openSnackBar(res.status_message, "snack-success");
      });
  }

  onClick(e) {
    this.dash
      .addRating(this.auth.userData.auth_token, this.app_user_id, e.rating)
      .subscribe((res: any) => {
        this.dataService.openSnackBar(res.status_message, "snack-success");
      });
  }

  pageChanged(event: any) {
    let per_page = (event.page - 1) * 12;
    if (this.baseService.auth.checkLoggedIn() === true) {
      if (this.app_user_id == 0) {
        this.baseService.baseApi.getUserInfoGearData(
          this.app_user_id,
          per_page,
          this.cat_id,
          this.searchgear
        );
      } else {
        this.baseService.baseApi.getUserInfoGearDatawithPublicPrivateKey(
          "public",
          this.app_user_id,
          per_page,
          this.cat_id,
          this.searchgear
        );
      }
    } else {
      this.baseService.baseApi.getUserInfoGearByAppUsername(
        this.app_user_id,
        per_page
      ); //here app user id is app username
    }
    window.scrollTo(0, 0);
  }

  pageNumberChanged(event: any) {
    let page = event.page;
    this.baseService.baseApi.getUserInfoProductReviews(this.app_user_id, page);
    window.scrollTo(0, document.getElementById("start_reviews").offsetTop);
  }
}
