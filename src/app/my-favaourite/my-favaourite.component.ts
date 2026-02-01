import { Component, OnInit } from "@angular/core";
import { DashboardService } from "../services/dashboard.service";
import { AuthService } from "../services/auth.service";

import { BaseService } from "./../services/base.service";

import { CartService } from "./../services/cart.service";
import { SearchService } from "./../services/search.service";

import * as moment from "moment/moment";
import { DataService } from "app/shared/data/data.service";

@Component({
  selector: "app-my-favaourite",
  templateUrl: "./my-favaourite.component.html",
  styleUrls: ["./my-favaourite.component.scss"],
})
export class MyFavaouriteComponent implements OnInit {
  my_favourite_array: Array<object>;
  search_fav: String;
  added_to_cart: boolean = false;
  cart_array: Array<any>;

  constructor(
    public dashboard: DashboardService,
    public baseService: BaseService,
    private cart: CartService,
    public searchService: SearchService,
    public auth: AuthService,
    private dataService: DataService
  ) {
    this.my_favourite_array = [];
    this.search_fav = "";
  }

  ngOnInit() {
    this.getMyFavourites();
  }

  getMyFavourites() {
    this.dashboard.getFavouriteList(this.auth.userData.auth_token).subscribe(
      (res: any) => {
        this.my_favourite_array = res.result;
        this.getCart();
      },
      (err) => {}
    );
  }

  searchFavourite() {
    // if(this.search_fav != '') {

    this.dashboard
      .searchFavouriteList(this.auth.userData.auth_token, this.search_fav)
      .subscribe(
        (res: any) => {
          this.my_favourite_array = res.result;
          this.getCart();
        },
        (err) => {}
      );

    // }
  }

  addtoCart(item) {
    let user_gear_desc_id = item.user_gear_desc_id;
    item["added_to_cart"] = true;
    let momentFromDate = moment(new Date()).format("YYYY-MM-DD");
    let momentToDate = moment(new Date()).format("YYYY-MM-DD");

    if (this.auth.checkLoggedIn()) {
      let item_obj = {
        user_gear_desc_id: user_gear_desc_id,
        date_from: momentFromDate,
        date_to: momentToDate,
        token: this.auth.userData.auth_token,
      };
      this.cart.addToCart(item_obj).subscribe(
        (res: any) => {
          // check the status
          // let result = res;  // if you are not using httpClient
          let result = res;

          if (result.status === 200) {
            this.dataService.openSnackBar("Item added to your cart");
            this.getCart();
          }
          if (result.status !== 200) {
            let status_message = result.status_message;
            this.baseService.global.hideLoader();
            this.dataService.openSnackBar(status_message, "snack-error");
          }
        },
        (error) => {
          this.baseService.global.hideLoader();
          this.dataService.openSnackBar(
            "Error while adding to cart",
            "snack-error"
          );
        }
      );
    } else {
      this.dataService.openSnackBar(
        "Please login to complete this action",
        "snack-error"
      );
    }
  }

  getCart() {
    this.cart
      .getCartItems(this.auth.userData.auth_token)
      .subscribe((res: any) => {
        // let cart_array_res = res; // if you are not using httpClient
        // this.cart_array_res = res;

        this.cart_array = res.result.cart;

        if (this.cart_array?.length) {
          if (this.my_favourite_array?.length) {
            this.my_favourite_array.forEach((fav: any) => {
              this.cart_array.forEach((cart: any) => {
                if (fav.user_gear_desc_id == cart.user_gear_desc_id) {
                  fav.added_to_cart = true;
                }
              });
            });
          }
          // call header cart count service
          this.cart.noOfCart(this.cart_array.length);
        }
      });
  }

  removeFromCart(ks_favourite_id) {
    this.dashboard
      .removeFromFavourite(this.auth.userData.auth_token, ks_favourite_id)
      .subscribe(
        (res: any) => {
          this.dataService.openSnackBar("Item removed from your favourites");

          this.getMyFavourites();
        },
        (err) => {}
      );
  }
}
