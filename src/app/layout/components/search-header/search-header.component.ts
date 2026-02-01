import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { SearchService } from "../../../services/search.service";

@Component({
  selector: "app-search-header",
  templateUrl: "./search-header.component.html",
  styleUrls: ["./search-header.component.scss"],
})
export class KitSearchHeaderComponent implements OnInit {
  categories: Array<any>;
  showNestedMenu: boolean = false;
  search: any;
  address: any = "";

  constructor(private searchService: SearchService, private router: Router) {}

  private observeRouterEvents() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showNestedMenu = false;
      }
    });
  }

  ngOnInit() {
    this.fetchCategories();
    this.observeRouterEvents();
  }

  fetchCategories() {
    // this.searchService.getAllCategoryWithSubcategory().subscribe((res: any) => {
    //   let result = res;
    //   this.categories = result.result;
    // });
  }

  toggleNestedMenu() {
    this.showNestedMenu = !this.showNestedMenu;
  }

  onLocationSelect(location) {
    this.address = location;
  }

  goToSearchPage(
    search,
    cat_type = "",
    cat_id = "",
    sub_cat_id = "",
    cat_sub_cat_name = "CATEGORY"
  ) {
    // this.closeSearch();
    // // console.log(this.router.url);
    // this.openAllCategories = false;
    // let routString = this.router.url;
    // let doesContainSearch = routString.includes("search");
    // // console.log(doesContainSearch);
    // // console.log(cat_id);
    // // console.log(sub_cat_id);
    //
    // // If not in search page, then pass the parameter in URL
    // // else pass via service subscription
    // if (!doesContainSearch) {
    //
    //   let navigationExtras: NavigationExtras = {
    //     queryParams: {
    //       searchparam: this.search,
    //       cat_type: cat_type,
    //       cat_id: cat_id,
    //       sub_cat_id: sub_cat_id,
    //       address: this.address,
    //       cat_sub_cat_name: cat_sub_cat_name,
    //     },
    //   };
    //   // this.searchNewService.searchParams$.next({
    //   //   key_word: this.search,
    //   //   kit_type: cat_type,
    //   //   cat_id: cat_id,
    //   //   sub_cat_id: sub_cat_id,
    //   //   address: this.address,
    //   //   cat_sub_cat_name: cat_sub_cat_name
    //   // });
    //   // console.log('Header search button clicked..');
    //   this.router.navigate(['search'], navigationExtras);
    //
    // } else {
    //
    //   let search_param = {
    //     search: this.search,
    //     cat: cat_type,
    //     cat_id: cat_id,
    //     sub_cat_id: sub_cat_id,
    //     address: this.address,
    //     cat_sub_cat_name: cat_sub_cat_name,
    //   };
    //   this.searchService.searchMethod(search_param);
    //   this.router.navigate(['search']);
    //
    // }
  }

  // new: http://localhost:4200/search?searchparam=camera&cat_type=&cat_id=&sub_cat_id=&address=&cat_sub_cat_name=CATEGORY
  // old: http://localhost:4200/search?searchparam=camera&cat_type=&cat_id=&sub_cat_id=&address=&cat_sub_cat_name=CATEGORY
  // old: http://localhost:4200/search?searchparam=camera&cat_type=&cat_id=&sub_cat_id=&address=Ingleburn%20NSW,%20Australia&cat_sub_cat_name=CATEGORY
}
