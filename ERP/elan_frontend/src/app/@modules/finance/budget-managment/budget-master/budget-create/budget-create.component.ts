import { Component, Inject } from '@angular/core';
import { FormBuilder,FormControl,FormGroup,Validators,ValidatorFn,AbstractControl} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';


function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-budget-create',
  templateUrl: './budget-create.component.html',
  styleUrls: ['./budget-create.component.scss']
})
export class BudgetCreateComponent {
  budgetForm: FormGroup;
  id: any;
  mainId: any;
  submitted: boolean | undefined;
  loginUser: any;
  loginUserID: any;
  budgetData: any;
  budgetId: any;
  view: any;
  getAllDepartment: any;
  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private _finaceservice:FinaceService,
    private _empRegistration: EmpRegistrationService,
    private route: Router,
    private activeroute: ActivatedRoute,
    public dialog: MatDialogRef<BudgetCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.budgetForm = this.fb.group({
      financial_year_id: new FormControl(null, [Validators.required]), 
      department_id: new FormControl(null, [Validators.required]), 
      type: new FormControl(null, [Validators.required,noLeadingSpaces()]),  
      amount: new FormControl(null, [Validators.required]),
    });
  }
  ngOnInit() {
    this.getAllDepartment_dropDown();
    if(this.data){
      this.budgetId = this.data.id
      this.view = this.data.view
    }
    let a:any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a)
    this.loginUserID = this.loginUser.employee_id;
    this.activeroute.queryParams.subscribe((params) => {
      this.id = params;
    });
    if(this.budgetId){
      this._finaceservice.getBudgetById(this.budgetId).subscribe((res: any) => {
        this.budgetData = res.data;
          this.budgetForm.patchValue({
            financial_year_id: this.budgetData?.financial_year_id, 
            department_id: this.budgetData?.department_id, 
            type: this.budgetData.type,  
            budgetAllocatedDate: this.budgetData?.budgetAllocatedDate, 
            amount: this.budgetData?.amount,
            employee_id: this.budgetData?.employee_id,
          })
      });
    }
  }
  getAllDepartment_dropDown() {
    this._empRegistration.getAllDepartment_dropDown().subscribe(
      (res) => {

        this.getAllDepartment = res.data.filter((res: any)=> res.status == "ACTIVE");
      }
    );
  };
  onSubmitForm() {
    Object.keys(this.budgetForm.controls).forEach(key => {
      this.budgetForm.controls[key].markAsTouched();
    });
    this.submitted = false;
    if (this.budgetForm.invalid) {
      this.toast.error('Required fields should not be empty.', 'Error Occurred!');
      return;
    }
    let val = this.budgetForm.value;
    const data = {
      financial_year_id: val.financial_year_id, 
      department_id: val.department_id, 
      type: val.type,  
      budgetAllocatedDate: moment(new Date).format('DD-MM-YYYY'), 
      amount: val.amount,
      employee_id: this.loginUserID,
    };
    
    this._finaceservice.createBudget(data).subscribe(
      (res: any) => {
        if(res.message === "Budget Updated Successfully"){
        this.toast.warning('Budget Already Exists And Updated Successfully');
      }
      else{
        this.toast.success('Budget Added Successfully');
      }
        this.route.navigate([
          'master/finance/budget-management/budget-master',
        ]);
        this.confirmDialog();
        this.reloadCurrentRoute();
      },
      (err) => {
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else if(err.status == 409){
          this.toast.error('Budget is Already Exits!');
        }else{
          this.toast.error('Error in submission!');
        }
      }
    );
  }

  onUpdateForm() {
    Object.keys(this.budgetForm.controls).forEach(key => {
      this.budgetForm.controls[key].markAsTouched();
    });
    this.submitted = false;
    if (this.budgetForm.invalid) {
      this.toast.error('Required fields should not be empty.', 'Error Occurred!');
      return;
    }
    let val = this.budgetForm.value;
    const data = {
      financial_year_id: val.financial_year_id, 
      department_id: val.department_id, 
      type: val.type,  
      budgetAllocatedDate: val.budgetAllocatedDate, 
      amount: val.amount,
      employee_id: this.loginUserID,
    };
    this._finaceservice.updateBudget(this.data.id,data).subscribe(
      (res: any) => {
        if(res.message=="Budget Name is Already Exits!"){
        this.toast.warning('Budget Name is Already Exits!');
      }
      else{
        this.toast.success('Budget Update Successfully');
      }
        this.route.navigate([
          'master/finance/budget-management/budget-master',
        ]);
        this.confirmDialog();
        this.reloadCurrentRoute();
      },
      (err) => {
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else if(err.status == 409){
          this.toast.error('Budget Name is Already Exits!');
        }else{
          this.toast.error('Error in submission!');
        }
      }
    );
  }
  confirmDialog() {
    this.dialog.close(this.budgetForm.value);
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });}
}
