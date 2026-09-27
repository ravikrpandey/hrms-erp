import { NativeDateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';

export class CustomDateAdapter extends NativeDateAdapter {
  // Override the format method
  override format(date: Date, displayFormat: Object): string {
    if (!date || !displayFormat) {
      return '';
    }
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  // Override the parse method
  override parse(value: any): Date | null {
    if (!value) {
      return null;
    }
    const [day, month, year] = value.split('/').map((v: string) => parseInt(v, 10));
    return new Date(year, month - 1, day);
  }
}

export const CUSTOM_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
  },
}