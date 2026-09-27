import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ThirdPartyService } from '../../../services/third-party.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-org-type-master-form',
  templateUrl: './org-type-master-form.component.html',
  styleUrls: ['./org-type-master-form.component.scss'],
})
export class OrgTypeMasterFormComponent {
  orgTypeForm: FormGroup;

  constructor(
    private dialog: MatDialogRef<OrgTypeMasterFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private service: ThirdPartyService,
    private toast: ToastrService
  ) {
    this.orgTypeForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });
    if (data) {
      this.orgTypeForm.patchValue(data.data);
    }
  }

  onSubmit() {
    if (this.orgTypeForm.valid) {
      if (this.data.type === 'edit') {
        this.service
          .updateOrgTypeMaster(this.data.data.id, this.orgTypeForm.value)
          .subscribe(
            (response: any) => {
              this.toast.success(response.message, 'Success');
              this.dialog.close(true);
            },
            (error: HttpErrorResponse) => {
              this.toast.error(error.message, 'Error');
            }
          );
        return;
      }
      this.service.createOrgTypeMaster(this.orgTypeForm.value).subscribe(
        (response: any) => {
          this.toast.success(response.message, 'Success');
          this.dialog.close(true);
        },
        (error: HttpErrorResponse) => {
          this.toast.error(error.message, 'Error');
        }
      );
    }
  }

  onClose(): () => void {
    return () => this.dialog.close(false);
  }
}
