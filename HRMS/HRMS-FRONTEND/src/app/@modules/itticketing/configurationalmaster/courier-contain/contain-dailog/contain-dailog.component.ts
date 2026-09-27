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
  selector: 'app-contain-dailog',
  templateUrl: './contain-dailog.component.html',
  styleUrls: ['./contain-dailog.component.scss']
})
export class ContainDailogComponent {
  courier_contains_id: any;
  singleData: any;
  courierContainForm: FormGroup;
  id: any;
  mainId: any;
  submitted: boolean | undefined;
  loginUser: any;
  loginUserID: any;
  view: any;
  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private dialog: MatDialogRef<ContainDailogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.courierContainForm = this.fb.group({
      courier_contains_name: new FormControl(null, [Validators.required, noLeadingSpaces()]),
    });
  }
  ngOnInit() {
    this.courier_contains_id = this.data?.id
    this.view = this.data?.view
    this.mainId = localStorage.getItem('EmpMainId');
    this.activeroute?.queryParams?.subscribe((params) => {
      this.id = params;
    });
    let a: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a)
    this.loginUserID = this.loginUser.employee_id;
    if (this.courier_contains_id) {
      this.getById();
    }
  }

  getById() {
    this._configurationalMasterService.getByIdContains(this.courier_contains_id).subscribe((res: any) => {
      this.singleData = res.data;
      this.courierContainForm.patchValue({
        courier_contains_name: this.singleData?.courier_contains_name,
      })
    })
  }

  onSubmitForm() {
    Object.keys(this.courierContainForm.controls).forEach(key => {
      this.courierContainForm.controls[key].markAsTouched();
    });
    this.submitted = false;
    if (this.courierContainForm.invalid) {
      this.toast.error('Required fields should not be empty.', 'Error Occurred!');
      return;
    }
    let val = this.courierContainForm.value;
    const data = {
      courier_contains_name: val.courier_contains_name,
    };
    this._configurationalMasterService.createContains(data).subscribe(
      (res: any) => {
        if (res.message === "Courier Contain Name is Already Exits!") {
          this.toast.warning('Courier Contain Name is Already Exits!');
        }
        else {
          this.toast.success('Courier Contain Added Successfully');
          this.route.navigate([
            'master/itticket/configurational-master/courier-contains',
          ]);
          this.confirmDialog();
          this.reloadCurrentRoute();
        }
      },
      (err) => {
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else if (err.status == 201) {
          this.toast.error('Courier Contain Name is Already Exits!');
        } else {
          this.toast.error('Error in submission!');
        }
      }
    );
  }

  onUpdateForm() {
    Object.keys(this.courierContainForm.controls).forEach(key => {
      this.courierContainForm.controls[key].markAsTouched();
    });
    this.submitted = false;
    if (this.courierContainForm.invalid) {
      this.toast.error('Required fields should not be empty.', 'Error Occurred!');
      return;
    }
    let val = this.courierContainForm.value;
    const data = {
      courier_contains_name: val.courier_contains_name,
    };
    this._configurationalMasterService.updateContains(this.data.id, data).subscribe(
      (res: any) => {
        if (res.message == "Courier Contain Name is Already Exits!") {
          this.toast.warning('Courier Contain Name is Already Exits!');
        }
        else {
          this.toast.success('Courier Contain Update Successfully');
          this.route.navigate([
            'master/itticket/configurational-master/courier-contains',
          ]);
          this.confirmDialog();
          this.reloadCurrentRoute();
        }
      },
      (err) => {
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else if (err.status == 409) {
          this.toast.error('Courier Contain Name is Already Exits!');
        } else {
          this.toast.error('Error in submission!');
        }
      }
    );
  }
  confirmDialog() {
    this.dialog.close(this.courierContainForm.value);
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
}
