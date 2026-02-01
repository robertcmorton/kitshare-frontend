import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
} from "@angular/core";
import { CartService } from "../../services/cart.service";
import { AuthService } from "./../../services/auth.service";
import { BaseService } from "../../services/base.service";
import { SITE_BASE_URL } from "./../../shared/constant";
import { ApiRouterService } from "../../services/api-router.service";
import { Router } from "@angular/router";
import { Observable, forkJoin } from "rxjs";

import { VerifyPopupDialogService } from "./../../shared/component/verify-popup-dialog/verify-popup-dialog.service";
import { DashboardService } from "./../../services/dashboard.service";

import * as moment from "moment/moment";
import { DataService } from "app/shared/data/data.service";
@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.scss"],
})
export class CartComponent implements OnInit, OnDestroy {
  @ViewChild("closeContactOwnerModal", { static: true })
  closeContactOwnerModal: ElementRef;

  public todayDate: any = new Date();
  selectedInsuraceType = {};
  insuranceTypeIsInvalid = false;
  from_date = new Date();
  to_date = new Date();
  shoot_days: number;
  showPicker: any = true;
  cartArr: any;
  insuranceCatTypeArr: Array<object> = [];
  insuranceCatWithpoutSecurityArr: Array<object> = [];
  date: Date = new Date();
  has_item_in_cart: boolean;
  today: any = new Date();
  cartGearAddress: Array<any>;
  userAllowedToCheckOut = false;
  project_name: string;
  project_description: string;

  is_pick_up_address_choosen: boolean;

  total_insurance_security_amount: number = 0;
  total_insurance_security_check_array: Array<Object> = [];
  no_of_insurance_checked: number;
  message_with_owner: string;
  avg_rating: number;
  reviews: number;
  total_no_of_shoot_days: any;
  cart_summery: any;
  total_cost_per_day_exc_gst: number;
  total_cost_day_exc_gst: number;
  minForReturn: any;

  proceed_to_checkout_disabled: boolean = false;

  unavailable_dates: any = [];
  address_selected: boolean = false;
  displayLocationError: boolean = false;
  selected_addess_id: any;
  selectedInsurance: any;
  displayCart: boolean = true;
  userinfo: any;

  address_found: boolean = false;
  digital_id_found: boolean = false;
  mobile_number_verfiy: boolean = false;
  // verify_subscription:any;
  owner_ins_subscription: any;

  mad_verified: boolean = false;
  from_calender: boolean = true;
  to_calender: boolean = true;
  is_message_sent: boolean = false;

  public myFilter = (d: any): boolean => {
    let is_this_day_unavailable: boolean = false;
    let day = d;
    let momentFromDate = moment(day).format("YY-MM-DD");
    // console.log(momentFromDate);
    // Prevent Saturday and Sunday from being selected.
    this.unavailable_dates.forEach((elem: Date) => {
      let unavailable_date = moment(elem).format("YY-MM-DD");
      if (unavailable_date == momentFromDate) {
        is_this_day_unavailable = true;
        // console.log(is_this_day_unavailable);
      }
    });
    return !is_this_day_unavailable ? day : "";
  };

  constructor(
    private cart: CartService,
    private auth: AuthService,
    public baseService: BaseService,
    public apiurl: ApiRouterService,
    public router: Router,
    private cdRef: ChangeDetectorRef,
    private verifyservice: VerifyPopupDialogService,
    private dashboard: DashboardService,
    private dataService: DataService
  ) {
    this.cart_summery = {};
    this.is_pick_up_address_choosen = false;
    /* console.log('From date...');
    console.log(this.from_date);   */

    // check login
    if (!this.auth.checkLoggedIn()) {
      this.router.navigate(["/login"]);
    }
    this.cartArr = {
      app_users_details: [],
      cart: [],
      cart_summary: {},
    };
    this.has_item_in_cart = false;
    this.project_name = "";
    this.project_description = "";
    this.message_with_owner = "";
    this.avg_rating = 0;
    this.reviews = 0;
    this.total_no_of_shoot_days = 0;
    this.total_cost_per_day_exc_gst = 0;
    this.total_cost_day_exc_gst = 0;
    this.proceed_to_checkout_disabled = false;
    this.no_of_insurance_checked = 0;

    this.todayDate.setDate(this.todayDate.getDate() - 1);
  }

  reFormatDate(date) {
    return typeof date === "string" ? (date + "Z").replace(/\s/g, "T") : date;
  }

  // openUserVerificationDialog() {
  //     this.verifyservice.popupbox(this.userinfo,'Please confirm..', 'Do you really want to cancel order?');
  // }

  onOptionChange(event, equipment) {
    if (event.target.value !== null) {
      // make a call here
      let payload = {
        user_gear_rent_detail_id: equipment.user_gear_rent_detail_id,
        ks_insurance_category_type_id: event.target.value,
      };
      this.cart.checkForInsurance(payload).subscribe((data: any) => {
        this.cartArr = data.result;
      });
    }
  }

  checkForInsuranceValidity() {
    let insuranceValid = true;
    for (let i = 0; i < this.cartArr.cart.length; i++) {
      let equipment = this.cartArr.cart[i];
      if (this.selectedInsuraceType[equipment.user_gear_desc_id]) {
        equipment.ks_insurance_category_type_id =
          this.selectedInsuraceType[equipment.user_gear_desc_id];
      }
      if (
        equipment.insurance_type.length &&
        (+equipment.ks_insurance_category_type_id == 0 ||
          equipment.ks_insurance_category_type_id == undefined ||
          equipment.ks_insurance_category_type_id == null)
      ) {
        insuranceValid = false;
      }
    }
    return insuranceValid;
  }

  filteredOptions(options) {
    return options.filter(
      (option) => option.ks_insurance_category_type_id !== "1"
    );
  }

  curateInsDrop(cartObj) {
    return this.insuranceCatWithpoutSecurityArr.filter((item: any) => {
      if (cartObj.insurance_check_key == 1) {
        return false;
      } else {
        return true;
      }
    });
  }

  checkIfUserCanCheckOut() {
    this.cart.checkIfUserIsAllowedToCheckout().subscribe((res: any) => {
      if (res.button_status) {
        this.userAllowedToCheckOut = true;
      } else {
        this.userAllowedToCheckOut = false;
      }
    });
  }

  ngOnInit() {
    this.getCartItems(true);
    this.checkIfUserCanCheckOut();

    this.dashboard
      .userInfoForProfile(this.auth.userData.auth_token)
      .subscribe((res: any) => {
        this.userinfo = res;
        this.openPopupBoxForVerification();
        // this.auth.setUserInfo(result);
      });

    // this.verify_subscription = this.auth.currentUserInfo.subscribe(userinfo => {
    //   console.log('userinfo',userinfo)
    //   if(userinfo.status == '200') {
    //     this.openPopupBoxForVerification(userinfo);
    //   }
    // })
  }
  ngOnDestroy(): void {
    // this.verify_subscription.unsubscribe();
  }

  openPopupBoxForVerification() {
    if (this.userinfo.result[0].address_found === "Y") {
      this.address_found = true;
    }
    if (this.userinfo.result[0].mobile_number_verfiy === "1") {
      this.mobile_number_verfiy = true;
    }
    if (this.userinfo.result[0].aus_post_verified === "Y") {
      this.digital_id_found = true;
    }

    this.mad_verified = true;

    if (
      !(
        this.address_found &&
        this.mobile_number_verfiy &&
        this.digital_id_found
      )
    ) {
      this.mad_verified = false;
      this.verifyservice.popupbox(
        this.userinfo,
        "To proceed to checkout, please verify the following:",
        ""
      );
    }
  }
  checkUserVerification(navigate: string) {
    // document.getElementById('open_owner_verify_id').click()
    this.router.navigate([navigate]);
  }

  getCartItems(init_flage = false) {
    this.no_of_insurance_checked = 0;
    this.baseService.global.showLoader();
    this.cart.getCartItems(this.auth.userData.auth_token).subscribe(
      (res: any) => {
        if (res.result.cart_summary.user_address_id) {
          this.address_selected = true;
          this.selected_addess_id = res.result.cart_summary.user_address_id;
        } else {
          this.address_selected = false;
          this.selected_addess_id = null;
        }

        this.baseService.global.hideLoader();
        // let resJson =  res;
        let resJson = res;
        let result = resJson.result;
        this.cartArr = result;
        this.insuranceTypeIsInvalid = !this.checkForInsuranceValidity();
        if (result.cart.length > 0) {
          if (
            this.cartArr.app_users_details[0].user_profile_picture_link ==
              null ||
            this.cartArr.app_users_details[0].user_profile_picture_link == ""
          ) {
            this.cartArr.app_users_details[0].user_profile_picture_link =
              this.apiurl.apiUrl + "assets/images/profile.png";
          }

          /** For star rating **/
          if (this.cartArr.app_users_details[0].rating == null) {
            this.avg_rating = 0;
          } else {
            this.avg_rating = this.cartArr.app_users_details[0].rating;
          }

          /** For reviews **/
          this.reviews = this.cartArr.app_users_details[0].reviews;
        }

        if (
          this.cartArr.cart_summary.user_address_id != "" &&
          this.cartArr.cart_summary.user_address_id != undefined
        ) {
          this.is_pick_up_address_choosen = true;
        } else {
          this.is_pick_up_address_choosen = false;
        }

        let no_cart_image_url =
          SITE_BASE_URL + "assets/images/default_product.jpg";

        if (result.cart.length > 0) {
          this.cartunavailableseDates(); // to check if any unavailable dates are there or not

          let temp_obj = {};
          this.total_insurance_security_check_array = [];

          let today = new Date();
          this.cart_summery = this.cartArr.cart_summary;

          this.total_no_of_shoot_days = Number(
            this.cartArr.cart_summary.gear_total_rent_request_days
          );
          console.log("todau0", today);
          this.from_date = new Date(
            moment(result.cart[0].gear_rent_request_from_date).format(
              "YYYY-MM-DD"
            )
          );
          console.log(
            "this.from_date",
            moment(result.cart[0].gear_rent_request_from_date).format(
              "YYYY-MM-DD"
            )
          );
          this.to_date = new Date(
            moment(result.cart[0].gear_rent_request_to_date).format(
              "YYYY-MM-DD"
            )
          );
          this.minForReturn = this.to_date;
          /* console.log(today.getDate());
          console.log(new Date(this.from_date).getDate());
          console.log(new Date(this.to_date).getDate()); */
          var refresh_old = false;
          if (
            new Date(this.from_date) < today ||
            new Date(this.to_date) < today
          ) {
            this.proceed_to_checkout_disabled = true;
            this.from_date = new Date(today);
            refresh_old = true;
          } else {
            this.proceed_to_checkout_disabled = false;
          }

          if (new Date(this.to_date) < today) {
            this.to_date = new Date(today);
          }
          if (refresh_old && init_flage) {
            this.fromPickerClosed();
          }
          //this.from_date = new Date(today)
          //this.to_date = new Date(today)

          /*let yesterday = new Date(today)
            let now = new Date(today)

            now.setDate(yesterday.getDate() + 1)
            yesterday.setDate(yesterday.getDate() + 3)

            this.from_date = new Date(now)
            this.to_date = new Date(yesterday)
            console.log('now from',this.from_date)
            console.log('now to ',this.to_date)
            this.from_calender = true;
            this.to_calender = true;           
            this.fromPickerClosed();
            */

          var date1 = new Date(this.from_date);
          var date2 = new Date(this.to_date);
          var diffDays = date2.getDate() - date1.getDate();
          this.shoot_days = diffDays + 1;
          // get Gear Addrress
          this.getCartGearAddress();
          // call header cart count service
          this.cart.noOfCart(result.cart.length); // to update the cart subject for header cart count
          this.has_item_in_cart = true;

          // loop through each cart Item and check for empty image link.
          this.total_insurance_security_amount = 0;
          this.cartArr.cart.forEach((element) => {
            if (
              element.ks_insurance_category_type_id != 0 ||
              element.security_deposit > 0 ||
              element.security_deposit_check == "0"
            ) {
              this.no_of_insurance_checked = this.no_of_insurance_checked + 1;
            }

            /* element.insurance_type_name        =   'Replacement value';
            element.insurance_type_description    =   'Covers damage, theft & some water damage. Claims are subject to a 12% deductible';  */
            element.insurance_type_name = "";
            element.insurance_type_description = "";

            this.total_cost_per_day_exc_gst =
              this.total_cost_per_day_exc_gst +
              Number(element.per_day_cost_aud_ex_gst);

            if (
              element.gear_display_image == "" ||
              element.gear_display_image == null
            ) {
              element.gear_display_image = no_cart_image_url; // set default image if no image link found
            }
            let security_dep = parseFloat(element.security_deposit);
            let insurance_fee = parseFloat(element.insurance_fee);
            if (security_dep > 0) {
              element.insurance_selected_amount = Number(
                element.security_deposit
              );
              element.has_security = true;

              // this.replacementValue(element.user_gear_desc_id, '5');
              this.total_insurance_security_amount +=
                element.insurance_selected_amount;

              temp_obj = {
                user_gear_desc_id: element.user_gear_desc_id,
                insurance_amount: element.security_deposit,
              };

              this.total_insurance_security_check_array.push(temp_obj);
            } else if (insurance_fee > 0) {
              element.insurance_selected_amount = Number(element.insurance_fee);
              temp_obj = {
                user_gear_desc_id: element.user_gear_desc_id,
                insurance_amount: element.insurance_fee,
              };

              this.total_insurance_security_check_array.push(temp_obj);
              element.has_security = false;
            } else {
              element.has_security = false;
            }
          });

          this.total_cost_day_exc_gst =
            this.total_cost_per_day_exc_gst * this.total_no_of_shoot_days;
        } else {
          this.has_item_in_cart = false;
          this.cart.noOfCart(0);
        }
        this.cart.refreshCart(this.cartArr.cart);
      },
      (error) => {
        this.baseService.global.hideLoader();
      }
    );
  }

  deleteAllUsingForkJoin() {
    this.baseService.global.showLoader();
    let forKJoinArr = [];
    this.cartArr.cart.forEach((each_cart_element) => {
      let resp = this.cart.removeCartItem(
        this.auth.userData.auth_token,
        each_cart_element.user_gear_desc_id
      );
      forKJoinArr.push(resp);
    });
    const combined = forkJoin(forKJoinArr);
    combined.subscribe(
      (res: any) => {
        this.baseService.global.hideLoader();
        this.getCartItems();
        this.has_item_in_cart = false;
        // call header cart count service
        this.cart.noOfCart(0); // to update the cart subject for header cart count
      },
      (err) => {
        this.baseService.global.hideLoader();
      }
    );
  }

  deleteAll() {
    let arrCart = [1, 2, 3, 4];

    arrCart.forEach((elm) => {}, 1000);
  }

  removeFromCart(user_gear_desc_id) {
    this.baseService.global.showLoader();
    let remove_subscription = this.cart
      .removeCartItem(this.auth.userData.auth_token, user_gear_desc_id)
      .subscribe(
        (res: any) => {
          this.baseService.global.hideLoader();

          // let resJson =  res;
          let resJson = res;
          remove_subscription.unsubscribe();
          this.getCartItems();
          this.checkIfUserCanCheckOut();
          this.dataService.openSnackBar("Item removed from cart");
        },
        (error) => {
          this.baseService.global.hideLoader();
          this.dataService.openSnackBar(
            "Error while removing cart item",
            "snack-error"
          );
        }
      );
  }

  verifyBeforegoToCheckout() {
    if (
      !(
        this.address_found &&
        this.mobile_number_verfiy &&
        this.digital_id_found
      )
    ) {
      this.verifyservice.popupbox(
        this.userinfo,
        "To proceed to checkout, please verify the following:",
        ""
      );
    } else {
      this.goToCheckout();
    }
  }

  goToCheckout() {
    let today = new Date();

    // console.log(this.project_description);

    let momentFromDate = moment(this.from_date).format("YYYY-MM-DD");
    let momentToDate = moment(this.to_date).format("YYYY-MM-DD");

    if (momentFromDate > momentToDate) {
    } else {
    }

    /* console.log(momentFromDate);
    console.log(momentToDate); */

    this.cart
      .updateRentingDate(
        this.auth.userData.auth_token,
        momentFromDate,
        momentToDate
      )
      .subscribe((res: any) => {});

    this.cart
      .updateProjectDescName(
        this.auth.userData.auth_token,
        this.project_description,
        this.project_name
      )
      .subscribe((res: any) => {
        var yesterdayDateObj = new Date();
        yesterdayDateObj.setDate(yesterdayDateObj.getDate() - 1);
        if (
          new Date(this.from_date) < yesterdayDateObj ||
          new Date(this.to_date) < yesterdayDateObj
        ) {
          this.dataService.openSnackBar(
            "Pick-up date or return date cannot be less than today",
            "snack-error"
          );
        } else if (this.is_pick_up_address_choosen != true) {
          this.dataService.openSnackBar(
            "Please choose a pick-up address",
            "snack-error"
          );
        } else if (this.no_of_insurance_checked < this.cartArr.cart.length) {
          this.dataService.openSnackBar(
            "Please select insurance option for all items",
            "snack-error"
          );
        } else if (this.project_name === "") {
          this.dataService.openSnackBar(
            "Please type the project name",
            "snack-error"
          );
        } else if (momentFromDate > momentToDate) {
          this.dataService.openSnackBar(
            "Return date cannot be less than pick-up date",
            "snack-error"
          );
        } else {
          //need some fixes here
          this.cart
            .userCheckoutCheck(this.auth.userData.auth_token)
            .subscribe((res: any) => {
              if (res.status === 200) {
                this.cart.setSecurityAmount(
                  this.total_insurance_security_amount
                );
                this.router.navigate(["/out/checkout"]);
              } else {
                this.dataService.openSnackBar(
                  res.status_message,
                  "snack-error"
                );
              }
            });
        }
      });
  }

  getCartGearAddress() {
    this.cart
      .getPickUpDropOffAddressList(this.auth.userData.auth_token)
      .subscribe((res: any) => {
        let result = res;
        this.cartGearAddress = result.result;
      });
  }

  selectPickDrop(event) {
    this.selected_addess_id = event.target.value;
    if (this.selected_addess_id !== null && this.selected_addess_id !== "") {
      // updated picup/dropoff
      this.displayCart = false;
      this.cart
        .updatePickUpDropOffAddressList(
          this.auth.userData.auth_token,
          this.selected_addess_id
        )
        .subscribe((res: any) => {
          this.checkIfUserCanCheckOut();
          // console.log(res);
          if (res.status === 200) {
            this.cartArr = {
              app_users_details: res.result.app_users_details,
              cart: res.result.cart,
              cart_summary: res.result.cart_summary,
            };
            this.cart_summery = res.result.cart_summary;
            this.cart_summery["user_address_id"] = res.result.user_address_id;
            this.displayCart = true;
            this.is_pick_up_address_choosen = true;
            // this.is_pick_up_address_choosen = true;
            // this.address_selected = true;
            // this.displayLocationError = false;
            // this.triggerReplacementValue(
            //   this.selectedInsurance.user_gear_desc_id,
            //   this.selectedInsurance.insurance_type
            // );
          } else {
            this.is_pick_up_address_choosen = false;
            this.displayLocationError = true;
            this.address_selected = false;
          }
        });
    } else {
      this.address_selected = false;
      this.cart
        .updatePickUpDropOffAddressList(this.auth.userData.auth_token, null)
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.is_pick_up_address_choosen = true;
            this.address_selected = true;
            this.displayLocationError = false;
            this.triggerReplacementValue(
              this.selectedInsurance.user_gear_desc_id,
              this.selectedInsurance.insurance_type
            );
          } else {
            this.is_pick_up_address_choosen = false;
            this.displayLocationError = true;
            this.address_selected = false;
          }
        });
    }
  }

  fetchInsuranceDetails(user_gear_desc_id, insurance_type) {
    this.cart
      .fetchInsuranceDetails(
        this.auth.userData.auth_token,
        user_gear_desc_id,
        insurance_type,
        this.cart_summery.user_address_id
      )
      .subscribe((res: any) => {
        // Update the cart summary
        // this.cartArr.cart_summary = res.result.cart_summary;
        // this.cartArr = res.result;
        this.cart_summery = this.cartArr.cart_summary;
        this.cartArr.cart.forEach((element) => {
          if (element.user_gear_desc_id == user_gear_desc_id) {
            element.insurance_type_name = res.result.insurance_type.name;
            element.insurance_type_description =
              res.result.insurance_type.description;
          }
        });
      });
  }

  cacheSelectedInsurance(user_gear_desc_id, insurance_type) {
    this.selectedInsurance = {
      user_gear_desc_id,
      insurance_type,
    };
  }

  triggerReplacementValue(user_gear_desc_id, insurance_type) {
    this.selectedInsuraceType[user_gear_desc_id] = insurance_type;
    console.log(this.selectedInsuraceType);
    this.replacementValue(user_gear_desc_id, insurance_type);
  }
  /**
   * If any developer finds it hard to modify the code below, it's not your fault.
   * @param user_gear_desc_id
   * @param insurance_type
   */

  replacementValue(user_gear_desc_id, insurance_type) {
    let temp_obj = {};
    this.insuranceTypeIsInvalid = !this.checkForInsuranceValidity();
    if (insurance_type != "") {
      if (insurance_type == "3") {
        const equipment = this.cartArr.cart.find(
          (item) => item.user_gear_desc_id === user_gear_desc_id
        );
        equipment.ks_insurance_category_type_id = "3";
      }
      if (insurance_type == 0) {
        const equipment = this.cartArr.cart.find(
          (item) => item.user_gear_desc_id == user_gear_desc_id
        );
        equipment.insurance_selected_amount = null;
        equipment.insurance_type_name = null;
        equipment.insurance_type_description = null;
        equipment.ks_insurance_category_type_id = null;
      }

      // this.fetchInsuranceDetails(user_gear_desc_id, insurance_type);
      this.cart
        .fetchInsuranceDetails(
          this.auth.userData.auth_token,
          user_gear_desc_id,
          insurance_type,
          this.selected_addess_id
        )
        .subscribe((res: any) => {
          this.checkIfUserCanCheckOut();
          this.cartArr.cart = res.result.cart;
          this.displayCart = true;
          if (res.status == 200) {
            if (res.flag == "0") {
              this.dataService.openSnackBar(
                res.result.insurance_type.description,
                "snack-error"
              );
            } else {
              // this.checkIfUserCanCheckOut();
              this.cart_summery = res.result.cart_summary;
              // Update cart selected insurance
              this.no_of_insurance_checked = 0;
              res.result.cart.forEach((element) => {
                if (
                  element.ks_insurance_category_type_id != 0 ||
                  element.security_deposit > 0 ||
                  element.security_deposit_check == "0"
                ) {
                  this.no_of_insurance_checked =
                    this.no_of_insurance_checked + 1;
                }
              });

              // Update the cart summary
              this.cart_summery = res.result.cart_summary;
              temp_obj = {
                user_gear_desc_id: user_gear_desc_id,
                insurance_amount:
                  res.result.insurance_type && res.result.insurance_type.amount
                    ? res.result.insurance_type.amount
                    : 0,
              };

              this.cartArr.cart.forEach((element) => {
                if (element.user_gear_desc_id == user_gear_desc_id) {
                  element.insurance_type_name =
                    res.result.insurance_type && res.result.insurance_type.name
                      ? res.result.insurance_type.name
                      : "";
                  element.insurance_type_description =
                    res.result.insurance_type &&
                    res.result.insurance_type.description
                      ? res.result.insurance_type.description
                      : "";
                }
              });

              if (this.total_insurance_security_check_array.length === 0) {
                this.total_insurance_security_check_array.push(temp_obj);
              } else {
                let has_in_the_array: boolean = false;
                this.total_insurance_security_check_array.forEach(
                  (elem: any) => {
                    if (elem.user_gear_desc_id == user_gear_desc_id) {
                      has_in_the_array = true;
                      elem.insurance_amount =
                        res.result.insurance_type &&
                        res.result.insurance_type.amount
                          ? res.result.insurance_type.amount
                          : null;
                    }
                  }
                );

                if (has_in_the_array == false) {
                  temp_obj = {
                    user_gear_desc_id: user_gear_desc_id,
                    insurance_amount:
                      res.result.insurance_type &&
                      res.result.insurance_type.amount
                        ? res.result.insurance_type.amount
                        : 0,
                  };
                  this.total_insurance_security_check_array.push(temp_obj);
                }
              }

              this.cartArr.cart.forEach((element) => {
                this.total_insurance_security_check_array.forEach(
                  (elem: any) => {
                    if (elem.user_gear_desc_id == element.user_gear_desc_id) {
                      element.insurance_selected_amount = Number(
                        elem.insurance_amount
                      );
                    }
                  }
                );
              });
            }
          } else {
            if (res.flag == "0") {
              this.dataService.openSnackBar(res.status_message, "snack-error");
            } else {
              this.dataService.openSnackBar(res.status_message, "snack-error");
            }
          }

          this.displayCart = true;
        });
    } else {
      this.cartArr.cart.forEach((element) => {
        if (element.user_gear_desc_id == user_gear_desc_id) {
          element.insurance_type_name = "";
          element.insurance_type_description = "";
        }
      });

      this.total_insurance_security_check_array =
        this.total_insurance_security_check_array.filter((obj: any) => {
          return obj.user_gear_desc_id !== user_gear_desc_id;
        });
      // console.log(this.total_insurance_security_check_array);
      this.total_insurance_security_check_array.forEach((item: any) => {
        this.total_insurance_security_amount += Number(item.insurance_amount);
      });

      /* console.log('Total else part ......');
      console.log(this.total_insurance_security_amount); */
    }
  }

  sendMessageToOwner() {
    this.is_message_sent = true;
    this.cart
      .contactTheOwner(
        this.auth.userData.auth_token,
        this.cartArr.app_users_details[0].app_user_id,
        this.message_with_owner
      )
      .subscribe(
        (res: any) => {
          /* console.log(res); */
          this.message_with_owner = "";
          this.is_message_sent = false;
          if (res.status === 200) {
            this.dataService.openSnackBar(res.status_message);
          } else {
            this.dataService.openSnackBar(res.status_message, "snack-error");
          }

          // this.closeContactOwnerModal.nativeElement.click();
        },
        (err) => {
          this.closeContactOwnerModal.nativeElement.click();
          this.dataService.openSnackBar(err, "snack-error");
        }
      );
    this.closeContactOwnerModal.nativeElement.click(); //this will close modal
  }

  returnPickerClosed() {
    /* console.log('Hi....');
    console.log(this.from_date);
    console.log(this.to_date); */

    let momentFromDate = moment(this.from_date).format("YYYY-MM-DD");
    let momentToDate = moment(this.to_date).format("YYYY-MM-DD");

    this.cart
      .updateRentingDate(
        this.auth.userData.auth_token,
        momentFromDate,
        momentToDate
      )
      .subscribe((res: any) => {
        this.cart
          .getCartItems(this.auth.userData.auth_token)
          .subscribe((new_cart_res: any) => {
            let resJson = new_cart_res;
            let result = resJson.result;
            this.cart_summery = result.cart_summary;
            this.total_no_of_shoot_days =
              this.cart_summery.gear_total_rent_request_days;
            this.getCartItems();
          });
      });
  }

  onDateSelection(initiator, selectedDate) {
    if (initiator == "from") {
      this.showPicker = false;
      this.from_date = selectedDate.value._d;
      let momentFrom = moment(this.from_date);
      let momentTo = moment(this.to_date);

      if (momentFrom.diff(momentTo) <= 0) {
        this.fromPickerClosed();
        this.showPicker = true;
      } else {
        setTimeout((_) => {
          this.to_date = this.from_date;
          this.fromPickerClosed();
          this.minForReturn = new Date(
            moment(selectedDate.value).format("YYYY-MM-DD")
          );
          this.showPicker = true;
          this.cdRef.detectChanges();
        }, 10);
      }
    }
    if (initiator == "to") {
      this.to_date = selectedDate.value;
      this.fromPickerClosed();
    }
  }

  fromPickerClosed() {
    let momentFromDate = moment(this.from_date).format("YYYY-MM-DD");
    let momentToDate = moment(this.to_date).format("YYYY-MM-DD");
    console.log("momentFromDate", momentFromDate);

    this.cart
      .updateRentingDate(
        this.auth.userData.auth_token,
        momentFromDate,
        momentToDate
      )
      .subscribe((res: any) => {
        //userCheckoutCheck on date change
        this.cart.checkIfUserIsAllowedToCheckout().subscribe((res: any) => {
          if (res.button_status) {
            this.userAllowedToCheckOut = true;
          } else {
            this.userAllowedToCheckOut = false;
          }

          this.cart
            .getCartItems(this.auth.userData.auth_token)
            .subscribe((new_cart_res: any) => {
              let resJson = new_cart_res;
              let result = resJson.result;
              this.cart_summery = result.cart_summary;
              this.total_no_of_shoot_days =
                this.cart_summery.gear_total_rent_request_days;
              this.getCartItems();
            });

          this.checkAvailability(true);

          if (res.status != 200) {
            // this.dataService.openSnackBar(res.status_message, {
            //   cssClass: 'snack-error',
            //   timeout: 3000
            // });
            this.cart_summery.owner_insurance_amount = 0;
            this.owner_ins_subscription = this.cart.cartItems$.subscribe(
              (res: any) => {
                this.cartArr.cart = res;
                for (let a in this.cartArr.cart) {
                  var user_gear_desc_id =
                    this.cartArr.cart[a].user_gear_desc_id;
                  // this.replacementValue(user_gear_desc_id, 0)

                  let equipment = this.cartArr.cart.find(
                    (item) => item.user_gear_desc_id === user_gear_desc_id
                  );

                  // equipment.insurance_selected_amount = null;
                  // equipment.insurance_type_name = null;
                  // equipment.insurance_type_description = null;
                  if (
                    equipment.ks_insurance_category_type_id == "3" ||
                    equipment.ks_insurance_category_type_id == "8"
                  ) {
                    console.log(
                      a + "reset ",
                      equipment.ks_insurance_category_type_id
                    );
                    if (
                      this.selectedInsuraceType[equipment["user_gear_desc_id"]]
                    ) {
                      equipment.ks_insurance_category_type_id =
                        this.selectedInsuraceType[
                          equipment["user_gear_desc_id"]
                        ];
                    } else {
                      equipment.ks_insurance_category_type_id = "0";
                    }
                    this.insuranceTypeIsInvalid =
                      !this.checkForInsuranceValidity();
                    this.cartArr.cart[a].insurance_amount = "";
                    this.cartArr.cart[a].description.message = "";

                    this.cart
                      .fetchInsuranceDetails(
                        this.auth.userData.auth_token,
                        user_gear_desc_id,
                        equipment.ks_insurance_category_type_id,
                        this.selected_addess_id
                      )
                      .subscribe((res: any) => {
                        // this.cartArr.cart_summary = res.result.cart_summary;
                        // this.cartArr = res.result;
                        this.cart_summery = res.result.cart_summary;
                      });
                  }
                }
                this.cart_summery.owner_insurance_amount = 0;
                console.log(
                  "this.owner_ins_subscription",
                  this.owner_ins_subscription
                );
                if (this.owner_ins_subscription) {
                  this.owner_ins_subscription.unsubscribe();
                }
              }
            );
          }
        });
      });
  }

  /**
   * Cart unavailable dates
   */
  cartunavailableseDates() {
    this.cart
      .cartunavailableseDates(this.auth.userData.auth_token)
      .subscribe((res: any) => {
        /* console.log('Cart unavailable dates...');
        console.log(res); */

        // Add unavailable dates
        if (res.result.length > 0) {
          res.result.forEach((element) => {
            let temp_unavailable_date = this.getDaysArray(
              new Date(element.unavailable_from_date),
              new Date(element.unavailable_to_date)
            );
            temp_unavailable_date
              .map((v) => v.toISOString().slice(0, 10))
              .join("");
            temp_unavailable_date.forEach((elem: any) => {
              // elem = moment(elem).format('YY-MM-DD');
              this.unavailable_dates.push(elem);
            });
          });

          /* console.log('Unavailable dates.....');
          console.log(this.unavailable_dates); */
          setTimeout((_) => {
            this.checkAvailability();
          }, 500);
        }
      });
  }
  checkAvailability(showonce = false) {
    let momentFromDate = moment(this.from_date).format("YYYY-MM-DD");
    let momentToDate = moment(this.to_date).format("YYYY-MM-DD");
    this.unavailable_dates.forEach((elem: Date) => {
      let unavailable_date = moment(elem).format("YYYY-MM-DD");
      //console.log('unavailable_date',unavailable_date);
      if (
        momentFromDate < unavailable_date &&
        momentToDate > unavailable_date
      ) {
        //is_this_day_unavailable = true;
        this.userAllowedToCheckOut = false;
        if (showonce) {
          this.dataService.openSnackBar(
            "Date conflicted! Please choose dates across the unavailable dates",
            "snack-error"
          );
        }
        return false;
      }
    });
  }
  getDaysArray = function (start, end) {
    for (
      var arr = [], dt = start;
      dt <= end;
      dt.setDate(dt.getDate("YY-MM-DD") + 1)
    ) {
      arr.push(new Date(dt));
    }
    return arr;
  };
}
