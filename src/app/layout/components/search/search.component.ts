import { environment } from "./../../../../environments/environment";
import {
  Component,
  Input,
  OnInit,
  HostListener,
  ViewChild,
} from "@angular/core";
import { SearchService } from "./../../../services/search.service";
import { NavigationEnd, Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "kit-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class KitSearchComponent implements OnInit {
  isSearchOpen: boolean = false;
  showNestedMenu: boolean = false;
  search: any;
  openAllCategories: any;
  desktop: number = environment.breakpoints.desktop;
  tablet: number = environment.breakpoints.tablet;
  key_word = null;

  @Input() currentSize: any;
  @ViewChild("insideElement", { static: false }) insideElement;
  constructor(private searchService: SearchService, private router: Router) {}

  private observeRouterEvents() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showNestedMenu = false;
      }
    });
  }

  ngOnInit() {
    this.observeRouterEvents();

    this.searchService.searchTriggered$.subscribe((res) => {
      if (res) {
        this.closeSearch();
      }
    });
  }
  @HostListener("document:click", ["$event"])
  onGlobalClick(event): void {
    let el = event.target.localName;
    if (this.showNestedMenu && el != "li" && el != "i" && el != "mat-icon") {
      this.showNestedMenu = false;
    }
  }
  openSearch() {
    this.isSearchOpen = true;
  }

  closeSearch() {
    this.isSearchOpen = false;
    this.showNestedMenu = false;
  }

  toggleNestedMenu() {
    this.showNestedMenu = !this.showNestedMenu;
  }

  onLocationSelect(address) {
    this.searchService.setSearchParams({ address });
  }
  closeSearchOnLocationtext() {
    if (this.currentSize <= this.desktop && this.currentSize > this.tablet) {
      setTimeout(() => this.closeSearch(), 10);
    }
  }

  onCategorySelected(event) {
    const gear_category_id = event?.gear_category_id || null;
    const sub_category_id = event?.sub_category_id || null;
    this.searchService.setSearchParams({ gear_category_id, sub_category_id });
    this.goToSearchPage();
  }

  searchTextChanged(event) {
    const key_word = event.target.value;
    this.key_word = key_word;
    this.searchService.setSearchParams({ key_word });
  }

  goToSearchPage() {
    this.closeSearch();
    this.openAllCategories = false;
    if (!this.router.url.includes("search")) {
      this.router.navigate(["search"]);
    } else {
      this.searchService.callNormalSearch();
    }
  }

  resetSearchParams() {
    this.key_word = null;
    this.searchService.resetSearchParams();
  }
}
