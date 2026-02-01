import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-extra-item-edit",
  templateUrl: "./extra-item-edit.component.html",
  styleUrls: ["./extra-item-edit.component.css"],
})
export class ExtraItemEditComponent implements OnInit {
  @Input()
  index: number;
  @Input()
  actionType: string;
  @Input()
  //defaultValue: ExtraItems = new ExtraItems();
  defaultValue: any = {
    gear_name: "",
    serial_numbe: "",
  };

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
