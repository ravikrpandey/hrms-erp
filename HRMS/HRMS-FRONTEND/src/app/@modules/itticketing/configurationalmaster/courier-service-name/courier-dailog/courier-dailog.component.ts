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
  selector: 'app-courier-dailog',
  templateUrl: './courier-dailog.component.html',
  styleUrls: ['./courier-dailog.component.scss']
})
export class CourierDailogComponent {
  courier_Service_id: any;
  singleData: any;
  courierServiceForm: FormGroup;
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
    private dialog: MatDialogRef<CourierDailogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _configurationalMasterService: ConfigurationalmasterService,
  ) {
    this.courierServiceForm = this.fb.group({
      courier_Service_name: new FormControl(null, [Validators.required, noLeadingSpaces()]),
    });
  }
  ngOnInit() {
    this.courier_Service_id = this.data.id
    this.view = this.data.view
    this.mainId = localStorage.getItem('EmpMainId');
    this.activeroute.queryParams.subscribe((params) => {
      this.id = params;
    });
    let a: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a)
    this.loginUserID = this.loginUser.employee_id;
    if (this.courier_Service_id) {
      this.getById()
    }
  }

  getById() {
    this._configurationalMasterService.getByIdCourier(this.courier_Service_id).subscribe((res: any) => {
      this.singleData = res.data;
      this.courierServiceForm.patchValue({
        courier_Service_name: this.singleData?.courier_Service_name,
      })
    })
  }

  onSubmitForm() {
    Object.keys(this.courierServiceForm.controls).forEach(key => {
      this.courierServiceForm.controls[key].markAsTouched();
    });
    this.submitted = false;
    if (this.courierServiceForm.invalid) {
      this.toast.error('Required fields should not be empty.', 'Error Occurred!');
      return;
    }
    let val = this.courierServiceForm.value;
    const data = {
      courier_Service_name: val.courier_Service_name,
    };
    this._configurationalMasterService.createCourier(data).subscribe(
      (res: any) => {
        if (res.message === "Courier Service Name is Already Exits!") {
          this.toast.warning('Courier Service Name is Already Exits!');
        }
        else {
          this.toast.success('Courier Service Added Successfully');
          this.route.navigate([
            'master/itticket/configurational-master/courier-service-name',
          ]);
          this.confirmDialog();
          this.reloadCurrentRoute();
        }
      },
      (err) => {
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else if (err.status == 201) {
          this.toast.error('Courier Service Name is Already Exits!');
        } else {
          this.toast.error('Error in submission!');
        }
      }
    );
  }

  onUpdateForm() {
    Object.keys(this.courierServiceForm.controls).forEach(key => {
      this.courierServiceForm.controls[key].markAsTouched();
    });
    this.submitted = false;
    if (this.courierServiceForm.invalid) {
      this.toast.error('Required fields should not be empty.', 'Error Occurred!');
      return;
    }
    let val = this.courierServiceForm.value;
    const data = {
      courier_Service_name: val.courier_Service_name,
    };
    this._configurationalMasterService.updateCourier(this.data.id, data).subscribe(
      (res: any) => {
        if (res.message == "Courier Service Name is Already Exits!") {
          this.toast.warning('Courier Service Name is Already Exits!');
        }
        else {
          this.toast.success('Courier Service Update Successfully');
          this.route.navigate([
            'master/itticket/configurational-master/courier-service-name',
          ]);
          this.confirmDialog();
          this.reloadCurrentRoute();
        }
      },
      (err) => {
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else if (err.status == 409) {
          this.toast.error('Courier Service Name is Already Exits!');
        } else {
          this.toast.error('Error in submission!');
        }
      }
    );
  }
  confirmDialog() {
    this.dialog.close(this.courierServiceForm.value);
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
}
