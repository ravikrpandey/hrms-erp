import { Component, Inject } from '@angular/core';
import { FormBuilder,FormControl,FormGroup,Validators,ValidatorFn,AbstractControl} from '@angular/forms';
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
  selector: 'app-add-trip-category',
  templateUrl: './add-trip-category.component.html',
  styleUrls: ['./add-trip-category.component.scss']
})
export class AddTripCategoryComponent {
  departmentForm: FormGroup;
  id: any;
  mainId: any;
  submitted: boolean | undefined;
  loginUser: any;
  loginUserID: any;
  departmentData: any;
  departmentId: any;
  view: any;
  entity_Id: any;
  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private route: Router,
    private _commonService : CommonService,
    private activeroute: ActivatedRoute,
    public dialog: MatDialogRef<AddTripCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.departmentForm = this.fb.group({
      expense_category_name: new FormControl(null, [Validators.required,noLeadingSpaces()]),
    });
  }

  ngOnInit() {
           const currentUrl = this.route.url;
       console.log(currentUrl)

    this.localStorage()
    this.departmentId = this.data?.id
    this.view = this.data?.view
    this.mainId = localStorage.getItem('EmpMainId');
    this.activeroute.queryParams.subscribe((params) => {
      this.id = params;
    });
    let a:any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a)
    this.loginUserID = this.loginUser.employee_id;
    if(this.departmentId){
      this._commonService.showLoader()
      this._configurationalMasterService.getTripExpenseCategoryById(this.departmentId).subscribe((res: any) => {
        this._commonService.hideLoader()
        this.departmentData = res.data;
          this.departmentForm.patchValue({
            expense_category_name: this.departmentData?.expense_category,
          })
      },(err:any) => {
        this._commonService.hideLoader()
      });
    }
  }
  localStorage() {
    let entity: any = localStorage.getItem('selectedEntityId');
    this.entity_Id = JSON.parse(entity);
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
      expense_category_name: val.expense_category_name,
      entity_id: this.entity_Id,
    };
    this._commonService.showLoader()
    this._configurationalMasterService.create_expense_category(data).subscribe(
      (res: any) => {
        this._commonService.hideLoader()
        if(res.message === "Expense Category Name is Already Exits!"){
        this.toast.warning('Expense Category Name Already Exists!');
      }
      else{
        this._commonService.hideLoader()
        this.toast.success('Expense Category Name Added Successfully');
        // this.route.navigate([
        //   'master/configurational-master/reason',
        // ]);
        this.confirmDialog();
        this.reloadCurrentRoute();
      }
      },
      (err) => {
        this._commonService.hideLoader()
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        }else if(err.error.message == "Expense Category Name Already Exists"){
          this.toast.error('Expense Category Name Name Already Exists!');
        }else{
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
      expense_category_name: val.expense_category_name,
      entity_id: this.entity_Id,
    };
    this._commonService.showLoader()
    this._configurationalMasterService.updateTripExpenseCategory(this.data.id,data).subscribe(
      (res: any) => {
        this._commonService.hideLoader()
        if(res.message=="Expense Category Name Already Exists"){
        this.toast.warning('Expense Category Name Already Exists');
      }
      else{
        this.toast.success('Expense Category Update Successfully');
      }
        this.route.navigate([
          'master/configurational-master/trip-category',
        ]);
        this.confirmDialog();
        this.reloadCurrentRoute();
      },
      (err) => {
        this._commonService.hideLoader()
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else if(err.error.message == "Expense Category Already Exists"){
          this.toast.error('Expense Category Already Exists!');
        }else{
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

}

