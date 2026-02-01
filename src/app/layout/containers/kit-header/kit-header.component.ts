import { Router } from "@angular/router";
import { environment } from "./../../../../environments/environment";
import { CartService } from "./../../../services/cart.service";
import { MessageService } from "./../../../services/message.service";
import { AppService } from "./../../../app.service";
import { DashboardService } from "./../../../services/dashboard.service";
import { AuthService } from "./../../../services/auth.service";
import { Component, OnInit, ChangeDetectorRef } from "@angular/core";

@Component({
  selector: "app-kit-header",
  templateUrl: "./kit-header.component.html",
  styleUrls: ["./kit-header.component.scss"],
})
export class KitHeaderComponent implements OnInit {
  user_profile_picture_link: string = "";
  currentSize: number;
  no_of_unread_messages;
  no_of_cart_items;
  desktop: number = environment.breakpoints.desktop;

  constructor(
    public auth: AuthService,
    private dashboard: DashboardService,
    private app: AppService,
    private cdRef: ChangeDetectorRef,
    private messageService: MessageService,
    private cartService: CartService,
    private router: Router
  ) {
    if (this.auth.checkLoggedIn()) {
      // get user info
      this.dashboard
        .userInfoForProfile(this.auth.userData.auth_token)
        .subscribe(
          (res: any) => {
            let result = res;
            // this.cartService.setUserInfo(result);
            // console.log('User info after login...');
            // console.log(result);
            // this.user_profile_picture_link = result.result[0].user_profile_picture_link;
            this.dashboard.getProfileImage(
              result.result ? result.result[0].user_profile_picture_link : ""
            );
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

      this.cartService
        .getCartItems(this.auth.userData.auth_token)
        .subscribe((res: any) => {
          // let response = res; // if you are not using httpClient
          let response = res;
          /* console.log('Getting cart items...');
        console.log(response); */
          if (
            response.result &&
            response.result.cart &&
            response.result.cart.length > 0
          ) {
            this.cartService.noOfCart(response.result.cart.length);
          } else {
            this.cartService.noOfCart(0);
          }
        });
    }
  }

  ngOnInit() {
    this.user_profile_picture_link = "assets/images/chat_user.png";
    this.auth.checkLoggedIn();
    this.dashboard.myProfilePics$.subscribe((res: any) => {
      this.user_profile_picture_link = res;
    });
    setTimeout(() => {
      this.auth.currentUserProfile.subscribe((profile_image: string) => {
        if (profile_image) {
          this.user_profile_picture_link = profile_image;
        }
      });
    }, 2000);

    this.app.onResize$.subscribe((size) => {
      this.currentSize = size;
      // this.cdRef.detectChanges();
    });
  }

  getUnreadMessages() {
    if (this.auth.userData.hasOwnProperty("auth_token")) {
      this.messageService
        .getUnreadMessages(this.auth.userData.auth_token)
        .subscribe((res: any) => {
          this.no_of_unread_messages = res.result;
        });
    }

    this.cartService.myCart$.subscribe((res: any) => {
      this.no_of_cart_items = res;
    });
  }
}
