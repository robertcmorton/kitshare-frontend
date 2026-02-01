import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SearchNewComponent } from "./search-component/search-new.component";
const routes: Routes = [
  { path: "", component: SearchNewComponent },
  { path: "/:from", component: SearchNewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchRoutingModule {}
