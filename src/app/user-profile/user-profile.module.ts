import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { UserProfileRoutingModule } from "./user-profile-routing.module";
import {
  ProfileComponent,
  RenterReviewsPipe,
  OwnerReviewsPipe,
} from "./profile/profile.component";
import { EditProfileComponent } from "./edit-profile/edit-profile.component";
import { SharedModule } from "../shared/shared.module";
import { GearComponent } from "./profile/gear/gear.component";
import { ReviewComponent } from "./profile/review/review.component";
import { ContactInfoComponent } from "./contact-info/contact-info.component";
import { LeftSidebarComponent } from "./left-sidebar/left-sidebar.component";
import { AccountSettingsComponent } from "./account-settings/account-settings.component";
import { NotificationComponent } from "./notification/notification.component";
import { ConnectSocialComponent } from "./connect-social/connect-social.component";
import { DigitalIdComponent } from "./digital-id/digital-id.component";
import { InsuranceComponent } from "./insurance/insurance.component";
import { PrivateGearDetailsComponent } from "./private-gear-details/private-gear-details.component";
import { ConnectPayoutsComponent } from "./connect-payouts/connect-payouts.component";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { ReactiveFormsModule } from "@angular/forms";
import { ExpirationDateComponent } from "./components/expiration-date/expiration-date.component";
import { VendorsModule } from "../vendors/vendors.module";
import { ImageUploadComponent } from "./components/image-upload/image-upload.component";
import { UserProfileService } from "./user-profile.service";
import { InsuranceListComponent } from "./components/insurance-list/insurance-list.component";
import { InsuranceRowComponent } from "./components/insurance-row/insurance-row.component";
import { GooglePlacesTypeaheadComponent } from "./components/google-places-typeahead/google-places-typeahead.component";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { AddressListComponent } from "./components/address-list/address-list.component";
import { AddressRowComponent } from "./components/address-row/address-row.component";
import { AddressErrorComponent } from "./components/address-error/address-error.component";
import { AddressMapComponent } from "./components/address-map/address-map.component";
import {
  OwlDateTimeModule,
  OwlMomentDateTimeModule,
  OWL_DATE_TIME_FORMATS,
} from "@danielmoncada/angular-datetime-picker";

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
    GooglePlaceModule,
    UserProfileRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    VendorsModule,
    OwlDateTimeModule,
    OwlMomentDateTimeModule,
    PaginationModule.forRoot(),
  ],
  declarations: [
    ProfileComponent,
    OwnerReviewsPipe,
    RenterReviewsPipe,
    EditProfileComponent,
    GearComponent,
    ReviewComponent,
    ContactInfoComponent,
    LeftSidebarComponent,
    AccountSettingsComponent,
    NotificationComponent,
    ConnectSocialComponent,
    DigitalIdComponent,
    InsuranceComponent,
    PrivateGearDetailsComponent,
    ConnectPayoutsComponent,
    ExpirationDateComponent,
    ImageUploadComponent,
    InsuranceListComponent,
    InsuranceRowComponent,
    GooglePlacesTypeaheadComponent,
    AddressListComponent,
    AddressRowComponent,
    AddressErrorComponent,
    AddressMapComponent,
  ],
  providers: [
    UserProfileService,
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS },
  ],
})
export class UserProfileModule {}
