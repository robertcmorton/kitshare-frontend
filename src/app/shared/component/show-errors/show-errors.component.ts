import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { AbstractControlDirective, AbstractControl } from '@angular/forms';

@Component({
  selector: "show-errors",
  templateUrl: "./show-errors.component.html",
  styleUrls: ["./show-errors.component.scss"]
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowErrorsComponent implements OnInit {
  private static readonly errorMessages = {
    required: () => "This is a required field",
    minlength: params =>
      "Ingrese un mínimo de " + params.requiredLength + " caracteres",
    maxlength: params =>
      "Ingrese un máximo de " + params.requiredLength + " caracteres",
      max: params => "Ingrese un máximo de " + params.max.toString().length + " caracteres",
    pattern: params => "Ingrese un formato válido", // "The required pattern is: " + params.requiredPattern,
    years: params => params.message,
    countryCity: params => params.message,
    uniqueName: params => params.message,
    telephoneNumbers: params => params.message,
    telephoneNumber: params => params.message,
    email: params => "Ingrese un formato válido",
    min: params => "La cantidad debe ser mayor que " + (params.min-1),
    areaCodeTelephone: () => "Por favor, ingrese el campo requerido"
  };
  @Input() control: AbstractControl | AbstractControlDirective;
  @Input() type: string;
  @Input() triggerError: boolean;


  constructor() { }

  ngOnInit() { }

  shouldShowErrors(): boolean {
    return ( this.control && this.control.errors && this.control.touched || this.triggerError);
  }

  listOfErrors(): string[] {
    let errors = this.control.errors;
    if(errors && errors.required && Object.keys(errors).length > 1){
      return [this.getMessage("required", errors.required)]
    }if(errors) {
      return Object.keys(errors).map(field =>
        this.getMessage(field, errors[field])
      );
    }

  }

  private getMessage(type: string, params: any) {
    return ShowErrorsComponent.errorMessages[type](params);
  }
}
