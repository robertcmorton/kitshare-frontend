import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CartService } from "../../services/cart.service";
import { AuthService } from "./../../services/auth.service";
import { BaseService } from "../../services/base.service";
import { PaymentService } from "../../services/payment.service";
import { DashboardService } from "../../services/dashboard.service";
import { Router } from "@angular/router";
import * as dropin from "braintree-web-drop-in";
import { DataService } from "app/shared/data/data.service";

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.scss"],
})
export class CheckoutComponent implements OnInit {
  @ViewChild("dropincontainer", { static: true }) dropincontainer: ElementRef;
  cartArr: any;
  no_of_items: number = 0;
  cart_item_sentence: string = "";
  insurance_fee: number;
  beta_discount: number;
  community_fee: number;
  security_deposit: number;
  total_rent_amount_ex_gst: number;
  gst_amount: number;
  total_rent_amount: number;
  braintreeIsReady: boolean;
  dropIninstance: any;
  isPayDisabled: boolean;
  transaction_id: string;
  paymentcompleted: boolean;
  user_gear_desc_id: string;
  paymentFormLoaded: boolean = false;
  total_insurance_security_amount: number;

  total_numer_of_days: String;

  rental_date_from: any;
  rental_date_to: any;

  total_no_of_shoot_days: number;
  total_cost_per_day_exc_gst: number;
  total_cost_day_exc_gst: number;
  sub_total: number;

  is_payment_going_on: boolean;
  payment_method_nonce_for_security: string;

  renter_id: any;

  constructor(
    private cart: CartService,
    private auth: AuthService,
    public baseService: BaseService,
    public router: Router,
    private dataService: DataService,
    private activeRoute: ActivatedRoute,
    private dashboard: DashboardService,
    private payment: PaymentService
  ) {
    // check login
    if (!this.auth.checkLoggedIn()) {
      this.router.navigate(["/login"]);
    }
    this.cartArr = {};
    this.getCartItems();
    this.isPayDisabled = true;
    this.transaction_id = "";
    this.paymentcompleted = false;
    this.user_gear_desc_id = "";
    this.total_insurance_security_amount = 0;
    this.is_payment_going_on = false;

    this.total_no_of_shoot_days = 0;
    this.total_cost_per_day_exc_gst = 0;
    this.total_cost_day_exc_gst = 0;
    this.payment_method_nonce_for_security = "";
  }
  ngOnInit() {
    /* this.activeRoute.queryParams.subscribe(queryParams => {
      console.log(queryParams);
    }); */

    this.activeRoute.params.subscribe((params) => {
      this.total_insurance_security_amount = this.cart.getSecurityAmount();
      if (this.total_insurance_security_amount === undefined) {
        this.router.navigate(["/out/cart"]);
      }
    });

    this.payment.getClientToken().subscribe((res: any) => {
      let response = res;
      if (response.status_code == 200) {
        dropin.create(
          {
            authorization: response.result,
            selector: "#dropincontainer",
            card: {
              cardholderName: true,
            },
          },
          (err, dropinInstance) => {
            if (err) {
              // Handle any errors that might've occurred when creating Drop-in
              return;
            }
            this.dropIninstance = dropinInstance;
            this.braintreeIsReady = true;
            this.isPayDisabled = false;
            this.paymentFormLoaded = true;
          }
        );
      }
    });
    // this.getCartItems();
  }

  pay() {
    this.is_payment_going_on = true;
    this.cart
      .userCheckoutCheck(this.auth.userData.auth_token)
      .subscribe((res: any) => {
        if (res.status === 200) {
          this.dropIninstance.requestPaymentMethod((err, payload) => {
            if (err) {
              this.is_payment_going_on = false;
            } else {
              this.payment_method_nonce_for_security = payload.nonce;
            }
          });

          this.dropIninstance.requestPaymentMethod((err, payload) => {
            if (err) {
              // deal with error
              this.is_payment_going_on = false;
            } else {
              this.is_payment_going_on = true;
              this.isPayDisabled = false;

              // send nonce to the server [payment_method_nonce]

              this.payment
                .completePayment(
                  this.auth.userData.auth_token,
                  payload.nonce,
                  Number(this.total_rent_amount).toFixed(2)
                )
                .subscribe(
                  (res: any) => {
                    let result = res;

                    if (result.status === 200) {
                      this.cart.noOfCart(0); // reset cart after payment done
                      this.transaction_id = result.trancation_id;
                      this.isPayDisabled = true;
                      this.payment
                        .saveRecordToOrder(
                          this.auth.userData.auth_token,
                          this.transaction_id,
                          this.total_rent_amount,
                          this.user_gear_desc_id
                        )
                        .subscribe((respns: any) => {
                          let res_json = respns;
                          this.paymentcompleted = true;

                          this.dashboard
                            .userInfoForProfile(this.auth.userData.auth_token)
                            .subscribe((res: any) => {
                              let response = res;
                              let sender_id = response.result[0].app_user_id;
                              this.dashboard
                                .sendMessage(
                                  this.auth.userData.auth_token,
                                  this.renter_id,
                                  "0",
                                  "Order : " + res_json.result,
                                  res_json.result,
                                  "Order",
                                  sender_id
                                )
                                .subscribe((res: any) => {});
                            });

                          // If insurance/security amount selected then save it
                          if (this.total_insurance_security_amount != 0) {
                            this.payInsurance(res_json);
                          } else {
                            this.is_payment_going_on = false;
                            this.auth.setPreviousUrl("out/checkout");
                            this.router.navigate([
                              "/order-summary/" + res_json.result + "/renter",
                            ]);
                          }
                        });
                    } else {
                      this.dataService.openSnackBar(
                        "Payment failed." + result.message,
                        "snack-error"
                      );
                    }
                  },
                  (error) => {}
                );
            }
          });
        } else {
          this.dataService.openSnackBar(res.status_message, "snack-error");
        }
      });
  }

  payInsurance(res_json) {
    this.dropIninstance.requestPaymentMethod((err, payload) => {
      if (err) {
        // deal with error
      } else {
        this.payment
          .depositePayment(
            this.auth.userData.auth_token,
            this.payment_method_nonce_for_security,
            this.total_insurance_security_amount,
            res_json.result
          )
          .subscribe((deposite_res: any) => {
            let result = deposite_res;

            this.transaction_id = deposite_res.trancation_id;
            this.payment
              .saveInsuranceRecordToOrder(
                this.auth.userData.auth_token,
                this.transaction_id,
                this.total_insurance_security_amount,
                this.user_gear_desc_id,
                res_json.result
              )
              .subscribe((res: any) => {
                this.is_payment_going_on = false;
                this.auth.setPreviousUrl("out/checkout");
                this.router.navigate([
                  "/order-summary/" + res_json.result + "/renter",
                ]);
              });
          });
      }
    });
  }

  getCartItems() {
    this.baseService.global.showLoader();
    this.cart.getCartItems(this.auth.userData.auth_token).subscribe(
      (res: any) => {
        this.baseService.global.hideLoader();
        let resJson = res;
        let result = resJson.result;
        this.cartArr = result;
        this.no_of_items = result.cart.length;
        this.cart_item_sentence =
          this.no_of_items > 0 && this.no_of_items <= 1
            ? "1 Item"
            : this.no_of_items + " Items";

        this.renter_id = this.cartArr.app_users_details[0].app_user_id;

        this.total_no_of_shoot_days = Number(
          this.cartArr.cart_summary.gear_total_rent_request_days
        );

        this.rental_date_from = new Date(
          `${this.cartArr.cart[0].gear_rent_request_from_date}`.replace(
            /-/g,
            "/"
          )
        );
        this.rental_date_to = new Date(
          `${this.cartArr.cart[0].gear_rent_request_to_date}`.replace(/-/g, "/")
        );

        // this.rental_dates = this.cartArr.cart[0].gear_rent_request_from_date + ' - ' + this.cartArr.cart[0].gear_rent_request_to_date;

        let cart_user_gear_desc_id: Array<any> = [];
        this.cartArr.cart.forEach((element) => {
          cart_user_gear_desc_id.push(element.user_gear_desc_id);
        });

        this.user_gear_desc_id = cart_user_gear_desc_id.join(",");

        this.insurance_fee = this.cartArr.cart_summary.insurance_fee;
        this.beta_discount = this.cartArr.cart_summary.beta_discount;
        this.community_fee = this.cartArr.cart_summary.community_fee;
        this.security_deposit = this.cartArr.cart_summary.security_deposit;
        this.total_rent_amount_ex_gst =
          this.cartArr.cart_summary.total_rent_amount_ex_gst;
        this.sub_total = this.cartArr.cart_summary.sub_total;
        this.gst_amount = this.cartArr.cart_summary.gst_amount;
        this.total_rent_amount = this.cartArr.cart_summary.total_rent_amount;
        this.total_numer_of_days =
          this.cartArr.cart_summary.gear_total_rent_request_days;

        this.cartArr.cart.forEach((element) => {
          this.total_cost_per_day_exc_gst =
            this.total_cost_per_day_exc_gst +
            Number(element.per_day_cost_aud_ex_gst);
        });

        this.total_cost_day_exc_gst =
          this.total_cost_per_day_exc_gst * this.total_no_of_shoot_days;
      },
      (error) => {
        this.baseService.global.hideLoader();
      }
    );
  }
}
