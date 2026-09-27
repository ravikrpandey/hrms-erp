import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
// import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-designation-dialog',
  templateUrl: './designation-dialog.component.html',
  styleUrls: ['./designation-dialog.component.scss']
})
export class DesignationDialogComponent {
  designation_id: any;
  singleCountryData: any;
  designationForm: FormGroup
  constructor(
    private dialog: MatDialogRef<DesignationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _configurationalmasterService: ConfigurationalmasterService,
    private _commonService : CommonService,
     public _fb: FormBuilder, public toaster: ToastrService, public route: Router
  ) {
    this.designation_id = Number(data.id);
    this.designationForm = this._fb.group({
      designation_name: new FormControl(null, [Validators.required, noLeadingSpaces()]),
    })
  }
  editDesignation: any
  addDesignation: any;
  visibility: any;
  ngOnInit() {
    if (this.designation_id) {
      this.getByIdDesignation();
    }
    this.addDesignation = this.data.data;
    this.editDesignation = this.data.edit;
    this.visibility = this.data.view;
  }

  getByIdDesignation() {
    this._configurationalmasterService.designationById(this.designation_id).subscribe((res: any) => {
      this.singleCountryData = res.data;
      this._commonService?.showLoader()
      if (this.designation_id) {
        this.designationForm.patchValue({
          designation_name: this.singleCountryData?.designation_name
        })
      }
      this._commonService?.hideLoader()
    },(err:any) => {
      this._commonService?.hideLoader()
    })
  }
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  ngSubmitDesignation(data: any) {
    if (this.designationForm.invalid) {
      this.designationForm.markAllAsTouched();
      this.toaster.error('Required fields should not be empty.', 'Error Occurred!');

      return
    }
    data.value.designation_name=data.value.designation_name.trim()
    if (this.editDesignation == 'Designation') {
      this._commonService?.showLoader()
      this._configurationalmasterService.updateDesignation(this.designation_id, data.value).subscribe((res: any) => {
        if (res) {
          this._commonService?.hideLoader()
          if (res.message == "Designation Name is Already Exits!") {
            this.toaster.warning('Designation Name Already Exists!');
          }
          else {
            this.toaster.success('Designation Updated Successfully');
            this.reloadCurrentRoute();
            this.dialog.close();
          }
        }
      }, (err: any) => {
        this._commonService?.hideLoader()
        if (err.status == 400) {
          this.toaster.error('Something went Wrong!');
        } else if (err.status == 409) {
          this.toaster.error('Designation Name Already Exists!');
        } else {
          this.toaster.error('Error in submission!');
        }
      })
    }
    if (this.addDesignation == 'Add_Designation') {
      this._commonService?.showLoader()
      if (this.designationForm.invalid) {
        this.designationForm.markAllAsTouched()
        return
      }
      this._configurationalmasterService.createDesignation(data.value).subscribe((res: any) => {
        this._commonService?.hideLoader()
        if (res) {
          if (res.message === "Designation Name Already Exists!") {
            this.toaster.warning('Designation Name Already Exists!');
          }
          else {
            this.toaster.success('Designation Added Successfully');
            this.dialog.close();
            this.reloadCurrentRoute()
          }
        }
      }, (err: any) => {
        this._commonService?.hideLoader()
        if (err.status == 400) {
          this.toaster.error('Something went Wrong!');
        } else if (err.status == 201) {
          this.toaster.error('Designation Name Already Exists!');
        } else {
          this.toaster.error('Error in submission!');
        }
      })
    }
  }
}



