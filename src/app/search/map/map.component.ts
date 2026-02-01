import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Subject } from "rxjs";
import { Subscription } from "rxjs";
import { SearchService } from "../../services/search.service";
import { GeolocationService } from "../../services/geolocation.service";
import LatLngBounds = google.maps.LatLngBounds;
import { AppService } from "../../app.service";
import { AgmMap } from "@agm/core";

import { environment } from "environments/environment";

@Component({
  selector: "kit-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"],
})
export class MapComponent implements OnInit, OnDestroy {
  @Input()
  mapVisible;
  @ViewChild(AgmMap) map: any;
  searchResults$ = this.searchService.searchResults$;

  itemHoveredIndex = -1;
  itemSelectedIndex = -1;

  bounds$ = this.geolocationService.bounds$;
  changedBounds$ = new Subject();

  sub = new Subscription();

  selectedItemLat = 0;
  selectedItemLng = 0;
  bounds;
  isTablet = false;
  resized = false;
  isDesktop = false;

  constructor(
    private searchService: SearchService,
    private geolocationService: GeolocationService,
    private appService: AppService
  ) {
    this.sub.add(
      this.appService.onResize$.subscribe((size) => {
        this.isTablet = size < environment.breakpoints.tablet;
        this.isDesktop = size > environment.breakpoints.desktop;
      })
    );
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.resized = true;
    this.map.triggerResize();
  }
  mapReady(map) {
    map.setOptions({
      zoomControl: "true",
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP,
      },
      zoom: 9,
      streetViewControl: "false",
    });
    map.addListener("dragend", () => {});
  }
  ngOnInit() {
    this.bounds$.subscribe((bounds) => {
      console.log("boundsChange", bounds);
    });
    this.changedBounds$.subscribe((bounds) => {
      console.log("changedBounds$", bounds);
    });
    this.sub.add(
      this.changedBounds$
        .pipe()
        .subscribe(async (bounds: any) => this.processBoundsChange(bounds))
    );

    this.sub.add(
      this.searchService.selectedItem$.subscribe((item) => {
        if (!item) {
          this.itemHoveredIndex = -1;
          return;
        }
        const searchResults = this.searchResults$.getValue();
        this.itemHoveredIndex = searchResults.addresses.findIndex(
          (address) => address.app_user_id === item.app_user_id
        );
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  async processBoundsChange(bounds) {
    if (!this.isBoundsChangeNeedsProcess(bounds)) {
      return;
    }
    await this.geolocationService.boundsChanged(bounds);
    let hideLoader = false;
    if (this.mapVisible && this.isTablet) {
      hideLoader = true;
    }
    this.searchService.callNormalSearch(hideLoader);
  }

  boundsChange($event) {
    this.bounds = $event;
  }

  idle() {
    this.changedBounds$.next(this.bounds);
  }

  onMouseOver(i) {
    this.itemHoveredIndex = i;
    this.searchService.selectedAddressIndex$.next(i);
  }

  onMouseOut() {
    this.itemHoveredIndex = -1;
    this.searchService.selectedAddressIndex$.next(-1);
  }

  onSelectItem(item, i) {
    this.itemSelectedIndex = i;
    this.selectedItemLat = +item.lat;
    this.selectedItemLng = +item.lng;
  }

  getIcon(i) {
    return i === this.itemHoveredIndex
      ? "../../assets/images/mapIcons/noun_speech-bubble_70004-50b.png"
      : "../../assets/images/mapIcons/noun_speech-bubble_70004-50_1g.png";
  }

  getMarkerZIndex(i) {
    if (i === this.itemSelectedIndex) {
      return 1;
    }
    if (i === this.itemHoveredIndex) {
      return 1000;
    }
    return i + 2;
  }

  dropItemsSelection() {
    this.itemSelectedIndex = -1;
    this.selectedItemLat = 0;
    this.selectedItemLng = 0;
  }

  isInfoWindowOpen(i) {
    return this.itemSelectedIndex === i;
  }

  isBoundsChangeNeedsProcess(bounds: LatLngBounds) {
    if (this.resized) {
      this.resized = false;
      return false;
    }
    return !bounds.contains({
      lat: this.selectedItemLat,
      lng: this.selectedItemLng,
    });
  }

  getLabelText(address) {
    let text = `$${address.gears[0].per_day_cost_aud_inc_gst}`;
    if (address.gears.length > 1) {
      text = `${address.gears.length} items`;
    }
    return text;
  }

  calculateMarker(marker, count: number) {
    let num = 0;
    marker.forEach((mk) => {
      const text = mk.getLabel().text;
      if (text.includes("$")) {
        num++;
      } else if (text.includes("items")) {
        num += +text.replace("items", "");
      }
    });
    return {
      text: num,
      index: 0,
    };
  }
}
