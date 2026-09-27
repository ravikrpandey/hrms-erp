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
  selector: 'app-amc-dailog',
  templateUrl: './amc-dailog.component.html',
  styleUrls: ['./amc-dailog.component.scss']
})
export class AmcDailogComponent {
  amc_description_id: any;
  singleData: any;
  amcdescriptionForm: FormGroup;
  id: any;
  mainId: any;
  submitted: boolean | undefined;
  loginUser: any;
  loginUserID: any;
  departmentData: any;
  view: any;
  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private dialog: MatDialogRef<AmcDailogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _configurationalmasterService: ConfigurationalmasterService,
  ) {
    this.amcdescriptionForm = this.fb.group({
      amc_description: new FormControl(null, [Validators.required,noLeadingSpaces()]),
    });
  }
  ngOnInit() {
    this.amc_description_id = this.data.id
    this.view = this.data.view
    this.mainId = localStorage.getItem('EmpMainId');
    this.activeroute.queryParams.subscribe((params) => {
      this.id = params;
    });
    let a: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a)
    this.loginUserID = this.loginUser.employee_id;
    if (this.amc_description_id) {
      this.getById();
    }
  }

  getById() {
    this._configurationalmasterService.getAmcDesById(this.amc_description_id).subscribe((res: any) => {
      this.singleData = res.data;
      this.amcdescriptionForm.patchValue({
        amc_description: this.singleData?.amc_description,
      })
    })
  }

  onSubmitForm() {
    Object.keys(this.amcdescriptionForm.controls).forEach(key => {
      this.amcdescriptionForm.controls[key].markAsTouched();
    });
    this.submitted = false;
    if (this.amcdescriptionForm.invalid) {
      this.toast.error('Required fields should not be empty.', 'Error Occurred!');
      return;
    }
    let val = this.amcdescriptionForm.value;
    const data = {
      amc_description: val.amc_description,
    };
    this._configurationalMasterService.createAmcDes(data).subscribe(
      (res: any) => {
        if (res.message === "AMC Description Name is Already Exits!") {
          this.toast.warning('AMC Description Name is Already Exits!');
        }
        else {
          this.toast.success('AMC Description Added Successfully');
          this.route.navigate([
            'master/itticket/configurational-master/amc-discription',
          ]);
          this.confirmDialog();
          this.reloadCurrentRoute();
        }
      },
      (err) => {
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else if (err.status == 201) {
          this.toast.error('AMC Description Name is Already Exits!');
        } else {
          this.toast.error('Error in submission!');
        }
      }
    );
  }

  onUpdateForm() {
    Object.keys(this.amcdescriptionForm.controls).forEach(key => {
      this.amcdescriptionForm.controls[key].markAsTouched();
    });
    this.submitted = false;
    if (this.amcdescriptionForm.invalid) {
      this.toast.error('Required fields should not be empty.', 'Error Occurred!');
      return;
    }
    let val = this.amcdescriptionForm.value;
    const data = {
      amc_description: val.amc_description,
    };
    this._configurationalMasterService.updateAmcDes(this.data.id, data).subscribe(
      (res: any) => {
        if (res.message == "AMC Description Name is Already Exits!") {
          this.toast.warning('AMC Description Name is Already Exits!');
        }
        else {
          this.toast.success('AMC Description Update Successfully');
          this.route.navigate([
            'master/itticket/configurational-master/amc-discription',
          ]);
          this.confirmDialog();
          this.reloadCurrentRoute();
        }
      },
      (err) => {
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else if (err.status == 409) {
          this.toast.error('AMC Description Name is Already Exits!');
        } else {
          this.toast.error('Error in submission!');
        }
      }
    );
  }
  confirmDialog() {
    this.dialog.close(this.amcdescriptionForm.value);
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

}
