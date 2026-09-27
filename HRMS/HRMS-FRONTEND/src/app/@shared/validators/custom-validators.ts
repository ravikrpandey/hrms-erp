import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** ✅ Natural Number Validator (0 or greater) */
export const naturalNumberValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (control.value === null || control.value === '') {
    return null; // Allow empty values (can be handled by required validator)
  }

  const num = Number(control.value);
  if (!Number.isInteger(num) || num < 0) {
    return { notNaturalNumber: true };
  }
  return null;
};

/** ✅ Max Value Validator */
export const maxValueValidator = (max: number): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value !== null && control.value > max) {
      return { 
        maxExceeded: { max },
        message:`Field value can't be greater than ${max}` 
      };
    }
    return null;
  };
};

/** ✅ Min Value Validator */
export const minValueValidator = (min: number): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value !== null && control.value < min) {
      return { 
        minNotMet: { min },
        message:`Field value can't be smaller than ${min}` 
      };
    }
    return null;
  };
};

/** ✅ Min Duration <= Max Duration Validator */
export const minLessThanMaxValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const min = group.get('minDuration')?.value;
  const max = group.get('maxDuration')?.value;

  if (min !== null && max !== null && min > max) {
    return { 
              minGreaterThanMax: true,
              message:`Field value must be between ${min} and ${max}, inclusive.` 
            };
  }
  return null;
};
