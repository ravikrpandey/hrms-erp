import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';

@Component({
  selector: 'app-basic-details-dialog',
  templateUrl: './basic-details-dialog.html',
  styleUrls: ['./basic-details-dialog.scss']
})
export class BasicDetailsDialog implements OnInit {
  emailForm!: FormGroup;
  contactForm!: FormGroup;
  type: 'email' | 'contact' = 'email';
  basicData: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BasicDetailsDialog>,
    private _configurationalMasterService: ConfigurationalmasterService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _empRegistration: EmpRegistrationService,
  ) {
    this.type = data?.type || 'email';
  }

  employee_id: any;
  ngOnInit(): void {


    this.emailForm = this.fb.group({
      emp_personal_email: [this.data.email || '', [Validators.required, Validators.email]]
    });


    this.contactForm = this.fb.group({
      country_code: [this.data.country_code || '', Validators.required],
      contact_number: [
        this.data.contact_number || '',
        [Validators.required, Validators.pattern(/^[0-9]{7,15}$/)]
      ]
    });
    this.getAll_Country_codes()
  }

 submit(): void {
    if (this.type === 'email' && this.emailForm.valid) {
      const email = this.emailForm.value.emp_personal_email;
      const payload = {
        employee_id: this.data.employee_id,
        emp_personal_email: email
      };
      this._empRegistration.updateBasicDetails(this.data.employee_id, payload).subscribe((res: any) => {
        if (res?.code === 200) {
          this.dialogRef.close({ email });
        }
      });
    } else if (this.type === 'contact' && this.contactForm.valid) {
      const contact_number = this.contactForm.value.contact_number;
      const country_code = this.contactForm.value.country_code;
      const payload = {
        employee_id: this.data.employee_id,
        contact_number,
        country_code
      };
      this._empRegistration.updateBasicDetails(this.data.employee_id, payload).subscribe((res: any) => {
        if (res?.code === 200) {
          this.dialogRef.close({ contact_number, country_code });
        }
      });
    } else {
      this.emailForm.markAllAsTouched();
      this.contactForm.markAllAsTouched();
    }
  }





  filteredCountryCodeList1: any[] = []; // for first select
  filteredCountryCodeList2: any[] = []; // for second select
  filterCountryCode1(event: any) {
    const searchValue = event?.target?.value?.toLowerCase() || '';
    if (!searchValue) {
      this.filteredCountryCodeList1 = [...this.countryCodeList];
      return;
    }
    this.filteredCountryCodeList1 = this.countryCodeList.filter((item: any) =>
      item.dialing_code?.toLowerCase().includes(searchValue)
    );
  }

  filterCountryCode2(event: any) {
    const searchValue = event?.target?.value?.toLowerCase() || '';
    if (!searchValue) {
      this.filteredCountryCodeList2 = [...this.countryCodeList];
      return;
    }
    this.filteredCountryCodeList2 = this.countryCodeList.filter((item: any) =>
      item.dialing_code?.toLowerCase().includes(searchValue)
    );
  }

  countryCodeList: any = [];
  getAll_Country_codes() {
    this._configurationalMasterService
      .getAll_Country_codes()
      .subscribe((res: any) => {
        this.countryCodeList = res.data;
        this.filteredCountryCodeList1 = [...this.countryCodeList];
        this.filteredCountryCodeList2 = [...this.countryCodeList];
      });
  }

  close(): void {
    this.dialogRef.close();
  }
}
