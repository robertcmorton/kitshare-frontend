import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RentalsComponent } from "./rentals/rentals.component";
import { MessagingComponent } from "./messaging/messaging.component";
import { RentalsDashboardComponent } from "./rentals-dashboard/rentals-dashboard.component";
import { ReviewsComponent } from "./reviews/reviews.component";
import { ManageListingComponent } from "./manage-listing/manage-listing.component";
import { MessagesComponent } from "./messages/messages.component";

const routes: Routes = [
  { path: "", component: RentalsComponent },
  { path: "dashboard", component: RentalsComponent },
  { path: "messaging", component: MessagingComponent },
  { path: "messages", component: MessagesComponent },
  {
    path: "dashboard/:renter_id/:user_gear_desc_id",
    component: RentalsDashboardComponent,
  },
  { path: "reviews", component: ReviewsComponent },
  { path: "manage-listing", component: ManageListingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RentalsRoutingModule {}
