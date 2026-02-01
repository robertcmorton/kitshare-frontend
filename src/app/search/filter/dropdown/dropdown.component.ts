import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DataService } from "app/shared/data/data.service";

@Component({
  selector: "kit-dropdown",
  templateUrl: "./dropdown.component.html",
  styleUrls: ["./dropdown.component.scss"],
})
export class DropdownComponent implements OnInit {
  @Input()
  items;

  @Input()
  displayString: string;

  @Input()
  multiple = false;

  @Input()
  selectedItems;

  @Input()
  itemIdGetter;

  @Input()
  itemNameGetter;

  @Input()
  defaultValue: { name; id };

  @Input()
  disabled = false;

  @Input()
  inUse = false;

  @Output()
  valueChanged = new EventEmitter<any>();

  opened = false;

  changed = false;

  constructor(private dataService: DataService) {}

  ngOnInit() {}

  select(value) {
    if (this.multiple) {
      this.selectedItems[value] = !this.selectedItems[value];
      this.changed = true;
    } else {
      this.valueChanged.emit(value);
    }
  }

  onClose() {
    this.opened = false;
    if (this.multiple && this.changed) {
      this.valueChanged.emit(this.selectedItems);
      this.changed = false;
    }
    this.dataService.dropdownsOpenedCount--;
  }

  onShown() {
    this.opened = true;
    this.dataService.dropdownsOpenedCount++;
  }
}
