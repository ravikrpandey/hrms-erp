import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/@shared/services/common.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';


function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}


@Component({
  selector: 'app-municipality-dialog',
  templateUrl: './municipality-dialog.component.html',
  styleUrls: ['./municipality-dialog.component.scss']
})
export class MunicipalityDialogComponent {
  departmentForm: FormGroup;
  id: any;
  mainId: any;
  submitted: boolean | undefined;
  loginUser: any;
  loginUserID: any;
  departmentData: any;
  departmentId: any;
  view: any;
  startYear = new Date();
  endYear = new Date();
  entity_Id: any;
  currencies: any;
  minEndDate: any = new Date(1900, 0, 1);
  currencies2: any;
  currencyList: any;

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private _commonService : CommonService,
    public dialog: MatDialogRef<MunicipalityDialogComponent>,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.departmentForm = this.fb.group({

      currency: [null, [Validators.required]],
      department_name: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      amount: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]{1,8}$/)]),
      startYear: new FormControl(null, [Validators.required]),
      endYear: new FormControl(null, [Validators.required]),

    });
  }
  ngOnInit() {
    this.departmentId = this.data?.id
    this.view = this.data?.view
    this.mainId = localStorage.getItem('EmpMainId');
    this.activeroute.queryParams.subscribe((params) => {
      this.id = params;
    });
    let a: any = localStorage.getItem('signInUser');
    let entity_id: any = localStorage.getItem('selectedEntityId');
    this.entity_Id = JSON.parse(entity_id)
    this.loginUser = JSON.parse(a)
    this.loginUserID = this.loginUser.employee_id;
    this.CurrencyList()
    if (this.departmentId) {
      this._commonService?.showLoader()
      this._configurationalMasterService.get_MunicipalityById(this.departmentId).subscribe((res: any) => {
        this.departmentData = res.data;
        this._commonService?.hideLoader()
        // const date = new Date(this.departmentData?.date);
        // const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
        this.departmentForm.patchValue({
          department_name: this.departmentData?.name_of_municipality,
          startYear: this.departmentData?.start_date,
          endYear: this.departmentData?.end_date,
          amount: this.departmentData?.amount,
          currency: this.departmentData?.currency_id,
        })
      });
    }
  }

  CurrencyList() {
    this._commonService?.showLoader()
    this._configurationalMasterService.CurrencyList().subscribe((res: any) => {
      if (res) {
        this._commonService?.hideLoader()
        this.currencies = res.data
        this.currencies2 = res.data
        this.currencyList = this.currencies.map((value:any) => value.Currency_Type)
        console.log(this.currencies)
      }
    })
  }



  updateEndDateValidation(startYear: Date) {
    this.minEndDate = new Date(startYear);
    this.minEndDate.setDate(this.minEndDate.getDate() + 1); // Add 1 day
    this.departmentForm.get('endYear')?.setValidators([
      Validators.min(this.minEndDate.getTime())
    ]);
    this.departmentForm.get('endYear')?.updateValueAndValidity(); // Update validity
  }

  onSubmitForm() {
    Object.keys(this.departmentForm.controls).forEach(key => {
      this.departmentForm.controls[key].markAsTouched();
    });
    this.submitted = false;
    if (this.departmentForm.invalid) {
      this.toast.error('Required fields should not be empty.', 'Error Occurred!');
      return;
    }
    let val = this.departmentForm.value;
    const data = {
      name_of_municipality: val.department_name.trim(),
      amount: val.amount,
      entity_id: this.entity_Id,
      start_date: val.startYear,
      currency_id: val.currency,
      end_date: val.endYear,
    };
    this._commonService?.showLoader()
    this._configurationalMasterService.createMunicipality(data).subscribe(
      (res: any) => {
        this._commonService?.hideLoader()
        if (res.message === "Name of Municipality Already Exists") {
          this.toast.warning('Municipality Name Already Exists!');
        }
        else {
          this.toast.success('Municipality Added Successfully');
          this.route.navigate([
            'master/configurational-master/municipality',
          ]);
          this.confirmDialog();
          this.reloadCurrentRoute();
        }
      },
      (err) => {
        this._commonService?.hideLoader()
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else if (err.status == 201) {
          this.toast.error('Municipality Name  Already Exists!');
        } else if (err.error.message) {
          this.toast.error(err.error.message);
        } else {
          this.toast.error('Error in submission!');
        }
      }
    );
  }

  onUpdateForm() {
    Object.keys(this.departmentForm.controls).forEach(key => {
      this.departmentForm.controls[key].markAsTouched();
    });
    this.submitted = false;
    if (this.departmentForm.invalid) {
      this.toast.error('Required fields should not be empty.', 'Error Occurred!');
      return;
    }
    let val = this.departmentForm.value;
    const data = {
      name_of_municipality: val.department_name.trim(),
      amount: val.amount,
      entity_id: this.entity_Id,
      start_date: val.startYear,
      currency_id: val.currency,
      end_date: val.endYear
    };
    this._commonService?.showLoader()
    this._configurationalMasterService.update_MunicipalityById(this.data.id, data).subscribe(
      (res: any) => {
        this._commonService?.hideLoader()
        if (res.message == "Name of Municipality Already Exists") {
          this.toast.warning('Municipality Name Already Exists!');
        }
        else {
          this.toast.success('Municipality Update Successfully');
          this.route.navigate([
            'master/configurational-master/municipality',
          ]);
          this.confirmDialog();
          this.reloadCurrentRoute();
        }
      },
      (err) => {
        this._commonService?.hideLoader()
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else if (err.status == 409) {
          this.toast.error('Municipality Name is Already Exits!');
        } else if (err.error.message) {
          this.toast.error(err.error.message);
        } else {
          this.toast.error('Error in submission!');
        }
      }
    );
  }
  confirmDialog() {
    this.dialog.close(this.departmentForm.value);
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  chosenYearHandler(normalizedYear: moment.Moment, year: Date,datepicker: any) {
    this.departmentForm.controls['startYear'].setValue(normalizedYear);
    this.departmentForm.controls['endYear'].setValue(null);
    this.updateEndDateValidation(year);
    datepicker.close();
  }
  chosenendYearHandler(normalizedYear: moment.Moment, datepicker: any) {
    this.departmentForm.controls['endYear'].setValue(normalizedYear);
    datepicker.close();
  }

  onStartDateChange(event: MatDatepickerInputEvent<Date>) {
    const startDate = event.value ? new Date(event.value) : null;
    const nextDay = startDate ? new Date(startDate) : null;
    nextDay && startDate ? nextDay.setDate(startDate.getDate() + 1) : null;
    this.minEndDate = nextDay;
    this.departmentForm.controls['endYear'].setValue(null);
  }

  muncipalityFilter(e: any) {
    const aa = e
    let filteredVariable = this.currencies2.filter((item: any) => aa.includes(item.Currency_Type));
    this.currencies = filteredVariable
  }
}
