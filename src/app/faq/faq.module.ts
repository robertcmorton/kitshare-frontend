import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FaqRoutingModule } from "./faq-routing.module";

import { FaqComponent } from "./faq/faq.component";
import { FaqListComponent } from "./faq-list/faq-list.component";
import { FaqDetailsViewComponent } from "./faq-details-view/faq-details-view.component";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  imports: [CommonModule, FaqRoutingModule, SharedModule],
  declarations: [FaqComponent, FaqListComponent, FaqDetailsViewComponent]
})
export class FaqModule {}
