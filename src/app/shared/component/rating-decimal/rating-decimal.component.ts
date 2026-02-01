import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "kit-rating-decimal",
  templateUrl: "./rating-decimal.component.html",
  styleUrls: ["./rating-decimal.component.scss"],
})
export class RatingDecimalComponent {
  @Input() currentRate;
  @Input() disabled;
  @Output() starClickChange: EventEmitter<any> = new EventEmitter();
  constructor() {}

  ngOnInit() {
    console.log(this.disabled);
  }

  onChange() {
    if (this.currentRate) this.starClickChange.emit(this.currentRate);
  }
}
