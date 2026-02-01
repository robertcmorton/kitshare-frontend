import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SearchParams, SearchService } from '../../../services/search.service';

@Component({
  selector: 'kit-multiple-select',
  templateUrl: './multiple-select.component.html',
  styleUrls: ['./multiple-select.component.scss'],
})
export class MultipleSelectComponent implements OnInit, OnDestroy {

  sub = new Subscription();

  @Input()
  items;

  @Input()
  searchParamName: string;

  @Input()
  itemIdField: string;

  @Input()
  itemNameField: string;

  @Input()
  displayString: string;

  @Input()
  multiple = false;

  selectedItems = {};

  changed = false;

  constructor(private searchService: SearchService) { }

  ngOnInit() {
    this.fillItems();
    this.sub.add(this.searchService.searchParams$.subscribe(params => this.processSearchParamsChange(params)));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  fillItems() {
    this.items.forEach(item => this.selectedItems[item[this.itemIdField]] = false);
    const searchParams: SearchParams = this.searchService.searchParams$.getValue();
    if (searchParams[this.searchParamName] && searchParams[this.searchParamName].length) {
      searchParams[this.searchParamName].split(',').forEach(id => this.selectedItems[id] = true);
    }
  }

  processSearchParamsChange(searchParams: SearchParams) {
    Object.keys(this.selectedItems).forEach(id => this.selectedItems[id] = false);
    if (searchParams[this.searchParamName] && searchParams[this.searchParamName].length) {
      searchParams[this.searchParamName].split(',').forEach(id => this.selectedItems[id] = true);
    }
  }

  onValueChange(value) {
    const itemIds = Object.keys(value).filter(id => value[id]);
    const idsString = itemIds.length ? itemIds.join(',') : null;
    this.searchService.setSearchParams({ [this.searchParamName]: idsString });
    this.searchService.callNormalSearch();
  }

  getItemId(item) {
    return item[this.itemIdField];
  }

  getItemName(item) {
    return item[this.itemNameField];
  }

  getDisplayString() {
    const selectedItemsIds = Object.keys(this.selectedItems).filter(id => this.selectedItems[id]);
    if (!selectedItemsIds.length) {
      return this.displayString;
    } else if (selectedItemsIds.length === 1) {
      const selectedItem = this.items.find(item => item[this.itemIdField] === selectedItemsIds[0]);
      return selectedItem && selectedItem[this.itemNameField] || this.displayString;
    } else {
      return `${this.displayString}: ${selectedItemsIds.length}`;
    }
  }

  isInUse() {
    const selectedItemsIds = Object.keys(this.selectedItems).filter(id => this.selectedItems[id]);
    return !!selectedItemsIds.length;
  }

}
