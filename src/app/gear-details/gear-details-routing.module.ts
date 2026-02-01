import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { GearListComponent } from "./gear-list/gear-list.component";
import { PublicGearDetailsComponent } from "./public-gear-details/public-gear-details.component";
import { EditgearComponent } from "./editgear/editgear.component";

const routes: Routes = [
  { path: "gear-list", component: GearListComponent },
  { path: "view-gear/:id", component: PublicGearDetailsComponent },
  { path: "edit-gear/:id", component: EditgearComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GearDetailsRoutingModule {}
