import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { DashboardService } from "../services/dashboard.service";
import { ConfirmationDialogService } from "./confirmation-dialog/confirmation-dialog.service";
import { VerifyPopupDialogService } from "./../shared/component/verify-popup-dialog/verify-popup-dialog.service";
import { AuthService } from "../services/auth.service";
import { BaseService } from "../services/base.service";
import * as moment from "moment/moment";
import { ChatUser } from "./../shared/interface";
import { DataService } from "app/shared/data/data.service";
declare var $: any;

@Component({
  selector: "app-rental-order-owner",
  templateUrl: "./rental-order-owner.component.html",
  styleUrls: ["./rental-order-owner.component.scss"],
})
export class RentalOrderOwnerComponent implements OnInit {
  @ViewChild("closeSubmitReviewModal", { static: true })
  closeSubmitReviewModal: ElementRef;

  checkListArray: Array<any>;
  order_id: any;
  renter_owner_type: String;

  cart_details: any;
  user_details: any;
  rent_summary: any;

  date_from: any;
  date_to: any;

  shoot_details: string;
  project_name: string;
  is_end_rental_available: Boolean;

  damage_issues: string = "";
  damage_waiver_text: boolean = false;

  app_user_id: any;
  security_deposite: any;
  order_status: any;
  is_cancel_rental_available: boolean = false;
  is_accept_rental_available: boolean = false;
  is_decline_rental_available: boolean = false;
  gear_rent_requested_on: any;

  damage_issue_list: Array<any>;

  uploadedFiles: Array<File> = [];

  message_with_owner: String;

  is_agreement_checked: boolean;

  shoot_days: number;
  update_damage_issue: string;
  ks_order_issues_id: any;
  does_any_item_has_security_deposite: boolean;
  suburb_state: string;

  app_user_id_for_logged_in_user: any;
  star_rating: number;

  is_order_completed: Boolean;
  cust_gear_review_desc: string;

  review_count: any;
  update_date: any;

  is_review_available: boolean;
  userinfo: any;
  ownerCanAcceptRenter: boolean;
  above_48_hours: boolean = false;

  previousUrl: string = null;
  url_subscriber: any;
  chat_user: ChatUser[] = [];

  constructor(
    public dataService: DataService,
    public baseService: BaseService,
    private route: ActivatedRoute,
    private router: Router,
    public dashboard: DashboardService,
    public auth: AuthService,
    private confirmationDialogService: ConfirmationDialogService,
    private verifyPopupDialogService: VerifyPopupDialogService
  ) {
    this.is_end_rental_available = false;
    this.damage_issue_list = [];
    this.is_agreement_checked = false;
    this.update_damage_issue = "";
    this.does_any_item_has_security_deposite = false;
    this.suburb_state = "";
    if (!this.auth.isLoggedIn) {
      this.router.navigate(["login"]);
    }
    this.app_user_id_for_logged_in_user = "";
    this.checkListArray = [];
    this.is_order_completed = false;
    this.star_rating = 0;
    this.cust_gear_review_desc = "";
    this.is_review_available = false;
    this.previousUrl = "";
  }
  ngOnDestroy() {
    this.auth.setPreviousUrl("");
    this.url_subscriber.unsubscribe();
  }
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.order_id = params.id;
      this.renter_owner_type = params.type;
    });
    this.url_subscriber = this.auth.previousUrl$.subscribe(
      (previousUrl: string) => {
        this.previousUrl = previousUrl;
        if (this.previousUrl && this.previousUrl.includes("checkout")) {
          $("#ordercompletemodal").modal("show");
        }
      }
    );
    this.getProfileDetails();
    this.getOrderSummary();
    this.getCheckList();

    this.dashboard.userInfoForProfile(this.auth.userData.auth_token).subscribe(
      (res: any) => {
        let result = res;
        console.log("User info after login...");
        // console.log(result);
        // this.user_profile_picture_link = result.result[0].user_profile_picture_link;
        // this.dashboard.getProfileImage(result.result ? result.result[0].user_profile_picture_link : '');
        this.auth.setUserInfo(result);
      },
      (err) => {
        //  debugger;
        this.auth.isLoggedIn = false;
        localStorage.clear();
        this.auth.setUser(null);
        this.router.navigate(["/login"]);
      }
    );
  }

  getProfileDetails() {
    this.auth
      .userInfoForProfile(this.auth.userData.auth_token)
      .subscribe((res: any) => {
        this.app_user_id_for_logged_in_user =
          res.result && res.result[0] ? res.result[0].app_user_id : null;
      });
  }

  getOrderSummary() {
    this.baseService.global.showLoader();
    if (this.renter_owner_type === "owner") {
      this.getOrderSummeryForOwner();
    }
    if (this.renter_owner_type === "renter") {
      this.getOrderSummeryForRenter();
    }

    this.getDamageIssueList();
  }

  editOrder(value) {
    if (value == "damage_waiver") {
      this.damage_waiver_text = true;
    } else {
      this.damage_waiver_text = false;
    }
  }

  submitDamageIssues() {
    if (this.damage_issues === "") {
      this.dataService.openSnackBar("Please type the issue", "snack-error");
    } else {
      this.dashboard
        .submitDamageIssues(
          this.auth.userData.auth_token,
          this.order_id,
          this.app_user_id,
          this.damage_issues,
          this.renter_owner_type
        )
        .subscribe(
          (res: any) => {
            this.damage_issues = "";
            this.dataService.openSnackBar("Issue submited successfully");
            this.getDamageIssueList();
          },
          (err) => {
            console.log("Error ==>", err);
            this.dataService.openSnackBar(
              "Error 005: Unable to Submit Rental Notes, Damage or Issues",
              "snack-error"
            );
          }
        );
    }
  }

  getDamageIssueList() {
    this.dashboard
      .getDamageIssuesList(this.auth.userData.auth_token, this.order_id)
      .subscribe(
        (res: any) => {
          this.damage_issue_list = res.result;
        },
        (err) => {
          console.log("Error ==>", err);
          this.dataService.openSnackBar(
            "Error 006: Unable to find Rental Notes, Damage or Issues",
            "snack-error"
          );
        }
      );
  }

  getOrderSummeryForOwner() {
    this.dashboard
      .getOrderSummeryForOwner(this.auth.userData.auth_token, this.order_id)
      .subscribe(
        (res: any) => {
          this.baseService.global.hideLoader();

          let todays_date = moment(new Date()).format("YYYY-MM-DD");
          let result = res;

          this.review_count = result.result.review_count;
          this.cart_details = result.result.Cart_details;
          this.user_details = result.result.app_users_details;
          this.rent_summary = result.result.rent_summary;

          this.date_from =
            result.result.Cart_details[0].gear_rent_request_from_date;
          this.date_to =
            result.result.Cart_details[0].gear_rent_request_to_date;
          this.app_user_id = result.result.app_users_details[0].app_user_id;
          this.shoot_days = result.result.Cart_details[0].shoot_days;
          this.update_date = result.result.Cart_details[0].update_date;

          this.security_deposite = result.result.rent_summary.security_deposit;
          this.order_status = result.result.order_status;
          this.gear_rent_requested_on =
            result.result.Cart_details[0].gear_rent_requested_on;

          /* console.log(this.renter_owner_type);
        console.log(this.order_status);  */
          console.log("date_from", this.date_from);
          console.log("date_to", this.date_to);
          this.date_from = moment(this.date_from).format("LL");
          this.date_to = moment(this.date_to).format("LL");

          if (this.order_status == "Completed" && this.review_count == "0") {
            this.is_review_available = true;
          }

          if (
            this.order_status == "Completed" ||
            this.order_status == "Rejected" ||
            this.order_status == "Expired" ||
            this.order_status == "Cancelled"
          ) {
            this.is_order_completed = true;
          }

          this.suburb_state =
            this.cart_details[0].address[0].suburb_name +
            "/" +
            this.cart_details[0].address[0].ks_state_name;

          if (
            this.app_user_id_for_logged_in_user ==
            result.result.Cart_details[0].create_user
          ) {
            this.router.navigate(["rentals-dashboard"]);
          }

          this.cart_details.forEach((element) => {
            if (element.security_deposit > 0) {
              this.does_any_item_has_security_deposite = true;
            }
          });

          // if rental time is Owner and todays date is equal to the drop-off date then 'End Rental' button should be visible
          if (
            todays_date >= moment(this.date_to).format("YYYY-MM-DD") &&
            this.order_status == "Contract"
          ) {
            this.is_end_rental_available = true;
          }

          if (
            this.order_status == "Quote" &&
            this.renter_owner_type == "owner"
          ) {
            this.is_accept_rental_available = true;
            this.is_decline_rental_available = true;
          } else {
            this.is_accept_rental_available = false;
            this.is_decline_rental_available = false;
          }

          //let todays_date = moment(new Date()).format('YYYY-MM-DD');
          let date1: any;
          let date2: any;
          console.log(
            "pickup date",
            result.result.Cart_details[0].gear_rent_request_from_date
          );
          let tmp =
            result.result.Cart_details[0].gear_rent_request_from_date.split(
              " "
            )[0];
          date1 = new Date(todays_date);
          date2 = new Date(tmp);
          console.log("date1", date1);
          console.log("date2", date2);
          //var diffTime = Math.abs(date2 - date1);
          let diffDays: any;
          diffDays = Math.ceil(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
          console.log(diffDays + " days");

          if (diffDays > 2 && this.order_status == "Reservation") {
            this.is_cancel_rental_available = true;
          } else {
            this.is_cancel_rental_available = false;
          }

          // Shoot details
          this.shoot_details =
            this.cart_details &&
            this.cart_details[0] &&
            this.cart_details[0].project_description == ""
              ? "No shoot details available"
              : this.cart_details[0].project_description;
          // Project name
          this.project_name =
            this.cart_details &&
            this.cart_details[0] &&
            this.cart_details[0].project_name
              ? this.cart_details[0].project_name
              : "";
        },
        (err) => {
          this.baseService.global.hideLoader();
        }
      );
  }

  getOrderSummeryForRenter() {
    this.dashboard
      .getOrderSummeryForRenter(this.auth.userData.auth_token, this.order_id)
      .subscribe(
        (res: any) => {
          this.baseService.global.hideLoader();
          let result = res;
          this.review_count = result.result.review_count;
          this.cart_details = result.result.Cart_details;
          this.user_details = result.result.app_users_details;
          this.rent_summary = result.result.rent_summary;

          this.date_from =
            result.result.Cart_details[0].gear_rent_request_from_date;
          this.date_to =
            result.result.Cart_details[0].gear_rent_request_to_date;
          this.app_user_id = result.result.app_users_details[0].app_user_id;
          this.shoot_days = result.result.Cart_details[0].shoot_days;

          this.security_deposite = result.result.rent_summary.security_deposit;
          this.order_status = result.result.order_status;
          this.gear_rent_requested_on =
            result.result.Cart_details[0].gear_rent_requested_on;

          this.date_from = moment(this.date_from).format("LL");
          this.date_to = moment(this.date_to).format("LL");
          this.update_date = result.result.Cart_details[0].update_date;

          if (this.order_status == "Completed" && this.review_count == "0") {
            this.is_review_available = true;
          }

          if (
            this.order_status == "Completed" ||
            this.order_status == "Rejected" ||
            this.order_status == "Expired" ||
            this.order_status == "Cancelled"
          ) {
            this.is_order_completed = true;
          }

          this.suburb_state =
            this.cart_details[0].address[0].suburb_name +
            "/" +
            this.cart_details[0].address[0].ks_state_name;

          /*if ( this.app_user_id_for_logged_in_user != result.result.Cart_details[0].create_user) {
          this.router.navigate(['rentals-dashboard']);
        }*/

          this.cart_details.forEach((element) => {
            if (element.security_deposit > 0) {
              this.does_any_item_has_security_deposite = true;
            }
          });

          // calculate the hours since the gear is booked
          /*let now_date    = moment(new Date()); // now
        let booked_date = moment(this.gear_rent_requested_on);
        let hours_sinces_booked = now_date.diff(booked_date, 'hours')
        console.log('now_date : ',now_date)
        console.log('booked_date : ',booked_date)
        if ((this.order_status === 'Quote' || this.order_status === 'Reservation') && hours_sinces_booked <= 48) {
          this.is_cancel_rental_available = true;
        } else {
          this.is_cancel_rental_available = false;
        }*/

          let todays_date_r = moment(new Date()).format("YYYY-MM-DD");
          let date1_r: any;
          let date2_r: any;
          date1_r = new Date(todays_date_r);
          date2_r = new Date(
            result.result.Cart_details[0].gear_rent_request_from_date
          );
          //var diffTime = Math.abs(date2 - date1);
          let diffDays_r: any;
          diffDays_r = Math.ceil(
            Math.abs(date2_r - date1_r) / (1000 * 60 * 60 * 24)
          );
          console.log(diffDays_r + " days");

          if (diffDays_r > 2 && this.order_status === "Reservation") {
            this.is_cancel_rental_available = true;
          } else {
            this.is_cancel_rental_available = false;
          }

          // Shoot details
          this.shoot_details =
            this.cart_details[0].project_description == ""
              ? "No shoot details available"
              : this.cart_details[0].project_description;
          // Project name
          this.project_name = this.cart_details[0].project_name;
        },
        (err) => {
          this.baseService.global.hideLoader();
        }
      );
  }

  uploadImage() {
    document.getElementById("filt_upload").click();
  }

  onFileChange(event) {
    this.uploadedFiles = [];
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let eachImage =
        event.target.files && event.target.files[0]
          ? event.target.files[0]
          : null;
      this.uploadedFiles.push(<File>eachImage);
      /* reader.readAsDataURL(eachImage);
       reader.onload = () => {
         this.gearImageList.push(reader.result);
       };*/
      this.uploadAllImages();
    }
  }

  uploadAllImages() {
    this.baseService.global.showLoader();
    if (this.uploadedFiles.length > 0) {
      for (const eachFile of this.uploadedFiles) {
        if (eachFile) {
          let uploadData = new FormData();
          // uploadData.append("image[]", eachFile, eachFile.name);
          uploadData.append("image", eachFile, eachFile.name);
          uploadData.append("order_id", this.order_id);
          uploadData.append("token", this.auth.userData.auth_token);
          this.dashboard
            .uploadCheckList(uploadData, this.renter_owner_type)
            .subscribe(
              (res: any) => {
                this.baseService.global.hideLoader();
                if (res.status == 200) {
                  this.getCheckList();
                  this.dataService.openSnackBar("Uploaded succesfully");
                } else {
                  this.dataService.openSnackBar(
                    res.status_message,
                    "snack-error"
                  );
                }
              },
              (err) => {
                this.baseService.global.hideLoader();
              }
            );
        }
      }
    }
  }

  cancelRental() {
    this.confirmationDialogService
      .confirm("Please confirm", "Do you really want to cancel the order?")
      .then((confirmed) => {
        console.log("User confirmed:", confirmed);
        if (confirmed) {
          this.baseService.global.showLoader();
          this.dashboard
            .cancelRental(this.auth.userData.auth_token, this.order_id)
            .subscribe((res: any) => {
              this.baseService.global.hideLoader();
              if (res.status == 200) {
                this.is_cancel_rental_available = false;
                this.dataService.openSnackBar("Rental cancelled succesfully");
                this.getOrderSummary();
              } else {
                this.dataService.openSnackBar(
                  res.status_message,
                  "snack-error"
                );
              }
            });
        }
      })
      .catch(() =>
        console.log(
          "User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)"
        )
      );
  }

  acceptRental() {
    let userinfo = this.auth.getUserInfo();
    console.log(
      "Fn: acceptRental, page:rental-order-owner, userinfo",
      userinfo.status
    );

    this.ownerCanAcceptRenter = false;
    if (
      userinfo.status != 404 &&
      userinfo.result[0].address_found === "Y" &&
      userinfo.result[0].mobile_number_verfiy === "1" &&
      userinfo.result[0].aus_post_verified === "Y"
    ) {
      console.log("Owner can accept Renter");
      this.ownerCanAcceptRenter = true;
    } else if (userinfo.status != 404) {
      console.log("Owner cannot accept Renter");
      this.verifyPopupDialogService.popupbox(
        userinfo,
        "To Accept this Order, please verify the following:",
        ""
      );
    }

    if (this.ownerCanAcceptRenter) {
      this.confirmationDialogService
        .confirm("Please confirm", "Do you want to accept the order?")
        .then((confirmed) => {
          console.log("User confirmation for accepting an order:", confirmed);
          if (confirmed) {
            this.baseService.global.showLoader();
            this.dashboard
              .userCheckoutCheck(this.auth.userData.auth_token)
              .subscribe((res: any) => {
                console.log("Usercheckoutcheck api response", res);
                if (res.status === 200) {
                  console.log("Usercheckoutcheck api response is 200 ");
                  this.dashboard
                    .acceptRental(this.auth.userData.auth_token, this.order_id)
                    .subscribe((res: any) => {
                      console.log("acceptRental api response", res);
                      this.baseService.global.hideLoader();
                      this.is_accept_rental_available = false;
                      this.is_decline_rental_available = false;
                      if (res.status == 200) {
                        // this.is_end_rental_available = true;
                        this.dataService.openSnackBar(
                          "Rental accepted succesfully"
                        );
                        this.getOrderSummary();
                      } else {
                        console.log("acceptRental api response not 200");
                        this.dataService.openSnackBar(
                          res.status_message,
                          "snack-error"
                        );
                      }
                    });
                } else {
                  console.log("Usercheckoutcheck api response not 200");
                  this.baseService.global.hideLoader();
                  this.dataService.openSnackBar(
                    res.status_message,
                    "snack-error"
                  );
                }
              });
          }
        })
        .catch(() =>
          console.log(
            "User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)"
          )
        );
    }
  }

  declineRental() {
    this.confirmationDialogService
      .confirm("Please confirm", "Do you want to decline the order?")
      .then((confirmed) => {
        console.log("User confirmed:", confirmed);
        if (confirmed) {
          this.baseService.global.showLoader();
          this.dashboard
            .declineRental(this.auth.userData.auth_token, this.order_id)
            .subscribe(
              (res: any) => {
                this.baseService.global.hideLoader();
                this.is_accept_rental_available = false;
                this.is_decline_rental_available = false;
                if (res.status == 200) {
                  this.dataService.openSnackBar(
                    "Rental has been declined succesfully"
                  );
                  this.getOrderSummary();
                } else {
                  this.dataService.openSnackBar(
                    res.status_message,
                    "snack-error"
                  );
                }
              },
              (err) => {
                this.baseService.global.hideLoader();
                this.dataService.openSnackBar(err, "snack-error");
              }
            );
        }
      })
      .catch(() =>
        console.log(
          "User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)"
        )
      );
  }

  endRental() {
    if (this.is_agreement_checked === false) {
      this.dataService.openSnackBar(
        "Please check the order completion agreement before ending the rental",
        "snack-error"
      );
    } else {
      this.baseService.global.showLoader();
      this.dashboard
        .completeRental(this.auth.userData.auth_token, this.order_id)
        .subscribe((res: any) => {
          this.baseService.global.hideLoader();
          if (res.status == 200) {
            this.dataService.openSnackBar("Rental completed");
            this.is_end_rental_available = false;
            this.getOrderSummary();
          } else {
            this.baseService.global.showLoader();
            this.dataService.openSnackBar(res.status_message, "snack-error");
          }
        });
    }
  }

  agreementChecked(e) {
    let val_checked = e.target.checked;
    if (val_checked === true) {
      this.is_agreement_checked = true;
    } else {
      this.is_agreement_checked = false;
    }
  }

  sendMessageToOwner() {
    if (this.message_with_owner == undefined || this.message_with_owner == "") {
      this.dataService.openSnackBar("Please type a message", "snack-error");
    } else if (this.auth.userData.auth_token == undefined) {
      this.dataService.openSnackBar(
        "Please login to send a message",
        "snack-error"
      );
    } else {
      this.dashboard
        .sendMessageToOwner(
          this.auth.userData.auth_token,
          this.app_user_id,
          this.message_with_owner
        )
        .subscribe((res: any) => {
          this.dataService.openSnackBar("Message sent to owners email");
        });
    }
  }

  getDamageIssue(ks_order_issues_id, damage_issue) {
    this.update_damage_issue = damage_issue;
    this.ks_order_issues_id = ks_order_issues_id;
  }

  updateDamageIssues() {
    let app_user_id;
    this.dashboard
      .updateDamageIssue(
        this.auth.userData.auth_token,
        this.ks_order_issues_id,
        this.order_id,
        this.update_damage_issue,
        this.user_details && this.user_details[0]
          ? this.user_details[0].app_user_id
          : null,
        this.renter_owner_type
      )
      .subscribe(
        (res: any) => {
          this.damage_issue_list = res.result;
          this.dataService.openSnackBar("Updated");

          this.getDamageIssueList();
        },
        (err) => {
          console.log("Error ==>", err);
          this.dataService.openSnackBar(
            "Error 007: Unable to update Rental Notes, Damage or Issues",
            "snack-error"
          );
        }
      );
  }

  goToMessageBox() {
    const messageData = {
      renter_id: this.app_user_id,
      user_gear_desc_id: "",
      user_name:
        this.user_details && this.user_details[0]
          ? this.user_details[0].app_user_first_name
          : null,
      profile_pics_link:
        this.user_details && this.user_details[0]
          ? this.user_details[0].user_profile_picture_link
          : null,
      order_id: this.order_id,
    };
    // this.dashboard.goToMessage(messageData);
    // this.router.navigate(['rentals-dashboard']);
    this.chat_user["order_id"] = this.order_id;
    this.router.navigate(["/rentals/messaging", this.chat_user]);
  }

  // get Uploaded checklist
  getCheckList() {
    this.dashboard
      .getCheckList(
        this.auth.userData.auth_token,
        this.order_id,
        this.renter_owner_type
      )
      .subscribe((res: any) => {
        this.checkListArray = res.result;
      });
  }

  onClickStarRating(e) {
    this.star_rating = e.rating;
  }

  submitReview() {
    /* console.log(this.order_id);
    console.log(this.app_user_id);
    console.log(this.app_user_id_for_logged_in_user); */

    this.baseService.global.showLoader();
    this.dashboard
      .addGearReviews(
        this.auth.userData.auth_token,
        this.order_id,
        this.app_user_id,
        this.cust_gear_review_desc,
        this.star_rating,
        0
      )
      .subscribe(
        (res: any) => {
          this.closeSubmitReviewModal.nativeElement.click();
          this.baseService.global.hideLoader();
          this.dataService.openSnackBar("Success");
          let response = res;
          // console.log(res);
          /* this.cust_gear_review_desc = '';
        this.star_rating = 0;
        this.order_id = ''; */
          this.is_review_available = false;
        },
        (err) => {
          this.closeSubmitReviewModal.nativeElement.click();
          this.baseService.global.hideLoader();
          this.dataService.openSnackBar(err, "snack-error");
        }
      );
  }
}
