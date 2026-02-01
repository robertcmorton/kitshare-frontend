import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { BaseComponent } from "../../base.componant";
import { BaseService } from "./../../services/base.service";
import { AuthService } from "./../../services/auth.service";

import {
  getPrivateGearDetails,
  RESULT_ERROR,
  SITE_BASE_URL,
} from "./../../shared/constant";
import { GearDetails } from "./../../shared/models/gear-details.model";

import { CartService } from "../../services/cart.service";
import { SearchService } from "../../services/search.service";

import * as moment from "moment/moment";

@Component({
  selector: "app-private-gear-details",
  templateUrl: "./private-gear-details.component.html",
  styleUrls: ["./private-gear-details.component.css"],
})
export class PrivateGearDetailsComponent
  extends BaseComponent
  implements OnInit
{
  public todayDate: any = new Date();

  from_date = new Date();
  to_date = new Date();
  has_item_in_cart: boolean;

  @ViewChild("gmap", { static: true }) gmapElement: any;
  map: google.maps.Map;
  marker: google.maps.Marker;

  lat_long_array: Array<object>;

  is_my_gear: boolean = true;

  protected gearId: any;
  public gearDetailsAvgRating: Array<number> = [];

  public gearDetails: GearDetails = new GearDetails();

  constructor(
    public baseService: BaseService,
    private route: ActivatedRoute,
    private router: Router,
    private cart: CartService,
    private search: SearchService,
    private auth: AuthService
  ) {
    super(baseService, true);
    this.baseService.global.showLoader();
    this.route.params.subscribe((params) => {
      this.gearId = params.id ? params.id : 0;
    });
    this.lat_long_array = [];
    this.has_item_in_cart = false;
  }

  ngOnInit() {
    this.baseService.baseApi.getPrivateGearDetails(this.gearId);
    this.getCart();
  }

  handleApiResponse(data: any) {
    if (data.resulttype === getPrivateGearDetails) {
      this.gearDetails = data.result.result;

      this.is_my_gear = true;

      this.gearDetails.gear_description_1 =
        this.gearDetails.gear_description_1.replace(/\\/g, "");

      if (this.gearDetails.images.length == 0) {
        let default_image_link =
          SITE_BASE_URL + "assets/images/default_product.jpg";

        let display_image_object = {
          create_date: "",
          create_user: "",
          gear_display_image: default_image_link,
          gear_display_seq_id: null,
          google_360_image_link: null,
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
    }

    if (data.resulttype === RESULT_ERROR) {
      this.baseService.global.hideLoader();
      this.baseService.global.loadNoDataFound("No Gear Found!");
    }
  }

  getAddress() {
    let addaress_from_google = [];
    let addaress_string = this.gearDetails.address[0].street_address_line1;
    let price = this.gearDetails.address[0].per_day_cost_aud_inc_gst;
    //console.log('Address...');
    //console.log(addaress_string);

    this.search.getGoogleAddress(addaress_string).subscribe((response: any) => {
      // let response = res;
      addaress_from_google = response.result;

      for (let add_arr = 0; add_arr < addaress_from_google.length; add_arr++) {
        //console.log(addaress_from_google);

        this.search
          .generateLatlong(addaress_from_google[add_arr])
          .subscribe((resPonse: any) => {
            //console.log(res);
            // let resPonse = res;
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

              //console.log('Inside page ...');
              //console.log(this.lat_long_array);
            }
          });
      }

      setTimeout(() => {
        this.generateGoogleMap();
      }, 2000);
    });
  }

  generateGoogleMap() {
    var bounds = new google.maps.LatLngBounds();
    var mapProp = {
      maxZoom: 8,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

    /*var markers = [
      {lat: -31.4897918, lng: 118.2388428, name: "Insignia Way, Merredin WA 6415, Australia"},
      {lat: -33.91648929999999, lng: 150.8922013, name: "Insignia St, Sadleir NSW 2168, Australia"},
      {lat: -37.5496072, lng: 143.8090646, name: "Insignia Blvd, Alfredton VIC 3350, Australia"},
      {lat: -34.6686722, lng: 138.6622227, name: "Insignia Ave, Andrews Farm SA 5114, Australia"},
      {lat: -38.0205567, lng: 145.3144852, name: "Insignia Cres, Berwick VIC 3806, Australia"},

    ];*/

    var markers: any = this.lat_long_array;

    //console.log('inside generateGoogleMap function..');
    //console.log(markers);

    var markerIcon = {
      // url: 'https://image.flaticon.com/icons/svg/252/252025.svg',
      url: "https://www.kitshare.com.au/assets/images/mapIcons/marker-icon.png",
      scaledSize: new google.maps.Size(50, 50),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(32, 65),
    };

    // Loop through our array of markers & place each one on the map
    for (let i = 0; i < markers.length; i++) {
      let price: any = parseFloat(markers[i].price).toFixed(2);
      var position = new google.maps.LatLng(markers[i].lat, markers[i].lng);
      bounds.extend(position);
      this.marker = new google.maps.Marker({
        position: position,
        map: this.map,
        icon: markerIcon,
        //labelContent: markerLabel,
        label: {
          text: "$" + price,
          color: "rgb(0, 0, 0)",
          fontSize: "13px",
          fontWeight: "bold",
        },
        title: markers[i].name,
      });

      // Allow each marker to have an info window
      /*google.maps.event.addListener(marker, 'click', (function(marker, i) {
          return function() {
              infoWindow.setContent(infoWindowContent[i][0]);
              infoWindow.open(map, marker);
          }
      })(marker, i));*/

      // Automatically center the map fitting all markers on the screen
      this.map.fitBounds(bounds);
    }
  }

  addtoCart() {
    let momentFromDate = moment(this.from_date).format("YYYY-MM-DD");
    let momentToDate = moment(this.to_date).format("YYYY-MM-DD");

    let item_obj = {
      user_gear_desc_id: this.gearId,
      date_from: momentFromDate,
      date_to: momentToDate,
      token: this.auth.userData.auth_token,
    };
    this.cart.addToCart(item_obj).subscribe((res: any) => {
      this.getCart();
    });
  }

  getCart() {
    this.cart
      .getCartItems(this.auth.userData.auth_token)
      .subscribe((res: any) => {
        //console.log(res);
        let cart_array_res = res;
        let cart_array = cart_array_res.result.cart;
        if (cart_array.length > 0) {
          for (let a = 0; a < cart_array.length; a++) {
            if (this.gearId == cart_array[a].user_gear_desc_id) {
              this.has_item_in_cart = true;
            }
          }
        }
        //console.log(this.has_item_in_cart);
      });
  }

  goToEditPage(id: any) {
    this.router.navigate(["/gear/edit-gear/" + id]);
  }
}
