import { GlobalService } from "../../services/global.service";
import { Component, OnInit } from "@angular/core";

import { Router } from "@angular/router";
import { SearchService } from "../../services/search.service";
import { LandingService } from "../../services/landing.service";
import { GeolocationService } from "../../services/geolocation.service";
import { Subscription } from "rxjs";
import { AppService } from "app/app.service";
import { environment } from "environments/environment";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
})

/**
 * contain footer component functionality
 */
export class FooterComponent implements OnInit {
  // fb: String = '';
  // twitt: String = '';
  // insta: String = '';

  topCities = ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"];

  topCategories = [
    { name: "Cameras", id: "1" },
    { name: "Lenses", id: "12" },
    { name: "Lighting", id: "22" },
    { name: "Audio Equipment", id: "37" },
    { name: "Virtual Reality and New Technology", id: "60" },
    { name: "Drone and Vehicles", id: "115" },
    { name: "Camera Accessories", id: "120" },
    { name: "Camera Support, Tripods and Rigs", id: "63" },
    { name: "Creative Spaces", id: "162" },
    { name: "Other Categories", id: null },
  ];
  sub = new Subscription();
  mapVisible = false;
  /**
   * manage dependency injcection of services
   * @param global GlobalService
   */
  constructor(
    public global: GlobalService,
    public router: Router,
    public searchService: SearchService,
    public landingService: LandingService,
    private geolocationService: GeolocationService,
    private appService: AppService
  ) {}

  ngOnInit() {
    this.sub.add(
      this.appService.onResize$.subscribe(
        (size) => (this.mapVisible = size >= environment.breakpoints.tablet)
      )
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  /**
   * Got to  serach page with address from the footer link
   * @param address
   */

  async goToSearchPageWithAddress(address) {
    await this.geolocationService.addressChanged(address, !this.mapVisible);
    if (!this.router.url.includes("search")) {
      this.router.navigate(["search"]);
    } else {
      window.scroll(0, 0);
      this.searchService.callNormalSearch();
    }
  }

  goToSearchPage(gear_category_id) {
    this.searchService.setSearchParams({ gear_category_id });
    this.router.navigate(["search"]);
  }

  // getSocialLinks() {
  //   this.landingService.getSocialLinks().map(map => map.json())
  //     .subscribe((res: any) => {

  //       this.fb = res.result.fb_link;
  //       this.twitt = res.result.twitter_link;
  //       this.insta = res.result.instagram_link;
  //     });
  // }
}
