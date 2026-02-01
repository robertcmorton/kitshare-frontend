import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GearDetailsRoutingModule } from "./gear-details-routing.module";
import { SharedModule } from "../shared/shared.module";
import { GearListComponent } from "./gear-list/gear-list.component";
import { PublicGearDetailsComponent } from "./public-gear-details/public-gear-details.component";
import { EditgearComponent } from "./editgear/editgear.component";
import {
  OwlDateTimeModule,
  OwlMomentDateTimeModule,
  OWL_DATE_TIME_FORMATS,
} from "@danielmoncada/angular-datetime-picker";
import { PaginationModule } from "ngx-bootstrap/pagination";

const MY_MOMENT_FORMATS = {
  parseInput: "l LT",
  fullPickerInput: "l LT",
  datePickerInput: "LL",
  timePickerInput: "LT",
  monthYearLabel: "MMM YYYY",
  dateA11yLabel: "LL",
  monthYearA11yLabel: "MMMM YYYY",
};

@NgModule({
  declarations: [
    GearListComponent,
    PublicGearDetailsComponent,
    EditgearComponent,
  ],
  imports: [
    CommonModule,
    GearDetailsRoutingModule,
    SharedModule,
    OwlDateTimeModule,
    OwlMomentDateTimeModule,
    PaginationModule.forRoot(),
  ],
  providers: [{ provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS }],
})
export class GearDetailsModule {}
