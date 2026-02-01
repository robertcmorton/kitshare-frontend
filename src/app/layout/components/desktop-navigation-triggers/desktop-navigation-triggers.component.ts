import { CartService } from "./../../../services/cart.service";
import { MessageService } from "./../../../services/message.service";
import { Component, OnInit, Input } from "@angular/core";
import { AuthService } from "../../../services/auth.service";
import { Router } from "@angular/router";
import { timer } from "rxjs";

@Component({
  selector: "kit-desktop-navigation-triggers",
  templateUrl: "./desktop-navigation-triggers.component.html",
  styleUrls: ["./desktop-navigation-triggers.component.scss"],
})
export class DesktopNavigationTriggersComponent implements OnInit {
  @Input() loggedIn: any;
  @Input() avatar: any;
  no_of_unread_messages;
  no_of_cart_items;
  closeMenu: boolean = false;

  constructor(
    private auth: AuthService,
    private messageService: MessageService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log(this.auth.checkLoggedIn(), "cccc");
    if (this.auth.checkLoggedIn()) {
      this.getUnreadMessages();
      var numbers = timer(10000, 10000); //interval start after 10 second and repeat in every 5 second
      numbers.subscribe((x) => {
        if (
          this.auth.userData.hasOwnProperty("auth_token") &&
          this.auth.checkLoggedIn()
        ) {
          this.messageService
            .getUnreadMessages(this.auth.userData.auth_token)
            .subscribe(
              (res: any) => {
                if (this.no_of_unread_messages != res.result) {
                  this.cartService.noOfMsg(res.result);
                  this.no_of_unread_messages = res.result;
                }
              },
              (error: any) => {
                if (
                  error.status == "400" &&
                  error.statusText == "Session Expired"
                ) {
                  // this.flash.show("session expired", {
                  //   cssClass: "snack-error",
                  //   timeout: 3000,
                  // });
                  this.auth.logout();
                  //this.router.navigate(['/login']);
                }
              }
            );
        }
      });
    }
  }

  goToMessage() {
    this.no_of_unread_messages = 0;
    // this.router.navigate(['/rentals-dashboard', {from : 'header'}]);
    this.router.navigate(["/rentals/messaging"]);
  }

  goToCart() {
    this.router.navigate(["/out/cart"]);
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

  logout() {
    this.auth.logout();
  }

  onClickedOutsidePrimaryNav(event) {
    this.closeMenu = true;
    setTimeout((_) => {
      this.closeMenu = false;
    }, 10);
  }
}
