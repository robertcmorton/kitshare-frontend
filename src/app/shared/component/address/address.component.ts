import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from "@angular/core";
import { BaseComponent } from "../../../base.componant";
import { BaseService } from "../../../services/base.service";
import {
  StateListOption,
  SuburbListOption,
  ContactInfoData,
} from "../../models/contact-info";
import { suburbList, stateList } from "../../constant";

@Component({
  selector: "app-address",
  templateUrl: "./address.component.html",
  styleUrls: ["./address.component.css"],
})
export class AddressComponent
  extends BaseComponent
  implements OnInit, OnChanges
{
  @Input()
  defaultValue: ContactInfoData = new ContactInfoData();
  @Input()
  index: number;
  @Input() isDisabled: boolean;

  @Output()
  updatedValue = new EventEmitter<any>();

  public stateList: Array<StateListOption>;
  public suburbList: Array<SuburbListOption>;

  constructor(public baseService: BaseService) {
    super(baseService, true);
  }

  ngOnInit() {
    this.baseService.baseApi.getStateList();
  }

  ngOnChanges() {
    if (this.defaultValue.ks_state_id && this.defaultValue.ks_state_id.length) {
      this.stateChangeHandler(this.defaultValue.ks_state_id, false);
    }
  }
  handleApiResponse(data: any) {
    if (data.resulttype === suburbList) {
      if (
        data.result.result[0] &&
        this.defaultValue &&
        data.result.result[0].ks_state_id === this.defaultValue.ks_state_id
      ) {
        this.suburbList = data.result.result;
      }
    }

    if (data.resulttype === stateList) {
      this.stateList = data.result.result;
    }
  }

  stateChangeHandler(stateId: any, resetSuburb: boolean = true) {
    this.baseService.baseApi.getSuburbsList(stateId);
    if (resetSuburb) {
      this.defaultValue.ks_suburb_id = "";
      this.defaultValue.postcode = "";
    }
  }
  suburbChangeHandler(suburbValue: any) {
    const selectedSuburb = this.suburbList.filter(
      (each) => each.ks_suburb_id === suburbValue
    );
    this.defaultValue.postcode = selectedSuburb
      ? selectedSuburb[0].suburb_postcode
      : "";
  }

  updatevalue(updatedValue: string) {
    let index = this.index;
    this.updatedValue.emit({ index: index, updatedValue: this.defaultValue });
  }

  updatePrimaryAddress(e) {
    // this.updatedValue = e.target.checked;
    let index = this.index;
    this.defaultValue.is_default = e.target.checked;
    this.updatedValue.emit({ index: index, updatedValue: this.defaultValue });
  }
}
