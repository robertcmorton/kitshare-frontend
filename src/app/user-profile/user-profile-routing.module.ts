import { EditProfileComponent } from "./edit-profile/edit-profile.component";
import { ProfileComponent } from "./profile/profile.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ContactInfoComponent } from "./contact-info/contact-info.component";
import { AccountSettingsComponent } from "./account-settings/account-settings.component";
import { NotificationComponent } from "./notification/notification.component";
import { ConnectSocialComponent } from "./connect-social/connect-social.component";
import { DigitalIdComponent } from "./digital-id/digital-id.component";
import { InsuranceComponent } from "./insurance/insurance.component";
import { ConnectPayoutsComponent } from "./connect-payouts/connect-payouts.component";

const routes: Routes = [
  { path: "edit", component: EditProfileComponent },
  { path: "address-details", component: ContactInfoComponent },
  { path: "account-settings", component: AccountSettingsComponent },
  { path: "notification", component: NotificationComponent },
  { path: "connect-social", component: ConnectSocialComponent },
  { path: "digital-id", component: DigitalIdComponent },
  { path: "insurance", component: InsuranceComponent },
  { path: "connect-payouts", component: ConnectPayoutsComponent },
  { path: "", component: ProfileComponent },
  { path: ":id", component: ProfileComponent },
  { path: "**", component: ProfileComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserProfileRoutingModule {}
