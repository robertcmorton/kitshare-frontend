import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { DashboardService } from "../../services/dashboard.service";
import { BaseApiService } from "../../services/base-api.service";
import { AuthService } from "../../services/auth.service";
import { SITE_BASE_URL } from "../../shared/constant";
import { BaseService } from "../../services/base.service";
import { CartService } from "../../services/cart.service";

import { Observable, forkJoin } from "rxjs";

import * as moment from "moment/moment";
import { DataService } from "app/shared/data/data.service";

const getNativeWindow = () => {
  return window;
};

@Component({
  selector: "app-rentals-dashboard",
  templateUrl: "./rentals-dashboard.component.html",
  styleUrls: ["./rentals-dashboard.component.scss"],
})
export class RentalsDashboardComponent implements OnInit, OnDestroy {
  @ViewChild("closeSubmitReviewModal", { static: true })
  closeSubmitReviewModal: ElementRef;
  @ViewChild("scrollMe", { static: true })
  private myScrollContainer: ElementRef;

  nativeWindow: any;
  owner_dashboard: boolean;
  renter_dashboard: boolean;
  all: boolean;
  active: boolean;
  completed: boolean;
  canceled: boolean;
  rejected: boolean;
  archive: boolean;
  token: string;
  rental_data: Array<any>;
  year_for_list: string;

  manage_list_data: Array<any>;
  // reference_list_data: Array<any>;
  // reference_count: number;
  manage_list_gear_categories_data: Array<any>;
  gear_item_list_checked_array: Array<any>;
  user_address_array: Array<any>;
  user_address_checked_array: Array<any>;

  reviews_array: Array<any>;
  reviews_count: number;

  date: Date = new Date();
  minDate: Date = new Date();
  date_from: any;
  date_to: any;

  is_any_item_checked: boolean;

  no_of_manage_list_item_checked: number;

  is_messaging: boolean;
  message_contact_list: Array<any>;

  current_chat_name: string = "";
  current_chat_profile_pics: string = "";
  current_chat_messages: Array<any>;
  current_chat_renter_id: any;
  current_chat_user_gear_desc_id: any;
  current_chat_order_id: string;
  current_chat_project_name: string;

  app_user_id: any;
  app_user_id_to_review: any;
  app_user_first_name: String;
  user_profile_picture_link: String;
  user_chat_status: string;
  message: string;
  getMessageInterval: any;

  user_chat_status_array: Array<String>;
  rental_year_array: Array<String>;
  all_rental_year_array: Array<String>;

  is_tax_invoice_available: boolean; // Only for renters

  // for manage list pagination
  totalItems: number;
  currentPage: number;
  limit: number;

  // for rental list pagination
  totalItemsRental: number = 0;
  currentPageRental: number = 1;
  limitRental: number = 25;

  reviewsByOwner: Array<Object>;
  reviewsByOwnerReplies: Array<Object>;
  reviewsByRenter: Array<Object>;
  reviewsByRenterReplies: Array<Object>;
  reviewsOrderList: Array<Object>;
  replyReviewText: string;

  currentSelectedOrderIdForGivingReview: string;
  star_rating: number;
  cust_gear_review_desc: string;

  default_profile_pic_link = SITE_BASE_URL + "assets/images/profile.png";

  isChattingAvailable: boolean; // To allow or reject user to chat

  count: number = 0;
  current_chat_id: any;
  message_type: string;
  sender_id: any;
  chat_message_id: any;
  renter_id: any;
  is_msg_loaded: boolean = true;
  msg_subscription: any;

  constructor(
    public dashboard: DashboardService,
    public auth: AuthService,
    public baseService: BaseService,
    private route: ActivatedRoute,
    private basapi: BaseApiService,
    private changeDetectorRef: ChangeDetectorRef,
    private dataService: DataService,
    private cartService: CartService
  ) {
    this.route.params.subscribe((params) => {
      /*console.log('%c params', 'color: green;');
      console.log(params);*/
      if (params.from != undefined && params.from == "header") {
        setTimeout(() => {
          document.getElementById("messagetab").click();
        }, 1000);
      }
    });

    this.nativeWindow = getNativeWindow();
    this.token = this.auth.userData.auth_token;
    this.defaultTab(); // Set the default tab by checking the localstorage
    /* this.owner_dashboard  = false;
    this.renter_dashboard = true; */
    this.all = false;
    this.active = true;
    this.completed = false;
    this.canceled = false;
    this.rejected = false;
    this.archive = false;
    this.year_for_list = "";
    this.gear_item_list_checked_array = [];

    this.date_from = "";
    this.date_to = "";
    this.user_address_checked_array = [];

    this.reviews_array = [];
    this.reviews_count = 0;
    this.is_any_item_checked = false;

    this.no_of_manage_list_item_checked = 0;
    // this.reference_count = 0;

    this.is_messaging = false;
    this.message_contact_list = [];
    this.current_chat_messages = [];

    this.user_chat_status_array = ["Online", "Offline", "Busy", "Away"];

    this.rental_year_array = [];
    this.all_rental_year_array = [];
    this.is_tax_invoice_available = false;
    this.currentPage = 1;
    this.limit = 25;
    this.replyReviewText = "";

    this.reviewsOrderList = [];
    this.currentSelectedOrderIdForGivingReview = "";
    this.star_rating = 0;
    this.cust_gear_review_desc = "";
    this.reviewsByRenter = [];
    this.reviewsByOwner = [];
    this.isChattingAvailable = true;
  }

  defaultTab() {
    var default_tab = "renter";
    if (localStorage.getItem("default_tab")) {
      default_tab = localStorage.getItem("default_tab");
    }

    if (default_tab == "renter") {
      this.renter_dashboard = true;
      this.owner_dashboard = false;
    } else {
      this.renter_dashboard = false;
      this.owner_dashboard = true;
    }
  }
  tabClicked(e) {
    //console.log('e',e.target.innerText);
    let tab = e.target.innerText;
    if (tab == "Messaging") {
      this.getAllContactListForMessaging();
      if (this.message_contact_list.length > 0) {
        this.startChatting(
          this.renter_id,
          0,
          this.current_chat_profile_pics,
          this.current_chat_name,
          this.current_chat_order_id,
          this.current_chat_project_name,
          "",
          this.current_chat_id,
          this.message_type,
          this.sender_id
        );
      }
    } else {
      clearInterval(this.getMessageInterval); // clear any previous interval
    }
  }

  scrollToBottom(): void {
    try {
      // this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      this.myScrollContainer.nativeElement.scrollTo({
        left: 0,
        top: this.myScrollContainer.nativeElement.scrollHeight,
        behavior: "smooth",
      });
    } catch (err) {
      console.log("err in scrollToBottom", err);
    }
  }

  reFormatDate(date = "") {
    return (date + "Z").replace(/\s/g, "T");
  }

  ngOnInit() {
    this.getAllYearList();
    // this.getRentalList();
    // this.fetchCompletedList();
    this.fetchActiveList(); // fetch all active list at first
    this.manageList();
    this.getAllReviews();
    // this.getAllReference();
    this.getContactInfos();
    this.getAllContactListForMessaging(true); // get message contact list
    this.getUserProfileInfo(); // get user profile info
    this.getUserOnlineStatus(); // get user online status
    this.reviewOrderList();
    this.getOwnerReview();
    // this.getRenterReviewNew();

    this.current_chat_profile_pics = "assets/images/chat_user.png";
    this.dashboard.startMessage$.subscribe((res: any) => {
      if (res != "" && res != undefined) {
        setTimeout(() => {
          this.messageWith(
            res.renter_id,
            "",
            res.user_name,
            res.profile_pics_link,
            res.order_id
          );
        }, 1000);
      }
    });

    this.msg_subscription = this.cartService.newMsg$.subscribe((res: any) => {
      this.dashboard
        .getAllContactListForMessaging(this.token)
        .subscribe((res: any) => {
          let result = res;
          this.message_contact_list = result.result;
        });
    });
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.msg_subscription.unsubscribe();
    clearInterval(this.getMessageInterval);
  }

  /**
   * Owner and Renter toggle
   */

  showOwnerDashboard() {
    localStorage.setItem("default_tab", "owner");
    this.owner_dashboard = true;
    this.renter_dashboard = false;
    this.getGeneralList();

    // Hide message box
    this.is_messaging = false;
    clearInterval(this.getMessageInterval);
  }

  showRenterDashboard() {
    localStorage.setItem("default_tab", "renter");
    this.owner_dashboard = false;
    this.renter_dashboard = true;
    this.getGeneralList();

    // Hide message box
    this.is_messaging = false;
    clearInterval(this.getMessageInterval);
  }
  /**
   *  End -------------------------------
   */

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
  getUserOnlineStatus() {
    this.dashboard.getUserOnlineStatus(this.token).subscribe((res: any) => {
      let result = res;

      this.user_chat_status = result.status_message.chat_status;
    });
  }

  getRentalList(per_page = 0, limit = 25) {
    this.is_messaging = false;
    let year = this.year_for_list;
    this.all = true;
    this.active = false;
    this.completed = false;
    this.canceled = false;
    this.rejected = false;
    this.archive = false;
    if (this.renter_dashboard == true) {
      this.dashboard
        .getRentalList(this.token, year, per_page, limit)
        .subscribe((res: any) => {
          //  debugger;
          // console.log(res);
          let response = res;
          this.rental_data = response.result.order_list;
          this.rental_year_array = response.result.date_array;
          this.totalItemsRental = response.result.pagination.total_rows;
        });
    } else {
      this.dashboard
        .getRentalListForOwner(this.token, year, per_page, limit)
        .subscribe((res: any) => {
          let response = res;
          this.rental_data = response.result.order_list;
          this.rental_year_array = response.result.date_array;
          this.totalItemsRental = response.result.pagination.total_rows;
        });
    }
  }

  /**
   * Get All year by firing this function at first
   */
  getAllYearList(per_page = 0, limit = 25) {
    let year = this.year_for_list;
    if (this.renter_dashboard == true) {
      this.dashboard
        .getRentalList(this.token, year, per_page, limit)
        .subscribe((res: any) => {
          let response = res;
          this.all_rental_year_array = response.result.date_array;
          this.totalItemsRental = response.result.pagination.total_rows;
        });
    } else {
      this.dashboard
        .getRentalListForOwner(this.token, year, per_page, limit)
        .subscribe((res: any) => {
          let response = res;
          this.all_rental_year_array = response.result.date_array;
          this.totalItemsRental = response.result.pagination.total_rows;
        });
    }
  }

  fetchActiveList(per_page = 0, limit = 25) {
    this.is_messaging = false;
    let year = this.year_for_list;
    this.all = false;
    this.active = true;
    this.completed = false;
    this.canceled = false;
    this.rejected = false;
    this.archive = false;

    if (this.renter_dashboard == true) {
      this.dashboard
        .getRentalListActive(this.token, year, per_page, limit)
        .subscribe((res: any) => {
          let response = res;
          this.rental_data = response.result.order_list;
          this.rental_year_array = response.result.date_array;
          this.totalItemsRental = response.result.pagination.total_rows;
        });
    } else {
      this.dashboard
        .getRentalListActiveForOwner(this.token, year, per_page, limit)
        .subscribe(
          (res: any) => {
            let response = res;
            this.rental_data = response.result.order_list;
            this.rental_year_array = response.result.date_array;
            this.totalItemsRental = response.result.pagination.total_rows;
          },
          (err) => {}
        );
    }
  }

  fetchCompletedList(per_page = 0, limit = 25) {
    this.is_messaging = false;
    let year = this.year_for_list;
    this.all = false;
    this.active = false;
    this.completed = true;
    this.canceled = false;
    this.rejected = false;
    this.archive = false;

    if (this.renter_dashboard == true) {
      this.dashboard
        .getCompletedListActive(this.token, year, per_page, limit)
        .subscribe((res: any) => {
          let response = res;
          this.rental_data = response.result.order_list;
          this.rental_year_array = response.result.date_array;
          this.totalItemsRental = response.result.pagination.total_rows;
        });
    } else {
      this.dashboard
        .getCompletedListActiveForOwner(this.token, year, per_page, limit)
        .subscribe((res: any) => {
          let response = res;
          this.rental_data = response.result.order_list;
          this.rental_year_array = response.result.date_array;
          this.totalItemsRental = response.result.pagination.total_rows;
        });
    }
  }

  fetchCanceledList(per_page = 0, limit = 25) {
    this.is_messaging = false;
    let year = this.year_for_list;
    this.all = false;
    this.active = false;
    this.completed = false;
    this.canceled = true;
    this.rejected = false;
    this.archive = false;

    if (this.renter_dashboard == true) {
      this.dashboard
        .getRentalListCanceled(this.token, year, per_page, limit)
        .subscribe((res: any) => {
          let response = res;
          this.rental_data = response.result.order_list;
          this.rental_year_array = response.result.date_array;
          this.totalItemsRental = response.result.pagination.total_rows;
        });
    } else {
      this.dashboard
        .getRentalListCanceledForOwner(this.token, year, per_page, limit)
        .subscribe((res: any) => {
          let response = res;
          this.rental_data = response.result.order_list;
          this.rental_year_array = response.result.date_array;
          this.totalItemsRental = response.result.pagination.total_rows;
        });
    }
  }

  fetchRejectedList(per_page = 0, limit = 25) {
    this.is_messaging = false;
    let year = this.year_for_list;
    this.all = false;
    this.active = false;
    this.completed = false;
    this.canceled = false;
    this.rejected = true;
    this.archive = false;

    if (this.renter_dashboard == true) {
      this.dashboard
        .getRentalListRejected(this.token, year, per_page, limit)
        .subscribe((res: any) => {
          let response = res;
          this.rental_data = response.result.order_list;
          this.rental_year_array = response.result.date_array;
          this.totalItemsRental = response.result.pagination.total_rows;

          this.changeDetectorRef.detectChanges();
        });
    } else {
      this.dashboard
        .getRentalListRejectedForOwner(this.token, year, per_page, limit)
        .subscribe((res: any) => {
          let response = res;
          this.rental_data = response.result.order_list;
          this.rental_year_array = response.result.date_array;
          this.totalItemsRental = response.result.pagination.total_rows;
          this.changeDetectorRef.detectChanges();
        });
    }
  }

  fetchArchivedList(per_page = 0, limit = 25) {
    this.is_messaging = false;
    let year = this.year_for_list;
    this.all = false;
    this.active = false;
    this.completed = false;
    this.canceled = false;
    this.rejected = false;
    this.archive = true;

    if (this.renter_dashboard == true) {
      this.dashboard
        .getRentalListArchived(this.token, year, per_page, limit)
        .subscribe((res: any) => {
          let response = res;
          this.rental_data = response.result.order_list;
          this.rental_year_array = response.result.date_array;
          this.totalItemsRental = response.result.pagination.total_rows;
        });
    } else {
      this.dashboard
        .getRentalListArchivedForOwner(this.token, year, per_page, limit)
        .subscribe((res: any) => {
          let response = res;
          this.rental_data = response.result.order_list;
          this.rental_year_array = response.result.date_array;
          this.totalItemsRental = response.result.pagination.total_rows;
        });
    }
  }

  getGeneralList(per_page_param = 0, limit_parama = 25) {
    var per_page = per_page_param;
    var limit = limit_parama;

    // let year = this.year_for_list;

    if (this.all === true) {
      this.getRentalList(per_page, limit);
    }

    if (this.active === true) {
      this.fetchActiveList(per_page, limit);
    }

    if (this.completed === true) {
      this.fetchCompletedList(per_page, limit);
    }

    if (this.canceled === true) {
      this.fetchCanceledList(per_page, limit);
    }

    if (this.rejected === true) {
      this.fetchRejectedList(per_page, limit);
    }

    if (this.archive === true) {
      this.fetchArchivedList(per_page, limit);
    }
  }

  onChangeYear(year) {
    this.year_for_list = year;
    this.getGeneralList();
  }

  /**
   * Open invoice link on a new window
   * @param user_gear_desc_id
   */
  seeInvoice(user_gear_desc_id) {
    var newWindow = this.nativeWindow.open();
    this.dashboard
      .getRentalListInvoice(this.token, user_gear_desc_id)
      .subscribe((res: any) => {
        let result = res;
        let invoice_url = result.result;
        // window.open(invoice_url, "_blank");
        newWindow.location = invoice_url;
      });
  }

  /**
   * Get managelist
   */
  manageList(per_page = 0, limit = 25) {
    this.dashboard
      .getManageList(this.token, null, per_page, limit)
      .subscribe((res: any) => {
        /* console.log('%cManage List', 'color: green;');
        console.log(res); */
        let result = res;
        this.manage_list_data = result.result.gear_lists;
        this.manage_list_gear_categories_data = result.result.gear_categories;

        this.totalItems = result.result.total_rows;

        this.manage_list_data.forEach((element) => {
          this.manage_list_gear_categories_data.forEach((elem) => {
            element.is_selected = false;
            if (element.gear_category_id == elem.gear_category_id) {
              element.gear_category_name = elem.gear_category_name;
            }
          });
        });
        /*
        console.log('%cManage List after adding data..', 'color: green;');
        console.log(this.manage_list_data);*/
      });
  }

  /**
   * Insert each item when checked or uncheked
   * @param val
   * @param item_id
   * @returns void
   */
  selectDeselectItem(val: any, item_id) {
    if (val.currentTarget.checked === true) {
      let index: number = this.gear_item_list_checked_array.indexOf(item_id);
      // if the Item is not found then push
      if (index === -1) {
        this.gear_item_list_checked_array.push(item_id);
      }
    }

    // if unchecked then remove from gear_item_list_checked_array array
    if (val.currentTarget.checked === false) {
      let index: number = this.gear_item_list_checked_array.indexOf(item_id);
      // if the item index is found then remove from the array
      if (index !== -1) {
        this.gear_item_list_checked_array.splice(index, 1);
      }
    }
    // console.log(this.gear_item_list_checked_array);

    if (this.gear_item_list_checked_array.length > 0) {
      this.no_of_manage_list_item_checked =
        this.gear_item_list_checked_array.length;
      this.is_any_item_checked = true;
    } else {
      this.no_of_manage_list_item_checked = 0;
      this.is_any_item_checked = false;
    }
  }

  /***
   * Manage list select deselect All
   */
  selectDeselectAll(val: any) {
    this.gear_item_list_checked_array = [];
    if (val.currentTarget.checked === true) {
      this.manage_list_data.forEach((element) => {
        element.is_selected = true;
        this.gear_item_list_checked_array.push(element.user_gear_desc_id);
      });
    }

    if (val.currentTarget.checked === false) {
      this.manage_list_data.forEach((element) => {
        element.is_selected = false;
      });
    }

    if (this.gear_item_list_checked_array.length > 0) {
      this.no_of_manage_list_item_checked =
        this.gear_item_list_checked_array.length;
      this.is_any_item_checked = true;
    } else {
      this.no_of_manage_list_item_checked = 0;
      this.is_any_item_checked = false;
    }
  }

  /**
   * Deactivate confirm popup
   */
  deactivateItems() {
    // console.log(this.gear_item_list_checked_array);
    let forKJoinArr = [];
    if (this.gear_item_list_checked_array.length > 0) {
      this.gear_item_list_checked_array.forEach((element) => {
        // let resp = this.dashboard.deactivateItem(this.token, element);
        let resp = this.dashboard.makeGearPublicPrivate(
          this.token,
          element,
          "N"
        );
        forKJoinArr.push(resp);
        /*
        this.dashboard.deactivateItem(this.token, element)
          .subscribe((res : any) =>{
            console.log(res);
          });*/
      });

      const combined = forkJoin(forKJoinArr);
      combined.subscribe((res: any) => {
        /* for(let b =0; b < res.length; b++){
          if(res[b].status != 200){
            hyperWallet_error_count ++;
          }
        } */

        // console.log('Fork join response ...');
        // console.log(res);

        this.dataService.openSnackBar("Success", "snack-success");

        this.no_of_manage_list_item_checked = 0;
        // call managelist again
        this.manageList();
        this.gear_item_list_checked_array = [];
      });
    } else {
      this.dataService.openSnackBar(
        "Please select an item to make it private",
        "snack-error"
      );
    }
  }

  /**
   * Public confirm popup
   */
  makeItemsPublic() {
    let forKJoinArr = [];
    if (this.gear_item_list_checked_array.length > 0) {
      this.gear_item_list_checked_array.forEach((element) => {
        // let resp = this.dashboard.deactivateItem(this.token, element);
        let resp = this.dashboard.makeGearPublicPrivate(
          this.token,
          element,
          "Y"
        );
        forKJoinArr.push(resp);
        /*
        this.dashboard.deactivateItem(this.token, element)
          .subscribe((res : any) =>{
            console.log(res);
          });*/
      });

      const combined = forkJoin(forKJoinArr);
      combined.subscribe((res: any) => {
        /* for(let b =0; b < res.length; b++){
          if(res[b].status != 200){
            hyperWallet_error_count ++;
          }
        } */

        // console.log('Fork join response ...');
        // console.log(res);

        this.dataService.openSnackBar("Success", "snack-success");

        this.no_of_manage_list_item_checked = 0;
        // call managelist again
        this.manageList();
        this.gear_item_list_checked_array = [];
      });
    } else {
      this.dataService.openSnackBar(
        "Please select an item to make it public",
        "snack-error"
      );
    }
  }

  /**
   * Delete confirm popup
   */
  deleteItems() {
    // console.log(this.gear_item_list_checked_array);
    let forKJoinArr = [];
    if (this.gear_item_list_checked_array.length > 0) {
      this.gear_item_list_checked_array.forEach((element) => {
        let resp = this.basapi.deleteGear(this.token, element);
        forKJoinArr.push(resp);
      });

      const combined = forkJoin(forKJoinArr);
      combined.subscribe((res: any) => {
        // console.log('Fork join response ...');
        // console.log(res);

        this.dataService.openSnackBar(
          "Item(s) deleted successfuly",
          "snack-success"
        );

        this.no_of_manage_list_item_checked = 0;

        // call managelist again
        this.manageList();
        this.gear_item_list_checked_array = [];
      });
    } else {
      this.dataService.openSnackBar(
        "Please select an item to delete",
        "snack-error"
      );
    }
  }

  individualItemDeactivate(user_gear_desc_id) {
    this.gear_item_list_checked_array = [];
    this.gear_item_list_checked_array.push(user_gear_desc_id);
  }

  individualItemDelete(user_gear_desc_id) {
    this.gear_item_list_checked_array = [];
    this.gear_item_list_checked_array.push(user_gear_desc_id);
  }

  emitValue() {}

  afterCloseCalender() {
    // console.log('after close the calender..');
    // console.log(this.date);
    this.date_from = moment(this.date[0]).format("YYYY-MM-DD");
    this.date_to = moment(this.date[1]).format("YYYY-MM-DD");

    // console.log(this.date_from);
    // console.log(this.date_to);

    let forKJoinArr = [];

    if (this.gear_item_list_checked_array.length > 0) {
      this.gear_item_list_checked_array.forEach((element) => {
        let resp = this.dashboard.changeDateForAnItem(
          this.token,
          element,
          this.date_from,
          this.date_to
        );
        forKJoinArr.push(resp);
      });

      const combined = forkJoin(forKJoinArr);
      combined.subscribe((res: any) => {
        // console.log('Fork join response ...');
        // console.log(res);

        this.dataService.openSnackBar(
          "New unavailable date(s) added successfully"
        );

        // call managelist again
        this.manageList();
        this.gear_item_list_checked_array = [];
      });
    }
  }

  /**
   * get all reviews
   */
  getAllReviews() {
    this.dashboard.getAllReviews(this.token).subscribe((res: any) => {
      // console.log('get all reviews...');
      // console.log(res);

      this.reviews_array = res.result;
      this.reviews_count = this.reviews_array.length;
    });
  }

  /**
   * get all references
   */
  // getAllReference() {
  //   this.dashboard.getAllReference(this.token)
  //     .subscribe((res : any) => {
  //       this.reference_list_data = res.result;
  //       // console.log('get all reference...');
  //       // console.log(this.reference_list_data);
  //       this.reference_count = this.reference_list_data.length;
  //
  //     });
  // }

  getContactInfos() {
    this.dashboard.getContactInfos(this.token).subscribe((res: any) => {
      // this.reference_list_data = res.result;
      // console.log('%cGet contact info...', 'color: red;');
      console.log(res);
      this.user_address_array = res.result;
    });
  }

  onChekedAddress(val: any, user_address_id) {
    if (val.currentTarget.checked === true) {
      let index: number =
        this.user_address_checked_array.indexOf(user_address_id);
      // if the Item is not found then push
      if (index === -1) {
        this.user_address_checked_array.push(user_address_id);
      }
    }

    // if unchecked then remove from user_address_checked_array array
    if (val.currentTarget.checked === false) {
      let index: number =
        this.user_address_checked_array.indexOf(user_address_id);
      // if the item index is found then remove from the array
      if (index !== -1) {
        this.user_address_checked_array.splice(index, 1);
      }
    }
    // console.log(this.user_address_checked_array);
  }

  /**
   * Update address
   */
  updateAddress() {
    // alert(this.user_address_checked_array);

    let forKJoinArr = [];

    if (this.gear_item_list_checked_array.length > 0) {
      this.gear_item_list_checked_array.forEach((element) => {
        this.user_address_checked_array.forEach((elem) => {
          let resp = this.dashboard.addGearItemAddress(
            this.token,
            element,
            elem
          );
          forKJoinArr.push(resp);
        });
      });

      const combined = forkJoin(forKJoinArr);
      combined.subscribe((res: any) => {
        // console.log('Fork join response ...');
        // console.log(res[0].json());

        this.dataService.openSnackBar("New address added successfully");

        this.no_of_manage_list_item_checked = 0;

        // call managelist again
        this.manageList();
        this.gear_item_list_checked_array = [];
      });
    }
  }

  /**
   * Delete address
   */
  deleteAddress() {
    // alert(this.user_address_checked_array);

    let forKJoinArr = [];

    if (this.gear_item_list_checked_array.length > 0) {
      this.gear_item_list_checked_array.forEach((element) => {
        // every element is user_gear_desc_id
        this.user_address_checked_array.forEach((elem) => {
          // every elem is user_address_id
          let resp = this.dashboard.deleteGearItemAddress(
            this.token,
            element,
            elem
          );
          forKJoinArr.push(resp);
        });
      });

      const combined = forkJoin(forKJoinArr);

      combined.subscribe((res: any) => {
        // console.log('Fork join response ...');
        // console.log(res[0].json());

        this.dataService.openSnackBar("Address deleted successfully");

        this.no_of_manage_list_item_checked = 0;

        // call managelist again
        this.manageList();
        this.gear_item_list_checked_array = [];
      });
    }
  }

  /**
   * Start message
   */
  messageWith(
    renter_id,
    user_gear_desc_id,
    user_name,
    profile_pics_link,
    order_id,
    project_name = "Project name"
  ) {
    console.log("messageWith desc");
    document.getElementById("messagetab").click();

    this.current_chat_messages = [];
    clearInterval(this.getMessageInterval); // clear any previous interval

    // this.is_messaging = true;

    if (profile_pics_link == null) {
      profile_pics_link = this.default_profile_pic_link;
    }

    this.current_chat_name = user_name;
    this.current_chat_profile_pics = profile_pics_link;

    this.current_chat_renter_id = renter_id;
    this.current_chat_user_gear_desc_id = user_gear_desc_id;
    this.current_chat_order_id = order_id;
    this.current_chat_project_name = project_name;

    this.getMessageInterval = setInterval(() => {
      this.getAllContactListForMessaging();
      this.dashboard
        .getAllMessagingByRenterID(
          this.token,
          renter_id,
          user_gear_desc_id,
          order_id,
          this.message_type,
          this.sender_id
        )
        .subscribe((res: any) => {
          let response = res;
          this.current_chat_messages = response.message;
          // console.log('%c all message list', 'color: green;');
          this.scrollToBottom();
        });
    }, 3000);
  }

  /**
   * Start chating on clicking Contact/Chat thread
   * ==============================================
   * @param renter_id
   * @param user_gear_desc_id
   * @param profil_pics_link
   * @param user_name
   * @param order_id
   * @param project_name
   */

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
    sender_id
  ) {
    this.current_chat_id = chat_id;

    if (!user_gear_desc_id) {
      user_gear_desc_id = 0;
    }
    if (
      order_status == "Completed" ||
      order_status == "Canceled" ||
      order_status == "Rejected" ||
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
        // console.log('%c all message list', 'color: green;');
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
        }, 500);

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

    this.getAllContactListForMessaging();
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

            // this.scrollToBottom();
          });
      }, 3000);
    }
  }

  getAllContactListForMessaging(flage = false) {
    this.dashboard
      .getAllContactListForMessaging(this.token)
      .subscribe((res: any) => {
        let result = res;
        this.message_contact_list = result.result;
        if (this.count < result.result.length || result.result.length == 0) {
          //this.message_contact_list = result.result;
          this.count = result.result.length;
          if (flage) {
            let contact = this.message_contact_list[0];
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
              contact.sender_id
            );
          }
        }
      });
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

                this.scrollToBottom();
              },
              (err) => {}
            );
        });
    }
  }

  showMessages() {
    this.is_messaging = true;
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
                this.scrollToBottom();
              });
          });
      }
    }
  }

  change_chat_status(event: any) {
    // console.log(event.target.value);
    let chat_status = event.target.value;
    this.dashboard
      .updateUserOnlineStatus(this.token, chat_status)
      .subscribe((res: any) => {});
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

  referanceActive() {}

  referanceInactive() {}

  select_public_private_all_listing(e) {
    let listing_type = e.target.value;
    let gear_hide_search_results = null;
    if (listing_type == "public") {
      gear_hide_search_results = "Y";
    }
    if (listing_type == "private") {
      gear_hide_search_results = "N";
    }
    if (listing_type == "all") {
      gear_hide_search_results = null;
    }
    this.dashboard
      .getManageList(this.token, gear_hide_search_results)
      .subscribe((res: any) => {
        /* console.log('%cManage List', 'color: green;');
        console.log(res); */
        let result = res;
        this.manage_list_data = result.result.gear_lists;
        this.manage_list_gear_categories_data = result.result.gear_categories;
        // console.log(this.manage_list_data);

        this.manage_list_data.forEach((element) => {
          this.manage_list_gear_categories_data.forEach((elem) => {
            element.is_selected = false;
            if (element.gear_category_id == elem.gear_category_id) {
              element.gear_category_name = elem.gear_category_name;
            }
          });
        });
        /*
        console.log('%cManage List after adding data..', 'color: green;');
        console.log(this.manage_list_data);*/
      });
  }

  makePublicPrivate(user_gear_desc_id, status) {
    this.dashboard
      .makeGearPublicPrivate(this.token, user_gear_desc_id, status)
      .subscribe((res: any) => {
        this.manageList();
      });
  }

  pageChanged(event: any) {
    let per_page = (event.page - 1) * this.limit;
    this.manageList(per_page);
    window.scrollTo(0, 0);
  }

  pageChangedRental(event: any) {
    // console.log(event.page);
    let per_page = event.page - 1;

    this.getGeneralList(per_page, this.limitRental);
    window.scrollTo(0, 0);
  }

  onChange(e) {
    if (e == "all") {
      this.limit = this.totalItems;
    } else {
      this.limit = e;
    }

    // let per_page = this.currentPage * this.limit;
    let per_page = 0;
    this.manageList(per_page, this.limit);
  }

  /**
   * Get owner review
   */
  getOwnerReview() {
    this.dashboard.getOwnerReviews(this.token).subscribe((res: any) => {
      let result = res;

      this.reviews_count = this.reviews_count + result.result.length;
      this.reviewsByOwner = result.result;
      this.reviewsByOwnerReplies = result.result;
      this.reviewsByOwner.forEach((el: any) => {
        el.has_reply = false;
        this.reviewsByOwnerReplies.forEach((elReply: any) => {
          if (el.ks_cust_gear_review_id == elReply.parent_gear_review_id) {
            el.has_reply = true;
          }
        });
      });
      this.getRenterReviewNew();
    });
  }

  /**
   * Get renter review
   */
  getRenterReviewNew() {
    this.dashboard.getRenterReview(this.token).subscribe((res: any) => {
      let result = res;
      this.reviews_count = this.reviews_count + result.result.length;
      this.reviewsByRenter = result.result;
      this.reviewsByRenterReplies = result.result;
      this.reviewsByRenter.forEach((el: any) => {
        el.has_reply = false;
        this.reviewsByRenterReplies.forEach((elReply: any) => {
          if (el.ks_cust_gear_review_id == elReply.parent_gear_review_id) {
            el.has_reply = true;
          }
        });
      });
    });
  }

  /**
   * Get user online status
   */
  getRenterReview() {
    this.dashboard.getUserOnlineStatus(this.token).subscribe((res: any) => {
      let result = res;

      this.user_chat_status = result.status_message.chat_status;
    });
  }

  replyReviewTextKeyUp(e) {
    this.replyReviewText = e.target.value;
    console.log(this.replyReviewText);
  }

  /**
   * reply to a review
   */
  replyToReview(order_id, app_user_id, ks_cust_gear_review_id) {
    this.dashboard.getUserOnlineStatus(this.token).subscribe((res: any) => {
      let result = res;

      this.dashboard
        .addGearReviews(
          this.token,
          order_id,
          app_user_id,
          this.replyReviewText,
          0,
          ks_cust_gear_review_id
        )
        .subscribe((res: any) => {
          let response = res;

          if (response.status != 200) {
            this.dataService.openSnackBar(
              response.status_message,
              "snack-error"
            );
          } else {
            this.getOwnerReview();
            this.getRenterReviewNew();
          }
        });
    });
  }

  reviewOrderList() {
    this.dashboard.reviewOrderList(this.token).subscribe((res: any) => {
      // let respons = res;
      this.reviewsOrderList = res.result;
    });
  }

  // Open modal for submiting review
  openGiveReviewModal(order_id, app_user_id_to_review) {
    this.currentSelectedOrderIdForGivingReview = order_id;
    this.app_user_id_to_review = app_user_id_to_review;
  }

  onClickStar(e) {
    this.star_rating = e.rating;
  }

  submitReview() {
    this.baseService.global.showLoader();
    this.dashboard
      .addGearReviews(
        this.token,
        this.currentSelectedOrderIdForGivingReview,
        this.app_user_id_to_review,
        this.cust_gear_review_desc,
        this.star_rating,
        0
      )
      .subscribe(
        (res: any) => {
          let response = res;
          this.closeSubmitReviewModal.nativeElement.click();
          this.baseService.global.hideLoader();
          if (response.status != 200) {
            this.dataService.openSnackBar(
              response.status_message,
              "snack-error"
            );
          } else {
            this.dataService.openSnackBar("Success");

            // console.log(res);
            this.cust_gear_review_desc = "";
            this.star_rating = 0;
            this.currentSelectedOrderIdForGivingReview = "";
            this.getOwnerReview();
            // this.getRenterReviewNew();
            this.reviewOrderList();
          }
        },
        (err) => {
          this.closeSubmitReviewModal.nativeElement.click();
          this.baseService.global.hideLoader();
          this.dataService.openSnackBar(err, "snack-error");
        }
      );
  }
}
