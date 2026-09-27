import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';


function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}


@Component({
  selector: 'app-budget-extend-dialog',
  templateUrl: './budget-extend-dialog.component.html',
  styleUrls: ['./budget-extend-dialog.component.scss']
})
export class BudgetExtendDialogComponent {
  budgetExtendForm: FormGroup;
  id: any;
  mainId: any;
  submitted: boolean | undefined;
  loginUser: any;
  loginUserID: any;
  budgetData: any;
  budgetId: any;
  view: any;
  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private _finaceservice:FinaceService,
    private route: Router,
    private activeroute: ActivatedRoute,
    public dialog: MatDialogRef<BudgetExtendDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.budgetExtendForm = this.fb.group({
      amount: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]+$/)]),
      extend_type: new FormControl(null,[Validators.required])
    });
  }
  ngOnInit() {
    if (this.data) {
      this.budgetId = this.data.id
      // this.view = this.data.view
    }
    this.mainId = localStorage.getItem('EmpMainId');
    this.activeroute.queryParams.subscribe((params) => {
      this.id = params;
    });
    let a: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a)
    this.loginUserID = this.loginUser.employee_id;
    if (this.budgetId) {
      this._finaceservice.getBudgetById(this.budgetId).subscribe((res: any) => {
        this.budgetData = res.data;
      });
    }
  }

  onSubmitForm() {
    Object.keys(this.budgetExtendForm.controls).forEach(key => {
      this.budgetExtendForm.controls[key].markAsTouched();
    });
    this.submitted = false;
    if (this.budgetExtendForm.invalid) {
      this.toast.error('Required fields should not be empty.', 'Error Occurred!');
      return;
    }
    let val = this.budgetExtendForm.value;
    const data = {
      financial_year_id: this.budgetData?.financial_year_id,
      department_id: this.budgetData?.department_id,
      type: this.budgetData?.type,
      budgetAllocatedDate: moment(new Date).format('DD-MM-YYYY'),
      amount: Number(val.amount),
      extend_type: val.extend_type,
      employee_id: this.budgetData?.employee_id,
    };
    this._finaceservice.createBudget(data).subscribe(
      (res: any) => {
        if (res.message) {
          this.toast.success('Amount Added Successfully');
        }
        this.route.navigate([
          'master/finance/budget-management/budget-master',
        ]);
        this.confirmDialog();
      },
      (err) => {
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else if (err.status == 201) {
          this.toast.error('amount Name is Already Exits!');
        } else {
          this.toast.error('Error in submission!');
        }
      }
    );
  }

  // onUpdateForm() {
  //   Object.keys(this.budgetExtendForm.controls).forEach(key => {
  //     this.budgetExtendForm.controls[key].markAsTouched();
  //   });
  //   this.submitted = false;
  //   if (this.budgetExtendForm.invalid) {
  //     this.toast.error('Required fields should not be empty.', 'Error Occurred!');
  //     return;
  //   }
  //   let val = this.budgetExtendForm.value;
  //   const data = {
  //     amount: val.amount,
  //   };
  //   this._configurationalMasterService.updateDepartment(this.data.id,data).subscribe(
  //     (res: any) => {
  //       if(res.message=="Department Name is Already Exits!"){
  //       this.toast.warning('Department Name is Already Exits!');
  //     }
  //     else{
  //       this.toast.success('Department Update Successfully');
  //     }
  //       this.route.navigate([
  //         'master/itticket/configurational-master/department',
  //       ]);
  //       this.confirmDialog();
  //       this.reloadCurrentRoute();
  //     },
  //     (err) => {
  //       if (err.status == 400) {
  //         this.toast.error('Something went Wrong!');
  //       } else if(err.status == 409){
  //         this.toast.error('Department Name is Already Exits!');
  //       }else{
  //         this.toast.error('Error in submission!');
  //       }
  //     }
  //   );
  // }
  confirmDialog() {
    this.dialog.close(this.budgetExtendForm.value);
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });}

}
