import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-extra-item",
  templateUrl: "./extra-item.component.html",
  styleUrls: ["./extra-item.component.css"],
})
export class ExtraItemComponent implements OnInit {
  @Input()
  index: number;
  @Input()
  actionType: string;
  @Input()
  // defaultValue: ExtraItems = new ExtraItems();
  defaultValue: string = "";

  @Input()
  optionList = [];

  @Output()
  updatedValue = new EventEmitter<any>();
  @Output()
  action = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  updatevalue(updatedValue: string) {
    let index = this.index;
    this.updatedValue.emit({ index: index, updatedValue: updatedValue });
  }

  clickHandler() {
    let index = this.index;
    let action = this.actionType;
    this.action.emit({ index: index, action: action });
  }
}
