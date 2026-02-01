import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "../shared/shared.module";
import { PaymentRoutingModule } from "./payment-routing.module";
import {
  OwlDateTimeModule,
  OwlMomentDateTimeModule,
  OWL_DATE_TIME_FORMATS,
} from "@danielmoncada/angular-datetime-picker";

import { HyperWalletViewComponent } from "./hyper-wallet-view/hyper-wallet-view.component";
import { HyperWalletComponent } from "./hyper-wallet/hyper-wallet.component";
import { CartComponent } from "./cart/cart.component";
import { CheckoutComponent } from "./checkout/checkout.component";

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
    PaymentRoutingModule,
    SharedModule,
    OwlDateTimeModule,
    OwlMomentDateTimeModule,
  ],
  declarations: [
    HyperWalletComponent,
    HyperWalletViewComponent,
    CartComponent,
    CheckoutComponent,
  ],
  providers: [{ provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS }],
})
export class PaymentModule {}
