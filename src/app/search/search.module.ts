import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { SearchRoutingModule } from "./search-routing.module";
import { SearchNewComponent } from "./search-component/search-new.component";
import { InfoWindowComponent } from "./map/info-window/info-window.component";
import { FilterComponent } from "./filter/filter.component";
import { MapComponent } from "./map/map.component";
import { CategorySelectComponent } from "./filter/category-select/category-select.component";
import { SearchFooterComponent } from "./search-footer/search-footer.component";
import { ItemsListComponent } from "./items-list/items-list.component";
import { MultipleSelectComponent } from "./filter/multiple-select/multiple-select.component";
import { DropdownComponent } from "./filter/dropdown/dropdown.component";
import { SearchFilterComponent } from "./filter/search-filter/search-filter.component";
import { AllFiltersComponent } from "./all-filters/all-filters.component";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { GOOGLE_API_KEY } from "../shared/constant";
import { AgmCoreModule } from "@agm/core";
import { AgmMarkerClustererModule, ClusterManager } from "@agm/markerclusterer";
import { PaginationModule } from "ngx-bootstrap/pagination";
@NgModule({
  imports: [
    CommonModule,
    SearchRoutingModule,
    SharedModule,
    BsDropdownModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: GOOGLE_API_KEY,
    }),
    AgmMarkerClustererModule,
    PaginationModule.forRoot(),
  ],
  declarations: [
    SearchNewComponent,
    AllFiltersComponent,
    SearchFilterComponent,
    DropdownComponent,
    ItemsListComponent,
    MultipleSelectComponent,
    SearchFooterComponent,
    InfoWindowComponent,
    FilterComponent,
    MapComponent,
    CategorySelectComponent,
  ],
})
export class SearchModule {}
