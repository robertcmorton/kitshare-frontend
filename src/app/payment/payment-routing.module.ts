import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HyperWalletViewComponent } from "./hyper-wallet-view/hyper-wallet-view.component";
import { HyperWalletComponent } from "./hyper-wallet/hyper-wallet.component";
import { CartComponent } from "./cart/cart.component";
import { CheckoutComponent } from "./checkout/checkout.component";

const routes: Routes = [
  { path: "Wallet-list", component: HyperWalletViewComponent },
  { path: "add-Wallet", component: HyperWalletComponent },
  { path: "cart", component: CartComponent },
  { path: "checkout", component: CheckoutComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentRoutingModule {}
