import { Component, OnInit, Input, Output, EventEmitter, OnChanges, HostListener } from "@angular/core";

@Component({
  selector: "app-suggestion-box",
  templateUrl: "./suggestion-box.component.html",
  styleUrls: ["./suggestion-box.component.scss"]
})
export class SuggestionBoxComponent implements OnInit, OnChanges {
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
  selectedValue: string;
  @Input()
  isDisabled: boolean = false;

  @Output()
  updatedSuggestionValue = new EventEmitter<any>();

  public showSuggestionList: boolean = false;
  public suggestionListOptions: Array<any> = [];

  suggestionsGlobal: Array<any> = [];

  hassuggestions:boolean;

  constructor() { this.hassuggestions = false; }

  ngOnInit() {}
  @HostListener('document:click', ['$event'])
  onGlobalClick(event): void {
      if(event.target.localName != 'li' && this.showSuggestionList){
        this.updateTextFieldValue("");
      }
  }
  ngOnChanges() {
    if (this.suggestions && this.suggestions.length) {
      this.suggestions = this.suggestions.map(option => {
        return { value: option[this.optionValueField], label: option[this.optionLabelField] };
      });
    }
    if (this.suggestions && this.suggestions.length) {
      // debugger;
      this.suggestionsGlobal = this.suggestions;
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
    this.selectedValue = selectedValue;
    this.showSuggestionList = false;
    this.updatedSuggestionValue.emit(selectedValue);
    this.hassuggestions = false;
    // this.newValueSelected();
    /* console.log('%cSuggestion after selecting value ', 'color:green;');
    console.log(this.suggestions); */
  }

  filterSuggestionList(event) {
    /* console.log(this.suggestions);
    console.log(this.suggestionsGlobal);
    console.log(this.selectedValue); */
    this.suggestions = this.suggestionsGlobal;
    /* console.log('======= after chnaging inside filtersuggestion');
    console.log(this.suggestions); */
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (this.selectedValue && this.suggestions.length >= 1) {
      this.hassuggestions = true;
      /* console.log('Filter suggestion if part');
      console.log(this.suggestions); */
      this.suggestionListOptions = this.suggestions.filter(option => {

        if (option.label !== undefined) {
          return option.label.toLowerCase().indexOf(this.selectedValue.toLowerCase()) > -1;
        } else {
          option = {
            value: '',
            label: ''
          };
          return option.label.toLowerCase().indexOf(this.selectedValue.toLowerCase()) > -1;
        }

      });
      /* console.log('Suggestion option...')
      console.log(this.suggestionListOptions); */
      if ( this.suggestionListOptions.length > 0 ) {
        this.showSuggestionList = true;
      } else {
        this.showSuggestionList = false;
        this.updatedSuggestionValue.emit(event.target.value);
      }

    } else {
      this.updatedSuggestionValue.emit(event.target.value);
      this.showSuggestionList = false;
    }
  }
}
