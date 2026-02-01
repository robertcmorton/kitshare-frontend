import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { SearchService } from "../../../services/search.service";
import { GeolocationService } from "../../../services/geolocation.service";
import { Observable, Subscription } from "rxjs";
import { AppService } from "app/app.service";
import { environment } from "environments/environment";

@Component({
  selector: "kit-location-search",
  templateUrl: "./location-search.component.html",
  styleUrls: ["./location-search.component.scss"],
})
export class LocationSearchComponent implements OnInit, OnDestroy {
  is_search_location_available;
  @Output() locationSelect: EventEmitter<any> = new EventEmitter();
  @Output() locationAdded: EventEmitter<any> = new EventEmitter();
  @ViewChild("mapAutocomplete", { static: true }) mapAutocomplete: any;

  autocomplete;

  options = {
    types: ["(regions)"],
    componentRestrictions: { country: "AU" },
  };

  sub = new Subscription();
  mapVisible = false;
  address$ = this.geoLocationService.address$;

  constructor(
    private searchService: SearchService,
    private geoLocationService: GeolocationService,
    private appService: AppService
  ) {}

  async ngOnInit() {
    this.autocomplete = new google.maps.places.Autocomplete(
      this.mapAutocomplete.nativeElement,
      this.options
    );
    this.sub.add(
      this.appService.onResize$.subscribe(
        (size) => (this.mapVisible = size >= environment.breakpoints.tablet)
      )
    );
    this.sub.add(
      this.searchService.resetSearch$.subscribe(() => this.resetLocation())
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  async handleAddressChange(event) {
    setTimeout(() => {
      this.geoLocationService.addressChanged(
        event.target.value,
        !this.mapVisible
      );
      this.locationAdded.emit(event.target.value);
    }, 10);
  }

  resetLocation() {
    setTimeout(() => this.geoLocationService.addressChanged("Australia"), 10);
    this.is_search_location_available = false;
  }
}
