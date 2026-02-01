import { DashboardService } from "./../../services/dashboard.service";
import { BaseService } from "../../services/base.service";
import { Router } from "@angular/router";
import { SocialLoginData } from "../../shared/models/auth.model";
import { Component, OnInit, OnDestroy } from "@angular/core";

import { SocialUser } from "@abacritt/angularx-social-login";

import { SocialAuthService } from "@abacritt/angularx-social-login";
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
} from "@abacritt/angularx-social-login";
import { DataService } from "app/shared/data/data.service";

@Component({
  selector: "app-social-login",
  templateUrl: "./social-login.component.html",
  styleUrls: ["./social-login.component.scss"],
})

/**
 * contain all functionality related to social(facebook, google) login
 */
export class SocialLoginComponent implements OnInit, OnDestroy {
  routerUrl: string;
  /**
   * contain logged in user details
   *
   * @var user SocialUser
   */
  public user: SocialUser;

  /**
   * subsciriber of provider response
   */
  public providerResponseSubscribe: any;

  /**
   * subsciriber of api response
   */
  public apiResponseSubscribe: any;

  /**
   * manage dependency injection
   *
   * @param authService Social AuthService
   * @param auth our auth service
   * @param flash FlashMessagesService
   */
  constructor(
    private dataService: DataService,
    public base: BaseService,
    public router: Router,
    private socialAuth: SocialAuthService,
    private dashboard: DashboardService
  ) {
    this.routerUrl = "";
  }

  ngOnInit(): void {
    this.routerUrl = this.router.url;
  }
  /**
   * fetch user data from provide
   */
  subscribeResponse() {
    this.providerResponseSubscribe = this.socialAuth.authState.subscribe(
      (user) => {
        if (user && this.base.auth.checkLoggedIn() === false) {
          this.user = user;
          this.login(user.provider.toLocaleLowerCase());
          //  debugger;
          // this.dashboard.getProfileImage(this.user.photoUrl);
          //             userInfoSub.unsubscribe();
        }
      }
    );
  }

  /**
   * redirect to google page for authorization
   */
  // signInWithGoogle(): void {
  //   this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  //   this.subscribeResponse();
  // }

  /**
   * redirect to fb page for authorization
   */
  signInWithFB(): void {
    // this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    // this.subscribeResponse();
    this.socialAuth.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.subscribeResponse();
  }

  signInWithGoogle(): void {
    this.socialAuth.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.subscribeResponse();
  }

  /**
   * called social login api
   *
   * @param provider string google|facebok
   */
  login(provider: string) {
    var userData: SocialLoginData = new SocialLoginData();
    userData.name = this.user.name;
    userData.email = this.user.email;
    userData.id = this.user.id;
    userData.image = this.user.photoUrl;
    this.base.global.showLoader();
    this.apiResponseSubscribe = this.base.auth
      .socialLogin(userData, provider)
      .subscribe(
        (response) => {
          debugger;
          var alertClass =
            response.status === 200 ? "snack-success" : "snack-error";
          if (response.status === 200 && response.auth_token) {
            const userInfoSub = this.base.auth
              .getUserFromToken(response.auth_token)
              .subscribe(
                // tslint:disable-next-line:no-shadowed-variable
                (userData) => {
                  if (userData.status === 200) {
                    this.base.auth.setUserData(userData);
                    this.dashboard
                      .userInfoForProfile(response.auth_token)
                      .subscribe((res: any) => {
                        let result = res;
                        this.dashboard.getProfileImage(
                          result.result[0].user_profile_picture_link
                        );
                        this.base.global.hideLoader();
                        this.dataService.openSnackBar(
                          "User Logged In Successfully"
                        );
                        this.router.navigate(["/"]);
                        userInfoSub.unsubscribe();
                      });
                  } else {
                    this.dataService.openSnackBar(
                      userData.status_message,
                      "snack-error"
                    );
                    userInfoSub.unsubscribe();
                  }
                },
                (error) => {
                  this.dataService.openSnackBar(
                    "Error 009: Something went wrong!",
                    "snack-error"
                  );
                }
              );
          } else {
            this.dataService.openSnackBar(response["status_message"]);
          }
          this.providerResponseSubscribe.unsubscribe();
        },
        (error) => {
          this.dataService.openSnackBar(
            "Error 009: Something went wrong!",
            "snack-error"
          );
          this.providerResponseSubscribe.unsubscribe();
        }
      );
  }
  ngOnDestroy() {
    if (this.apiResponseSubscribe) {
      this.apiResponseSubscribe.unsubscribe();
    }
  }
}
