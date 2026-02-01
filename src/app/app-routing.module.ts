import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LandingComponent } from "./landing/landing.component";
import { NoDataFoundComponent } from "./no-data-found/no-data-found.component";
import { ReferenceComponent } from "./reference/reference.component";
import { RentalOrderOwnerComponent } from "./rental-order-owner/rental-order-owner.component";
import { MyFavaouriteComponent } from "./my-favaourite/my-favaourite.component";

import { AccountConfirmationComponent } from "./auth/account-confirmation/account-confirmation.component";
import { ReplyEmailComponent } from "./reply-email/reply-email.component";
import { SearchModule } from "./search/search.module";
import { FaqModule } from "./faq/faq.module";
import { CmsModule } from "./cms/cms.module";
import { RentalsModule } from "./rentals-page/rentals.module";
import { GearDetailsModule } from "./gear-details/gear-details.module";
import { UserProfileModule } from "./user-profile/user-profile.module";
import { PaymentModule } from "./payment/payment.module";
const routes: Routes = [
  { path: "", component: LandingComponent },
  {
    path: "profile",
    loadChildren: () => UserProfileModule,
  },
  {
    path: "profile/:id",
    loadChildren: () => UserProfileModule,
  },
  {
    path: "faq",
    loadChildren: () => FaqModule,
  },
  {
    path: "cms",
    loadChildren: () => CmsModule,
  },
  {
    path: "gear",
    loadChildren: () => GearDetailsModule,
  },
  {
    path: "search",
    loadChildren: () => SearchModule,
  },
  {
    path: "rentals",
    loadChildren: () => RentalsModule,
  },
  {
    path: "out",
    loadChildren: () => PaymentModule,
  },

  { path: "no-data-found", component: NoDataFoundComponent },

  { path: "reference", component: ReferenceComponent },

  { path: "order-summary/:id/:type", component: RentalOrderOwnerComponent },
  { path: "my_favourites", component: MyFavaouriteComponent },

  { path: "account-confirmation", component: AccountConfirmationComponent },
  {
    path: "reply/:mail_address/:ks_owner_id/:sender_id",
    component: ReplyEmailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
