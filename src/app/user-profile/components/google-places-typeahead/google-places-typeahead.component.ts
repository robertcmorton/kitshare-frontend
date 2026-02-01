import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  ElementRef
} from "@angular/core";
import { GooglePlaceDirective } from "ngx-google-places-autocomplete";
import { Address } from "ngx-google-places-autocomplete/objects/address";
import { KSAddress, Coords } from "../../models/address.model";
import { fromEvent } from "rxjs";
import { pluck } from "rxjs/operators";
import { SaveBarService } from "../../../shared/component/save-bar/save-bar.service";

@Component({
  selector: "kit-google-places-typeahead",
  templateUrl: "./google-places-typeahead.component.html",
  styleUrls: ["./google-places-typeahead.component.scss"]
})
export class GooglePlacesTypeaheadComponent implements OnInit {
  @ViewChild("placesRef", { static: true }) placesRef: GooglePlaceDirective;
  @ViewChild("address", { static: true }) address: ElementRef;
  @ViewChild("floor", { static: true }) floor: ElementRef;

  @Output() placeSelect: EventEmitter<KSAddress> = new EventEmitter();
  new_address:any;
  displayLabel = false;
  options = {
    componentRestrictions: { country: "AU" }
  };
  selectedAddress: any;
  addressState = {
    status: true,
    key: []
  };
  required_fields = [
    "street_address_line2",
    "route",
    "suburb_name",
    "ks_state_name",
    "ks_country_name",
    "lat",
    "lng"
  ];
  screenname_map = {
    street_address_line2: "Street Number",
    route: "Route",
    suburb_name: "Town",
    ks_state_name: "State",
    ks_country_name: "Country"
  };
  isValid = {
    status: true,
    key: []
  };
  floorNumber:any;

  constructor(private saveBar: SaveBarService,) {}

  ngOnInit() {
    this.observeSaveBarStream();
  }

  observeSaveBarStream() {
    this.saveBar.SAVEBAR_RESULT_ACTION$.subscribe((res: any) => {
      // debugger;
      if(res.action || res.status) {
        // debugger;
        this.address.nativeElement.value = null;
        this.floor.nativeElement.value = null;
      }

    });
  }


  private extractAddEntity(entity, addressArr = this.selectedAddress): string {
    let addr_component = "";
    addressArr.map(addr => {
      if (addr.types && addr.types.includes(entity)) {
        addr_component = addr.long_name ? addr.long_name : addr.short_name;
      }
    });
    return addr_component;
  }

  private processAddress(address): KSAddress {
    this.selectedAddress = address.address_components;
    let coords: Coords = {
      lat: address.geometry.location.lat(),
      lng: address.geometry.location.lng()
    };

    let address_model = [
      "street_number",
      "route",
      "locality",
      "administrative_area_level_1",
      "country",
      "postal_code",
      "administrative_area_level_2"
    ];

    let addressComponentsArray = address_model.map(item => {
      return this.extractAddEntity(item);
    });
    const new_address = new KSAddress(
      addressComponentsArray[0],
      addressComponentsArray[1],
      addressComponentsArray[2],
      addressComponentsArray[3],
      addressComponentsArray[4],
      +addressComponentsArray[5],
      coords.lat,
      coords.lng,
      addressComponentsArray[6]
    );
    return new_address;
  }

  private isAddressValid(new_address) {
    for (let prop in new_address) {
      if (this.required_fields.includes(prop)) {
        if (new_address[prop] === "") {
          this.isValid["status"] = false;
          this.isValid["key"].push(this.screenname_map[prop]);
        }
      }
    }
    return this.isValid;
  }

  public handleAddressChange(address: Address) {
    var a = this.address.nativeElement.value.split(' ');
    if(a[0].includes('/') ) {
      var floor = a[0].split('/');
      this.floor.nativeElement.value = floor[0];
      this.displayLabel = true;
    }


    // Do some stuff
    this.new_address = this.processAddress(address);
    let addressWithStreet = {...this.new_address, street_address_line1: this.floor.nativeElement.value};

    this.addressState = this.isAddressValid(this.new_address);

    if (this.addressState.status) {
      // debugger;
      this.placeSelect.emit(addressWithStreet);
    }

  }

  ngAfterViewInit(): void {
    const addressFocus$ = fromEvent(this.address.nativeElement, 'focus');
    const addressInput$ = fromEvent(this.address.nativeElement, 'input');

    addressFocus$.subscribe(res => {
      this.addressState.status = true;
    });

    addressInput$.subscribe(res => {
      this.floor.nativeElement.value = null;
      this.displayLabel = false;
    });
  }

  submitAddress() {
    if (this.addressState.status) {
      this.address.nativeElement.value = null;
      this.new_address = {...this.new_address, street_address_line1: this.floorNumber};
      this.placeSelect.emit(this.new_address);
    }
  }
}
