import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import {
  SearchParams,
  SearchResult,
  SearchService,
} from "../../services/search.service";
@Component({
  selector: "kit-search-footer",
  templateUrl: "./search-footer.component.html",
  styleUrls: ["./search-footer.component.scss"],
})
export class SearchFooterComponent implements OnInit, OnDestroy {
  sub = new Subscription();

  totalItems;

  itemsPerPage;

  visibleItemsString;

  constructor(private searchService: SearchService) {}

  ngOnInit() {
    this.sub.add(
      this.searchService.searchResults$.subscribe((results) =>
        this.processSearchResultsChange(results)
      )
    );
    this.sub.add(
      this.searchService.searchParams$.subscribe((params) =>
        this.processSearchParamsChange(params)
      )
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  processSearchResultsChange(results: SearchResult) {
    this.totalItems = results.totalItems;
    this.getVisibleItemsString(results);
  }

  processSearchParamsChange(params: SearchParams) {
    this.itemsPerPage = params.limit;
  }

  pageChanged(event) {
    const offset = (event.page - 1) * this.itemsPerPage;
    this.searchService.setSearchParams({ per_page: offset.toString() });
    this.searchService.callNormalSearch();
    window.scrollTo(0, 0);
  }

  getVisibleItemsString(results: SearchResult) {
    const firstItem = +results.offset + 1;
    const lastItem =
      +results.offset + +this.itemsPerPage > +results.totalItems
        ? results.totalItems
        : +results.offset + +this.itemsPerPage;
    this.visibleItemsString = `Showing ${firstItem} - ${lastItem} of ${results.totalItems}`;
    this.totalItems = results.totalItems;
  }
}
