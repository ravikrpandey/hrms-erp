import { Component, Inject } from '@angular/core';
import { FormBuilder,FormControl,FormGroup,Validators,ValidatorFn,AbstractControl} from '@angular/forms';
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
  selector: 'app-bank-dialog',
  templateUrl: './bank-dialog.component.html',
  styleUrls: ['./bank-dialog.component.scss']
})
export class BankDialogComponent {
  departmentForm: FormGroup;
  id: any;
  mainId: any;
  submitted: boolean | undefined;
  loginUser: any;
  loginUserID: any;
  departmentData: any;
  view: any;
  bankid: any;
  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private route: Router,
    private activeroute: ActivatedRoute,
    public dialog: MatDialogRef<BankDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.departmentForm = this.fb.group({
      department_name: new FormControl(null, [Validators.required,noLeadingSpaces()]),
      bank_code: new FormControl(null, [Validators.required,noLeadingSpaces()]),
    });
  }
  ngOnInit() {
    this.bankid = this.data?.id
    console.log(this.bankid,"fdyg")
    this.view = this.data?.view
    this.mainId = localStorage.getItem('EmpMainId');
    this.activeroute.queryParams.subscribe((params) => {
      this.id = params;
    });
    let a:any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a)
    this.loginUserID = this.loginUser.employee_id;
    if(this.bankid){
      this._configurationalMasterService.getByBankID(this.bankid).subscribe((res: any) => {
        this.departmentData = res.data;
          this.departmentForm.patchValue({
            department_name: this.departmentData?.bank_name,
            bank_code: this.departmentData?.bank_code,
          })
      });
    }
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
      // "financial_id":2,
      bank_name: val.department_name,
      bank_code: val.bank_code,
      entity_id : 1,
    };
    this._configurationalMasterService.createBank(data).subscribe(
      (res: any) => {
        if(res.message === "Bank Name is Already Exits!"){
        this.toast.warning('Bank Name is Already Exits!');
      }
      else{
        this.toast.success('Bank Added Successfully');
        this.route.navigate([
          'master/configurational-master/department',
        ]);
        this.confirmDialog();
        this.reloadCurrentRoute();
      }
      },
      (err) => {
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else if(err.status == 201){
          this.toast.error('Bank Name is Already Exits!');
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
      bank_name: val.department_name,
      bank_code: val.bank_code,
      "entity_id":1,
      // "financial_id":2

    };
    this._configurationalMasterService.updateBankById(this.data.id,data).subscribe(
      (res: any) => {
        if(res.message=="Bank Name is Already Exits!"){
        this.toast.warning('Bank Name is Already Exits!');
      }
      else{
        this.toast.success('Bank Update Successfully');
      }
        this.route.navigate([
          'master/configurational-master/Bank',
        ]);
        this.confirmDialog();
        this.reloadCurrentRoute();
      },
      (err) => {
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else if(err.status == 409){
          this.toast.error('Bank Name is Already Exits!');
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
