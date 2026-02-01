import { Component, OnInit, forwardRef, Renderer2, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import * as moment from 'moment/moment';

export const EXPIRATION_DATE_VALUE_ACCESSOR : any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ExpirationDateComponent),
  multi: true,
};

@Component({
  selector: 'kit-expiration-date',
  templateUrl: './expiration-date.component.html',
  styleUrls: ['./expiration-date.component.scss'],
  providers: [EXPIRATION_DATE_VALUE_ACCESSOR],
})
export class ExpirationDateComponent implements OnInit, ControlValueAccessor {


  today: any = new Date();
  @Input() initiator: any;
  @Input() isStart: boolean;

  // @ViewChild('textarea') textarea;
  onChange(val) {
  }

  constructor(private renderer : Renderer2) { }


  ngOnInit() {
    if(this.isStart) {this.today = "";}
  }

  onDateSelection(date) {
    this.change( moment(date.value).format("YYYY-MM-DD"));
  }

  writeValue( value : any ) : void {
    // const div = this.textarea.nativeElement;
    // this.renderer.setProperty(div, 'textContent', value);
  }

  registerOnChange( fn : any ) : void {
    this.onChange = fn;
  }

  change( $event ) {
    this.onChange($event);
  }

  setDisabledState( isDisabled : boolean ) : void {
    // const div = this.textarea.nativeElement;
    const action = isDisabled ? 'addClass' : 'removeClass';
    // this.renderer[action](div, 'disabled');
  }

  registerOnTouched(fn: any) : void {}

}
