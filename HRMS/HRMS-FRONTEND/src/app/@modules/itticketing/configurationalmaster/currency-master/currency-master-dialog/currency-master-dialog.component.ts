import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, EventType, Router } from '@angular/router';
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
  selector: 'app-currency-master-dialog',
  templateUrl: './currency-master-dialog.component.html',
  styleUrls: ['./currency-master-dialog.component.scss']
})
export class CurrencyMasterDialogComponent {
  currencyForm: FormGroup;
  id: any;
  mainId: any;
  submitted: boolean | undefined;
  loginUser: any;
  loginUserID: any;
  departmentData: any;
  departmentId: any;
  view: any;
  entity_id: any;
  roles: any[] = [];
  roleSelected: boolean = false;
  employees: any;
  entityList: any;
  entityIds: any;

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private route: Router,
    private activeroute: ActivatedRoute,
    public dialog: MatDialogRef<CurrencyMasterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data)
    this.currencyForm = this.fb.group({
      Currency_Type: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      rate: new FormControl(null, [Validators.required, noLeadingSpaces()]),
    });
    if (data?.id) {
      this.setData(data?.id);
    }
  }
  ngOnInit() {
    this.departmentId = this.data?.id
    this.view = this.data?.view
    this.mainId = localStorage.getItem('EmpMainId');
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.activeroute.queryParams.subscribe((params) => {
      this.id = params;
    });
    let a: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a)
    this.loginUserID = this.loginUser.employee_id;
  }

  setData(data: any) {
    this.currencyForm.patchValue({
      Currency_Type: data?.Currency_Type,
      rate: data?.rate,
    })
  }

  onSubmitForm() {
    Object.keys(this.currencyForm.controls).forEach(key => {
      this.currencyForm.controls[key].markAsTouched();
    });
    this.submitted = false;
    if (this.currencyForm.invalid) {
      this.toast.error('Required fields should not be empty.', 'Error Occurred!');
      return;
    }
    let val = this.currencyForm.value;
    const data = {
      ...val
    };
    if(this.data?.id?.Currency_Convert_id){
      data.Currency_Convert_id = this.data?.id?.Currency_Convert_id;
    }
    this._configurationalMasterService.Create_Currency(data).subscribe(
      (res: any) => {
        this.toast.success(res.message);
        this.route.navigate([
          'master/itticket/configurational-master/department',
        ]);
        this.confirmDialog();
        this.reloadCurrentRoute();
      },
      (err) => {
        this.toast.error(err.error.message)
      }
    );
  }

  confirmDialog() {
    this.dialog.close(this.currencyForm.value);
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

}
