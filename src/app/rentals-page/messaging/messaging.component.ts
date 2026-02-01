import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  ViewChildren,
  QueryList,
} from "@angular/core";

import { DashboardService } from "../../services/dashboard.service";
import { BaseService } from "../../services/base.service";
import { AuthService } from "../../services/auth.service";
import { SITE_BASE_URL } from "../../shared/constant";
import { Router, ActivatedRoute } from "@angular/router";

import { CartService } from "./../../services/cart.service";
import { VerifyPopupDialogService } from "./../../shared/component/verify-popup-dialog/verify-popup-dialog.service";
import { ConfirmationDialogService } from "./../../rental-order-owner/confirmation-dialog/confirmation-dialog.service";

import * as moment from "moment/moment";
import { DataService } from "app/shared/data/data.service";

@Component({
  selector: "kit-messaging",
  templateUrl: "./messaging.component.html",
  styleUrls: ["./messaging.component.scss"],
})
export class MessagingComponent implements OnInit {
  @ViewChild("scrollMe", { static: false })
  private myScrollContainer: ElementRef;
  @ViewChild("scrollContact", { static: false })
  private myScrollContainer1: ElementRef;
  @ViewChildren("items") liItems: QueryList<ElementRef>;
  token: string;
  current_chat_name: string = "";
  current_chat_profile_pics: string = "";
  current_chat_messages: Array<any>;
  current_chat_renter_id: any;
  current_chat_user_gear_desc_id: any;
  current_chat_order_id: string;
  current_chat_project_name: string;

  message_contact_list: Array<any>;
  isChattingAvailable: boolean;
  count: number = 0;
  current_chat_id: any;
  message_type: string;
  sender_id: any;
  chat_message_id: any;
  renter_id: any;
  is_msg_loaded: boolean = true;
  is_init: boolean = false;

  msg_subscription: any;

  getMessageInterval: any;

  app_user_id: any;

  app_user_first_name: String;
  user_profile_picture_link: String;
  message: string;

  default_profile_pic_link = SITE_BASE_URL + "assets/images/profile.png";
  chat_user: any;
  renter_or_owner: string;
  ownerCanAcceptRenter: boolean;
  is_accept_rental_available: boolean = false;
  is_decline_rental_available: boolean = false;
  is_cancel_rental_available: boolean = false;
  is_end_rental_available: boolean = false;
  above_48_hours: boolean = false;
  processed_order_ids: Array<any>;
  canceled_order_ids: Array<any>;
  current_index: number;

  constructor(
    public dashboard: DashboardService,
    public auth: AuthService,
    public baseService: BaseService,
    public dataService: DataService,
    public router: Router,
    public route: ActivatedRoute,
    private cartService: CartService,
    private verifyPopupDialogService: VerifyPopupDialogService,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    route.params.subscribe((params) => {
      console.log(params);
      if (params.order_id != undefined) {
        this.chat_user = params;
      }
    });
    //console.log('messaging constructor')
    this.token = this.auth.userData.auth_token;
    this.message_contact_list = [];
    this.current_chat_messages = [];

    // this.user_chat_status_array = ['Online', 'Offline', 'Busy', 'Away'];
    this.isChattingAvailable = true;
    this.current_index = 0;
  }

  ngOnInit(): void {
    this.baseService.global.showLoader();

    this.getAllContactListForMessaging(true); // get message contact list
    this.getUserProfileInfo(); // get user profile info
    // this.getUserOnlineStatus(); // get user online status

    this.current_chat_profile_pics = "assets/images/chat_user.png";
    this.dashboard.startMessage$.subscribe((res: any) => {
      if (res != "" && res != undefined) {
        setTimeout(() => {
          console.log("messageWith");
          // this.messageWith(res.renter_id, '', res.user_name, res.profile_pics_link, res.order_id);
        }, 1000);
      }
    });

    this.msg_subscription = this.cartService.newMsg$.subscribe((res: any) => {
      if (this.is_init) {
        this.dashboard
          .getAllContactListForMessaging(this.token)
          .subscribe((res: any) => {
            let result = res;
            this.message_contact_list = result.result;
          });
      }
    });
  }
  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.msg_subscription.unsubscribe();
    clearInterval(this.getMessageInterval);
  }
  getAllContactListForMessaging(flage = false) {
    this.dashboard
      .getAllContactListForMessaging(this.token)
      .subscribe((res: any) => {
        this.baseService.global.hideLoader();
        let result = res;
        this.processed_order_ids = [];
        this.canceled_order_ids = [];
        this.message_contact_list = result.result;
        /*let temparr = [];
        for(var i=130;i<135;i++) {
          temparr.push(result.result[i]);
        }
        this.message_contact_list = temparr;*/
        if (this.count < result.result.length || result.result.length == 0) {
          //this.message_contact_list = result.result;
          this.count = result.result.length;
          if (flage) {
            if (this.chat_user) {
              // console.log(this.chat_user)
              // console.log(this.message_contact_list)
              setTimeout(() => {
                let clength = this.message_contact_list.length;
                this.liItems.forEach((item, index) => {
                  if (
                    index < clength &&
                    this.message_contact_list[index].order_id ==
                      this.chat_user.order_id
                  ) {
                    (item.nativeElement as HTMLElement).click();
                    let tp = 65 * index;
                    this.myScrollContainer1.nativeElement.scrollTo({
                      left: 0,
                      top: tp,
                      behavior: "smooth",
                    });
                  }
                });
              }, 1000);
            }
            if (this.message_contact_list.length > 0) {
              let contact = null;
              contact = this.message_contact_list[0];
              let indexForParam = null;
              if (this.chat_user?.order_id) {
                this.message_contact_list.forEach((item, index) => {
                  if (item.order_id == this.chat_user.order_id) {
                    indexForParam = index;
                  }
                });
                contact = this.message_contact_list[indexForParam];
              }
              this.current_chat_id = contact.chat_id;
              this.startChatting(
                contact.renter_id,
                contact.user_gear_desc_id,
                contact.user_details[0].user_profile_picture_link,
                contact.user_details[0].app_user_first_name,
                contact.order_id,
                contact.project_name,
                contact.order_status,
                contact.chat_id,
                contact.message_type,
                contact.sender_id,
                0
              );
            }
            this.is_init = true;
          }
        }
      });
  }
  startChatting(
    renter_id,
    user_gear_desc_id,
    profil_pics_link,
    user_name,
    order_id,
    project_name = "Project name",
    order_status,
    chat_id,
    message_type,
    sender_id,
    c = 0
  ) {
    this.current_index = c;
    this.current_chat_id = chat_id;
    this.message_contact_list[c].unseen_message = "0";
    console.log("order_status", order_status);
    console.log("processed_order_ids", this.processed_order_ids);
    this.is_accept_rental_available = false;
    this.is_decline_rental_available = false;
    this.is_cancel_rental_available = false;
    this.is_end_rental_available = false;
    let todays_date = moment(new Date()).format("YYYY-MM-DD");
    let date_today: any;
    let pickup_date: any;
    let return_date: any;
    date_today = new Date(todays_date);
    pickup_date = new Date(this.message_contact_list[c].pickup_date);
    return_date = new Date(this.message_contact_list[c].return_date);
    //var diffTime = Math.abs(pickup_date - date_today);
    let diffDays: any;
    diffDays = Math.ceil(
      Math.abs(pickup_date - date_today) / (1000 * 60 * 60 * 24)
    );
    console.log(date_today + " date_today");
    console.log(return_date + " return_date");
    this.above_48_hours = false;
    if (diffDays > 2) {
      this.above_48_hours = true;
    }

    if (
      this.message_contact_list[c].user_details.length > 0 &&
      this.message_contact_list[c].owner_id !=
        this.message_contact_list[c].user_details[0].app_user_id
    ) {
      this.renter_or_owner = "renter";
      //this.getOrderSummeryForRenter();
      if (
        this.above_48_hours &&
        message_type == "Order" &&
        order_status == "Quote" &&
        this.canceled_order_ids.indexOf(order_id) == -1
      ) {
        this.is_cancel_rental_available = true;
      }
    } else {
      this.renter_or_owner = "owner";
      //this.getOrderSummeryForOwner();
      if (
        message_type == "Order" &&
        order_status == "Quote" &&
        this.processed_order_ids.indexOf(order_id) == -1
      ) {
        this.is_accept_rental_available = true;
        this.is_decline_rental_available = true;
      }
      if (
        this.above_48_hours &&
        message_type == "Order" &&
        order_status == "Quote" &&
        this.processed_order_ids.indexOf(order_id) != -1 &&
        this.canceled_order_ids.indexOf(order_id) == -1
      ) {
        this.is_cancel_rental_available = true;
      }
      diffDays = Math.ceil((date_today - return_date) / (1000 * 60 * 60 * 24));

      if (
        diffDays >= 0 &&
        message_type == "Order" &&
        order_status == "Contract" &&
        this.processed_order_ids.indexOf(order_id) == -1
      ) {
        this.is_end_rental_available = true;
      }
      let diff_pr_date = Math.ceil(
        Math.abs(return_date - pickup_date) / (1000 * 60 * 60 * 24)
      );
      if (
        diffDays >= 0 &&
        diff_pr_date >= 0 &&
        message_type == "Order" &&
        order_status == "Quote" &&
        this.processed_order_ids.indexOf(order_id) != -1
      ) {
        this.is_end_rental_available = true;
      }
      console.log(diffDays + " == " + diff_pr_date);
    }
    console.log("this.renter_or_owner", this.renter_or_owner);
    if (
      this.above_48_hours &&
      message_type == "Order" &&
      order_status == "Reservation" &&
      this.canceled_order_ids.indexOf(order_id) == -1
    ) {
      this.is_cancel_rental_available = true;
    }

    if (!user_gear_desc_id) {
      user_gear_desc_id = 0;
    }
    if (
      order_status == "Completed" ||
      order_status == "Cancelled" ||
      order_status == "Rejected" ||
      order_status == "Declined" ||
      order_status == "Expired"
    ) {
      this.isChattingAvailable = false;
    } else {
      this.isChattingAvailable = true;
    }

    this.is_msg_loaded = false;
    this.current_chat_messages = [];
    clearInterval(this.getMessageInterval); // clear any previous interval

    // Get message history when cilcked on the chat thread
    this.dashboard
      .getAllMessagingByRenterID(
        this.token,
        renter_id,
        user_gear_desc_id,
        order_id,
        message_type,
        sender_id
      )
      .subscribe((res: any) => {
        this.is_msg_loaded = true;
        let response = res;
        this.current_chat_messages = response.message;
        console.log("%c all message list", "color: green;");
        if (message_type == "Contact") {
          this.chat_message_id = null;
        } else {
          this.chat_message_id =
            this.current_chat_messages[
              this.current_chat_messages.length - 1
            ].chat_message_id;
        }
        setTimeout(() => {
          this.scrollToBottom();
        }, 1000);

        this.dashboard
          .markChatSeen(
            this.token,
            order_id,
            this.chat_message_id,
            this.message_type,
            this.sender_id
          )
          .subscribe((res: any) => {});
      });

    // Mark chats as seen

    if (profil_pics_link == null) {
      profil_pics_link = this.default_profile_pic_link;
    }

    this.current_chat_name = user_name;
    this.current_chat_profile_pics = profil_pics_link;

    this.current_chat_renter_id = renter_id;
    this.current_chat_user_gear_desc_id = user_gear_desc_id;
    this.current_chat_order_id = order_id;
    this.current_chat_project_name = project_name;
    this.message_type = message_type;
    this.sender_id = sender_id;
    this.renter_id = renter_id;

    // if(this.is_init) {
    //   this.getAllContactListForMessaging();
    // }
    console.log(c + "message_contact_list", this.message_contact_list[c]);
    if (this.isChattingAvailable) {
      this.getMessageInterval = setInterval(() => {
        //this.getAllContactListForMessaging();
        this.dashboard
          .getAllMessagingByRenterID(
            this.token,
            renter_id,
            user_gear_desc_id,
            order_id,
            message_type,
            sender_id
          )
          .subscribe((res: any) => {
            let response = res;
            this.current_chat_messages = response.message;
            // console.log('%c all message list', 'color: green;');
            setTimeout(() => this.scrollToBottom(), 100);
          });
      }, 30000);
    }
  }

  sendMessage() {
    if (this.message != "" && this.message != null) {
      let msg = this.message;
      this.message = "";
      this.dashboard
        .sendMessage(
          this.token,
          this.current_chat_renter_id,
          this.current_chat_user_gear_desc_id,
          msg,
          this.current_chat_order_id,
          this.message_type,
          this.sender_id
        )
        .subscribe((res: any) => {
          this.dashboard
            .getAllMessagingByRenterID(
              this.token,
              this.current_chat_renter_id,
              this.current_chat_user_gear_desc_id,
              this.current_chat_order_id,
              this.message_type,
              this.sender_id
            )
            .subscribe(
              (res: any) => {
                let response = res;
                this.current_chat_messages = response.message;

                setTimeout(() => {
                  this.scrollToBottom();
                }, 100);
              },
              (err) => {}
            );
        });
    }
  }
  sendMessageOnKeyDown(event) {
    if (event.keyCode == 13) {
      if (this.message != "" && this.message != null) {
        let msg = this.message;
        this.message = "";
        this.dashboard
          .sendMessage(
            this.token,
            this.current_chat_renter_id,
            this.current_chat_user_gear_desc_id,
            msg,
            this.current_chat_order_id,
            this.message_type,
            this.sender_id
          )
          .subscribe((res: any) => {
            this.dashboard
              .getAllMessagingByRenterID(
                this.token,
                this.current_chat_renter_id,
                this.current_chat_user_gear_desc_id,
                this.current_chat_order_id,
                this.message_type,
                this.sender_id
              )
              .subscribe((res: any) => {
                let response = res;
                this.current_chat_messages = response.message;
                setTimeout(() => {
                  this.scrollToBottom();
                }, 100);
              });
          });
      }
    }
  }
  searchContacts(event: any) {
    let searchMessage = event.target.value;
    if (searchMessage != null && searchMessage != "") {
      this.dashboard
        .searchMessageContacts(this.token, searchMessage)
        .subscribe((res: any) => {
          let result = res;
          this.message_contact_list = result.result;
        });
    } else {
      this.getAllContactListForMessaging();
    }
  }

  /**
   * Get user profile info
   */
  getUserProfileInfo() {
    this.dashboard.userInfoForProfile(this.token).subscribe((res: any) => {
      //  debugger;
      let result = res;
      // console.log(result);
      this.app_user_id = result.result[0].app_user_id;
      // console.log('%c App user ID : ' + this.app_user_id, 'color: green;');
      this.app_user_first_name = result.result[0].app_user_first_name;
      this.user_profile_picture_link =
        result.result[0].user_profile_picture_link;
    });
  }
  /**
   * Get user profile info
   */
  //  getUserOnlineStatus() {

  //   this.dashboard.getUserOnlineStatus(this.token)
  //     .subscribe((res: any) => {
  //       let result = res;

  //       this.user_chat_status = result.status_message.chat_status;

  //     });
  //  }
  scrollToBottom(): void {
    console.log("scroll", this.myScrollContainer);
    try {
      // this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      this.myScrollContainer?.nativeElement.scrollTo({
        left: 0,
        top: this.myScrollContainer?.nativeElement.scrollHeight,
        behavior: "smooth",
      });
    } catch (err) {
      console.log("err in scrollToBottom", err);
    }
  }
  endRental() {
    this.confirmationDialogService
      .confirm(
        "Please confirm",
        "The order has been completed and all items have been returned with no damage"
      )
      .then((confirmed) => {
        console.log("User confirmed:", confirmed);
        if (confirmed) {
          this.baseService.global.showLoader();
          this.dashboard
            .completeRental(
              this.auth.userData.auth_token,
              this.current_chat_order_id
            )
            .subscribe((res: any) => {
              this.baseService.global.hideLoader();
              if (res.status == 200) {
                this.processed_order_ids.push(this.current_chat_order_id);
                let contact = this.message_contact_list[this.current_index];
                this.current_chat_id = contact.chat_id;
                this.startChatting(
                  contact.renter_id,
                  contact.user_gear_desc_id,
                  contact.user_details[0].user_profile_picture_link,
                  contact.user_details[0].app_user_first_name,
                  contact.order_id,
                  contact.project_name,
                  "Completed",
                  contact.chat_id,
                  contact.message_type,
                  contact.sender_id,
                  this.current_index
                );
                this.dataService.openSnackBar("Rental completed");
                this.is_end_rental_available = false;
                //this.getOrderSummary();
              } else {
                this.baseService.global.showLoader();
                this.dataService.openSnackBar(
                  res.status_message,
                  "snack-error"
                );
              }
            });
        }
      });
  }
  acceptRental() {
    let userinfo = this.auth.getUserInfo();
    console.log("Fn: acceptRental, page:messagging, userinfo", userinfo.status);

    this.ownerCanAcceptRenter = false;
    if (
      userinfo.status != 404 &&
      userinfo.result[0].address_found === "Y" &&
      userinfo.result[0].mobile_number_verfiy === "1" &&
      userinfo.result[0].aus_post_verified === "Y"
    ) {
      console.log("Owner can accept Renter");
      this.ownerCanAcceptRenter = true;
    } else if (userinfo.status != 404) {
      console.log("Owner cannot accept Renter");
      this.verifyPopupDialogService.popupbox(
        userinfo,
        "To Accept this Order, please verify the following:",
        ""
      );
    }

    if (this.ownerCanAcceptRenter) {
      this.confirmationDialogService
        .confirm("Please confirm", "Do you want to accept the order?")
        .then((confirmed) => {
          console.log("User confirmation for accepting an order:", confirmed);
          if (confirmed) {
            this.baseService.global.showLoader();
            this.dashboard
              .userCheckoutCheck(this.auth.userData.auth_token)
              .subscribe((res: any) => {
                console.log("Usercheckoutcheck api response", res);
                if (res.status === 200) {
                  console.log("Usercheckoutcheck api response is 200 ");
                  this.dashboard
                    .acceptRental(
                      this.auth.userData.auth_token,
                      this.current_chat_order_id
                    )
                    .subscribe((res: any) => {
                      console.log("acceptRental api response", res);
                      this.baseService.global.hideLoader();
                      if (res.status == 200) {
                        // this.is_end_rental_available = true;
                        this.is_decline_rental_available = false;
                        this.is_accept_rental_available = false;
                        if (this.above_48_hours) {
                          this.is_cancel_rental_available = true;
                        }
                        this.processed_order_ids.push(
                          this.current_chat_order_id
                        );
                        let contact =
                          this.message_contact_list[this.current_index];
                        this.current_chat_id = contact.chat_id;
                        this.startChatting(
                          contact.renter_id,
                          contact.user_gear_desc_id,
                          contact.user_details[0].user_profile_picture_link,
                          contact.user_details[0].app_user_first_name,
                          contact.order_id,
                          contact.project_name,
                          contact.order_status,
                          contact.chat_id,
                          contact.message_type,
                          contact.sender_id,
                          this.current_index
                        );

                        this.dataService.openSnackBar(
                          "Rental accepted succesfully",
                          "snack-success"
                        );
                        //this.getOrderSummary();
                      } else {
                        console.log("acceptRental api response not 200");
                        this.dataService.openSnackBar(
                          res.status_message,
                          "snack-error"
                        );
                      }
                    });
                } else {
                  console.log("Usercheckoutcheck api response not 200");
                  this.baseService.global.hideLoader();
                  this.dataService.openSnackBar(
                    res.status_message,
                    "snack-error"
                  );
                }
              });
          }
        })
        .catch(() =>
          console.log(
            "User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)"
          )
        );
    }
  }
  cancelRental() {
    this.confirmationDialogService
      .confirm("Please confirm", "Do you want to cancel the order?")
      .then((confirmed) => {
        console.log("User confirmed:", confirmed);
        if (confirmed) {
          this.baseService.global.showLoader();
          this.dashboard
            .cancelRental(
              this.auth.userData.auth_token,
              this.current_chat_order_id
            )
            .subscribe((res: any) => {
              this.baseService.global.hideLoader();
              if (res.status == 200) {
                this.is_cancel_rental_available = false;
                this.canceled_order_ids.push(this.current_chat_order_id);
                let contact = this.message_contact_list[this.current_index];
                this.current_chat_id = contact.chat_id;
                this.startChatting(
                  contact.renter_id,
                  contact.user_gear_desc_id,
                  contact.user_details[0].user_profile_picture_link,
                  contact.user_details[0].app_user_first_name,
                  contact.order_id,
                  contact.project_name,
                  "Cancelled",
                  contact.chat_id,
                  contact.message_type,
                  contact.sender_id,
                  this.current_index
                );
                this.dataService.openSnackBar("Rental cancelled succesfully");
                //this.getOrderSummary();
              } else {
                this.dataService.openSnackBar(
                  res.status_message,
                  "snack-error"
                );
              }
            });
        }
      })
      .catch(() =>
        console.log(
          "User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)"
        )
      );
  }
  declineRental() {
    this.confirmationDialogService
      .confirm("Please confirm", "Do you want to decline the order?")
      .then((confirmed) => {
        console.log("User confirmed:", confirmed);
        if (confirmed) {
          console.log("about to declineRental");
          this.baseService.global.showLoader();
          this.dashboard
            .declineRental(
              this.auth.userData.auth_token,
              this.current_chat_order_id
            )
            .subscribe(
              (res: any) => {
                this.baseService.global.hideLoader();

                if (res.status == 200) {
                  this.is_decline_rental_available = false;
                  this.is_accept_rental_available = false;
                  if (this.above_48_hours) {
                    this.is_cancel_rental_available = true;
                  }
                  this.processed_order_ids.push(this.current_chat_order_id);
                  let contact = this.message_contact_list[this.current_index];
                  this.startChatting(
                    contact.renter_id,
                    contact.user_gear_desc_id,
                    contact.user_details[0].user_profile_picture_link,
                    contact.user_details[0].app_user_first_name,
                    contact.order_id,
                    contact.project_name,
                    "Declined",
                    contact.chat_id,
                    contact.message_type,
                    contact.sender_id,
                    this.current_index
                  );
                  this.dataService.openSnackBar(
                    "Rental has been declined succesfully"
                  );
                  //this.getOrderSummary();
                } else {
                  this.dataService.openSnackBar(
                    res.status_message,
                    "snack-error"
                  );
                }
              },
              (err) => {
                this.baseService.global.hideLoader();
                this.dataService.openSnackBar(err, "snack-error");
              }
            );
        }
      })
      .catch(() =>
        console.log(
          "User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)"
        )
      );
  }

  getOrderSummeryForRenter() {
    this.dashboard
      .getOrderSummeryForRenter(
        this.auth.userData.auth_token,
        this.current_chat_order_id
      )
      .subscribe(
        (res: any) => {
          this.baseService.global.hideLoader();

          let result = res;
          //this.order_status      = result.result.order_status;
        },
        (err) => {
          this.baseService.global.hideLoader();
        }
      );
  }

  getOrderSummeryForOwner() {
    this.dashboard
      .getOrderSummeryForOwner(
        this.auth.userData.auth_token,
        this.current_chat_order_id
      )
      .subscribe(
        (res: any) => {
          this.baseService.global.hideLoader();

          //let todays_date = moment(new Date()).format('YYYY-MM-DD');
          let result = res;
          //this.order_status      = result.result.order_status;
        },
        (err) => {
          this.baseService.global.hideLoader();
        }
      );
  }
}
