import { AuthService } from "./auth.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BehaviorSubject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { ApiRouterService } from "./api-router.service";
import { SITE_BASE_URL } from "./../shared/constant";

@Injectable()
export class CartService {
  base_url: string;
  security: number;

  myCart$: Observable<any>;
  private myCartSubject = new BehaviorSubject<any>(0);
  token: any;

  newMsg$: Observable<any>;
  private newMsgSubject = new BehaviorSubject<any>(0);

  cartItems$: Observable<any>;
  private totalItemInCartSubject = new BehaviorSubject<any>(0);

  constructor(
    private http: HttpClient,
    public api: ApiRouterService,
    private auth: AuthService
  ) {
    this.myCart$ = this.myCartSubject.asObservable();
    this.newMsg$ = this.newMsgSubject.asObservable();
    this.base_url = this.api.apiUrl + "Gear_listing/";

    this.token = this.auth.userData.auth_token;

    this.cartItems$ = this.totalItemInCartSubject.asObservable();
  }
  refreshCart(cart) {
    this.totalItemInCartSubject.next(cart);
  }
  noOfCart(cart_count) {
    this.myCartSubject.next(cart_count);
  }

  noOfMsg(msg_count) {
    this.newMsgSubject.next(msg_count);
  }

  setSecurityAmount(amount: number) {
    this.security = amount;
  }
  getSecurityAmount() {
    return this.security;
  }

  addToCart(item_obj) {
    let data = item_obj;
    let url = this.base_url + "AddCart";
    return this.http.post(url, data);
  }

  getCartItems(token) {
    let url = this.base_url + "UserCart";
    let data = { token: token };
    return this.http.post(url, data);
  }

  onDateChangeGetOrderSummary(payload) {
    let url = this.api.apiUrl + "Cart/itemCalculation";
    let data = { ...payload, token: this.auth.userData.auth_token };
    return this.http.post(url, data);
  }

  checkForInsurance(payload) {
    let url = this.base_url + "InsuanceCheck1";
    let data = { ...payload, token: this.auth.userData.auth_token };
    return this.http.post(url, data);
  }

  checkIfUserIsAllowedToCheckout() {
    let url = this.api.apiUrl + "Cart/usercheckoutcheck";
    let data = { token: this.auth.userData.auth_token };
    return this.http.post(url, data);
  }

  removeCartItem(token, user_gear_desc_id) {
    let url = this.base_url + "RemoveGearFromCart";
    let data = { token: token, user_gear_desc_id: user_gear_desc_id };
    return this.http.post(url, data);
  }

  checkHyperWallet(token, user_gear_desc_id) {
    let url = this.base_url + "CheckValidDetails";
    let data = { token: token, user_gear_desc_id: user_gear_desc_id };
    return this.http.post(url, data);
  }

  htmlDecode(str) {
    return str.replace(/&#(\d+);/g, function (match, dec) {
      return String.fromCharCode(dec);
    });
  }

  getPickUpDropOffAddressList(token) {
    let url = this.base_url + "GETCartAddressList";
    let data = { token: token };
    return this.http.post(url, data);
  }

  updatePickUpDropOffAddressList(token, user_address_id) {
    let url = this.base_url + "AddAddresstoCartGear";
    let data = { token: token, user_address_id: user_address_id };
    return this.http.post(url, data);
  }

  updateRentingDate(token, date_from, date_to) {
    let url = this.base_url + "ChangeDatesForCart";
    let data = { token: token, date_from: date_from, date_to: date_to };
    return this.http.post(url, data);
  }

  updateProjectDescName(token, project_description, project_name) {
    let url = this.base_url + "AddCartProjects";
    let data = {
      token: token,
      project_description: project_description,
      project_name: project_name,
    };
    return this.http.post(url, data);
  }

  fetchInsuranceDetails(
    token,
    user_gear_desc_id,
    insurance_type,
    user_address_id
  ) {
    let url = this.api.apiUrl + "Insurance/InsuranceCheck";
    let data = {
      token: token,
      user_gear_desc_id: user_gear_desc_id,
      insurance_type: insurance_type,
      user_address_id,
    };
    return this.http.post(url, data);
  }

  /**
   * This function is to check whether the cart items has creative space or not
   */
  creativeSpaceInTheCart(cart) {
    let has_creative: boolean = false;

    cart.forEach((element) => {
      if (element.ks_gear_type_id == "1") {
        has_creative = true;
      }
    });
    return has_creative;
  }

  /**
   * To check If user's Digital ID, Email, Phone etc verified or not
   */

  userCheckoutCheck(token) {
    let url = this.api.userCheckoutCheck;
    let data = { token: token };
    return this.http.post(url, data);
  }

  /**
   * To check unavailable dates of the cart items
   */

  cartunavailableseDates(token) {
    let url = this.api.cartunavailableseDates;
    let data = { token: token };
    return this.http.post(url, data);
  }

  /**
   * To contact the owner from cart page
   */
  contactTheOwner(token, app_user_id, mail_text) {
    let url = this.api.sendMessageToOwner;
    let data = { token: token, app_user_id: app_user_id, mail_text: mail_text };
    return this.http.post(url, data);
  }
}
