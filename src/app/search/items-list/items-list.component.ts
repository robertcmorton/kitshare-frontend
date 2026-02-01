import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { DataService } from "app/shared/data/data.service";
import { Subscription } from "rxjs";
import { SearchService } from "../../services/search.service";

@Component({
  selector: "kit-items-list",
  templateUrl: "./items-list.component.html",
  styleUrls: ["./items-list.component.scss"],
})
export class ItemsListComponent implements OnInit, OnDestroy {
  @Input()
  mapVisible;

  sub = new Subscription();

  items;

  addresses;

  error = false;

  itemHoveredIndexes = [];

  constructor(
    private searchService: SearchService,
    public dataService: DataService
  ) {}

  ngOnInit() {
    if (!this.mapVisible) {
      this.searchService.callNormalSearch(true);
    }
    this.sub.add(
      this.searchService.searchResults$.subscribe((results) => {
        this.items = results.items;
        this.addresses = results.addresses;
        this.error = results.error;
      })
    );

    this.sub.add(
      this.searchService.selectedAddressIndex$.subscribe((index) => {
        this.itemHoveredIndexes = [];
        if (index < 0) {
          return;
        }
        const address = this.addresses[index];
        this.items.forEach((item, i) =>
          item.app_user_id === address.app_user_id
            ? this.itemHoveredIndexes.push(i)
            : {}
        );
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  hover(i) {
    this.searchService.selectedItem$.next(this.items[i]);
  }

  hoverOut() {
    this.searchService.selectedItem$.next(null);
  }

  isHover(i) {
    return this.itemHoveredIndexes.includes(i);
  }

  getBackgroundStyle(item) {
    return {
      "background-image": `url('${item.gear_display_image}')`,
      "background-repeat": "no-repeat",
      "background-position": "center",
      "background-size": "cover",
    };
  }

  getListStyle(filterHeight) {
    return { "padding-top": `${filterHeight}px` };
  }

  getContainerStyle(listWidth, filterHeight) {
    return { width: `${listWidth}px`, "margin-top": `-${filterHeight}px` };
  }
}
