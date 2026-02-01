import { AuthService } from "./../../../services/auth.service";
import { CartService } from "./../../../services/cart.service";
import { MessageService } from "./../../../services/message.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "kit-navigation-triggers",
  templateUrl: "./navigation-triggers.component.html",
  styleUrls: ["./navigation-triggers.component.scss"],
})
export class NavigationTriggersComponent implements OnInit {
  no_of_unread_messages;
  no_of_cart_items;

  constructor(
    private messageService: MessageService,
    private auth: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getUnreadMessages();
  }

  goToMessage() {
    // this.router.navigate(['/rentals-dashboard', {from : 'header'}]);
    this.router.navigate(["/rentals/messaging"]);
    this.no_of_unread_messages = 0;
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
}
