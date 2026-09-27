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
  selector: 'app-contract-type-dialog',
  templateUrl: './contract-type-dialog.component.html',
  styleUrls: ['./contract-type-dialog.component.scss']
})
export class ContarctTypeDialogComponent {
  departmentForm: FormGroup;
  id: any;
  mainId: any;
  submitted: boolean | undefined;
  loginUser: any;
  loginUserID: any;
  departmentData: any;
  departmentId: any;
  view: any;
  entity_id: string | null;
  financial_id: string | null;
  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private route: Router,
    private activeroute: ActivatedRoute,
    public dialog: MatDialogRef<ContarctTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.departmentForm = this.fb.group({
      contract_type: new FormControl(null, [Validators.required,noLeadingSpaces()]),
    });
  }
  ngOnInit() {
    this.departmentId = this.data?.id
    this.view = this.data?.view
    this.mainId = localStorage.getItem('EmpMainId');
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_id = localStorage.getItem('financial_id');
    this.activeroute.queryParams.subscribe((params) => {
      this.id = params;
    });
    let a:any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a)
    this.loginUserID = this.loginUser.employee_id;
    if(this.departmentId){
      this._configurationalMasterService.get_ContractById(this.departmentId).subscribe((res: any) => {
        this.departmentData = res.data;
          this.departmentForm.patchValue({
            contract_type: this.departmentData?.contract_type,
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
      contract_type: val.contract_type,
      entity_id:Number(this.entity_id),
      financial_id:Number(this.financial_id)
    };
    this._configurationalMasterService.createContractType(data).subscribe(
      (res: any) => {
        if(res.message === "Contract-Type Name is Already Exits!"){
        this.toast.warning('Contract-Type Name Already Exists!');
      }
      else{
        this.toast.success('Contract-Type Added Successfully');
        this.route.navigate([
          'master/configurational-master/contract-type',
        ]);
        this.confirmDialog();
        this.reloadCurrentRoute();
      }
      },
      (err) => {
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else if(err.status == 201){
          this.toast.error('Contract-Type Name is Already Exits!');
        }else if(err.error.message){
          this.toast.error(err.error.message);
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
      contract_type: val.contract_type,
      entity_id:Number(this.entity_id),
      financial_id:Number(this.financial_id)
    };
    this._configurationalMasterService.update_ContractById(this.data.id,data).subscribe(
      (res: any) => {
        if(res.message=="Contract-Type Name is Already Exits!"){
        this.toast.warning('Contract-Type Name is Already Exits!');
      }
      else{
        this.toast.success('Contract-Type Update Successfully');
      }
        this.route.navigate([
          'master/configurational-master/contract-type',
        ]);
        this.confirmDialog();
        this.reloadCurrentRoute();
      },
      (err) => {
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else if(err.status == 409){
          this.toast.error('Contract-Type Name is Already Exits!');
        }else if(err.error.message){
          this.toast.error(err.error.message);
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
