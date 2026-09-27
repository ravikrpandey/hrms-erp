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
  selector: 'app-reason-dialog',
  templateUrl: './reason-dialog.component.html',
  styleUrls: ['./reason-dialog.component.scss']
})
export class ReasonDialogComponent {
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
    private activeroute: ActivatedRoute,
    public dialog: MatDialogRef<ReasonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.departmentForm = this.fb.group({
      reason_for_recruitment: new FormControl(null, [Validators.required,noLeadingSpaces()]),
    });
  }
  ngOnInit() {
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
      this._configurationalMasterService.get_reason_ById(this.departmentId).subscribe((res: any) => {
        this.departmentData = res.data;
          this.departmentForm.patchValue({
            reason_for_recruitment: this.departmentData?.reason_for_recruitment,
          })
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
      reason_for_recruitment: val.reason_for_recruitment,
      entity_id: this.entity_Id,
    };
    this._configurationalMasterService.create_reason(data).subscribe(
      (res: any) => {
        if(res.message === "Reason Name is Already Exits!"){
        this.toast.warning('Reason Name Already Exists!');
      }
      else{
        this.toast.success('Reason Added Successfully');
        this.route.navigate([
          'master/configurational-master/reason',
        ]);
        this.confirmDialog();
        this.reloadCurrentRoute();
      }
      },
      (err) => {
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        }else if(err.error.message == "Reason Already Exists"){
          this.toast.error('Reason Name Already Exists!');
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
      reason_for_recruitment: val.reason_for_recruitment,
      entity_id: this.entity_Id,
    };
    this._configurationalMasterService.update_reason_ById(this.data.id,data).subscribe(
      (res: any) => {
        if(res.message=="Reason Name is Already Exits!"){
        this.toast.warning('Reason Name Already Exists!');
      }
      else{
        this.toast.success('Reason Update Successfully');
      }
        this.route.navigate([
          'master/configurational-master/reason',
        ]);
        this.confirmDialog();
        this.reloadCurrentRoute();
      },
      (err) => {
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else if(err.error.message == "Reason Already Exists"){
          this.toast.error('Reason Name Already Exists!');
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
