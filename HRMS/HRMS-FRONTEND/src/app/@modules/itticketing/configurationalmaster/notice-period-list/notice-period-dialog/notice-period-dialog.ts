import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

// function noLeadingSpaces(): ValidatorFn {
//   return (control: AbstractControl): { [key: string]: boolean } | null => {
//     if (control.value && control.value.trimLeft() !== control.value) {
//       return { leadingSpaces: true };
//     }
//     return null;
//   };
// }

@Component({
  selector: 'app-notice-period-dialog',
  templateUrl: './notice-period-dialog.html',
  styleUrls: ['./notice-period-dialog.scss'],
})
export class NoticePeriodDialog {
  country_id: any;
  listAssetcategory: any;
  singleGrade: any;
  noticeperiodForm: FormGroup;
  entity_Id: any;
  loginUser: any;
  mainId: any;
  add_notice_period: any;
  editNoticePeriod: any;
  visible: any;

  constructor(
    private dialog: MatDialogRef<NoticePeriodDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _configurationalmasterService: ConfigurationalmasterService,
    private _fb: FormBuilder,
    private route: Router,
    private toaster: ToastrService
  ) {
    this.noticeperiodForm = _fb.group({
      confirm_notice_days: new FormControl(null, [Validators.required,]),
      probation_notice_days: new FormControl(null, [Validators.required,]),
      can_buy_out: [false],
      can_waive_out: [false],
    });
    this.listAssetcategory = data.id;
  }

  ngOnInit() {
    this.mainId = localStorage.getItem('EmpMainId');
    this.localStorage();
    this.add_notice_period = this.data.noticeperiod;
    this.editNoticePeriod = this.data.noticeperiod;
    this.visible = this.data.visible;
    if (this.editNoticePeriod == "edit" || this.visible) {
      this.getNoticePeriodById();
    }
  }

  localStorage() {
    let a: any = localStorage.getItem('signInUser');
    let entity: any = localStorage.getItem('selectedEntityId');
    this.loginUser = JSON.parse(a);
    this.entity_Id = JSON.parse(entity);
  }

  getNoticePeriodById() {
    this._configurationalmasterService
      .getNoticePeriodById(this.listAssetcategory)
      .subscribe((res: any) => {
        this.singleGrade = res.data;
        if (this.editNoticePeriod == 'edit') {
          this.noticeperiodForm.patchValue({
            confirm_notice_days: this.singleGrade.confirm_notice_days || '',
            probation_notice_days: this.singleGrade.probation_notice_days || '',
            can_buy_out: !!this.singleGrade.can_buy_out,
            can_waive_out: !!this.singleGrade.can_waive_out,
          });
        }
      });
  }
  onCheckboxChange(event: any): void {
    this.noticeperiodForm.patchValue({
      can_buy_out: event.checked,
    });
  }
  onCheckboxChange1(event: any): void {
    this.noticeperiodForm.patchValue({
      can_waive_out: event.checked
    });
  }


  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  ngSubmitEmp(data: any) {
    if (this.noticeperiodForm.invalid) {
      this.toaster.warning('Please fill all required fields');
      return;
    }

    const payload = {
      confirm_notice_days: data.confirm_notice_days,
      probation_notice_days: data.probation_notice_days,
      can_buy_out: data.can_buy_out || false,
      can_waive_out: data.can_waive_out || false,
      created_by: this.mainId,
      entity_id: this.entity_Id
    };

    console.log('Submitting payload:', payload); // Debug log

    if (this.listAssetcategory) {
      // UPDATE MODE
      this._configurationalmasterService.noticePeriodUpdate(this.listAssetcategory, payload).subscribe(
        (res: any) => {
          if (res.code === 409 || res.message === "Notice period already exists!") {
            this.toaster.warning('Notice period already exists!');
          } else if (res.code === 200) {
            this.toaster.success('Updated successfully!');
            this.reloadCurrentRoute();
            this.dialog.close();
            this.noticeperiodForm.reset();
          }
        },
        (err: any) => {
          console.error('Update error:', err);
          if (err.status === 400) {
            this.toaster.error('Invalid data provided!');
          } else if (err.status === 409) {
            this.toaster.warning('Notice period already exists!');
          } else if (err.status === 404) {
            this.toaster.error('Record not found!');
          } else {
            this.toaster.error('Error in submission!');
          }
        }
      );
    } else {
      // CREATE MODE
      this._configurationalmasterService.noticePeriodCreate(payload).subscribe(
        (res: any) => {
          if (res.code === 409 || res.message === "Notice period already exist for this entity!") {
            this.toaster.warning('Notice period already exist for this entity!');
          } else if (res.code === 200) {
            this.toaster.success('Added successfully!');
            this.reloadCurrentRoute();
            this.dialog.close();
            this.noticeperiodForm.reset();
          }
        },
        (err: any) => {
          console.error('Create error:', err);
          if (err.status === 400) {
            this.toaster.error('Invalid data provided!');
          } else if (err.status === 409) {
            this.toaster.error('Notice period already exist for this entity!');
          } else {
            this.toaster.error('Error in submission!');
          }
        }
      );
    }
  }
}