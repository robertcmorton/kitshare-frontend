import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  HostListener,
  ViewChild,
} from "@angular/core";
import { GlobalService } from "../../services/global.service";
import { AuthService } from "../../services/auth.service";
import { SearchService } from "../../services/search.service";
import { CartService } from "../../services/cart.service";
import { DashboardService } from "../../services/dashboard.service";
import { MessageService } from "../../services/message.service";

import { DOCUMENT } from "@angular/common";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})

/**
 * contain header component functionality
 */
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild("insideElement", { static: true }) insideElement;

  openAllCategories = false;
  is_search_location_available: boolean = false;
  header_location_search_array: String[] = [];
  search2: string = "";
  no_of_cart_items: number = 0;

  header_cat_list_array: Array<object> = [];
  search: string;
  cat_type: string;
  navIsFixed: boolean;
  cat_id: any = "";
  sub_cat_id: any = "";
  address: string = "";
  user_profile_picture_link: string = "";

  no_of_unread_messages: number;

  private routeSubscriber: any;
  public navMenuClass: any = [];
  public navMenuClassTwo: any = [];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    public global: GlobalService,
    public auth: AuthService,
    public router: Router,
    public route: ActivatedRoute,
    public searchService: SearchService,
    public cartService: CartService, // private fb: FormBuilder
    private dashboard: DashboardService,
    private messageService: MessageService
  ) {
    this.getAllCateWithSubcat();

    this.auth.checkLoggedIn();
    this.routeSubscriber = this.router.events.subscribe(() => {
      this.navMenuClass[0] = false;
      this.navMenuClass[1] = false;
      this.navMenuClassTwo[0] = false;
      this.navMenuClassTwo[1] = false;
    });

    this.cat_type = "";
    this.search = "";

    this.cartService.myCart$.subscribe((res: any) => {
      this.no_of_cart_items = res;
    });

    this.dashboard.myProfilePics$.subscribe((res: any) => {
      this.user_profile_picture_link = res;
    });

    if (this.auth.checkLoggedIn()) {
      this.dashboard
        .userInfoForProfile(this.auth.userData.auth_token)
        .subscribe(
          (res: any) => {
            let result = res;
            this.dashboard.getProfileImage(
              result.result[0].user_profile_picture_link
            );
          },
          (err) => {
            debugger;
          }
        );

      this.cartService
        .getCartItems(this.auth.userData.auth_token)
        .subscribe((res: any) => {
          let response = res;
          if (response.result.cart.length > 0) {
            this.cartService.noOfCart(response.result.cart.length);
          } else {
            this.cartService.noOfCart(0);
          }
        });
    }

    this.no_of_unread_messages = 0;
  }

  displayFn(user: any) {
    if (user) {
      return user.name;
    }
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    if (
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop > 100
    ) {
      this.navIsFixed = true;
    } else if (
      (this.navIsFixed && window.pageYOffset) ||
      document.documentElement.scrollTop ||
      document.body.scrollTop < 10
    ) {
      this.navIsFixed = false;
    }
  }

  scrollToTop() {
    (function smoothscroll() {
      var currentScroll =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - currentScroll / 5);
      }
    })();
  }

  ngOnInit() {
    this.getUnreadMessages();
  }

  toggleNavMenu(index: number) {
    this.navMenuClass[index] = !this.navMenuClass[index];
  }
  toggleNavMenuTwo(index: number) {
    this.navMenuClassTwo[index] = !this.navMenuClassTwo[index];
  }
  logout() {
    this.auth.logout();
  }
  ngOnDestroy() {
    this.routeSubscriber.unsubscribe();
  }

  goToSearchPage(
    search,
    cat_type = "",
    cat_id = "",
    sub_cat_id = "",
    cat_sub_cat_name = "CATEGORY"
  ) {
    this.openAllCategories = false;
    let routString = this.router.url;
    let doesContainSearch = routString.includes("search");

    if (!doesContainSearch) {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          searchparam: this.search,
          cat_type: cat_type,
          cat_id: cat_id,
          sub_cat_id: sub_cat_id,
          address: this.address,
          cat_sub_cat_name: cat_sub_cat_name,
        },
      };
      this.router.navigate(["search"], navigationExtras);
    } else {
      let search_param = {
        search: this.search,
        cat: cat_type,
        cat_id: cat_id,
        sub_cat_id: sub_cat_id,
        address: this.address,
        cat_sub_cat_name: cat_sub_cat_name,
      };
      this.searchService.searchMethod(search_param);
      this.router.navigate(["search"]);
    }
  }

  chooseCat(cat_type) {
    // console.log(cat_type);
    this.cat_type = cat_type;
    this.goToSearchPage("", "", "", "");
  }

  goToCart() {
    this.router.navigate(["cart"]);
  }

  onSearchKey(event: any) {
    if (event.target.value == "") {
      this.address = "";
      this.is_search_location_available = true;
      this.header_location_search_array = [];
    } else {
      this.searchService
        .getGoogleAddress(event.target.value)
        .subscribe((result: any) => {
          if (result.result.length > 0) {
            this.is_search_location_available = true;
            this.header_location_search_array = result.result;
          } else {
            this.is_search_location_available = false;
            this.header_location_search_array = [];
          }
        });
    }
  }

  onClickLocationSearch(location) {
    this.search2 = location;
    this.address = this.search2;
    this.is_search_location_available = false;
    this.header_location_search_array = [];
  }

  getAllCateWithSubcat() {
    this.searchService.categories$.subscribe((categories) => {
      this.header_cat_list_array = categories;
    });
  }

  chooseHeaderCat(gear_category_id, name = "") {
    this.cat_id = gear_category_id;
    this.goToSearchPage("", "", gear_category_id, "", name);
  }

  chooseHeaderSubCat(sub_cat_id, name = "") {
    this.sub_cat_id = sub_cat_id;
    this.goToSearchPage("", "", "", sub_cat_id, name);
  }

  toggleClass(header_cat) {
    header_cat.open = !header_cat.open;
    return false;
  }

  goToMessage() {
    this.router.navigate(["/rentals/dashboard", { from: "header" }]);
    this.no_of_unread_messages = 0;
  }

  getUnreadMessages() {
    if (this.auth.userData.hasOwnProperty("auth_token")) {
      this.messageService
        .getUnreadMessages(this.auth.userData.auth_token)
        .subscribe((res: any) => {
          this.no_of_unread_messages = res.result;
        });
    }
  }
  toggleAllCategoryMenu() {
    this.openAllCategories = !this.openAllCategories;
  }
  @HostListener("document:click", ["$event.target"])
  onClick(targetElement) {
    const clickedInside =
      this.insideElement.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.openAllCategories = false;
    }
  }
}
