import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { DashboardService } from "../../services/dashboard.service";
import { AuthService } from "../../services/auth.service";
import { BaseService } from "../../services/base.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ChatUser } from "./../../shared/interface";
import { DataService } from "app/shared/data/data.service";

@Component({
  selector: "kit-rentals",
  templateUrl: "./rentals.component.html",
  styleUrls: ["./rentals.component.scss"],
})
export class RentalsComponent implements OnInit {
  nativeWindow: any;
  owner_dashboard: boolean;
  renter_dashboard: boolean;
  all: boolean;
  active: boolean;
  completed: boolean;
  canceled: boolean;
  rejected: boolean;
  archive: boolean;

  year_for_list: string;
  token: string;
  totalItemsRental: number = 0;

  rental_data: Array<any>;
  is_messaging: boolean;
  rental_year_array: Array<String>;
  all_rental_year_array: Array<String>;

  getMessageInterval: any;
  limitRental: number = 25;

  current_chat_name: string = "";
  current_chat_profile_pics: string = "";
  current_chat_messages: Array<any>;
  current_chat_renter_id: any;
  current_chat_user_gear_desc_id: any;
  current_chat_order_id: string;
  current_chat_project_name: string;

  chat_user: ChatUser[] = [];
  ActiveRentalCount: number = 0;
  ActiveOwnerCount: number = 0;

  constructor(
    public dashboard: DashboardService,
    public auth: AuthService,
    public baseService: BaseService,
    public router: Router,
    public route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    public dataService: DataService
  ) {
    this.token = this.auth.userData.auth_token;
    this.rental_year_array = [];
    this.all_rental_year_array = [];
    this.is_messaging = false;
    this.renter_dashboard = true;
    this.owner_dashboard = true;
  }

  ngOnInit(): void {
    // this.getAllYearList();
    // this.getRentalList();
    // this.fetchCompletedList();
    this.fetchActiveList(); // fetch all active list at first
  }

  onChangeYear(year) {
    this.year_for_list = year;
    this.getGeneralList();
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
    console.log("messageWith desc", this.chat_user);
    console.log(
      renter_id,
      user_gear_desc_id,
      user_name,
      profile_pics_link,
      order_id
    );
    // this.chat_user['chat_name'] = user_name;
    // this.chat_user['profile_pics'] = profile_pics_link;

    // this.chat_user['renter_id'] = renter_id;
    // this.chat_user['user_gear_desc_id'] = user_gear_desc_id;
    this.chat_user["order_id"] = order_id;
    // this.chat_user['project_name'] = project_name;
    // this.chat_user['sender_id'] = create_user;
    this.router.navigate(["/rentals/messaging", this.chat_user]);
    // document.getElementById("messagetab").click();

    // this.current_chat_messages = [];
    // clearInterval(this.getMessageInterval); // clear any previous interval

    // // this.is_messaging = true;

    // if (profile_pics_link == null) {
    //   profile_pics_link = this.default_profile_pic_link;
    // }

    // this.current_chat_name          = user_name;
    // this.current_chat_profile_pics  = profile_pics_link;

    // this.current_chat_renter_id         = renter_id;
    // this.current_chat_user_gear_desc_id = user_gear_desc_id;
    // this.current_chat_order_id = order_id;
    // this.current_chat_project_name = project_name;

    // this.getMessageInterval = setInterval(() => {

    //   this.getAllContactListForMessaging();
    //   this.dashboard.getAllMessagingByRenterID(this.token, renter_id, user_gear_desc_id, order_id, this.message_type, this.sender_id)
    //   .subscribe((res : any) => {

    //     let response = res;
    //     this.current_chat_messages = response.message;
    //     // console.log('%c all message list', 'color: green;');
    //     this.scrollToBottom();

    //   });
    // }, 3000);
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

  pageChangedRental(event: any) {
    // console.log(event.page);
    let per_page = event.page - 1;

    this.getGeneralList(per_page, this.limitRental);
    window.scrollTo(0, 0);
  }
  showMessages() {
    this.is_messaging = true;
  }

  /**
   * Owner and Renter toggle
   */
  selectOption(e, val) {
    console.log(this.renter_dashboard);
    console.log(this.owner_dashboard);
    console.log(e, val);
    if (val == "renter_dashboard") {
      this.renter_dashboard = e.checked;
    }
    if (val == "owner_dashboard") {
      this.owner_dashboard = e.checked;
    }
    this.getGeneralList();
  }
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
  getRentalList(per_page = 0, limit = 25) {
    if (!this.owner_dashboard && !this.renter_dashboard) {
      this.dataService.openSnackBar(
        "Please select owner or rental",
        "snack-error"
      );
    }
    this.is_messaging = false;
    let year = this.year_for_list;
    this.all = true;
    this.active = false;
    this.completed = false;
    this.canceled = false;
    this.rejected = false;
    this.archive = false;
    this.rental_data = [];
    if (this.renter_dashboard) {
      this.dashboard
        .getRentalList(this.token, year, per_page, limit)
        .subscribe((res: any) => {
          let response = res;
          this.rental_data = response.result.order_list;
          this.rental_year_array = response.result.date_array;
          this.totalItemsRental = response.result.pagination.total_rows;
          if (this.owner_dashboard) {
            this.dashboard
              .getRentalListForOwner(this.token, year, per_page, limit)
              .subscribe((res: any) => {
                let response = res;
                response.result.order_list.forEach((x) => {
                  x.isOwner = true;
                });
                this.rental_data = [
                  ...this.rental_data,
                  ...response.result.order_list,
                ];
                this.rental_year_array = response.result.date_array;
                this.totalItemsRental = response.result.pagination.total_rows;
              });
          }
        });
    } else {
      this.dashboard
        .getRentalListForOwner(this.token, year, per_page, limit)
        .subscribe((res: any) => {
          let response = res;
          response.result.order_list.forEach((x) => {
            x.isOwner = true;
          });
          this.rental_data = response.result.order_list;
          this.rental_year_array = response.result.date_array;
          this.totalItemsRental = response.result.pagination.total_rows;
        });
    }
  }
  getAllYearList(per_page = 0, limit = 25) {
    let year = this.year_for_list;
    if (this.renter_dashboard == true) {
      this.dashboard
        .getRentalList(this.token, year, per_page, limit)
        .subscribe((res: any) => {
          let response = res;
          this.all_rental_year_array = response.result.date_array;
          // this.totalItemsRental = response.result.pagination.total_rows;
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
    if (!this.owner_dashboard && !this.renter_dashboard) {
      this.dataService.openSnackBar(
        "Please select owner or rental",
        "snack-error"
      );
    }
    this.is_messaging = false;
    let year = this.year_for_list;
    this.all = false;
    this.active = true;
    this.completed = false;
    this.canceled = false;
    this.rejected = false;
    this.archive = false;
    if (this.renter_dashboard) {
      this.dashboard
        .getRentalListActive(this.token, year, per_page, limit)
        .subscribe((res: any) => {
          let response = res;
          this.rental_data = response.result.order_list;
          this.ActiveRentalCount = this.rental_data.length;
          this.rental_year_array = response.result.date_array;
          this.all_rental_year_array = response.result.date_array;
          this.totalItemsRental = response.result.pagination.total_rows;
          if (this.owner_dashboard) {
            this.dashboard
              .getRentalListActiveForOwner(this.token, year, per_page, limit)
              .subscribe((res: any) => {
                let res1 = res;
                res1.result.order_list.forEach((x) => {
                  x.isOwner = true;
                });
                this.ActiveOwnerCount = res1.result.order_list.length;
                if (this.ActiveOwnerCount) {
                  this.rental_data = [
                    ...this.rental_data,
                    ...res1.result.order_list,
                  ];
                  this.all_rental_year_array = [
                    ...this.all_rental_year_array,
                    ...response.result.date_array,
                  ];
                }
              });
          }
        });
    } else {
      this.dashboard
        .getRentalListActiveForOwner(this.token, year, per_page, limit)
        .subscribe(
          (res: any) => {
            let response = res;
            response.result.order_list.forEach((x) => {
              x.isOwner = true;
            });
            this.rental_data = response.result.order_list;
            this.ActiveOwnerCount = this.rental_data.length;
            this.rental_year_array = response.result.date_array;
            this.all_rental_year_array = response.result.date_array;
            this.totalItemsRental = response.result.pagination.total_rows;
          },
          (err) => {}
        );
    }
  }

  fetchCompletedList(per_page = 0, limit = 25) {
    if (!this.owner_dashboard && !this.renter_dashboard) {
      this.dataService.openSnackBar(
        "Please select owner or rental",
        "snack-error"
      );
    }
    this.is_messaging = false;
    let year = this.year_for_list;
    this.all = false;
    this.active = false;
    this.completed = true;
    this.canceled = false;
    this.rejected = false;
    this.archive = false;
    this.rental_data = [];
    if (this.renter_dashboard) {
      this.dashboard
        .getCompletedListActive(this.token, year, per_page, limit)
        .subscribe((res: any) => {
          let response = res;
          this.rental_data = response.result.order_list;
          this.rental_year_array = response.result.date_array;
          this.totalItemsRental = response.result.pagination.total_rows;
          if (this.owner_dashboard) {
            this.dashboard
              .getCompletedListActiveForOwner(this.token, year, per_page, limit)
              .subscribe((res: any) => {
                let response = res;
                response.result.order_list.forEach((x) => {
                  x.isOwner = true;
                });
                this.rental_data = [
                  ...this.rental_data,
                  ...response.result.order_list,
                ];
                this.rental_year_array = response.result.date_array;
                this.totalItemsRental = response.result.pagination.total_rows;
              });
          }
        });
    } else {
      this.dashboard
        .getCompletedListActiveForOwner(this.token, year, per_page, limit)
        .subscribe((res: any) => {
          let response = res;
          response.result.order_list.forEach((x) => {
            x.isOwner = true;
          });
          this.rental_data = response.result.order_list;
          this.rental_year_array = response.result.date_array;
          this.totalItemsRental = response.result.pagination.total_rows;
        });
    }
  }

  fetchCanceledList(per_page = 0, limit = 25) {
    if (!this.owner_dashboard && !this.renter_dashboard) {
      this.dataService.openSnackBar(
        "Please select owner or rental",
        "snack-error"
      );
    }
    this.is_messaging = false;
    let year = this.year_for_list;
    this.all = false;
    this.active = false;
    this.completed = false;
    this.canceled = true;
    this.rejected = false;
    this.archive = false;
    this.rental_data = [];
    if (this.renter_dashboard == true) {
      this.dashboard
        .getRentalListCanceled(this.token, year, per_page, limit)
        .subscribe((res: any) => {
          let response = res;
          this.rental_data = response.result.order_list;
          this.rental_year_array = response.result.date_array;
          this.totalItemsRental = response.result.pagination.total_rows;
          if (this.owner_dashboard) {
            this.dashboard
              .getRentalListCanceledForOwner(this.token, year, per_page, limit)
              .subscribe((res: any) => {
                let response = res;
                response.result.order_list.forEach((x) => {
                  x.isOwner = true;
                });
                this.rental_data = [
                  ...this.rental_data,
                  ...response.result.order_list,
                ];
                this.rental_year_array = response.result.date_array;
                this.totalItemsRental = response.result.pagination.total_rows;
              });
          }
        });
    } else {
      this.dashboard
        .getRentalListCanceledForOwner(this.token, year, per_page, limit)
        .subscribe((res: any) => {
          let response = res;
          response.result.order_list.forEach((x) => {
            x.isOwner = true;
          });
          this.rental_data = response.result.order_list;
          this.rental_year_array = response.result.date_array;
          this.totalItemsRental = response.result.pagination.total_rows;
        });
    }
  }

  fetchRejectedList(per_page = 0, limit = 25) {
    if (!this.owner_dashboard && !this.renter_dashboard) {
      this.dataService.openSnackBar(
        "Please select owner or rental",
        "snack-error"
      );
    }
    this.is_messaging = false;
    let year = this.year_for_list;
    this.all = false;
    this.active = false;
    this.completed = false;
    this.canceled = false;
    this.rejected = true;
    this.archive = false;
    this.rental_data = [];
    if (this.renter_dashboard == true) {
      this.dashboard
        .getRentalListRejected(this.token, year, per_page, limit)
        .subscribe((res: any) => {
          let response = res;
          this.rental_data = response.result.order_list;
          this.rental_year_array = response.result.date_array;
          this.totalItemsRental = response.result.pagination.total_rows;
          if (this.owner_dashboard) {
            this.dashboard
              .getRentalListRejectedForOwner(this.token, year, per_page, limit)
              .subscribe((res: any) => {
                let response = res;
                response.result.order_list.forEach((x) => {
                  x.isOwner = true;
                });
                this.rental_data = [
                  ...this.rental_data,
                  ...response.result.order_list,
                ];
                this.rental_year_array = response.result.date_array;
                this.totalItemsRental = response.result.pagination.total_rows;
                this.changeDetectorRef.detectChanges();
              });
          }
        });
    } else {
      this.dashboard
        .getRentalListRejectedForOwner(this.token, year, per_page, limit)
        .subscribe((res: any) => {
          let response = res;
          response.result.order_list.forEach((x) => {
            x.isOwner = true;
          });
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
    this.rental_data = [];
    if (this.renter_dashboard == true) {
      this.dashboard
        .getRentalListArchived(this.token, year, per_page, limit)
        .subscribe((res: any) => {
          let response = res;
          this.rental_data = response.result.order_list;
          this.rental_year_array = response.result.date_array;
          this.totalItemsRental = response.result.pagination.total_rows;
          if (this.owner_dashboard) {
            this.dashboard
              .getRentalListArchivedForOwner(this.token, year, per_page, limit)
              .subscribe((res: any) => {
                let response = res;
                response.result.order_list.forEach((x) => {
                  x.isOwner = true;
                });
                this.rental_data = [
                  ...this.rental_data,
                  ...response.result.order_list,
                ];
                this.rental_year_array = response.result.date_array;
                this.totalItemsRental = response.result.pagination.total_rows;
              });
          }
        });
    } else {
      this.dashboard
        .getRentalListArchivedForOwner(this.token, year, per_page, limit)
        .subscribe((res: any) => {
          let response = res;
          response.result.order_list.forEach((x) => {
            x.isOwner = true;
          });
          this.rental_data = response.result.order_list;
          this.rental_year_array = response.result.date_array;
          this.totalItemsRental = response.result.pagination.total_rows;
        });
    }
  }
  reFormatDate(date = "") {
    return (date + "Z").replace(/\s/g, "T");
  }
  onRentalTypeChange(e) {
    console.log(e);
    switch (+e) {
      case 1:
        this.getRentalList();
        break;
      case 2:
        this.fetchActiveList();
        break;
      case 3:
        this.fetchCompletedList();
        break;
      case 4:
        this.fetchCanceledList();
        break;
      case 5:
        this.fetchRejectedList();
        break;
      default:
        break;
    }
  }
  orderSummary(item) {
    this.router.navigate([
      "/order-summary",
      item.order_id,
      item.isOwner ? "owner" : "renter",
    ]);
  }
}
