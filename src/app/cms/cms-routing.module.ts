import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AboutUsComponent } from "./about-us/about-us.component";
import { TrustSafetyComponent } from "./trust-safety/trust-safety.component";
import { CommunityRulesComponent } from "./community-rules/community-rules.component";
import { TermsAndConditionsComponent } from "./terms-and-conditions/terms-and-conditions.component";
import { WhatIsKitShareComponent } from "./what-is-kit-share/what-is-kit-share.component";
import { PrivacyPolicyComponent } from "./privacy-policy/privacy-policy.component";
import { CustomerDamageWaiverPolicyComponent } from "./customer-damage-waiver-policy/customer-damage-waiver-policy.component";
import { ContactUsComponent } from "./contact-us/contact-us.component";
const routes: Routes = [
  { path: "about-us", component: AboutUsComponent },
  { path: "trust-and-safety", component: TrustSafetyComponent },
  { path: "how-we-work", component: CommunityRulesComponent },
  { path: "terms-and-conditions", component: TermsAndConditionsComponent },
  { path: "what-is-kitshare", component: WhatIsKitShareComponent },
  { path: "privacy-policy", component: PrivacyPolicyComponent },
  {
    path: "customer-damage-waiver",
    component: CustomerDamageWaiverPolicyComponent,
  },
  { path: "contact-us", component: ContactUsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CmsRoutingModule {}
