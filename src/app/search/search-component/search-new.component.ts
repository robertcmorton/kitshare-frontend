import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { environment } from "../../../environments/environment";
import { AppService } from "../../app.service";

@Component({
  selector: "kit-search-new",
  templateUrl: "./search-new.component.html",
  styleUrls: ["./search-new.component.scss"],
})
export class SearchNewComponent implements OnInit, OnDestroy {
  sub = new Subscription();

  mapVisible = true;

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.sub.add(
      this.appService.onResize$.subscribe((size) => {
        this.mapVisible = size >= environment.breakpoints.tablet;
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  toggleMap() {
    setTimeout(() => (this.mapVisible = !this.mapVisible), 0);
  }
}
