import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  TemplateRef,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { BaseComponent } from "../../base.componant";
import { BaseService } from "../../services/base.service";
import { AuthService } from "../../services/auth.service";

import { SITE_BASE_URL } from "../../shared/constant";
import { GearDetails } from "../../shared/models/gear-details.model";

import { CartService } from "../../services/cart.service";
import { SearchService } from "../../services/search.service";
import { DashboardService } from "../../services/dashboard.service";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";

import * as moment from "moment/moment";

import { Subscription } from "rxjs";
import { AppService } from "app/app.service";
import { environment } from "environments/environment";
import { DataService } from "app/shared/data/data.service";

declare var $: any;

@Component({
  selector: "app-public-gear-details",
  templateUrl: "./public-gear-details.component.html",
  styleUrls: ["./public-gear-details.component.scss"],
})
export class PublicGearDetailsComponent
  extends BaseComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild("closeContactOwnerModal", { static: true })
  closeContactOwnerModal: ElementRef;
  @ViewChild("gmap", { static: true }) gmapElement: any;
  summaryDetails = null;
  has_description: Boolean;
  public todayDate: any = new Date();
  modalRef: BsModalRef;
  from_date: any = new Date();
  to_date: any = new Date();
  has_item_in_cart: boolean;

  today: any = new Date();
  disableAddToCart: boolean = false;
  map: google.maps.Map;
  marker: google.maps.Marker;

  lat_long_array: Array<object>;

  protected gearId: any;
  public gearDetailsAvgRating: Array<number> = [];
  public gearDetails: any;
  related_list: Array<object>;
  other_list: Array<any>;
  owner_other_list: Array<any>;
  other_name: string;
  other_id: string;
  sub = new Subscription();
  is_my_gear: boolean = false;

  calender_disabled: boolean;

  token: string;

  gear_list_delist_flag: string;

  unavailable_dates: any = [];

  script: any;
  html_body: any;
  user_gear_desc_id: any;
  view_count: number;

  message_with_owner: string;
  paramSubscription: Subscription;
  showPicker = true;
  owner_id: any;

  is_creative_space_in_the_cart: boolean;
  is_cart_empty: boolean;

  isCreativeSpace: boolean;
  minForReturn: any = new Date();

  showCal: boolean = false;
  minToDate: any;
  app_username: string;
  is_favourite: boolean = false;
  totalItems: number;
  currentPage: number;
  cart_array: Array<any>;
  is_message_sent: boolean = false;
  tabletCarosal = false;

  /**
   * Calendar Dates filter
   * This function returns only dates that are available for booking on the calendar
   */
  public myFilter = (d: any): boolean => {
    let is_this_day_unavailable: boolean = false;
    let day = d;
    let momentFromDate = moment(day).format("YY-MM-DD");
    this.unavailable_dates.forEach((elem: Date) => {
      let unavailable_date = moment(elem).format("YY-MM-DD");
      if (unavailable_date == momentFromDate) {
        is_this_day_unavailable = true;
      }
    });

    return !is_this_day_unavailable ? day : "";
  };

  constructor(
    public baseService: BaseService,
    private route: ActivatedRoute,
    private router: Router,
    private cart: CartService,
    public searchService: SearchService,
    public dashboard: DashboardService,
    public dataService: DataService,
    private auth: AuthService,
    private modalService: BsModalService,
    private appService: AppService
  ) {
    super(baseService, false);
    this.baseService.global.showLoader();

    this.currentPage = 1;
    this.lat_long_array = [];
    this.has_item_in_cart = false;

    this.is_my_gear = false;

    this.gearDetails = new GearDetails();
    // console.log(this.gearDetails);
    this.related_list = [];
    this.other_list = [];
    this.owner_other_list = [];
    this.other_name = "";
    this.calender_disabled = false;

    this.token = this.auth.userData.auth_token;

    this.has_description = true;

    this.script = "";
    this.view_count = 0;
    this.message_with_owner = "";
    this.is_creative_space_in_the_cart = false;
    this.is_cart_empty = true;
    this.isCreativeSpace = false;
    this.todayDate.setDate(this.todayDate.getDate() - 1);
  }
  onContactClick(event) {
    this.openModal(event);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  getGearDetails() {
    this.gearDetails = new GearDetails();
    this.baseService.baseApi
      .getSingleGearDetailsTest(this.gearId)
      .subscribe((res: any) => {
        this.socialShare();
        let response = res;

        this.gearDetails = response.result.gear_details;
        this.app_username = this.gearDetails.app_username;
        this.gearId = this.gearDetails.user_gear_desc_id;
        this.related_list = response.result.related_listings;

        this.other_list = response.result.user_gears;

        $("#similar_slider").trigger("destroy.owl.carousel");
        $("#users_listings").trigger("destroy.owl.carousel");
        setTimeout(() => {
          $("#similar_slider").owlCarousel({
            items: 2,
            itemsDesktop: [1199, 3],
            itemsDesktopSmall: [980, 2],
            itemsMobile: [600, 1],
            navigation: false,
            navigationText: ["", ""],
            pagination: true,
            autoPlay: true,
          });

          $("#users_listings").owlCarousel({
            items: 2,
            itemsDesktop: [1199, 3],
            itemsDesktopSmall: [980, 2],
            itemsMobile: [600, 1],
            navigation: false,
            navigationText: ["", ""],
            pagination: true,
            autoPlay: true,
          });
        }, 1000);
        this.owner_other_list = response.result.user_gears;
        if (this.other_list.length > 0) {
          this.other_name = this.other_list[0].app_user_first_name;
          this.other_id = this.other_list[0].app_user_id;
        }

        if (this.gearDetails.ks_gear_type_id == "1") {
          this.isCreativeSpace = true;
        }
        this.is_favourite = this.gearDetails.is_favourite == "Y" ? true : false;

        this.owner_id = this.gearDetails.app_user_id;
        // Add unavailable dates
        if (this.gearDetails.gear_unavailable.length > 0) {
          this.gearDetails.gear_unavailable.forEach((element) => {
            let temp_unavailable_date = this.getDaysArray(
              new Date(element.unavailable_from_date),
              new Date(element.unavailable_to_date)
            );
            temp_unavailable_date
              .map((v) => v.toISOString().slice(0, 10))
              .join("");
            temp_unavailable_date.forEach((elem: any) => {
              // elem = moment(elem).format('YY-MM-DD');
              this.unavailable_dates.push(elem);
            });
          });
          let ghostDate = moment(new Date()).subtract(1, "d");
          this.unavailable_dates.push(ghostDate);
          this.checkForOverlap();
        }

        if (this.gearDetails.ks_user_gear_condition == "--Select Condition--") {
          this.gearDetails.ks_user_gear_condition = "";
        }

        this.gear_list_delist_flag = this.gearDetails.gear_list_delist_flag;

        this.user_gear_desc_id = response.result.gear_details.user_gear_desc_id;

        if (this.auth.isLoggedIn) {
          this.baseService.baseApi
            .getUserInfoForPrfileNew(this.auth.userData.auth_token)
            .subscribe((res: any) => {
              let response_profile = res;
              let user_details_id = response_profile.result[0].app_user_id;
              let gear_details_app_user_id = this.gearDetails.app_user_id;

              if (user_details_id == gear_details_app_user_id) {
                this.is_my_gear = true;
              } else {
                this.is_my_gear = false;
              }
            });
        }

        if (this.auth.checkLoggedIn()) {
          this.getCart();
        }

        if (this.gearDetails.gear_description_1 == "") {
          this.has_description = false;
        }

        this.gearDetails.gear_description_1 =
          this.gearDetails.gear_description_1.replace(/\\/g, "");

        this.gearDetails.owners_remark = this.gearDetails.owners_remark.replace(
          /(\r?\n|\r)/gm,
          ""
        );

        if (this.gearDetails.images.length == 0) {
          let default_image_link =
            SITE_BASE_URL + "assets/images/default_product.jpg";

          let display_image_object = {
            create_date: "",
            create_user: "",
            gear_display_image: default_image_link,
            gear_display_seq_id: null,
            google_360_link: "",
            is_active: "Y",
            model_id: "",
            update_date: null,
            update_user: null,
            user_gear_desc_id: "",
            user_gear_image_id: "",
          };

          this.gearDetails.images.push(display_image_object);
        }

        if (this.gearDetails.address.length > 0) {
          this.getAddress();
        }
        this.gearDetailsAvgRating = Array.from(
          Array(Math.round(this.gearDetails.avg_rating)).keys()
        );
        this.baseService.global.hideLoader();
        this.gearViewCount();
      });
  }

  getDaysArray = function (start, end) {
    for (
      var arr = [], dt = start;
      dt <= end;
      dt.setDate(dt.getDate("YY-MM-DD") + 1)
    ) {
      arr.push(new Date(dt));
    }
    return arr;
  };

  ngOnInit() {
    this.sub.add(
      this.appService.onResize$.subscribe((size) => {
        this.tabletCarosal = size < environment.breakpoints.tablet;
      })
    );
    this.paramSubscription = this.route.params.subscribe((params) => {
      this.gearId = params.id ? params.id : 0;
      console.log("... gear ID from param subscription..");
      console.log(this.gearId);
      this.has_item_in_cart = false;
      this.getGearDetails();
    });

    console.log("ngoninit");
  }

  ngAfterViewInit(): void {
    let elem_socialshare = document?.getElementById("socialshare"); // 27.05.20 - SOCIAL SHARE
    if (elem_socialshare == null) {
    }
    let elem_at_share = document?.getElementById("at4-share"); // 27.05.20 - SOCIAL SHARE
    if (elem_at_share != null) {
      // 27.05.20 - SOCIAL SHARE
      document.getElementById("at4-share").style.display = "block";
    }
    let elem_at_share_mob = document?.getElementById("at-share-dock"); // 27.05.20 - SOCIAL SHARE
    if (elem_at_share_mob != null) {
      // 27.05.20 - SOCIAL SHARE
      document.getElementById("at-share-dock").parentElement.style.display =
        "block";
    }
  }

  ngOnDestroy() {
    console.log("destoryed");
    this.sub.unsubscribe();
    document.getElementById("closeCartModalButton").click();
    let elem_at_share = document.getElementById("at4-share"); // 27.05.20 - SOCIAL SHARE
    if (elem_at_share != null) {
      // 27.05.20 - SOCIAL SHARE
      document.getElementById("at4-share").style.display = "none";
    }
    let elem_at_share_mob = document.getElementById("at-share-dock"); // 27.05.20 - SOCIAL SHARE
    if (elem_at_share_mob != null) {
      // 27.05.20 - SOCIAL SHARE
      document.getElementById("at-share-dock").parentElement.style.display =
        "none";
    }
  }

  getAddress() {
    let addaress_from_google = [];
    let addaress_string = this.gearDetails.address[0].street_address_line1;
    let price = this.gearDetails.address[0].per_day_cost_aud_inc_gst;

    this.searchService
      .getGoogleAddress(addaress_string)
      .subscribe((response: any) => {
        // let response = res;
        addaress_from_google = response.result;

        for (
          let add_arr = 0;
          add_arr < addaress_from_google.length;
          add_arr++
        ) {
          this.searchService
            .generateLatlong(addaress_from_google[add_arr])
            .subscribe((resPonse: any) => {
              if (resPonse.status == "OK") {
                let lat = resPonse.results[0].geometry.location.lat;
                let lng = resPonse.results[0].geometry.location.lng;
                let name = resPonse.results[0].formatted_address;

                let mapObj: Object = {
                  lat: lat,
                  lng: lng,
                  name: name,
                  price: price,
                };

                this.lat_long_array.push(mapObj);
              }
            });
        }

        setTimeout(() => {
          this.generateGoogleMap();
        }, 500);
      });
  }

  public socialShare() {
    this.html_body = <HTMLDivElement>document.body;
    let url =
      "https://s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5c1c8b69349d6d65";

    if (document.getElementById("socialshare")) {
      return;
    }
    this.script = document?.createElement("script");
    this.script.innerHTML = "";
    this.script.id = "socialshare";
    this.script.src = url;
    this.script.async = true;
    this.script.defer = true;
    setTimeout(() => {
      this.html_body.appendChild(this.script);
    }, 1000);
  }

  generateGoogleMap() {
    var center_of_map = {
      lat: Number(this.gearDetails.address[0].lat),
      lng: Number(this.gearDetails.address[0].lng),
    };
    var bounds = new google.maps.LatLngBounds();
    var mapProp = {
      center: center_of_map,
      zoom: 4,
      maxZoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

    var markers = [];

    this.gearDetails.address.forEach((element) => {
      let marker_temp_obj = {
        lat: element.lat,
        lng: element.lng,
        name: element.street_address_line1,
        price: element.per_day_cost_aud_inc_gst,
      };
      markers.push(marker_temp_obj);
    });

    var markerIcon = {
      url: "https://www.kitshare.com.au/assets/images/mapIcons/kitshare-map-icon@2x.png",
      scaledSize: new google.maps.Size(41, 41),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(12, 40),
    };

    for (let i = 0; i < markers.length; i++) {
      let price: any = parseFloat(markers[i].price).toFixed(2);
      var position = new google.maps.LatLng(markers[i].lat, markers[i].lng);
      bounds.extend(position);
      this.marker = new google.maps.Marker({
        position: position,
        map: this.map,
        icon: markerIcon,

        title: markers[i].name,
      });
    }
  }

  addMoretoCart(user_gear_desc_id) {
    let item_obj = {
      user_gear_desc_id: user_gear_desc_id,
      date_from: moment(this.from_date).format("YYYY-MM-DD"),
      date_to: moment(this.to_date).format("YYYY-MM-DD"),
      token: this.auth.userData.auth_token,
    };
    this.cart.addToCart(item_obj).subscribe(
      (res: any) => {
        let result = res;
        if (result.status === 200) {
          this.dataService.openSnackBar(
            "Item added to your cart",
            "snack-success"
          );
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
          "snack-error zindex_99999999"
        );
      }
    );
  }
  addtoCart() {
    let momentFromDate = moment(this.from_date).format("YYYY-MM-DD");
    let momentToDate = moment(this.to_date).format("YYYY-MM-DD");

    if (
      this.gearDetails.ks_gear_type_id != "1" &&
      this.is_creative_space_in_the_cart == true &&
      !this.is_cart_empty
    ) {
      this.dataService.openSnackBar(
        "Creative Space and other Kits/Items should be booked seperately",
        "snack-error"
      );
    } else if (
      this.gearDetails.ks_gear_type_id == "1" &&
      this.is_creative_space_in_the_cart == false &&
      !this.is_cart_empty
    ) {
      this.dataService.openSnackBar(
        "Creative Space and other Kits/Items should be booked seperately",
        "snack-error"
      );
    } else {
      if (this.auth.checkLoggedIn()) {
        let item_obj = {
          user_gear_desc_id: this.gearId,
          date_from: momentFromDate,
          date_to: momentToDate,
          token: this.auth.userData.auth_token,
        };

        this.cart.addToCart(item_obj).subscribe(
          (res: any) => {
            let result = res;
            if (result.status === 200) {
              this.dataService.openSnackBar(
                "Item added to your cart",
                "snack-success"
              );
              if (this.gearDetails.gear_type != "1") {
                this.baseService.baseApi
                  .getUserInfoGearByAppUsernameSubscribe(
                    this.gearDetails.app_username,
                    10
                  )
                  .subscribe((res): any => {
                    let result = res;

                    this.owner_other_list = result.result.gears.gear_lists;
                    this.totalItems = result.result.count;
                    this.getCart();
                    if (this.owner_other_list && this.owner_other_list.length) {
                      document.getElementById("open_addmoremodal_btn").click();
                    }
                  });
              } else {
                this.getCart();
              }
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
  }
  pageChanged(event: any) {
    let per_page = (event.page - 1) * 12;
    this.baseService.baseApi
      .getUserInfoGearByAppUsernameSubscribe(
        this.gearDetails.app_username,
        per_page
      )
      .subscribe((res) => {
        let result = res;
        this.owner_other_list = result.result.gears.gear_lists;
        this.checkCartAdded();
      });
  }
  checkCartAdded() {
    if (this.cart_array.length > 0) {
      if (this.owner_other_list.length > 0) {
        this.owner_other_list.forEach((elem: any, index: number) => {
          this.owner_other_list[index]["is_added"] = false;
          this.cart_array.forEach((element: any) => {
            if (elem.user_gear_desc_id == element.user_gear_desc_id) {
              this.owner_other_list[index]["is_added"] = true;
              return false;
            }
          });
        });
      }
    }
  }
  getCart() {
    this.cart
      .getCartItems(this.auth.userData.auth_token)
      .subscribe((res: any) => {
        let cart_array_res = res;

        let cart_array = cart_array_res.result.cart;
        this.cart_array = cart_array;
        console.log("getCart");

        if (cart_array.length > 0) {
          this.is_creative_space_in_the_cart =
            this.cart.creativeSpaceInTheCart(cart_array);

          this.is_cart_empty = false;

          this.from_date = moment(
            cart_array[0].gear_rent_request_from_date
          ).format("MMMM DD, YYYY");
          this.to_date = moment(cart_array[0].gear_rent_request_to_date).format(
            "MMMM DD, YYYY"
          );
          let dataToSend = {
            user_gear_desc_id: this.gearId,
            date_from: moment(cart_array[0].gear_rent_request_from_date).format(
              "YYYY-MM-DD"
            ),
            date_to: moment(cart_array[0].gear_rent_request_to_date).format(
              "YYYY-MM-DD"
            ),
          };
          this.cart
            .onDateChangeGetOrderSummary(dataToSend)
            .subscribe((res: any) => {
              if (res.status === 200) {
                this.summaryDetails = res.result;
              } else {
                this.summaryDetails = null;
              }
            });

          this.from_date = new Date(this.from_date);
          this.to_date = new Date(this.to_date);

          // call header cart count service
          this.cart.noOfCart(cart_array.length);
          this.calender_disabled = true;

          for (let a = 0; a < cart_array.length; a++) {
            if (this.gearId == cart_array[a].user_gear_desc_id) {
              this.has_item_in_cart = true;
            }
          }
          this.checkForOverlap(); //sets disableAddToCart variable
          this.checkCartAdded();
        }
      });
  }

  goToEditPage(id: any) {
    this.router.navigate(["/gear/edit-gear/" + id]);
  }

  addToFavourite(user_gear_desc_id = null) {
    if (user_gear_desc_id == null) {
      this.dashboard
        .addTofavourite(this.auth.userData.auth_token, this.gearId)
        .subscribe(
          (res: any) => {
            if (res.status === 200) {
              this.dataService.openSnackBar(res.result, "snack-success");
              this.is_favourite = true;
              this.getCart();
            }
            if (res.status !== 200) {
              this.baseService.global.hideLoader();
              this.dataService.openSnackBar(res.result, "snack-error");
            }
          },
          (err) => {}
        );
    } else {
      this.dashboard
        .addTofavourite(this.auth.userData.auth_token, user_gear_desc_id)
        .subscribe(
          (res: any) => {
            if (res.status === 200) {
              this.dataService.openSnackBar(res.result, "snack-success");
              this.is_favourite = true;
              this.getCart();
            }
            if (res.status !== 200) {
              this.baseService.global.hideLoader();
              this.dataService.openSnackBar(res.result, "snack-error");
            }
          },
          (err) => {}
        );
    }
  }

  makeGearPublicPrivate(user_gear_desc_id, status) {
    this.dashboard
      .makeGearPublicPrivate(this.token, user_gear_desc_id, status)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.gear_list_delist_flag = status;
        }
      });
  }

  gearViewCount() {
    this.dashboard
      .gearViewCount(this.token, this.user_gear_desc_id)
      .subscribe((res: any) => {
        // console.log(res);
        this.view_count = res.view_count;
      });
  }

  sendMessageToOwner() {
    if (this.message_with_owner == undefined || this.message_with_owner == "") {
      this.dataService.openSnackBar("Please type a message", "snack-error");
    } else if (this.token == undefined) {
      this.dataService.openSnackBar(
        "Please login to send a message",
        "snack-error"
      );
    } else {
      this.is_message_sent = true;
      this.modalRef.hide();
      this.dashboard
        .sendMessageToOwner(this.token, this.owner_id, this.message_with_owner)
        .subscribe(
          (res: any) => {
            this.is_message_sent = false;
            this.message_with_owner = "";

            // this.closeContactOwnerModal.nativeElement.click();

            this.dataService.openSnackBar(
              "Your message has been sent",
              "snack-success"
            );
          },
          (err) => {
            this.modalRef.hide();
          }
        );
    }
  }

  closeGear() {
    this.baseService.baseApi
      .closeGear(this.token, this.user_gear_desc_id)
      .subscribe(
        (res: any) => {
          this.dataService.openSnackBar(
            "Your listing has been deleted",
            "snack-success"
          );

          this.router.navigate(["profile"]);
        },
        (err) => {
          this.dataService.openSnackBar(err, "snack-error");
        }
      );
  }

  deleteItem() {
    this.dashboard.deleteItem(this.token, this.user_gear_desc_id).subscribe(
      (res: any) => {
        this.dataService.openSnackBar(
          "Your listing has been deleted",
          "snack-success"
        );

        this.router.navigate(["profile"]);
      },
      (err) => {
        this.dataService.openSnackBar(err, "snack-error");
      }
    );
  }

  checkForOverlap() {
    let momentFrom = moment(this.from_date);
    let momentTo = moment(this.to_date);
    let minUnavailable = moment(this.unavailable_dates[0]);
    let maxUnavailable = moment(
      this.unavailable_dates[this.unavailable_dates.length - 1]
    );
    let dataToSend = {
      user_gear_desc_id: this.gearId,
      date_from: momentFrom.format("YYYY-MM-DD"),
      date_to: momentTo.format("YYYY-MM-DD"),
    };
    this.cart.onDateChangeGetOrderSummary(dataToSend).subscribe((res: any) => {
      if (res.status === 200) {
        this.summaryDetails = res.result;
      } else {
        this.summaryDetails = null;
      }
    });
    for (var m = momentFrom; m.diff(momentTo, "days") <= 0; m.add(1, "days")) {
      for (let i = 0; i < this.unavailable_dates.length; i++) {
        if (
          moment(m.format("YYYY-MM-DD")).isSame(
            moment(this.unavailable_dates[i]),
            "day"
          )
        ) {
          this.disableAddToCart = true;
          return;
        } else {
          this.disableAddToCart = false;
        }
      }
    }
  }
  onDateSelection(initiator, date_selected) {
    if (initiator == "from") {
      this.showPicker = false;
    }

    setTimeout((_) => {
      if (initiator == "from") {
        this.from_date = date_selected.value;
        this.minToDate = moment(this.from_date).add(1, "day");
        let momentFrom = moment(this.from_date);
        let momentTo = moment(this.to_date);

        if (momentFrom.diff(momentTo) >= 0) {
          this.to_date = date_selected.value;
        }
        this.checkForOverlap();
      } else {
        this.to_date = date_selected.value;
        this.checkForOverlap();
      }

      this.minForReturn = new Date(
        moment(date_selected.value).format("YYYY-MM-DD")
      );
      this.showPicker = true;
    }, 10);
  }
}
