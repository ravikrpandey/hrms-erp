import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LeaveManagementService } from 'src/app/@shared/services/leave-managemnet/leave-management.service';

@Component({
  selector: 'app-edit-leave',
  templateUrl: './edit-leave.component.html',
  styleUrls: ['./edit-leave.component.scss']
})
export class EditLeaveComponent {
  editLeave: FormGroup;
  isSubmitted: boolean = false;
  showLoader: boolean = false;
  leaveId: any;
  employeeId: any;
  financial_id: any
  entity_id: any
  pageMode: any
  showButton: boolean;


  constructor(
    private fb: FormBuilder, private route: Router,
    public dialog: MatDialogRef<any>,
    private toast: ToastrService,
    private leaveManagementService: LeaveManagementService,
    public dialogRef: MatDialogRef<EditLeaveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.leaveId = data.leaveId;
    this.pageMode = data.pageMode;

    this.getLeaveMasterById(this.leaveId);

    this.editLeave = this.fb.group({
      leaveName: ['', [Validators.required, Validators.minLength(2)]],
      // leaveCode: ['', [Validators.required, Validators.pattern(/^\d+$/), Validators.minLength(1), Validators.maxLength(5)]],
      leaveCode: [''],
      toggleLeaveTotal: [false],
      leaveTotal: [0],
    });


    if (this.pageMode === 'viewMode') {
      this.showButton = false;
      // this.editLeave.get('leaveName')?.disable();
      // this.editLeave.get('leaveCode')?.disable();
      // this.editLeave.get('toggleLeaveTotal')?.disable();
      // this.editLeave.get('leaveTotal')?.disable();
      // You can disable other controls as needed
    } else {
      this.showButton = true;
      this.editLeave.get('leaveName')?.enable();
      this.editLeave.get('leaveCode')?.enable();
      this.editLeave.get('toggleLeaveTotal')?.enable();
      this.editLeave.get('leaveTotal')?.enable();
      // You can enable other controls as needed
    }


    //LOCAL STORAGE DATA============

    this.entity_id= localStorage.getItem('selectedEntityId')
    this.financial_id = localStorage.getItem('financial_id')

    let localStorageJSON: any = localStorage.getItem('signInUser')
    // Parse the JSON string into an object
    const jsonObject = JSON.parse(localStorageJSON);
    // Extract the employee_id
    this.employeeId = jsonObject.employee_id;

    //==============================



    // Validation in leaveTotal
    this.editLeave.get('toggleLeaveTotal')?.valueChanges.subscribe((checked: any) => {
      if (checked) {
        this.editLeave.get('leaveTotal')?.setValue(0);
        this.editLeave.get('leaveTotal')?.setValidators([Validators.required]);
      } else {
        this.editLeave.get('leaveTotal')?.clearValidators();
        this.editLeave.get('leaveTotal')?.reset();
        this.editLeave.get('leaveTotal')?.setValue(0);
      }
      this.editLeave.get('leaveTotal')?.updateValueAndValidity();
    });
  }



  closeDialog(): void {
    // Reset form and close dialog
    this.dialog.close();
  }



  getLeaveMasterById(leaveId: any) {
    this.leaveManagementService.GetLeaveMasterById(leaveId).subscribe(
      (res: any) => {
        let formData = res.data;

        if (formData.total_available !== null) {
          this.editLeave.patchValue({ toggleLeaveTotal: true })
        }

        this.editLeave.patchValue({
          leaveName: formData.leave_name,
          leaveCode: formData.leave_code,
          toggleLeaveTotal: !!formData.total_available,
          leaveTotal: formData.total_available,
        });
      },
      (err: any) => {
        console.log('Policy Detail => ', err.error.message);
      }
    );
  }


    // Getter function for accessing form controls dynamically
    getFormControl(controlName: string): AbstractControl | null {
      return this.editLeave.get(controlName);
    }


  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  editLeaveForm(): void {
    this.isSubmitted = true;

    if (this.editLeave.valid) {
      this.showLoader = true;

      let formData = this.editLeave.value;
      const body = {
        "leave_name": `${formData.leaveName}`,
        "leave_code": `${formData.leaveCode}`,
        "leave_total": `${formData.leaveTotal}`,
        "financial_year_id": this.financial_id,
        "entity_id": this.entity_id,
        "employee_id": this.employeeId,
        "is_status": "ACTIVE",
        "isDeleted": 0
      };


      this.leaveManagementService.UpdateLeaveMasterById(this.leaveId, body).subscribe(
        (res: any) => {
          this.reloadCurrentRoute()
          this.toast.success('Leave updated successfully');
          this.closeDialog();

        },
        (err: any) => {
          this.toast.error(err.error.message);
        }
      );
    } else {
      this.markFormGroupTouched(this.editLeave);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}