import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { RentalsRoutingModule } from "./rentals-routing.module";
import { RentalsComponent } from "./rentals/rentals.component";
import { MessagingComponent } from "./messaging/messaging.component";
import { ReviewDashboardComponent } from "./review/review.component";
import { RentalsDashboardComponent } from "./rentals-dashboard/rentals-dashboard.component";
import {
  ReviewsComponent,
  RenterReviewsPipe,
  OwnerReviewsPipe,
} from "./reviews/reviews.component";
import { ManageListingComponent } from "./manage-listing/manage-listing.component";
import { MessagesComponent } from "./messages/messages.component";
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
  imports: [
    CommonModule,
    RentalsRoutingModule,
    SharedModule,
    OwlDateTimeModule,
    OwlMomentDateTimeModule,
    PaginationModule.forRoot(),
  ],
  declarations: [
    RentalsComponent,
    MessagingComponent,
    ReviewsComponent,
    RentalsDashboardComponent,
    ReviewDashboardComponent,
    ManageListingComponent,
    MessagesComponent,
    RenterReviewsPipe,
    OwnerReviewsPipe,
  ],
  providers: [{ provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS }],
})
export class RentalsModule {}
