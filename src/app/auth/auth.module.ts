import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AuthRoutingModule } from "./auth-routing.module";
import { SharedModule } from "../shared/shared.module";

import { LogInComponent } from "./log-in/log-in.component";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { SocialLoginComponent } from "./social-login/social-login.component";

import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";

import { GOOGLE_CLIENT_KEY, FB_CLIENT_KEY } from "./../shared/constant";
import { AccountConfirmationComponent } from "./account-confirmation/account-confirmation.component";

import {
  SocialLoginModule,
  SocialAuthServiceConfig,
} from "@abacritt/angularx-social-login";
import {
  GoogleLoginProvider,
  FacebookLoginProvider,
} from "@abacritt/angularx-social-login";

@NgModule({
  imports: [CommonModule, SharedModule, AuthRoutingModule, SocialLoginModule],
  declarations: [
    LogInComponent,
    SignUpComponent,
    SocialLoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    AccountConfirmationComponent,
  ],
  providers: [
    {
      provide: "SocialAuthServiceConfig",
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              GOOGLE_CLIENT_KEY
              // "558921154887-nm9gm2t0qrm5akpgscpj5meedkk9tuno.apps.googleusercontent.com"
            ),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(FB_CLIENT_KEY),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
})
export class AuthModule {}
