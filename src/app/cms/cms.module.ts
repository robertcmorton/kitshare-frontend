import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { CmsRoutingModule } from "./cms-routing.module";
import { AboutUsComponent } from "./about-us/about-us.component";
import { TrustSafetyComponent } from "./trust-safety/trust-safety.component";
import { CommunityRulesComponent } from "./community-rules/community-rules.component";
import { TermsAndConditionsComponent } from "./terms-and-conditions/terms-and-conditions.component";
import { WhatIsKitShareComponent } from "./what-is-kit-share/what-is-kit-share.component";
import { PrivacyPolicyComponent } from "./privacy-policy/privacy-policy.component";
import { CustomerDamageWaiverPolicyComponent } from "./customer-damage-waiver-policy/customer-damage-waiver-policy.component";
import { ContactUsComponent } from "./contact-us/contact-us.component";

@NgModule({
  imports: [CommonModule, CmsRoutingModule, SharedModule],
  declarations: [
    TermsAndConditionsComponent,
    AboutUsComponent,
    TrustSafetyComponent,
    WhatIsKitShareComponent,
    PrivacyPolicyComponent,
    CustomerDamageWaiverPolicyComponent,
    ContactUsComponent,
    CommunityRulesComponent,
  ],
})
export class CmsModule {}
