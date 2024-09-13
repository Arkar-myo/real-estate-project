import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class UtilService {

    constructor() { }

    emailValidator(control: AbstractControl): { [key: string]: any } | null {
        const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!emailPattern.test(control.value)) {
            return { invalidEmail: true };
        }
        return null;
    }

    passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
        const password = control.get('password');
        const confirmPassword = control.get('confirmPassword');
        if (password?.value !== confirmPassword?.value) {
            confirmPassword?.setErrors({ mismatch: true })
        }
        return null
    };

    phoneValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const phonePattern = /^[0-9]{11}$/;
            if (!phonePattern.test(control.value)) {
                return { invalidPhone: true };
            }
            return null;
        };
    }

    validateTransactionId(control: AbstractControl) {
        const value = control.value;
      
        // Check if the input consists of exactly 20 digits
        if (/^\d{20}$/.test(value)) {
          return null; // Validation passed
        } else {
          return { invalidTransactionId: true }; // Validation failed
        }
      }
}
