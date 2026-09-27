// dynamic-form.service.ts
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class DynamicFormService {
  constructor(private fb: FormBuilder) { }

  generateForm(config: any): FormGroup {
    const formControls: any = {};
    config?.fields?.forEach((field: any) => {
      formControls[field.name] = this.createControl(field);
    });

    formControls['lead_owner'] = this.fb.control('', Validators.required);
    formControls['user_id'] = this.fb.control('', Validators.required);
    return this.fb.group(formControls);
  }


  private createControl(field: any): any {
    const { name, type, value, options, required } = field;

    const validators = [];
    if (required) {
      validators.push(Validators.required);
    }
    if (name == 'mail_id') {
      validators.push(Validators.email);
    }

    if (type === 'text') {
      return this.fb.control(value || '', validators);
    } else if (type === 'select') {
      return this.fb.control(value || null, validators);
    } else if (type === 'date') {
      return this.fb.control(value || null, validators);
    } else if (type === 'number') {
      return this.fb.control(value || null, validators);
    } else {
      // Handle other field types as needed
      return null;
    }
  }
}
