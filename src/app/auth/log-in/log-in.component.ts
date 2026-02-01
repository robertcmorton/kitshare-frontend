import { BaseService } from "../../services/base.service";
import { DashboardService } from "../../services/dashboard.service";
import {
  LoginResponse,
  UserData,
  UserDetailsResponse,
} from "../../shared/models/auth.model";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { UserLoginData } from "../../shared/models/auth.model";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { AuthService } from "./../../services/auth.service";
import { DataService } from "app/shared/data/data.service";

@Component({
  selector: "app-log-in",
  templateUrl: "./log-in.component.html",
  styleUrls: ["./log-in.component.scss"],
})

/**
 * contain all functionality related to login component
 */
export class LogInComponent implements OnInit, OnDestroy {
  /**
   * contain login credentials
   *
   * @var  loginData  UserLoginData
   */
  public loginData: UserLoginData = new UserLoginData();
  disableLoginSubmit = false;
  public urlParam: string = "";

  /**
   * This injected dependency to to component
   *
   * @param global global service
   * @param flash flash message service
   * @param auth auth service
   */
  constructor(
    public base: BaseService,
    private route: ActivatedRoute,
    public router: Router,
    public dashboard: DashboardService,
    private auth: AuthService,
    private dataService: DataService
  ) {
    this.base.global.showFooter = false;
    this.base.global.showHeader = false;
    this.route.params.subscribe((params) => {
      this.urlParam = params.type ? params.type : "";
    });
  }

  ngOnInit(): void {
    this.base.global.hideLoader();

    // if (this.base.auth.checkLoggedIn() === true) {
    //   this.router.navigate(["/search"]);
    // }
    console.log("this.urlParam", this.urlParam);
    if (this.urlParam !== "") {
      var alertClass =
        this.urlParam === "Success" ? "snack-success" : "snack-error";
      var alertMessage =
        this.urlParam === "Success"
          ? "Your account has been successfully verified. Please Login"
          : "Your account is not activated yet!";

      this.dataService.openSnackBar(alertMessage, alertClass);
      if (this.urlParam === "Success") {
        this.base.global.showCongrates();
      }
    }
  }

  /**
   * This will call when users submit the form, and call api to register user
   *
   * @return void
   */
  submitForm(): void {
    this.disableLoginSubmit = true;
    if (this.validateForm()) {
      this.base.global.showLoader();
      this.auth.login(this.loginData).subscribe(
        (response: LoginResponse) => {
          if (response.status === 200 && response.auth_token) {
            const userInfoSub = this.auth
              .getUserFromToken(response.auth_token)
              .subscribe(
                (userData: UserDetailsResponse) => {
                  if (userData.status === 200) {
                    this.auth.setUserData(userData);
                    this.dashboard
                      .userInfoForProfile(response.auth_token)
                      .subscribe((res: any) => {
                        this.base.global.hideLoader();
                        this.dataService.openSnackBar(
                          "User Logged In Successfully"
                        );
                        let result = res;
                        this.auth.setUserInfo(result);
                        this.dashboard.getProfileImage(
                          result.result[0].user_profile_picture_link
                        );
                        userInfoSub.unsubscribe();
                        this.router.navigate(["/search"]);
                      });
                  } else {
                    this.base.global.hideLoader();
                    this.disableLoginSubmit = false;
                    userInfoSub.unsubscribe();
                    this.router.navigate(["/search"]);
                  }
                },
                (error) => {
                  this.disableLoginSubmit = false;
                  this.base.global.hideLoader();
                  this.dataService.openSnackBar(
                    "Error 008: Something went wrong!",
                    "snack-error"
                  );
                }
              );
          }
          if (response.status === 403) {
            response.status_message =
              "Please check your email for a confirmation link";
          }
          if (response.status != 200) {
            this.disableLoginSubmit = false;
            this.dataService.openSnackBar(
              response.status_message,
              "snack-error"
            );
            this.base.global.hideLoader();
          }
        },
        (error) => {
          this.disableLoginSubmit = false;
          this.dataService.openSnackBar(
            "Error 008: Something went wrong!",
            "snack-error"
          );
        }
      );
    } else {
      this.disableLoginSubmit = false;
    }
  }
  /**
   * This will called from submitFor function to validate users input
   * before sending them to server
   */
  validateForm() {
    if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
        this.loginData.primary_email_address
      )
    ) {
      this.dataService.openSnackBar("Invalid Email Address");
      return false;
    }

    if (
      !this.loginData.app_password ||
      this.loginData.app_password.length < 6
    ) {
      this.dataService.openSnackBar(
        "Password should be a minimum of 6 characters"
      );
      return false;
    }
    return true;
  }

  /**
   * this will enable header and footer again
   */
  ngOnDestroy() {
    this.base.global.showFooter = true;
    this.base.global.showHeader = true;
  }
}
