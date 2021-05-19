import { InjectionToken } from '@angular/core';
import { Validators, ValidatorFn } from '@angular/forms';

export interface UserFormValidator {
  PASSWORD_VALIDATOR: ValidatorFn[];
  EMAIL_VALIDATOR: ValidatorFn[];
  OTP_VALIDATOR: ValidatorFn[];
}

export const userFormValidator: UserFormValidator =
{
  PASSWORD_VALIDATOR: [
    Validators.required,
    Validators.minLength(10),
    Validators.maxLength(100)
  ],
  EMAIL_VALIDATOR: [
    Validators.required,
    Validators.email,
    Validators.minLength(10),
    Validators.maxLength(100)
  ],
  OTP_VALIDATOR: [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(6)
  ]
};

export const UserFormValidatorToken = new InjectionToken<UserFormValidator>('UserFormValidatorToken');
