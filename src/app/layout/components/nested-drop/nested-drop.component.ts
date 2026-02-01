import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SearchService } from '../../../services/search.service';

@Component({
  selector: 'kit-nested-drop',
  templateUrl: './nested-drop.component.html',
  styleUrls: ['./nested-drop.component.scss'],
})
export class NestedDropComponent implements OnInit {

  @Output()
  categorySelected: EventEmitter<any> = new EventEmitter();

  categories$;
  cat_id: any;
  openAllCategories: any;
  search: string;
  cat_type: string;
  navIsFixed: boolean;
  sub_cat_id: any = '';
  address: string = '';
  user_profile_picture_link: string = '';
  displayMenu: boolean = false;

  constructor(private searchService: SearchService) { }

  ngOnInit() {
    this.categories$ = this.searchService.categories$;
  }

  toggleNestedMenu() {
    this.displayMenu = !this.displayMenu;
  }

  toggleClass(header_cat) {
    header_cat.open = !header_cat.open;
    return false;
  }

  chooseHeaderCat(gear_category_id) {
    this.openAllCategories = false;
    this.categorySelected.next({ gear_category_id });
  }

  chooseHeaderSubCat(gear_category_id, sub_category_id) {
    this.openAllCategories = false;
    this.categorySelected.next({ gear_category_id, sub_category_id });
  }

  goToSearchPage() {
    this.searchService.callNormalSearch();
  }

}
