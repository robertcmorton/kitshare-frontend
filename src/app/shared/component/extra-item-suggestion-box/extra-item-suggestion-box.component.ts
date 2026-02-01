import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from "@angular/core";

@Component({
  selector: 'app-extra-item-suggestion-box',
  templateUrl: './extra-item-suggestion-box.component.html',
  styleUrls: ['./extra-item-suggestion-box.component.css']
})
export class ExtraItemSuggestionBoxComponent implements OnInit, OnChanges {

  @Input()
  name: string;
  @Input()
  placeHolder: string;
  @Input()
  optionLabelField: string;
  @Input()
  optionValueField: string;
  @Input()
  suggestions: Array<any> = [];
  @Input()
  selectedValue: any;
  @Input()
  isDisabled: boolean = false;

  @Output()
  updatedSuggestionValue = new EventEmitter<any>();

  public showSuggestionList: boolean = false;
  public suggestionListOptions: Array<any> = [];
  constructor() {}

  ngOnInit() {

    if(this.selectedValue == undefined || this.selectedValue == ""){
      this.selectedValue = {};
    }
  }

  ngOnChanges() {
    if (this.suggestions && this.suggestions.length) {
      this.suggestions = this.suggestions.map(option => {
        return { value: option[this.optionValueField], label: option[this.optionLabelField] };
      });
    }
  }

  newValueSelected() {
    /*
    let value = this.selectedValue;
    if (value && value.length) {
      this.updatedSuggestionValue.emit(value);
    }
    this.showSuggestionList = false;*/
  }
  updateTextFieldValue(selectedValue: any) {
    //this.selectedValue = selectedValue;
    this.selectedValue.gear_name = selectedValue;
    this.showSuggestionList = false;
    this.updatedSuggestionValue.emit(selectedValue);
    //this.newValueSelected();
  }

  filterSuggestionList(event) {

    this.suggestions = this.suggestions;
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (this.selectedValue.gear_name && this.selectedValue.gear_name.length >= 1) {
      this.suggestionListOptions = this.suggestions.filter(option => {

        if(option.label !== undefined){
          return option.label.toLowerCase().indexOf(this.selectedValue.gear_name.toLowerCase()) > -1;
        }else{
          option = {
            value: '',
            label: ''
          };
          return option.label.toLowerCase().indexOf(this.selectedValue.gear_name.toLowerCase()) > -1;
        }

      });

      //console.log(this.suggestionListOptions);
      this.showSuggestionList = true;
    } else {
      this.showSuggestionList = false;
    }
  }

}
