import { NavigationExtras, Router } from "@angular/router";
import { AfterViewInit, Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { CartService } from "../services/cart.service";
import { DashboardService } from "../services/dashboard.service";
import { SearchService } from "../services/search.service";
import { LandingService } from "../services/landing.service";

@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.scss"],
})
export class LandingComponent implements OnInit, AfterViewInit {
  random_products: Array<any>;
  random_users: Array<any>;

  search: string;
  cat_type: string;
  cat_id: any = "";
  address: string = "";

  topCategories = [
    { name: "Cameras", id: "1", icon: "assets/images/icon1.png" },
    { name: "Lenses", id: "12", icon: "assets/images/icon2.png" },
    { name: "Audio", id: "37", icon: "assets/images/icon3.png" },
    { name: "Lighting", id: "22", icon: "assets/images/icon4.png" },
    { name: "Drones", id: "115", icon: "assets/images/icon5.png" },
    { name: "Vr & edge tech", id: "60", icon: "assets/images/icon6.png" },
    { name: "Tripods & Support", id: "63", icon: "assets/images/icon7.png" },
    { name: "Camera Accs", id: "120", icon: "assets/images/icon8.png" },
    { name: "More", id: null, icon: "assets/images/icon9.png" },
  ];

  kitTypes = [
    { name: "Equipment", id: "4", image: "assets/images/alexamini.jpg" },
    {
      name: "Kit/Package",
      id: "2",
      image: "assets/images/705169-d651f5-red_right_wide.jpg",
    },
    {
      name: "Creative Space",
      id: "1",
      image: "assets/images/creativespace.jpg",
    },
  ];

  constructor(
    public auth: AuthService,
    public cart: CartService,
    public dashboard: DashboardService,
    public router: Router,
    public landingservice: LandingService,
    public searchService: SearchService
  ) {}

  ngOnInit() {
    if (this.auth.checkLoggedIn()) {
      this.dashboard
        .userInfoForProfile(this.auth.userData.auth_token)
        .subscribe((res: any) => {
          let result = res;
          this.auth.setUserInfo(result);
          // this.dashboard.getProfileImage(result.result[0].user_profile_picture_link);
        });

      //   this.cart.getCartItems(this.auth.userData.auth_token)
      //   .subscribe((res: any) => {
      //     // let response = res;
      //     let response = res;
      //     if (response.result.cart.length > 0) {
      //       this.cart.noOfCart(response.result.cart.length);
      //     } else {
      //       this.cart.noOfCart(0);
      //     }
      //   });
    }

    // get random users
    this.getRandomUsers();
  }

  ngAfterViewInit() {
    // get random product
    this.getRandomProducts();
  }

  getRandomProducts() {
    this.dashboard.getHomePageRandomProduct().subscribe((res: any) => {
      let result = res;
      this.random_products = result.result;
      // console.log(this.random_products);
    });
  }

  getRandomUsers() {
    this.landingservice.getHomePageUsers().subscribe((res: any) => {
      let result = res;
      this.random_users = result.result;
      this.random_users.forEach((elem) => {
        if (elem.rating == null) {
          elem.rating = 0;
        }
      });
    });
  }

  gotoUserPage(app_user_id) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: app_user_id,
      },
    };

    /* '/profile', {id : image.app_user_id} ]" */
    this.router.navigate(["profile"], navigationExtras);
  }

  /**
   * Cameras 1
   * Lenses 12
   * Lighting 24
   * Audio Equipment 39
   * Virtual Reality and New Technology 62
   * Drone and Vehicles 116
   * Camera Accessories 121
   * Camera Support, Tripods and Rigs 65
   * Creative Spaces 162
   *
   */

  goToSearchPage(gear_category_id) {
    this.searchService.setSearchParams({ gear_category_id });
    this.searchService.callNormalSearch();
  }

  /**
   *  creative space : 1
   *  kit : 2
   *  item : 4
   *
   * @param ks_gear_type_id
   */

  goToSearchPageWithKitType(ks_gear_type_id) {
    this.searchService.setSearchParams({ ks_gear_type_id });
    this.searchService.callNormalSearch();
  }
}
