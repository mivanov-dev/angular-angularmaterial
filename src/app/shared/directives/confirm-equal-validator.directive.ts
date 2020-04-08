// angular
import { Directive, Input } from '@angular/core';
import { Validator, ValidationErrors, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[appConfirmEqualValidator]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: ConfirmEqualValidatorDirective,
    multi: true
  }]
})
export class ConfirmEqualValidatorDirective implements Validator {

  @Input() appConfirmEqualValidator: string;

  constructor() { }

  validate(control: AbstractControl): ValidationErrors | null {

    const compare = control.parent.get(this.appConfirmEqualValidator);

    const isNotEqual = compare && compare.value !== control.value;

    if (control.value === null || control.value.length === 0) {
      return null;
    }

    if (compare) {
      const comparison = compare.valueChanges
        .subscribe(res => {
          control.updateValueAndValidity();
          comparison.unsubscribe();
        })
    }

    return isNotEqual ? { notEqual: true } : null;

  }

}
