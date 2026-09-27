import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';
import { LeaveManagementService } from 'src/app/@shared/services/leave-managemnet/leave-management.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-add-leave',
  templateUrl: './add-leave.component.html',
  styleUrls: ['./add-leave.component.scss']
})



export class AddLeaveComponent {
  addLeave: FormGroup;
  isSubmitted: boolean = false;
  showLoader: boolean = false;
  employeeId: any;
  entity_id: any;
  financial_id: any;
  currentUrl: any;



  constructor(
    private fb: FormBuilder, private route: Router,
    private toast: ToastrService,
    private leaveManagementService: LeaveManagementService,
    public dialog: MatDialogRef<any>
  ) {
    this.addLeave = this.fb.group({
      leaveName: ['', [Validators.required]],
      leaveCode: ['', [Validators.required]],
      toggleLeaveTotal: [false],
      leaveTotal: [0],
    });




    //  Validation in leaveTotal
    this.addLeave.get('toggleLeaveTotal')?.valueChanges.subscribe((checked: any) => {
      if (checked) {
        this.addLeave.get('leaveTotal')?.setValue(0)

        this.addLeave.get('leaveTotal')?.setValidators([Validators.required]);
      } else {
        this.addLeave.get('leaveTotal')?.clearValidators();
        this.addLeave.get('leaveTotal')?.reset();
        this.addLeave.get('leaveTotal')?.setValue(0)
      }
    });



    //LOCAL STORAGE DATA============

    this.entity_id = localStorage.getItem('selectedEntityId')
    this.financial_id = localStorage.getItem('financial_id')

    let localStorageJSON: any = localStorage.getItem('signInUser')
    // Parse the JSON string into an object
    const jsonObject = JSON.parse(localStorageJSON);
    // Extract the employee_id
    this.employeeId = jsonObject.employee_id;


    console.log('entity_id :-', this.entity_id);
    console.log('financial_id :-', this.financial_id);
    console.log('employee_id :-', this.employeeId);



    //==============================


  }





  // Getter function for accessing form controls dynamically
  getFormControl(controlName: string): AbstractControl | null {
    return this.addLeave.get(controlName);
  }


  closeDialog(): void {
    // Reset form and close dialog
    this.dialog.close();
  }

  reloadCurrentRoute() {
    this.currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([this.currentUrl]);
    });
  }

  addLeaveForm(): void {
    this.isSubmitted = true;


    // Trim and validate leaveName and leaveCode
    const leaveName = this.addLeave.controls['leaveName'].value.trim();
    const leaveCode = this.addLeave.controls['leaveCode'].value.trim();

    if (!leaveName || !leaveCode) {
      this.toast.error('Leave Name and Leave Code are required and cannot be just spaces.');
      return;
    }


    // Check if leaveName and leaveCode are not empty
    if (!this.addLeave?.controls['leaveName'].value || !this.addLeave?.controls['leaveCode'].value) {


      this.toast.error('Leave Name and Leave Code are required.');
      return;
    }

    if (this.addLeave.valid) {
      this.showLoader = true;

      let formData = this.addLeave.value;
      console.log('Form Data: ', formData);


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

      console.log("BODY =>", body);

      this.leaveManagementService.AddLeaveMaster(body).subscribe(
        (res: any) => {
          this.toast.success('Leave added successfully');
          this.reloadCurrentRoute()
        },
        (err: any) => {
          this.toast.error(err.error.message);
        });


      // Close the dialog if using MatDialogRef
      this.dialog.close();
    } else {
      this.markFormGroupTouched(this.addLeave);
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


  generateLeaveCode(): void {
    try {

      let leave_name = this.addLeave?.value?.leaveName;
      if (leave_name) {
        let req = {
          leave_name: leave_name,
        }
        this.leaveManagementService.generateLeaveCode(req).subscribe(
          (res: any) => {
            this.addLeave?.patchValue({leaveCode: res?.data})
          },
          (err: any) => {
            this.toast.error(err.error.message);
          });
      }
    } catch (err) {
      console.log(err)
    }
  }


}
