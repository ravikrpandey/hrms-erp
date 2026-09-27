import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { CommonService } from 'src/app/@shared/services/common.service';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-allowance-create',
  templateUrl: './allowance-create.component.html',
  styleUrls: ['./allowance-create.component.scss']
})
export class AllowanceCreateComponent {
  AllowanceForm: FormGroup;
  id: any;
  mainId: any;
  submitted: boolean | undefined;
  loginUser: any;
  loginUserID: any;
  allowanceData: any;
  allowanceid: any;
  view: any;
  entity_id: any;
  allownceData: any;
  allemp: any;
  // Domestic_Allowance: any;
  // International_Allowance: any;
  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private _commonService: CommonService,
    public dialog: MatDialogRef<AllowanceCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.AllowanceForm = this.fb.group({
      allowance_name: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      Domestic_Allowance: new FormControl(null, [Validators.required]),
      International_Allowance: new FormControl(null, [Validators.required]),
      amount_type: new FormControl(null),
      // employee_id: new FormControl(null,[Validators.required]),
    });
    console.log(data, 'this.cellValue');
    this.allownceData = data?.data;
  }
  ngOnInit() {
    
    this.allowanceid = this.data?.id
    this.view = this.data?.view
    this.mainId = localStorage.getItem('EmpMainId');
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.get_all_employe()
    this.activeroute.queryParams.subscribe((params) => {
      this.id = params;
    });
    let a: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a)
    this.loginUserID = this.loginUser.employee_id;
    if (this.allowanceid) {
      this._commonService.showLoader()
      this._configurationalMasterService.allowanceGetByID(this.allowanceid).subscribe((res: any) => {
        this._commonService.hideLoader()
        this.allowanceData = res.data;
        this.AllowanceForm.patchValue({
          allowance_name: this.allowanceData?.allowance_name,
          Domestic_Allowance: this.allowanceData?.domestic_allowance,
          International_Allowance: this.allowanceData?.international_allowance,
          amount_type: this.allowanceData?.amount_type == 'NON_TAXABLE' ? null : this.allowanceData?.amount_type,
          // employee_id: this.allowanceData?.employee_id,
        })
      },(err:any) => {
        this._commonService.hideLoader()
      });
    }
  }

  get_all_employe() {
    this._configurationalMasterService.get_all_employe(this.entity_id).subscribe((res: any) => {
      this.allemp = res.data;

    })
  }

  onSubmitForm() {
    // Object.keys(this.AllowanceForm.controls).forEach(key => {
    //   this.AllowanceForm.controls[key].markAsTouched();
    // });
    this.submitted = false;
    if (this.AllowanceForm.invalid) {
      this.toast.error('Required fields should not be empty.', 'Error Occurred!');
      return;
    }
    let val = this.AllowanceForm.value;
    let financial_id = localStorage.getItem("financial_id");
    const data = {
      allowance_name: val.allowance_name,
      domestic_allowance: val.Domestic_Allowance,
      international_allowance: val.International_Allowance,
      // employee_id: val.employee_id,
      entity_id: this.entity_id,
      financial_id: financial_id,
      amount_type: !val?.amount_type ? 'NON_TAXABLE' : val?.amount_type,
    };
    
    this._commonService.showLoader()
    this._configurationalMasterService.createAllownce(data).subscribe(
      (res: any) => {
        this._commonService.hideLoader()
        if (res.message === "Allowance Name is Already Exits!") {
          this.toast.warning('Allowance Name is Already Exits!');
        }
        else {
          this.toast.success('Allowance Added Successfully');
          // this.route.navigate([
          //   'master/itticket/configurational-master/department',
          // ]);
          this.confirmDialog();
          this.reloadCurrentRoute();
        }
      },
      (err) => {
        this._commonService.hideLoader()
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else if (err.status == 201) {
          this.toast.error('Allowance Name is Already Exits!');
        } else {
          this.toast.error('Allowance Name Already Exisiting!');
        }
      }
    );
  }

  onUpdateForm() {
    Object.keys(this.AllowanceForm.controls).forEach(key => {
      this.AllowanceForm.controls[key].markAsTouched();
    });
    this.submitted = false;
    if (this.AllowanceForm.invalid) {
      this.toast.error('Required fields should not be empty.', 'Error Occurred!');
      return;
    }
    let val = this.AllowanceForm.value;
    let financial_id = localStorage.getItem("financial_id");
    const data = {
      allowance_name: val.allowance_name,
      domestic_allowance: val.Domestic_Allowance,
      international_allowance: val.International_Allowance,
      // employee_id: val.employee_id,
      entity_id: this.entity_id,
      financial_id: financial_id,
      amount_type: !val?.amount_type ? 'NON_TAXABLE' : val?.amount_type,
    };
    
    this._commonService.showLoader()
    this._configurationalMasterService.Allowance_Data_updateById(this.data.id, data).subscribe(
      (res: any) => {
        this._commonService.hideLoader()
        if (res.message == "Allowance Name is Already Exits!") {
          this.toast.warning('Allowance Name is Already Exits!');
        }
        else {
          this.toast.success('Allowance Updated Successfully');
        }
        this.route.navigate([
          'master/itticket/configurational-master/department',
        ]);
        this.confirmDialog();
        this.reloadCurrentRoute();
      },
      (err) => {
        this._commonService.hideLoader()
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else if (err.status == 409) {
          this.toast.error('Allowance Name is Already Exits!');
        } else {
          this.toast.error('Error in submission!');
        }
      }
    );
  }
  confirmDialog() {
    this.dialog.close(this.AllowanceForm.value);
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === '-' || event.key === '+') {
      event.preventDefault();
    }
  }

  onCheckboxChange(event: any): void {
    
    if (event.checked) {
      this.AllowanceForm.get('amount_type')?.setValue('TAXABLE');
    }
    else {
      this.AllowanceForm.get('amount_type')?.setValue(null);
    }
  }

}
