import { Component, Inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountryComponent {
  countryForm: FormGroup;
  isOpenDialog: boolean = false;
  constructor(
    private dialog: MatDialogRef<CountryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _fb: FormBuilder,
    public toaster: ToastrService,
    public router: Router,
    private _configurationalmasterService: ConfigurationalmasterService
  ) {
    this.countryForm = this._fb.group({
      countryss_name: new FormControl(null, [
        Validators.required,
        noLeadingSpaces(),
      ]),
      country_code: new FormControl(null, [
        Validators.required,
        noLeadingSpaces(),
      ]),
      phone_code: new FormControl(null, [
        Validators.required,
        noLeadingSpaces(),
      ]),
    });
  }

  ngOnInit(): void {
    this.isOpenDialog = this.dialog?.componentInstance?.data?.isOpenDialog
  }


  confirmDialog() {
    this.dialog.close(this.countryForm.value);
  }

  onInputChange(event: any): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^a-zA-Z]/g, '').toUpperCase();
    this.countryForm
      .get('country_code')
      ?.setValue(input.value, { emitEvent: false });
  }

  onInputDigitChange(event: any): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    this.countryForm
      .get('phone_code')
      ?.setValue(input.value, { emitEvent: false });
  }

  onSubmit(data: any) {
    if (this.countryForm.invalid) {
      this.countryForm.markAllAsTouched();
      return;
    }
    this._configurationalmasterService.createCountry(data.value).subscribe(
      (res: any) => {
        if (res) {
          if (res.code == 201) {
            this.toaster.warning('Country Name Already Exists!');
          } else {
            this.toaster.success('Country Added Successfully');
            this.dialog.close();
            if (this.isOpenDialog === true) {
              this.confirmDialog();
            }
          }
        }
      },
      (err: any) => {
        if (err.status == 500) {
          this.toaster.error('Something went Wrong!');
        }
      }
    );
  }
}
