import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { DatePipe } from "@angular/common";
import * as moment from "moment/moment";
import { AppService } from "../../../app.service";

@Component({
  selector: "kit-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"],
})
export class CalendarComponent implements OnInit {
  value;
  conditionalPlaceholder;
  minimumDate;
  startDate;
  selectedDate: any = null;

  @Output() pickerStatus: EventEmitter<any>;
  @Input() initiator: any;

  // @Input() set minDate(date) {
  //   this.startDate = date;
  //   this.minimumDate =  moment(date).subtract(1, 'd');
  // }
  @Input() dateFilter: any;
  @Input() disabled: any;
  @Input() prefix: any;
  @Input() fromDate: any;
  @Input() toDate: any;
  @Input() placeholderDate: any;
  @Output() dateSelect: EventEmitter<any> = new EventEmitter();
  public formatedDate: Date;
  @Input() set minDate(date) {
    setTimeout((_) => {
      this.startDate = moment(date).subtract(1, "d");
      this.minimumDate = moment(date).subtract(1, "d");
    }, 10);
  }
  // today = moment(new Date()).subtract(1, 'd');

  constructor(private datePipe: DatePipe, private AppService: AppService) {}

  transformDate(date) {
    return this.datePipe.transform(
      date && date !== "no_date" ? date : new Date(),
      "MMMM d, y"
    );
  }

  ngOnInit() {
    console.log("________________", this.fromDate, this.toDate);
    let currentDate = `${new Date()}`;

    if (this.placeholderDate) {
      this.conditionalPlaceholder = this.transformDate(this.placeholderDate);
    } else {
      this.conditionalPlaceholder = this.transformDate(new Date());
    }
  }

  ngOnChanges(change) {
    if (!this.placeholderDate) {
      if (change.toDate && change.toDate.currentValue) {
        setTimeout((_) => {
          this.conditionalPlaceholder = this.transformDate(
            change.toDate.currentValue
          );
        }, 10);
      }
      if (change.fromDate && change.fromDate.currentValue) {
        setTimeout((_) => {
          this.conditionalPlaceholder = this.transformDate(
            change.fromDate.currentValue
          );
        }, 10);
      }
    }

    if (this.placeholderDate) {
      if (change.placeholderDate && change.placeholderDate.currentValue) {
        setTimeout((_) => {
          this.conditionalPlaceholder = this.transformDate(
            change.placeholderDate.currentValue
          );
        }, 10);
      }
    }
    if (this.placeholderDate === "no_date") {
      setTimeout((_) => {
        this.conditionalPlaceholder = "";
      }, 10);
    }
  }

  onDateSelection(dateSelected) {
    this.selectedDate = dateSelected;
    console.log("this.selectedDate", this.selectedDate);
    this.dateSelect.emit(dateSelected);
  }

  onPickerOpen(event) {}

  onPickerClosed(event) {
    // this.selectedDate
    //   ? this.AppService.setCalStatus({
    //       initiator: this.initiator,
    //       status: true,
    //     })
    //   : this.AppService.setCalStatus({
    //       initiator: this.initiator,
    //       status: false,
    //     });
  }
}
