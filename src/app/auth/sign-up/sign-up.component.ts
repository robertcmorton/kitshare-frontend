import { Component, OnInit, OnDestroy } from "@angular/core";

import { AuthService as Auth } from "../../services/auth.service";
import { GlobalService } from "../../services/global.service";
import {
  HttpResonseTextWihStatus,
  UserRegistrationData,
} from "../../shared/models/auth.model";
import { Router } from "@angular/router";
import { DataService } from "app/shared/data/data.service";
@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.scss"],
})

/**
 * contain all functionality related to sign up component
 */
export class SignUpComponent implements OnDestroy {
  /**
   * conatin users registration details
   * @var UserRegistrationData
   */
  public registrationData: UserRegistrationData = new UserRegistrationData();
  /**
   * terms and condition agree or not
   */
  public terms_and_condition: boolean = false;

  /**
   * This injected dependency to to component
   *
   * @param global global service
   * @param flash flash message service
   * @param auth auth service
   */
  constructor(
    public global: GlobalService,
    public auth: Auth,
    public router: Router,
    private dataService: DataService
  ) {
    this.global.showFooter = false;
    this.global.showHeader = false;
  }

  /**
   * This will call when users submit the form, and call api to register user
   *
   * @return void
   */
  submitForm(): void {
    if (this.validateForm()) {
      this.global.showLoader();
      this.auth.registration(this.registrationData).subscribe(
        (response) => {
          this.global.hideLoader();
          var alertClass =
            response.status === 200 ? "snack-success" : "snack-error";
          this.dataService.openSnackBar(response.status_message, alertClass);
          this.router.navigate(["/account-confirmation"]);
        },
        (error) => {
          console.log("Error ==>", error);
          this.dataService.openSnackBar(
            "Error 003: Unable to Submit your Signup request",
            "snack-error"
          );
        }
      );
    }
  }

  /**
   * This will called from submitFor function to validate users input
   * before sending them to server
   */
  validateForm() {
    if (!this.registrationData.app_user_first_name) {
      this.dataService.openSnackBar("First name is too short!", "snack-error");
      return false;
    }
    if (!this.registrationData.app_user_last_name) {
      this.dataService.openSnackBar("Last name is too short!", "snack-error");
      return false;
    }
    if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
        this.registrationData.primary_email_address
      )
    ) {
      this.dataService.openSnackBar("Invalid Email Address", "snack-error");
      return false;
    }

    if (
      !this.registrationData.app_password ||
      this.registrationData.app_password.length < 6
    ) {
      this.dataService.openSnackBar(
        "Password should be minimum of 6 characters",
        "snack-error"
      );
      return false;
    }

    if (!this.terms_and_condition) {
      this.dataService.openSnackBar(
        "Please agree with our Terms & Conditions",
        "snack-error"
      );
      return false;
    }
    return true;
  }

  /**
   * this will check the email, is it unique or not
   */
  checkUniqueEmail() {
    if (this.registrationData.primary_email_address) {
      this.auth
        .checkUniqueEmail({
          primary_email_address: this.registrationData.primary_email_address,
        })
        .subscribe(
          (response) => {
            if (response.status !== 200) {
              this.dataService.openSnackBar(
                response.status_message,
                "snack-error"
              );
              this.registrationData.primary_email_address = "";
            }
          },
          (error) => {
            console.log("Error ==>", error);
            this.dataService.openSnackBar(
              "Error 004: This is not a Unique email Address",
              "snack-error"
            );
          }
        );
    }
  }
  /**
   * This will enable header and footer again, so they are visible in other page
   */
  ngOnDestroy() {
    this.global.showFooter = true;
    this.global.showHeader = true;
  }
}
