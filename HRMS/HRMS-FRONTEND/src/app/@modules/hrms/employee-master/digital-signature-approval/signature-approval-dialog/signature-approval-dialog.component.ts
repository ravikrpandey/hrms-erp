import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { DialogRef } from '@angular/cdk/dialog';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-signature-approval-dialog',
  templateUrl: './signature-approval-dialog.component.html',
  styleUrls: ['./signature-approval-dialog.component.scss'],
})
export class SignatureApprovalDialogComponent {
  areaForm: FormGroup;
  submitted: boolean | undefined;
  public mainId: string | null = '';
  public signatureId: string | undefined;

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private _commonService: CommonService,
    public dialog: MatDialogRef<SignatureApprovalDialogComponent>,
    private _empService: EmpRegistrationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.areaForm = this.fb.group({
      remark: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      status: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.mainId = localStorage.getItem('EmpMainId');
    this.signatureId = this.data?.id;
  }

  onSubmitForm() {
    Object.keys(this.areaForm.controls).forEach((key) => {
      this.areaForm.controls[key].markAsTouched();
    });
    this.submitted = false;
    if (this.areaForm.invalid) {
      this.toast.error(
        'Required fields should not be empty!',
        'Error Occurred!'
      );
      return;
    }
    let val = this.areaForm.value;

    const data = {
      remark: val.remark,
      status: val.status,
    };

    this._commonService?.showLoader();
    this._empService.digitalSignatureApproved(this.signatureId, data).subscribe(
      (res: any) => {
        this._commonService?.hideLoader();
        this.dialog.close();
        this.toast.success(res.message);
        this.route.navigate([
          '/master/hrms/employee-master/employee-digital-signature',
        ]);
      },
      (error: any) => {
        this._commonService?.hideLoader();
        this.toast.error(error.error.message);
      }
    );
  }

  confirmDialog() {
    this.dialog.close(this.areaForm.value);
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
}
