import { CoreModule } from "./core/core.module";
import { AppService } from "./app.service";
import { BaseService } from "./services/base.service";
import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientJsonpModule, HttpClientModule } from "@angular/common/http";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { OwlModule } from "ngx-owl-carousel";
import { BsModalService, ModalModule } from "ngx-bootstrap/modal";
import { AppRoutingModule } from "./app-routing.module";
import { AuthModule } from "./auth/auth.module";
import { SharedModule } from "./shared/shared.module";

import { AppComponent } from "./app.component";
import { HeaderComponent } from "./layout/header/header.component";
import { FooterComponent } from "./layout/footer/footer.component";
import { LandingComponent } from "./landing/landing.component";

import { GlobalService } from "./services/global.service";
import { ApiRouterService } from "./services/api-router.service";
import { AuthService } from "./services/auth.service";
import { BaseApiService } from "./services/base-api.service";
import { SearchService } from "./services/search.service";
import { CartService } from "./services/cart.service";
import { PaymentService } from "./services/payment.service";
import { GearlistService } from "./services/gearlist.service";
import { DashboardService } from "./services/dashboard.service";
import { LandingService } from "./services/landing.service";
import { CmsService } from "./services/cms.service";
import { MessageService } from "./services/message.service";
import { NoDataFoundComponent } from "./no-data-found/no-data-found.component";
import { PrivateListingComponent } from "./private-listing/private-listing.component";
import { ReferenceComponent } from "./reference/reference.component";

import { RentalOrderOwnerComponent } from "./rental-order-owner/rental-order-owner.component";
import { RentalOrderRenterComponent } from "./rental-order-renter/rental-order-renter.component";
import { MyFavaouriteComponent } from "./my-favaourite/my-favaourite.component";

import { ExtraItemEditComponent } from "../app/shared/component/extra-item-edit/extra-item-edit.component";
import { ExtraItemSuggestionBoxComponent } from "../app/shared/component/extra-item-suggestion-box/extra-item-suggestion-box.component";

import { ReplyEmailComponent } from "./reply-email/reply-email.component";
import { PageNotExistComponent } from "./page-not-exist/page-not-exist.component";
import { KitHeaderComponent } from "./layout/containers/kit-header/kit-header.component";
import { KitPrimaryNavComponent } from "./layout/components/kit-primary-nav/kit-primary-nav.component";
import { LogoContainerComponent } from "./layout/components/logo-container/logo-container.component";
import { NavigationTriggersComponent } from "./layout/components/navigation-triggers/navigation-triggers.component";
import { UserMenuComponent } from "./layout/components/user-menu/user-menu.component";
import { KitSearchComponent } from "./layout/components/search/search.component";
import { VendorsModule } from "./vendors/vendors.module";
import { NestedDropComponent } from "./layout/components/nested-drop/nested-drop.component";
import { LookingForComponent } from "./layout/components/looking-for/looking-for.component";
import { LocationSearchComponent } from "./layout/components/location-search/location-search.component";
import { DesktopNavigationTriggersComponent } from "./layout/components/desktop-navigation-triggers/desktop-navigation-triggers.component";
import { SaveBarService } from "./shared/component/save-bar/save-bar.service";
import { KitSearchHeaderComponent } from "./layout/components/search-header/search-header.component";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { GeolocationService } from "./services/geolocation.service";
import { ConfirmationDialogComponent } from "./rental-order-owner/confirmation-dialog/confirmation-dialog.component";
import { ConfirmationDialogService } from "./rental-order-owner/confirmation-dialog/confirmation-dialog.service";
import { ContactfilterPipe } from "./contactfilter.pipe";
import { CustomErrorHandlerService } from "./error-handler";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LandingComponent,
    NoDataFoundComponent,
    PrivateListingComponent,
    ReferenceComponent,
    RentalOrderOwnerComponent,
    RentalOrderRenterComponent,
    MyFavaouriteComponent,
    ExtraItemEditComponent,
    ExtraItemSuggestionBoxComponent,
    ReplyEmailComponent,
    PageNotExistComponent,
    KitHeaderComponent,
    KitPrimaryNavComponent,
    LogoContainerComponent,
    NavigationTriggersComponent,
    UserMenuComponent,
    KitSearchComponent,
    NestedDropComponent,
    LookingForComponent,
    LocationSearchComponent,
    DesktopNavigationTriggersComponent,
    KitSearchHeaderComponent,
    ConfirmationDialogComponent,
    ContactfilterPipe,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientJsonpModule,
    BrowserAnimationsModule,
    FormsModule,
    CoreModule,
    ReactiveFormsModule,
    NgbModule,
    MatInputModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatSelectModule,
    AppRoutingModule,
    OwlModule,
    AuthModule,
    VendorsModule,

    ModalModule.forRoot(),
    SharedModule,
    ReactiveFormsModule,
    GooglePlaceModule,
  ],
  providers: [
    BaseService,
    GlobalService,
    ApiRouterService,
    AuthService,
    BaseApiService,
    SearchService,
    CartService,
    PaymentService,
    GearlistService,
    DashboardService,
    LandingService,
    CmsService,
    MessageService,
    AppService,
    BsModalService,
    GeolocationService,
    SaveBarService,
    ConfirmationDialogService,
    { provide: ErrorHandler, useClass: CustomErrorHandlerService },
  ],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmationDialogComponent],
})
export class AppModule {}
