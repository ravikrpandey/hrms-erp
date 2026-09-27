import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
  selector: 'app-quotation-currency-dialog',
  templateUrl: './quotation-currency-dialog.component.html',
  styleUrls: ['./quotation-currency-dialog.component.scss']
})
export class QuotationCurrencyDialogComponent {
  quotation_currency_id: any;
  singleQuotationcurrencyData: any;
  quotationCurrencyForm: FormGroup;
  id: any;
  mainId: any;
  submitted: boolean | undefined;
  loginUser: any;
  loginUserID: any;
  view: any;
  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private dialog: MatDialogRef<QuotationCurrencyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.quotationCurrencyForm = this.fb.group({
      quotation_currency_name: new FormControl(null, [Validators.required, noLeadingSpaces()]),
    });
  }
  ngOnInit() {
    this.quotation_currency_id = Number(this.data?.id);
    this.view = this.data?.view
    this.mainId = localStorage.getItem('EmpMainId');
    this.activeroute.queryParams.subscribe((params) => {
      this.id = params;
    });
    let a: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a)
    this.loginUserID = this.loginUser.employee_id;
    if (this.quotation_currency_id) {
      this.getByIdQuotationcurrency();
    }
  }

  getByIdQuotationcurrency() {
    this._configurationalMasterService.getByIdQuotationcurrency(this.quotation_currency_id).subscribe((res: any) => {
      this.singleQuotationcurrencyData = res.data;
      this.quotationCurrencyForm.patchValue({
        quotation_currency_name: this.singleQuotationcurrencyData?.quotation_currency_name,
      })
    });
  }
  onSubmitForm() {
    Object.keys(this.quotationCurrencyForm.controls).forEach(key => {
      this.quotationCurrencyForm.controls[key].markAsTouched();
    });
    this.submitted = false;
    if (this.quotationCurrencyForm.invalid) {
      this.toast.error('Required fields should not be empty.', 'Error Occurred!');
      return;
    }
    let val = this.quotationCurrencyForm.value;
    const data = {
      quotation_currency_name: val.quotation_currency_name,
    };
    this._configurationalMasterService.createQuotationcurrency(data).subscribe(
      (res: any) => {
        if (res.message === "Quotation_currency Name is Already Exits!") {
          this.toast.warning('Quotation Currency Name is Already Exits!');
        }
        else {
          this.toast.success('Quotation Currency Added Successfully');
          this.route.navigate([
            'master/itticket/configurational-master/quotationcurrency',
          ]);
          this.confirmDialog();
          this.reloadCurrentRoute();
        }
      },
      (err) => {
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else if (err.status == 201) {
          this.toast.error('Quotation Currency Name is Already Exits!');
        } else {
          this.toast.error('Error in submission!');
        }
      }
    );
  }

  onUpdateForm() {
    Object.keys(this.quotationCurrencyForm.controls).forEach(key => {
      this.quotationCurrencyForm.controls[key].markAsTouched();
    });
    this.submitted = false;
    if (this.quotationCurrencyForm.invalid) {
      this.toast.error('Required fields should not be empty.', 'Error Occurred!');
      return;
    }
    let val = this.quotationCurrencyForm.value;
    const data = {
      quotation_currency_name: val.quotation_currency_name,
    };
    this._configurationalMasterService.updateSingleQuotationcurrency(this.quotation_currency_id, data).subscribe(
      (res: any) => {
        if (res.message == "Quotation_currency Name is Already Exits!") {
          this.toast.warning('Quotation Currency Name is Already Exits!');
        }
        else {
          this.toast.success('Quotation Currency Update Successfully');
          this.route.navigate([
            'master/itticket/configurational-master/quotationcurrency',
          ]);
          this.confirmDialog();
          this.reloadCurrentRoute();
        }
      },
      (err) => {
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else if (err.status == 409) {
          this.toast.error('Quotation Currency Name is Already Exits!');
        } else {
          this.toast.error('Error in submission!');
        }
      }
    );
  }

  confirmDialog() {
    this.dialog.close(this.quotationCurrencyForm.value);
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
}
