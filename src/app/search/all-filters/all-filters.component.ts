import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DataService } from "app/shared/data/data.service";

@Component({
  selector: "kit-all-filters",
  templateUrl: "./all-filters.component.html",
  styleUrls: ["./all-filters.component.scss"],
})
export class AllFiltersComponent implements OnInit {
  @Input()
  items;

  @Input()
  displayString: string;

  @Input()
  disabled = false;

  @Input()
  inUse = false;

  @Output()
  valueChanged = new EventEmitter<any>();

  opened = false;

  constructor(private dataService: DataService) {}

  ngOnInit() {}

  onShown() {
    this.opened = true;
    this.dataService.dropdownsOpenedCount++;
  }

  onClose() {
    this.opened = false;
    this.dataService.dropdownsOpenedCount--;
  }
}
