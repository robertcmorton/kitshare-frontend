import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LogInComponent } from "./log-in/log-in.component";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { AccountConfirmationComponent } from "./account-confirmation/account-confirmation.component";
import { PageNotExistComponent } from "../page-not-exist/page-not-exist.component";

const routes: Routes = [
  { path: "", component: LogInComponent },
  { path: "login", component: LogInComponent },
  { path: "login/:type", component: LogInComponent },
  { path: "sign-up", component: SignUpComponent },
  { path: "forgot-password", component: ForgotPasswordComponent },
  { path: "account-confirmation", component: AccountConfirmationComponent },
  { path: "reset-password/:token", component: ResetPasswordComponent },
  { path: "**", component: PageNotExistComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" })],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
