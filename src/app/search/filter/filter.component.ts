import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SearchParams, SearchService } from '../../services/search.service';

@Component({
  selector: 'kit-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit, OnDestroy {

  @Input()
  filterClass;

  @Input()
  topMenu = false;

  currentLimit;

  currentSortOptionIndex;

  availableLimits = [24, 48, 72];

  sortOptions = [
    { name: 'Default', value: null },
    { name: 'Lowest price on top', value: 'ASC' },
    { name: 'Highest price on top', value: 'DESC' },
  ];

  brands$ = this.searchService.brands$;
  gearTypes$ = this.searchService.gearTypes$;
  ownerTypes$ = this.searchService.ownerTypes$;

  fieldNames = {
    brands: { id: 'manufacturer_id', name: 'manufacturer_name', searchParamName: 'manufacturer_id' },
    gear_type: { id: 'ks_gear_type_id', name: 'ks_gear_type_name', searchParamName: 'ks_gear_type_id' },
    owner_type: { id: 'ks_renter_type_id', name: 'ks_renter_type', searchParamName: 'owner_type_id' },
  };

  sub = new Subscription();

  triggerWidths = [400, 450, 550, 650, 840];

  currentWidth;

  constructor(private searchService: SearchService) { }

  onResize(event) {
    this.currentWidth = event.target.outerWidth;
  }

  ngOnInit() {
    this.sub.add(this.searchService.searchParams$.subscribe(params => this.processSearchParamsChange(params)));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  processSearchParamsChange(params: SearchParams) {
    this.currentLimit = params.limit;
    const index = this.sortOptions.findIndex(option => option.value === params.order_by);
    this.currentSortOptionIndex = index !== -1 ? index : 0;
  }

  limitChanged(limit) {
    this.searchService.setSearchParams({ limit });
    this.searchService.callNormalSearch();
  }

  sortOrderChanged(order_by) {
    const params = order_by ? { order_by, order_by_fld: 'price' } : { order_by };
    this.searchService.setSearchParams(params);
    this.searchService.callNormalSearch();
  }

  getSortOptionName(option) {
    return option.name;
  }

  getSortOptionValue(option) {
    return option.value;
  }

  getLimit(limit) {
    return limit;
  }

}
