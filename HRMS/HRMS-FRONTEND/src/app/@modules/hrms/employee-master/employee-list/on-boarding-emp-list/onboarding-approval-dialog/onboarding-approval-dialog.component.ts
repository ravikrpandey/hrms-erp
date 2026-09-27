import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { OnboardingService } from 'src/app/@shared/services/service/recruitment/onboarding.service';
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
  selector: 'app-onboarding-approval-dialog',
  templateUrl: './onboarding-approval-dialog.component.html',
  styleUrls: ['./onboarding-approval-dialog.component.scss']
})
export class OnboardingApprovalDialogComponent {
  designation_id: any;
  singleCountryData: any;
  designationForm: FormGroup
  constructor(
    private dialog: MatDialogRef<OnboardingApprovalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _configurationalmasterService: ConfigurationalmasterService,
    public _fb: FormBuilder,
    public toaster: ToastrService,
    public route: Router,
    public $onboarding: OnboardingService,
  ) {
    this.designation_id = Number(data.id);
    this.designationForm = this._fb.group({
      employee_official_email: new FormControl(null, [Validators.required, noLeadingSpaces()]),
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
      if (this.designation_id) {
        this.designationForm.patchValue({
          designation_name: this.singleCountryData?.designation_name
        })
      }
    })
  }
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  ngSubmitDesignation() {
    let entity_id = localStorage.getItem("selectedEntityId")
    let val = {
      ...this.designationForm?.value,
      candidate_id: this.data?.data?.candidate_id,
      status: 'ACTIVE',
      primary_entity_id:entity_id
    }
    this.$onboarding.update_onboarded_employee_status(val).subscribe((res: any) => {
      if (res) {
        this.toaster.success(res?.message);
        this.dialog.close(true);
      }
    }, (err: any) => {
      console.log(err)
    })
  }
}