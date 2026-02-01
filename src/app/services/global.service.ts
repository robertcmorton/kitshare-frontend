import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";

import { ContactInfoData } from "./../shared/models/contact-info";
import { Injectable } from "@angular/core";
import { NotificationSettingsData } from "./../shared/models/notification.model";

@Injectable()

/**
 * this will contain all methods and property need in global basis
 */
export class GlobalService {
  /**
   * this will regulate header section, is it visible or not
   * @var showHeader  boolean
   */
  public showHeader: boolean = true;

  /**
   * this will regulate footer section, is it visible or not
   *
   * @var showFooter  boolean
   */
  public showFooter: boolean = true;

  public showLoaderState: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public showVerifyState: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public noDataText: string;

  constructor(public router: Router) {}

  getContactInfoData(data: any) {
    let arr: Array<ContactInfoData> = [];
    if (data.length) {
      for (let eachSet of data) {
        arr.push(eachSet);
      }
    } else {
      arr.push(new ContactInfoData());
    }
    return arr;
  }

  getNotificationSettingsData(data: NotificationSettingsData) {
    let notificationData: NotificationSettingsData = new NotificationSettingsData();
    notificationData.send_message = data.send_message === "No" ? false : true;
    notificationData.accept_offer = data.accept_offer === "No" ? false : true;
    notificationData.comment_on_offer = data.comment_on_offer === "No" ? false : true;
    notificationData.forget_to_aceept_offer = data.forget_to_aceept_offer === "No" ? false : true;
    notificationData.reject_offer = data.reject_offer === "No" ? false : true;
    notificationData.rental_message = data.rental_message === "No" ? false : true;
    notificationData.review = data.review === "No" ? false : true;

    return notificationData;
  }
  setNotificationSettingsData(data: NotificationSettingsData) {
    let notificationData: NotificationSettingsData = new NotificationSettingsData();

    notificationData.send_message = data.send_message === false ? "No" : "Yes";
    notificationData.accept_offer = data.accept_offer === false ? "No" : "Yes";
    notificationData.comment_on_offer = data.comment_on_offer === false ? "No" : "Yes";
    notificationData.forget_to_aceept_offer = data.forget_to_aceept_offer === false ? "No" : "Yes";
    notificationData.reject_offer = data.reject_offer === false ? "No" : "Yes";
    notificationData.rental_message = data.rental_message === false ? "No" : "Yes";
    notificationData.review = data.review === false ? "No" : "Yes";

    return notificationData;
  }

  showLoader() {
    this.showLoaderState.next(true);
  }
  showCongrates() {
    this.showVerifyState.next(true);
  }
  hideCongrates() {
    this.showVerifyState.next(false);
  }

  hideLoader() {
    this.showLoaderState.next(false);
  }

  get loaderState() {
    return this.showLoaderState.asObservable();
  }
  get verifyState() {
    return this.showVerifyState.asObservable();
  }

  loadNoDataFound(text: string = "No Data Found!") {
    this.noDataText = text;
    this.router.navigate(["/no-data-found"]);
  }
}
