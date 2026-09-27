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
  selector: 'app-expense-category-dialog',
  templateUrl: './expense-category-dialog.component.html',
  styleUrls: ['./expense-category-dialog.component.scss']
})
export class ExpenseCategoryDialogComponent {
  country_id: any;
  expenseId: any;
  singleData: any;
  expenseCategoryForm: FormGroup;
  id: any;
  mainId: any;
  submitted: boolean | undefined;
  loginUser: any;
  loginUserID: any;
  view: any;
  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private dialog: MatDialogRef<ExpenseCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _configurationalMasterService: ConfigurationalmasterService
  ) {
    this.expenseCategoryForm = this.fb.group({
      expenseforCopy_name: new FormControl(null, [Validators.required, noLeadingSpaces()]),
    });
  }
  ngOnInit() {
    this.expenseId = this.data.id
    this.view = this.data.view
    this.mainId = localStorage.getItem('EmpMainId');
    this.activeroute.queryParams.subscribe((params) => {
      this.id = params;
    });
    let a: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a)
    this.loginUserID = this.loginUser.employee_id;
    if (this.expenseId) {
      this.getByIdExpense();
    }
  }

  getByIdExpense() {
    this._configurationalMasterService
      .getByIdExpense(this.expenseId)
      .subscribe((res: any) => {
        this.singleData = res.data;
        this.expenseCategoryForm.patchValue({
          expenseforCopy_name: this.singleData?.expenseforCopy_name,
        })
      });
  }
  onSubmitForm() {
    Object.keys(this.expenseCategoryForm.controls).forEach(key => {
      this.expenseCategoryForm.controls[key].markAsTouched();
    });
    this.submitted = false;
    if (this.expenseCategoryForm.invalid) {
      this.toast.error('Required fields should not be empty.', 'Error Occurred!');
      return;
    }
    let val = this.expenseCategoryForm.value;
    const data = {
      expenseforCopy_name: val.expenseforCopy_name,
    };
    this._configurationalMasterService.ExpenseCreate(data).subscribe(
      (res: any) => {
        if (res.message === "expenseforCopy_name is already Exits!") {
          this.toast.warning('Expense Category Name is Already Exits!');
        }
        else {
          this.toast.success('Expense Category Added Successfully');
          this.route.navigate([
            'master/itticket/configurational-master/expense-category',
          ]);
          this.confirmDialog();
          this.reloadCurrentRoute();
        }
      },
      (err) => {
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else if (err.status == 201) {
          this.toast.error('Expense Category Name is Already Exits!');
        } else {
          this.toast.error('Error in submission!');
        }
      }
    );
  }

  onUpdateForm() {
    Object.keys(this.expenseCategoryForm.controls).forEach(key => {
      this.expenseCategoryForm.controls[key].markAsTouched();
    });
    this.submitted = false;
    if (this.expenseCategoryForm.invalid) {
      this.toast.error('Required fields should not be empty.', 'Error Occurred!');
      return;
    }
    let val = this.expenseCategoryForm.value;
    const data = {
      expenseforCopy_name: val.expenseforCopy_name,
    };
    this._configurationalMasterService.updateExpense(this.data.id, data).subscribe(
      (res: any) => {
        if (res.message == "expenseforCopy_name is already Exits!") {
          this.toast.warning('Expense Category Name is Already Exits!');
        }
        else {
          this.toast.success('Expense Category Update Successfully');
          this.route.navigate([
            'master/itticket/configurational-master/expense-category',
          ]);
          this.confirmDialog();
          this.reloadCurrentRoute();
        }
      },
      (err) => {
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else if (err.status == 409) {
          this.toast.error('Expense Category Name is Already Exits!');
        } else {
          this.toast.error('Error in submission!');
        }
      }
    );
  }
  confirmDialog() {
    this.dialog.close(this.expenseCategoryForm.value);
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
}
