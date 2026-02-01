import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-review-dashboard",
  templateUrl: "./review.component.html",
  styleUrls: ["./review.component.scss"],
})
export class ReviewDashboardComponent implements OnInit {
  @Input() eachReview: any;

  constructor() {}

  ngOnInit() {}
}
