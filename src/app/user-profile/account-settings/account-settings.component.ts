import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "../../base.componant";
import { BaseService } from "./../../services/base.service";
import { DashboardService } from "./../../services/dashboard.service";
import { AuthService } from "./../../services/auth.service";
import {
  getAccountSettings,
  postAccountSettings,
  userProfile,
  ListUnavailableDates,
} from "../../shared/constant";

import { Observable } from "rxjs";
import "rxjs/add/observable/forkJoin";

import * as moment from "moment/moment";
import { DataService } from "app/shared/data/data.service";

@Component({
  selector: "app-account-settings",
  templateUrl: "./account-settings.component.html",
  styleUrls: ["./account-settings.component.scss"],
})
export class AccountSettingsComponent extends BaseComponent implements OnInit {
  notificationStatus: boolean = false;
  phone_no: any;
  otp_came: boolean = false;
  otp: any;
  has_verification_code_been_requested: boolean = false;
  is_mobile_verified: boolean = false;
  verified_mobile_number: String = "";
  primary_email_address: String = "";

  public unAvailableCount: Array<any> = ["dt0"];
  public unAvailableDates: Date[] = [];
  public minDate = new Date();
  constructor(
    public baseService: BaseService,
    public dashboard: DashboardService,
    public dataService: DataService,
    public auth: AuthService
  ) {
    super(baseService, true);
    this.baseService.baseApi.getProfile();
    this.baseService.baseApi.ListUnavailableDates();
    this.baseService.global.showLoader();
    this.phone_no = "";
    this.otp = "";
  }

  ngOnInit() {
    this.baseService.baseApi.getAccountSettings();
  }

  handleApiResponse(data: any) {
    if (data.resulttype === userProfile) {
      if (data.result.result[0].mobile_number_verfiy == "1") {
        this.is_mobile_verified = true;
        this.phone_no = data.result.result[0].primary_mobile_number;
      } else {
        this.is_mobile_verified = false;
      }
      this.primary_email_address = data.result.result[0].primary_email_address;
    }
    if (data.resulttype === getAccountSettings) {
      this.notificationStatus =
        data.result.result.notification === "No" ? false : true;
      this.baseService.global.hideLoader();
    }
    if (data.resulttype === postAccountSettings) {
      if (data.result.status_code === 200) {
        this.baseService.global.hideLoader();
        this.dataService.openSnackBar(
          data.result.status_message,
          "snack-success"
        );
      }
    }
    if (data.resulttype === ListUnavailableDates) {
      if (data.result.status == 200) {
        let date_count_index: number = 0;
        data.result.result.forEach((element) => {
          let new_array_date: any = [];

          new_array_date.push(moment(new Date(element.from_date)));
          new_array_date.push(moment(new Date(element.to_date)));
          this.unAvailableDates.push(new_array_date);
          this.unAvailableCount.push("dt" + date_count_index);
          date_count_index++;
        });
      }
    }
  }
  updateAccountSettings() {
    let accountData = !this.notificationStatus === false ? "No" : "Yes";
    this.baseService.baseApi.postAccountSettings({ notification: accountData });
    this.baseService.global.showLoader();
  }

  verifyPhone() {
    this.has_verification_code_been_requested = true;

    this.dashboard
      .verifyPhone(this.auth.userData.auth_token, this.phone_no)
      .subscribe((res: any) => {
        /**
         * otp_code: 349353
         * status: 200
         * status_message: "Message is sent to registered mobile"
         */
        let result = res;
        if (result.status == 200) {
          this.otp_came = true;
          // this.otp = result.otp_code;
        }
      });
  }

  /**
   * Resend the OTP again
   * Added by N.Roy on 23/May/2019
   */
  resendOtp() {
    this.has_verification_code_been_requested = true;

    this.dashboard
      .verifyPhone(this.auth.userData.auth_token, this.phone_no)
      .subscribe((res: any) => {
        /**
         * otp_code: 349353
         * status: 200
         * status_message: "Message is sent to registered mobile"
         */
        let result = res;
        if (result.status == 200) {
          this.otp_came = true;
          // this.otp = result.otp_code;
        }
      });
  }

  sendOTP() {
    this.dashboard
      .verifyOtp(this.auth.userData.auth_token, this.phone_no, this.otp)
      .subscribe((res: any) => {
        let result = res;
        if (result.status == 200) {
          this.is_mobile_verified = true;
          this.otp_came = false;
          this.otp = "";
          /* this.baseService.flash.show('Mobile number verified successfully', {
            cssClass: 'success',
            timeout: 2000
          }); */

          this.dataService.openSnackBar(
            "Mobile number verified successfully",
            "snack-success"
          );

          this.baseService.global.showLoader();
          this.baseService.baseApi.getAccountSettings();
        } else {
          /* this.baseService.flash.show(result.status_message, {
            cssClass: 'snack-error',
            timeout: 2000
          }); */
          this.dataService.openSnackBar(res.status_message, "snack-error");
        }
      });
  }

  addNewUnavailableDate() {
    let lastIndex = this.unAvailableCount.length;
    this.unAvailableCount.push("dt" + lastIndex);
    // this.unAvailableDates.push(new Date());
  }

  savedate() {
    let unavailableFormattedDates = this.unAvailableDates.map((e) => {
      return [e[0].format("YYYY-MM-DD"), e[1].format("YYYY-MM-DD")];
    });

    // let requestDataFromMultipleSources: Observable<any[]>;
    if (unavailableFormattedDates.length > 0) {
      let add_date_array = [];

      unavailableFormattedDates.forEach((elem) => {
        add_date_array.push(
          this.dashboard.addUnavailableDate(
            this.auth.userData.auth_token,
            elem[0],
            elem[1]
          )
        );
      });

      const obsrv = Observable.forkJoin(add_date_array);
      obsrv.subscribe((res: any) => {
        this.dataService.openSnackBar(
          "Unavailable dates added successfully",
          "snack-success"
        );
      });
    }
  }

  removeDateFunction(index) {
    this.unAvailableDates.splice(index, 1);
    this.unAvailableCount.splice(index, 1);
    if (this.unAvailableDates[index] === undefined) {
      return false;
    }
    let from_date = this.unAvailableDates[index][0].format("YYYY-MM-DD");
    let to_date = this.unAvailableDates[index][1].format("YYYY-MM-DD");
    this.baseService.baseApi.deleteUnavialableDate(from_date, to_date);
  }
}
