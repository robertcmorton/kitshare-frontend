import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { SearchParams, SearchService } from "../../../services/search.service";

@Component({
  selector: "kit-category-select",
  templateUrl: "./category-select.component.html",
  styleUrls: ["./category-select.component.scss"],
})
export class CategorySelectComponent implements OnInit, OnDestroy {
  categories$;

  currentCategory;

  currentSubCategory;

  currentSubcategories = [];

  selectedSubcategoryId;

  sub = new Subscription();

  defaultCategory = { name: "All Categories", id: null };

  defaultSubCategory = { name: "All Subcategories", id: null };

  constructor(private searchService: SearchService) {}

  ngOnInit() {
    this.categories$ = this.searchService.categories$;
    this.sub.add(
      this.searchService.searchParams$.subscribe((params) =>
        this.processCategoryChange(params)
      )
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  processCategoryChange(params: SearchParams) {
    const categoryId = params.gear_category_id;
    const categories = this.categories$.getValue();
    this.currentCategory = categories.find(
      (cat) => cat.gear_category_id === categoryId
    );
    this.currentSubcategories = this.currentCategory
      ? this.currentCategory.gear_sub_category
      : [];
    this.selectedSubcategoryId = params.sub_category_id;
    this.currentSubCategory = this.currentSubcategories.find(
      (cat) => cat.gear_sub_category_id === this.selectedSubcategoryId
    );
  }

  categoryChanged(gear_category_id) {
    const sub_category_id = null;
    this.searchService.setSearchParams({ gear_category_id, sub_category_id });
    this.searchService.callNormalSearch();
  }

  subcategoryChanged(sub_category_id) {
    const searchSubCategory =
      sub_category_id === this.selectedSubcategoryId ? null : sub_category_id;
    this.searchService.setSearchParams({ sub_category_id: searchSubCategory });
    this.searchService.callNormalSearch();
  }

  getCurrentCategoryName() {
    return this.currentCategory
      ? this.currentCategory.gear_category_name
      : "All categories";
  }

  getCurrentSubCategoryName() {
    return this.selectedSubcategoryId
      ? this.currentSubCategory.gear_sub_category_name
      : "All subcategories";
  }

  isSubCategoryActive(sub_category_id) {
    return this.selectedSubcategoryId === sub_category_id;
  }

  getCategoryId(item) {
    return item.gear_category_id;
  }

  getCategoryName(item) {
    return item.gear_category_name;
  }

  getSubCategoryId(item) {
    return item.gear_sub_category_id;
  }

  getSubCategoryName(item) {
    return item.gear_sub_category_name;
  }
}
