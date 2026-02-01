import {
  suburbList,
  stateList,
  updateContactInfo,
  deleteContactInfo,
} from "./../../shared/constant";
import { BaseService } from "./../../services/base.service";
import { BaseComponent } from "../../base.componant";
import { Component, OnInit } from "@angular/core";
import { usersContactInfo } from "../../shared/constant";
import {
  StateListOption,
  SuburbListOption,
  ContactInfoData,
} from "./../../shared/models/contact-info";

import { SearchService } from "./../../services/search.service";
import { UserProfileService } from "../user-profile.service";
import { KSAddress } from "../models/address.model";
import { SaveBarService } from "../../shared/component/save-bar/save-bar.service";
import { DataService } from "app/shared/data/data.service";
declare var $: any;

@Component({
  selector: "app-contact-info",
  templateUrl: "./contact-info.component.html",
  styleUrls: ["./contact-info.component.scss"],
})
export class ContactInfoComponent extends BaseComponent implements OnInit {
  stateListOption_1: Array<StateListOption>;
  suburbListOption_1: Array<SuburbListOption>;
  suburbListOption_2: Array<SuburbListOption>;
  actionTitle: string = "Add";
  selectedSuburbFieldOptionName: string = "suburbListOption_1";
  show2ndSlot: boolean = false;

  contactInfoData: Array<ContactInfoData> = [];
  contactInfoCountArray: Array<any> = [];
  positions = [];
  addressList: Array<KSAddress> = [];
  new_addresses: Array<KSAddress> = [];
  hasaddress: boolean = false;
  currentaddress: any;

  constructor(
    public baseService: BaseService,
    public searchService: SearchService,
    private userProfile: UserProfileService,
    private saveBar: SaveBarService,
    private dataService: DataService
  ) {
    super(baseService, true);
    this.contactInfoData[0] = new ContactInfoData();
    this.baseService.global.showLoader();
    this.baseService.baseApi.getUsersContactInfo();
    this.baseService.baseApi.getStateList();
  }

  saveAddress(payload) {
    this.userProfile.addAddress(payload).subscribe((addresses: KSAddress[]) => {
      this.addressList = [...this.addressList, ...this.new_addresses];
      this.dataService.openSnackBar(
        "Address added successfully!",
        "snack-success"
      );
      this.hasaddress = false;
      setTimeout(() => {
        this.hasaddress = true;
      }, 50);

      this.userProfile.getSavedAddresses().subscribe((addresses: any) => {
        this.addressList = [...addresses.result];
        if (this.addressList.length == 1) {
          let user_address_id = this.addressList[0].user_address_id;
          this.makeAddressDefault(user_address_id);
        }
      });
    });
  }

  observeSaveBarStream() {
    this.saveBar.SAVEBAR_RESULT_ACTION$.subscribe((res: any) => {
      if (res.action === "save") {
        this.saveAddress(res.data);
      }
    });
  }
  ngOnInit() {
    let randomLat = Math.random() * 0.0099 + 43.725;
    let randomLng = Math.random() * 0.0099 + -79.7699;
    this.observeSaveBarStream();
    this.fetchSavedAddress();
  }

  fetchSavedAddress() {
    this.userProfile.getSavedAddresses().subscribe((addresses: any) => {
      this.addressList = [...addresses.result];
      if (this.addressList.length > 0) {
        this.hasaddress = true;
      }
    });
  }

  onDeleteAddress(addressId) {
    this.currentaddress = addressId;
    $("#confirmdeleteaddressmodal").modal("show");
  }
  nowDeleteAddress() {
    this.userProfile
      .deleteAddress(this.currentaddress)
      .subscribe((response: any) => {
        if (response.status == 400) {
          this.dataService.openSnackBar(response.status_message, "snack-error");
        } else {
          this.dataService.openSnackBar(
            response.status_message,
            "snack-success"
          );
          this.addressList = this.addressList.filter(
            (item) => item.user_address_id !== this.currentaddress
          );
          this.hasaddress = false;
          setTimeout(() => {
            this.hasaddress = true;
          }, 50);
        }
      });
  }

  makeAddressDefault(id) {
    this.userProfile.makeAddrDefault(id).subscribe((res) => {
      this.fetchSavedAddress();
    });
  }
  handleApiResponse(data: any) {
    if (data.resulttype === usersContactInfo) {
      this.positions = [];
      this.contactInfoData = this.baseService.global.getContactInfoData(
        data.result.result
      );
      this.contactInfoCountArray = new Array(this.contactInfoData.length);
      this.baseService.global.hideLoader();

      if (this.contactInfoData.length > 0) {
        this.contactInfoData.forEach((element) => {
          let address =
            element.street_address_line1 +
            ", " +
            element.street_address_line2 +
            ", " +
            element.suburb_name +
            ", " +
            element.ks_state_name;
          if (this.searchService != undefined) {
            this.searchService
              .generateLatlong(address)
              .subscribe((res: any) => {
                // debugger;
                /* console.log('%cAddress', 'color: green;');
                console.log(res); */
                // let response = res;
                if (
                  res &&
                  res.results &&
                  res.results[0] &&
                  res.results[0].geometry
                ) {
                  let lat_long = [];
                  lat_long.push(res.results[0].geometry.location.lat);
                  lat_long.push(res.results[0].geometry.location.lng);
                  this.positions.push(lat_long);
                }
              });
          }
        });
      }

      // console.log(this.contactInfoCountArray);
    }

    if (data.resulttype === suburbList) {
      this[this.selectedSuburbFieldOptionName] = data.result.result;
    }

    if (data.resulttype === stateList) {
      this.stateListOption_1 = data.result.result;
    }

    if (data.resulttype === updateContactInfo) {
      if (data.result.status === 200) {
        this.baseService.global.hideLoader();
        this.dataService.openSnackBar("successfully updated!");
      }
    }

    if (data.resulttype === deleteContactInfo) {
      this.baseService.global.hideLoader();
      if (data.result.status === 200) {
        this.dataService.openSnackBar("successfully deleted!");
      }
    }
  }

  addOrRemoveHandler(actionDetails) {
    if (actionDetails.action === "add") {
      this.contactInfoData.push(new ContactInfoData());
    } else {
      this.contactInfoData.splice(actionDetails.index, 1);
      // if user_address_id is not undefined or empty then call the delete Address API
      if (
        actionDetails.user_address_id != undefined &&
        actionDetails.user_address_id != ""
      ) {
        this.baseService.baseApi.deleteContactInfo(
          actionDetails.user_address_id
        );
        this.baseService.global.showLoader();
      }
    }
    this.contactInfoCountArray = new Array(this.contactInfoData.length);
  }

  updatedValueHandler(updatedValueDetails) {
    if (updatedValueDetails.updatedValue.is_default === true) {
      this.contactInfoData.forEach((element, index) => {
        if (index !== updatedValueDetails.index) {
          element.is_default = false;
          // element.default_address = '0';
        }
      });
    }
    this.contactInfoData[updatedValueDetails.index] =
      updatedValueDetails.updatedValue;
  }

  updateProfile() {
    let updateData = { token: "", data: [] };
    for (let eachSet of this.contactInfoData) {
      if (eachSet) {
        updateData.data.push(eachSet);
      }
    }

    this.baseService.baseApi.updateContactInfo(updateData);
    // this.baseService.global.showLoader();
  }

  onPlaceSelect(address) {
    this.new_addresses = [];
    this.new_addresses = [...this.new_addresses, address];

    // this.addressList = [...this.addressList, address];
    let config = {
      status: "show",
      data: this.new_addresses,
    };
    var new_tmp =
      this.new_addresses[0].street_address_line2 +
      " " +
      this.new_addresses[0].route +
      " " +
      this.new_addresses[0].suburb_name;
    let is_duplicate = false;
    for (var a in this.addressList) {
      var tmp =
        this.addressList[a].street_address_line2 +
        " " +
        this.addressList[a].route +
        " " +
        this.addressList[a].suburb_name;
      if (new_tmp == tmp) {
        is_duplicate = true;
      }
    }
    if (is_duplicate) {
      this.dataService.openSnackBar("Duplicate address found", "snack-error");
      let config = {
        status: "cancel",
        action: "cancel",
      };
      setTimeout(() => {
        this.saveBar.triggerBar(config);
        this.saveBar.onSaveBarAction(config);
      }, 3000);
    } else {
      this.saveBar.triggerBar(config);
    }
  }

  ngOnDestroy() {
    let config = {
      status: "hide",
      data: this.new_addresses,
    };

    this.saveBar.triggerBar(config);
  }
  /* deleteAddress(user_address_id){

    this.baseService.baseApi.deleteContactInfo(user_address_id);
  } */
}
