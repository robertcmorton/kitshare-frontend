import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BehaviorSubject } from "rxjs";
import { HttpClient } from "@angular/common/http";

import { ApiRouterService } from "./api-router.service";
import { map } from "rxjs/operators";

@Injectable()
export class DashboardService {
  private messageSource = new BehaviorSubject<any>("");
  startMessage$ = this.messageSource.asObservable();

  myProfilePics$: Observable<any>;
  private myProfilePicsSubject = new BehaviorSubject<any>("");

  // baseUrl: string = 'http://www.inferasolz.com/kitshare/server/RentalDashboard/';

  constructor(
    private http: HttpClient,
    public apiRoute: ApiRouterService,
    private router: Router
  ) {
    this.myProfilePics$ = this.myProfilePicsSubject.asObservable();
  }

  getProfileImage(profile_image_link) {
    this.myProfilePicsSubject.next(profile_image_link);
  }

  goToMessage(data: any) {
    this.messageSource.next(data);
  }

  // For messaging to dashboard from

  // for renter
  getRentalList(token, year = "", per_page = 0, limit = 25) {
    //  debugger;
    if (token === undefined) {
      this.router.navigate(["/login"]);
    } else {
      let data: any;
      let url =
        this.apiRoute.rentalList + "?per_page=" + per_page + "&limit=" + limit;
      if (year != null) {
        data = { token: token, Date: year };
      } else {
        data = { token: token };
      }
      return this.http.post(url, data);
    }
  }

  // for owner
  getRentalListForOwner(token, year = "", per_page = 0, limit = 25) {
    let data: any;
    let url =
      this.apiRoute.rentalOwnerList +
      "?per_page=" +
      per_page +
      "&limit=" +
      limit;
    if (year != null) {
      data = { token: token, Date: year };
    } else {
      data = { token: token };
    }
    return this.http.post(url, data);
  }

  // for renter
  getRentalListActive(token, year = "", per_page = 0, limit = 25) {
    let url =
      this.apiRoute.rentalList + "?per_page=" + per_page + "&limit=" + limit;
    let data = { token: token, is_rent_approved: "Y", Date: year };
    return this.http.post(url, data);
  }

  // for owner
  getRentalListActiveForOwner(token, year = "", per_page = 0, limit = 25) {
    let url =
      this.apiRoute.rentalOwnerList +
      "?per_page=" +
      per_page +
      "&limit=" +
      limit;
    let data = { token: token, is_rent_approved: "Y", Date: year };
    return this.http.post(url, data);
  }

  // for Renter
  getCompletedListActive(token, year = "", per_page = 0, limit = 25) {
    let url =
      this.apiRoute.rentalList + "?per_page=" + per_page + "&limit=" + limit;
    let data = { token: token, is_completed: "Y", Date: year };
    return this.http.post(url, data);
  }

  // for Owner
  getCompletedListActiveForOwner(token, year = "", per_page = 0, limit = 25) {
    let url =
      this.apiRoute.rentalOwnerList +
      "?per_page=" +
      per_page +
      "&limit=" +
      limit;
    let data = { token: token, is_completed: "Y", Date: year };
    return this.http.post(url, data);
  }

  // for Renter
  getRentalListCanceled(token, year = "", per_page = 0, limit = 25) {
    let url =
      this.apiRoute.rentalList + "?per_page=" + per_page + "&limit=" + limit;
    let data = { token: token, is_rent_cancelled: "Y", Date: year };
    return this.http.post(url, data);
  }

  // for Owner
  getRentalListCanceledForOwner(token, year = "", per_page = 0, limit = 25) {
    let url =
      this.apiRoute.rentalOwnerList +
      "?per_page=" +
      per_page +
      "&limit=" +
      limit;
    let data = { token: token, is_rent_cancelled: "Y", Date: year };
    return this.http.post(url, data);
  }

  // for Renter
  getRentalListRejected(token, year = "", per_page = 0, limit = 25) {
    let url =
      this.apiRoute.rentalList + "?per_page=" + per_page + "&limit=" + limit;
    let data = { token: token, is_rent_rejected: "Y", Date: year };
    return this.http.post(url, data);
  }

  // for Owner
  getRentalListRejectedForOwner(token, year = "", per_page = 0, limit = 25) {
    let url =
      this.apiRoute.rentalOwnerList +
      "?per_page=" +
      per_page +
      "&limit=" +
      limit;
    let data = { token: token, is_rent_rejected: "Y", Date: year };
    return this.http.post(url, data);
  }

  // for Renter
  getRentalListArchived(token, year = "", per_page = 0, limit = 25) {
    let url =
      this.apiRoute.rentalList + "?per_page=" + per_page + "&limit=" + limit;
    let data = { token: token, is_achive: "Y", Date: year };
    return this.http.post(url, data);
  }

  // for Owner
  getRentalListArchivedForOwner(token, year = "", per_page = 0, limit = 25) {
    let url =
      this.apiRoute.rentalOwnerList +
      "?per_page=" +
      per_page +
      "&limit=" +
      limit;
    let data = { token: token, is_achive: "Y", Date: year };
    return this.http.post(url, data);
  }

  // for Owner and Renter invoice
  getRentalListInvoice(token, user_gear_desc_id) {
    let url = this.apiRoute.rentalOwnerOrderInvoice;
    let data = { token: token, user_gear_desc_id: user_gear_desc_id };
    return this.http.post(url, data);
  }

  // for Owner mange gear list
  getManageList(
    token,
    gear_hide_search_results = null,
    per_page = 0,
    limit = 25
  ) {
    let url =
      this.apiRoute.rentalOwnerManagelist +
      "?per_page=" +
      per_page +
      "&limit=" +
      limit;
    let data = {};
    if (gear_hide_search_results != null) {
      data = {
        token: token,
        gear_hide_search_results: gear_hide_search_results,
      };
    } else {
      data = { token: token };
    }

    return this.http.post(url, data);
  }

  // for Owner and Renter deactivate Item(s)
  deactivateItem(token, user_gear_desc_id) {
    let url = this.apiRoute.rentalOwnerDeactivatelist;
    let data = { token: token, user_gear_desc_id: user_gear_desc_id };
    return this.http.post(url, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  // for Owner and Renter invoice
  deleteItem(token, user_gear_desc_id) {
    let url = this.apiRoute.rentalOwnerDeleteGear;
    let data = { token: token, user_gear_desc_id: user_gear_desc_id };
    return this.http.post(url, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  // for Owner and Renter gear date change
  changeDateForAnItem(token, user_gear_desc_id, date_from, date_to) {
    let url = this.apiRoute.rentalOwnerAddUnavailableDates;
    let data = {
      token: token,
      user_gear_desc_id: user_gear_desc_id,
      date_from: date_from,
      date_to: date_to,
    };
    return this.http.post(url, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  // for Owner and Renter get all reviews
  getAllReviews(token) {
    let url = this.apiRoute.rentalOwnerGetAllReviews;
    let data = { token: token };
    return this.http.post(url, data);
  }
  getAllProductReviews(data) {
    let url = this.apiRoute.userInfoProdutReviews;
    return this.http.post(url, data);
  }

  // for Owner and Renter get all reviews
  getAllReference(token) {
    let url = this.apiRoute.rentalOwnerGetAllReference;
    let data = { token: token };
    return this.http.post(url, data);
  }

  // get user contact info
  getContactInfos(token) {
    let url = this.apiRoute.usersContactInfo;
    let data = { token: token };
    return this.http.post(url, data);
  }

  // Add address for gear from dashboard
  addGearItemAddress(token, user_gear_desc_id, user_address_id) {
    let url = this.apiRoute.rentalOwnerAddGearAddress;
    let data = {
      token: token,
      user_gear_desc_id: user_gear_desc_id,
      user_address_id: user_address_id,
    };
    return this.http.post(url, data);
  }

  // Delete address for gear from dashboard
  deleteGearItemAddress(token, user_gear_desc_id, user_address_id) {
    let url = this.apiRoute.rentalOwnerRemoveGearAddress;
    let data = {
      token: token,
      user_gear_desc_id: user_gear_desc_id,
      user_address_id: user_address_id,
    };
    return this.http.post(url, data);
  }

  // Address list gear from dashboard
  gearAddressList(token, user_gear_desc_id) {
    let url = this.apiRoute.rentalOwnerGearAddressList;
    let data = { token: token, user_gear_desc_id: user_gear_desc_id };
    return this.http.post(url, data);
  }

  //get address by gear id
  getAddressListByGear(token, user_gear_desc_id) {
    let url = this.apiRoute.getAddressListByGear;
    let data = { token: token, user_gear_desc_id: user_gear_desc_id };
    return this.http.post(url, data);
  }

  /**
   * For messaging
   */
  // get all contact list
  getAllContactListForMessaging(token) {
    let url = this.apiRoute.getAllContactListForMessaging;
    let data = { token: token };
    return this.http.post(url, data);
  }

  // get All messages by renter_id, user_gear_desc_id
  getAllMessagingByRenterID(
    token,
    renter_id,
    user_gear_desc_id,
    order_id,
    message_type = "",
    sender_id = 0
  ) {
    let url = this.apiRoute.getAllMessagingByRenterID;
    let data = {
      token: token,
      renter_id: renter_id,
      user_gear_desc_id: user_gear_desc_id,
      order_id: order_id,
      message_type: message_type,
      sender_id: sender_id,
    };
    return this.http.post(url, data);
  }

  // get profile data
  userInfoForProfile(token, app_user_id = "") {
    let url = this.apiRoute.userInfoForProfile;
    let data = { token: token, app_user_id: app_user_id, action: "" };
    return this.http.post(url, data);
  }

  // send message
  sendMessage(
    token,
    renter_id,
    user_gear_desc_id,
    message,
    order_id,
    message_type = "",
    sender_id = 0
  ) {
    let url = this.apiRoute.sendMessage;
    let data = {
      token: token,
      renter_id: renter_id,
      user_gear_desc_id: user_gear_desc_id,
      message: message,
      order_id: order_id,
      message_type: message_type,
      sender_id: sender_id,
    };
    return this.http.post(url, data);
  }

  // Mark message seen
  markChatSeen(token, order_id, chat_message_id, message_type, sender_id) {
    let url = this.apiRoute.markChatSeen;
    let data = {
      token: token,
      order_id: order_id,
      chat_message_id: chat_message_id,
      message_type: message_type,
      sender_id: sender_id,
    };
    return this.http.post(url, data);
  }

  // Get chat status
  getUserOnlineStatus(token) {
    let url = this.apiRoute.getMessageStatus;
    let data = { token: token };
    return this.http.post(url, data);
  }

  // Update chat status
  updateUserOnlineStatus(token, chat_status) {
    let url = this.apiRoute.updateUserOnlineStatus;
    let data = { token: token, chat_status: chat_status };
    return this.http.post(url, data);
  }

  // Search users for message
  searchMessageContacts(token, search_key) {
    let url = this.apiRoute.searchMessageContacts;
    let data = { token: token, search_key: search_key };
    return this.http.post(url, data);
  }

  getOrderSummeryForOwner(token, order_id) {
    let url = this.apiRoute.getOrderSummeryForOwner;
    let data = { token: token, order_id: order_id };
    return this.http.post(url, data);
  }

  getOrderSummeryForRenter(token, order_id) {
    let url = this.apiRoute.getOrderSummeryForRenter;
    let data = { token: token, order_id: order_id };
    return this.http.post(url, data);
  }

  getHomePageRandomProduct() {
    let url = this.apiRoute.getHomePageProduct;
    return this.http.get(url);
  }

  verifyPhone(token, phone_number) {
    let url = this.apiRoute.verifyPhone;
    let data = { token: token, phone_number: phone_number };
    return this.http.post(url, data);
  }

  verifyOtp(token, phone_number, otp) {
    let url = this.apiRoute.verifyOtp;
    let data = { token: token, phone_number: phone_number, otp: otp };
    return this.http.post(url, data);
  }

  addUnavailableDate(token, from_date, to_date) {
    let url = this.apiRoute.addUnavailbleDates;
    let data = { token: token, from_date: from_date, to_date: to_date };
    return this.http.post(url, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  uploadCheckList(data, type) {
    if (type == "owner") {
      var url = this.apiRoute.ownerCheckListUpload;
    }
    if (type == "renter") {
      var url = this.apiRoute.renterCheckListUpload;
    }

    let payload_data = data;
    return this.http.post(url, payload_data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getCheckList(token, order_id, type) {
    if (type == "owner") {
      var url = this.apiRoute.ownerCheckListList;
    }
    if (type == "renter") {
      var url = this.apiRoute.RenterCheckListList;
    }
    let payload_data = { token: token, order_id: order_id };
    return this.http.post(url, payload_data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  // Add favourite
  addTofavourite(token, user_gear_desc_id) {
    var url = this.apiRoute.addTofavourite;
    let payload_data = { token: token, user_gear_desc_id: user_gear_desc_id };
    return this.http.post(url, payload_data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  // My favourite
  getFavouriteList(token) {
    var url = this.apiRoute.getFavouriteList;
    let payload_data = { token: token };
    return this.http.post(url, payload_data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  // Search favourite
  searchFavouriteList(token, gear_name) {
    var url = this.apiRoute.getFavouriteList;
    let payload_data = { token: token, gear_name: gear_name };
    return this.http.post(url, payload_data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  // Remove from favourite
  removeFromFavourite(token, ks_favourite_id) {
    var url = this.apiRoute.removeFromFavourite;
    let payload_data = { token: token, ks_favourite_id: ks_favourite_id };
    return this.http.post(url, payload_data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  // make gear public/private
  makeGearPublicPrivate(token, user_gear_desc_id, status) {
    var url = this.apiRoute.makeGearPublicPrivate;
    let payload_data = {
      token: token,
      user_gear_desc_id: user_gear_desc_id,
      status: status,
    };
    return this.http.post(url, payload_data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getDigitalKey() {
    var url = this.apiRoute.getDigitalIdKey;
    let data = {};
    return this.http.post(url, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  acceptRental(token, order_id) {
    const url = this.apiRoute.acceptRental + "/" + order_id;
    // let data = {token : token, order_id: order_id};
    return this.http.get(url).pipe(
      map((response) => {
        return response;
      })
    );
  }

  declineRental(token, order_id) {
    const url = this.apiRoute.declineRental + "/" + order_id;
    let data = { token: token, order_id: order_id };
    return this.http.post(url, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  completeRental(token, order_id) {
    const url = this.apiRoute.completeRental;
    let data = { token: token, order_id: order_id };
    return this.http.post(url, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  cancelRental(token, order_id) {
    const url = this.apiRoute.cancelRental;
    let data = { token: token, order_id: order_id };
    return this.http.post(url, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  submitDamageIssues(token, order_id, app_user_id, issue, type) {
    const url = this.apiRoute.addDamageIssue;
    let data = {
      token: token,
      order_id: order_id,
      app_user_id: app_user_id,
      issue: issue,
      type: type,
    };
    return this.http.post(url, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getDamageIssuesList(token, order_id) {
    const url = this.apiRoute.getDamageIssueList;
    let data = { token: token, order_id: order_id };
    return this.http.post(url, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  updateDamageIssue(
    token,
    ks_order_issues_id,
    order_id,
    issue,
    app_user_id,
    renter_owner_type
  ) {
    const url = this.apiRoute.updateDamageIssue;
    let data = {
      token: token,
      ks_order_issues_id: ks_order_issues_id,
      order_id: order_id,
      issue: issue,
      app_user_id: app_user_id,
      type: renter_owner_type,
    };
    return this.http.post(url, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  gearViewCount(token, user_gear_desc_id) {
    const url = this.apiRoute.addGearViewCount;
    let data = { token: token, user_gear_desc_id: user_gear_desc_id };
    return this.http.post(url, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  connectPayout(token, account_name, bsb_number, bank_id, account_number) {
    const url = this.apiRoute.connectPayout;
    let data = {
      token: token,
      user_account_name: account_name,
      bsb_number: bsb_number,
      bank_id: bank_id,
      user_account_number: account_number,
    };
    return this.http.post(url, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getBankList() {
    const url = this.apiRoute.getBankList;
    return this.http.get(url).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getBankDetails(token) {
    const url = this.apiRoute.connectPayoutDetails;
    let data = { token: token };
    return this.http.post(url, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  addRating(token, app_user_id, rating) {
    const url = this.apiRoute.addUserRating;
    let data = { token: token, app_user_id: app_user_id, rating: rating };
    return this.http.post(url, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  sendMessageToOwner(token, app_user_id, message) {
    const url = this.apiRoute.sendMessageToOwner;
    let data = { token: token, app_user_id: app_user_id, mail_text: message };
    return this.http.post(url, data);
  }

  /**
   * To check If user's Digital ID, Email, Phone etc verified or not
   */

  userCheckoutCheck(token) {
    let url = this.apiRoute.userCheckoutCheck;
    let data = { token: token };
    return this.http.post(url, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  // Get Owner review
  getOwnerReviews(token) {
    let url = this.apiRoute.getOwnerReviews;
    let data = { token: token };
    return this.http.post(url, data);
  }

  // Get Renter review
  getRenterReview(token) {
    let url = this.apiRoute.getRenterReview;
    let data = { token: token };
    return this.http.post(url, data);
  }

  // Get Renter review
  addGearReviews(
    token,
    order_id,
    app_user_id,
    cust_gear_review_desc,
    star_rating = 0,
    parent_gear_review_id = 0
  ) {
    let url = this.apiRoute.addGearReviews;
    let data = {
      token: token,
      order_id: order_id,
      app_user_id: app_user_id,
      cust_gear_review_desc: cust_gear_review_desc,
      star_rating: star_rating,
      parent_gear_review_id: parent_gear_review_id,
    };
    return this.http.post(url, data);
  }

  // Get Renter review
  reviewOrderList(token) {
    let url = this.apiRoute.reviewOrderList;
    let data = { token: token };
    return this.http.post(url, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  // Check duplicate user name
  checkDuplicateUserName(token, app_username) {
    let url = this.apiRoute.checkduplicateUserName;
    let data = { token: token, app_username: app_username };
    return this.http.post(url, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getUserInfoId(token, app_username) {
    let url = this.apiRoute.getUserInfoId;
    let data = { token: token, app_username: app_username };
    return this.http.post(url, data).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
