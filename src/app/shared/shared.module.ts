import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

// import { NguiMapModule } from "@ngui/map";
import { GOOGLE_API_KEY } from "./../shared/constant";
import { NgxSelectModule } from "ngx-select-ex";
import { ExtraItemComponent } from "./component/extra-item/extra-item.component";
import { AddressComponent } from "./component/address/address.component";
import { SuggestionBoxComponent } from "./component/suggestion-box/suggestion-box.component";
import { AddressReadonlyComponent } from "./component/address-readonly/address-readonly.component";
import { ConfirmationDialogComponent } from "./confirmation/confirmation-dialog/confirmation-dialog.component";
import { CalendarComponent } from "./component/calendar/calendar.component";
import * as fromPipes from "./pipes";
import {
  OwlDateTimeModule,
  OwlMomentDateTimeModule,
  OWL_DATE_TIME_FORMATS,
} from "@danielmoncada/angular-datetime-picker";
import { AuthorCardComponent } from "./component/author-card/author-card.component";
// import { StarRatingModule } from "angular-star-rating";
import { SocialLinksComponent } from "./component/social-links/social-links.component";
import { CardComponent } from "./component/card/card.component";
import { KitListComponent } from "./component/kit-list/kit-list.component";
import { RatingDecimalComponent } from "./component/rating-decimal/rating-decimal.component";
import { FavMeComponent } from "./component/fav-me/fav-me.component";
import { ShowErrorsComponent } from "./component/show-errors/show-errors.component";
import { SaveBarComponent } from "./component/save-bar/save-bar.component";
import { VerifyPopupDialogComponent } from "./component/verify-popup-dialog/verify-popup-dialog.component";
import { VerifyPopupDialogService } from "./component/verify-popup-dialog/verify-popup-dialog.service";
import { DragDropComponent } from "./component/drag-drop/drag-drop.component";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { AppMaterialModule } from "./material-module/app-material.module";
const pipes = [fromPipes.FixSocialLinksPipe];
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { MY_MOMENT_FORMATS } from "./moments-format.constant";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { RatingModule } from "ngx-bootstrap/rating";
@NgModule({
  imports: [
    NgbModule,
    FormsModule,
    NgxSelectModule,
    CommonModule,
    HttpClientModule,
    CKEditorModule,
    OwlDateTimeModule,
    OwlMomentDateTimeModule,
    RouterModule,
    DragDropModule,
    AppMaterialModule,
    RatingModule,
  ],
  declarations: [
    ...pipes,
    ExtraItemComponent,
    AddressComponent,
    SuggestionBoxComponent,
    AddressReadonlyComponent,
    ConfirmationDialogComponent,
    CalendarComponent,
    AuthorCardComponent,
    SocialLinksComponent,
    CardComponent,
    KitListComponent,
    RatingDecimalComponent,
    FavMeComponent,
    ShowErrorsComponent,
    SaveBarComponent,
    VerifyPopupDialogComponent,
    DragDropComponent,
  ],
  providers: [
    HttpClientModule,
    DatePipe,
    VerifyPopupDialogService,
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS },
  ],
  exports: [
    ...pipes,
    SocialLinksComponent,
    AuthorCardComponent,
    FormsModule,
    ExtraItemComponent,
    AddressComponent,
    SuggestionBoxComponent,
    AddressReadonlyComponent,
    CalendarComponent,
    CardComponent,
    KitListComponent,
    RatingDecimalComponent,
    FavMeComponent,
    ShowErrorsComponent,
    SaveBarComponent,
    DragDropComponent,
    AppMaterialModule,
    NgxSelectModule,
    CKEditorModule,
    RatingModule,
    DragDropModule,
  ],
  entryComponents: [VerifyPopupDialogComponent],
})
export class SharedModule {}
