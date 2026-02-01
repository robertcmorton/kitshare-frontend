import { Component, OnInit } from "@angular/core";
import { DashboardService } from "../../services/dashboard.service";
import { BaseApiService } from "../../services/base-api.service";
import { BaseService } from "../../services/base.service";
import { AuthService } from "../../services/auth.service";
import { ConfirmationDialogService } from "./../../rental-order-owner/confirmation-dialog/confirmation-dialog.service";

import { forkJoin } from "rxjs";
import * as moment from "moment/moment";
import { DataService } from "app/shared/data/data.service";
declare var $: any;

@Component({
  selector: "kit-manage-listing",
  templateUrl: "./manage-listing.component.html",
  styleUrls: ["./manage-listing.component.scss"],
})
export class ManageListingComponent implements OnInit {
  token: string;

  no_of_manage_list_item_checked: number;
  gear_item_list_checked_array: Array<any>;
  manage_list_gear_categories_data: Array<any>;
  manage_list_data: Array<any>;
  is_any_item_checked: boolean;
  user_address_array: Array<any>;
  user_address_checked_array: Array<any>;

  date: Date = new Date();
  minDate: Date = new Date();
  date_from: any;
  date_to: any;

  totalItems: number;
  currentPage: number;
  limit: number;
  is_address_rendered: boolean;

  constructor(
    public dashboard: DashboardService,
    public auth: AuthService,
    public baseService: BaseService,
    public dataService: DataService,
    private basapi: BaseApiService,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    this.token = this.auth.userData.auth_token;
    this.no_of_manage_list_item_checked = 0;
    this.is_any_item_checked = false;
    this.gear_item_list_checked_array = [];
    this.date_from = "";
    this.date_to = "";
    this.user_address_checked_array = [];

    this.currentPage = 1;
    this.limit = 25;
    this.is_address_rendered = false;
  }

  ngOnInit(): void {
    this.manageList();
    this.getContactInfos();
  }
  getContactInfos() {
    this.dashboard.getContactInfos(this.token).subscribe((res: any) => {
      this.user_address_array = res.result;
    });
  }

  makeItemsPublic() {
    let forKJoinArr = [];
    if (this.gear_item_list_checked_array.length > 0) {
      this.baseService.global.showLoader();
      this.gear_item_list_checked_array.forEach((element) => {
        let resp = this.dashboard.makeGearPublicPrivate(
          this.token,
          element,
          "Y"
        );
        forKJoinArr.push(resp);
      });

      const combined = forkJoin(forKJoinArr);
      combined.subscribe((res: any) => {
        this.baseService.global.hideLoader();
        this.dataService.openSnackBar("Success");

        this.no_of_manage_list_item_checked = 0;
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

  openAddressList() {
    this.is_address_rendered = false;
    $("#address").modal("show");
    let common_address_arr = [];
    this.user_address_checked_array = [];
    let forKJoinArr = [];
    this.gear_item_list_checked_array.forEach((element, index) => {
      let resp = this.dashboard.getAddressListByGear(this.token, element);
      forKJoinArr.push(resp);
    });

    const combined = forkJoin(forKJoinArr);
    combined.subscribe((res: any) => {
      console.log("something");
      for (var i = 0; i < res.length; i++) {
        let result = JSON.parse(res[i]._body);
        if (i == 0) {
          common_address_arr = result.result;
        } else {
          common_address_arr = result.result.filter((value) =>
            common_address_arr.includes(value)
          );
        }
      }
      this.user_address_checked_array = common_address_arr;

      this.user_address_array.forEach((element) => {
        if (common_address_arr.indexOf(element.user_address_id) >= 0) {
          element.assigned = true;
        } else {
          element.assigned = false;
        }
      });
      this.is_address_rendered = true;
    });
  }

  updateAddress() {
    if (this.user_address_checked_array.length == 0) {
      this.confirmationDialogService
        .confirm(
          "No Address selected",
          "Do you want to remove all address from selected listings?"
        )
        .then((confirmed) => {
          if (confirmed) {
            this.updateAddressConfirmed();
          }
        });
    } else {
      this.updateAddressConfirmed();
    }
  }
  updateAddressConfirmed() {
    this.dashboard
      .addGearItemAddress(
        this.token,
        this.gear_item_list_checked_array,
        this.user_address_checked_array
      )
      .subscribe((res: any) => {
        let result = res;
        if (result.status == 200) {
          this.manageList();
          this.gear_item_list_checked_array = [];
          this.dataService.openSnackBar(result.status_message);
        } else {
          this.dataService.openSnackBar(result.status_message, "snack-error");
        }
      });
  }

  deleteItems() {
    let forKJoinArr = [];
    if (this.gear_item_list_checked_array.length > 0) {
      this.gear_item_list_checked_array.forEach((element) => {
        let resp = this.basapi.deleteGear(this.token, element);
        forKJoinArr.push(resp);
      });

      const combined = forkJoin(forKJoinArr);
      combined.subscribe((res: any) => {
        this.dataService.openSnackBar("Item(s) deleted successfuly");

        this.no_of_manage_list_item_checked = 0;
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

  deactivateItems() {
    let forKJoinArr = [];
    if (this.gear_item_list_checked_array.length > 0) {
      this.baseService.global.showLoader();
      this.gear_item_list_checked_array.forEach((element) => {
        let resp = this.dashboard.makeGearPublicPrivate(
          this.token,
          element,
          "N"
        );
        forKJoinArr.push(resp);
      });

      const combined = forkJoin(forKJoinArr);
      combined.subscribe((res: any) => {
        this.baseService.global.hideLoader();
        this.dataService.openSnackBar("Success");

        this.no_of_manage_list_item_checked = 0;
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

  deleteAddress() {
    let forKJoinArr = [];

    if (this.gear_item_list_checked_array.length > 0) {
      this.gear_item_list_checked_array.forEach((element) => {
        this.user_address_checked_array.forEach((elem) => {
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
        this.dataService.openSnackBar("Address deleted successfully");

        this.no_of_manage_list_item_checked = 0;

        this.manageList();
        this.gear_item_list_checked_array = [];
      });
    }
  }

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

  onChange(e) {
    if (e == "all") {
      this.limit = this.totalItems;
    } else {
      this.limit = e;
    }
    let per_page = 0;
    this.manageList(per_page, this.limit);
  }
  emitValue() {}
  manageList(per_page = 0, limit = 25) {
    this.dashboard
      .getManageList(this.token, null, per_page, limit)
      .subscribe((res: any) => {
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
      });
  }

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
      });
  }
  afterCloseCalender() {
    this.date_from = moment(this.date[0]).format("YYYY-MM-DD");
    this.date_to = moment(this.date[1]).format("YYYY-MM-DD");
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
        this.dataService.openSnackBar(
          "New unavailable date(s) added successfully"
        );
        this.manageList();
        this.gear_item_list_checked_array = [];
      });
    }
  }

  selectDeselectItem(val: any, item_id) {
    if (val.currentTarget.checked === true) {
      let index: number = this.gear_item_list_checked_array.indexOf(item_id);
      if (index === -1) {
        this.gear_item_list_checked_array.push(item_id);
      }
    }

    if (val.currentTarget.checked === false) {
      let index: number = this.gear_item_list_checked_array.indexOf(item_id);
      if (index !== -1) {
        this.gear_item_list_checked_array.splice(index, 1);
      }
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

  individualItemDeactivate(user_gear_desc_id) {
    this.gear_item_list_checked_array = [];
    this.gear_item_list_checked_array.push(user_gear_desc_id);
  }

  individualItemDelete(user_gear_desc_id) {
    this.gear_item_list_checked_array = [];
    this.gear_item_list_checked_array.push(user_gear_desc_id);
  }
  pageChanged(event: any) {
    let per_page = (event.page - 1) * this.limit;
    this.manageList(per_page);
    window.scrollTo(0, 0);
  }
  onChekedAddress(val: any, user_address_id) {
    if (val.currentTarget.checked === true) {
      let index: number =
        this.user_address_checked_array.indexOf(user_address_id);
      if (index === -1) {
        this.user_address_checked_array.push(user_address_id);
      }
    }

    if (val.currentTarget.checked === false) {
      let index: number =
        this.user_address_checked_array.indexOf(user_address_id);
      if (index !== -1) {
        this.user_address_checked_array.splice(index, 1);
      }
    }
  }

  makePublicPrivate(user_gear_desc_id, status) {
    this.dashboard
      .makeGearPublicPrivate(this.token, user_gear_desc_id, status)
      .subscribe((res: any) => {
        this.manageList();
      });
  }
}
