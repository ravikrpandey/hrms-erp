import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';
import Swal from 'sweetalert2';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}
@Component({
  selector: 'app-remark-dilog',
  templateUrl: './remark-dilog.component.html',
  styleUrls: ['./remark-dilog.component.scss']
})
export class RemarkDilogComponent {
  travereqid: any;
  getData: any = [];
  remarksForm: FormGroup;
  loginUser: any;

  constructor(
    public dialog: MatDialogRef<RemarkDilogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toaster: ToastrService,
    private route: Router,
    public travelService: TravelRequestService,
    private fb: FormBuilder
  ) {
    this.travereqid = this.data;
    console.log(this.data)
    this.remarksForm = this.fb.group({
      remarks: new FormControl(null, [Validators.required,noLeadingSpaces()]),
    })
  }

  ngOnInit(): void {
    this.localStorage();
  }

  localStorage() {
    let a: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a);
  }

  approve() {
    if (this.remarksForm.invalid) {
      this.toaster.error('Please fill in all required fields');
      return;
    }
    let val = this.remarksForm.value;
    const payload = {
      "approvel_status": "APPROVED", "employee_id": this.loginUser.employee_id, remarks: val.remarks,
    }
    Swal.fire({
      title: 'Are you sure you want to approve it?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.travelService.travel_approve_level(this.travereqid, payload).subscribe(
          (res) => {

            this.toaster.success('Approved successfully');
            this.travelService.changeStatus('1');
            this.dialog.close();
            this.route.navigate(['/master/ess/approve-travel-request/travel-request-approval-list'])

          },
          (err) => {
            this.toaster.error("Somthing went wrong Please try agin", "Error Message")

          }
        )
      }
    });
  }

  reject() {
    if (this.remarksForm.invalid) {
      this.toaster.error('Please fill in all required fields');
      return;
    }
    let val = this.remarksForm.value;
    const payload = {
      "approvel_status": "REJECTED", "employee_id": this.loginUser.employee_id, remarks: val.remarks,
    }
    Swal.fire({
      title: 'Are you sure you want to reject it?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.travelService.travel_approve_level(this.travereqid, payload).subscribe(
          (res) => {

            this.toaster.success('Rejected successfully');
            this.travelService.changeStatus('2');
            this.route.navigate(['/master/ess/approve-travel-request/travel-request-approval-list'])
          },
          (err) => {
            this.toaster.error("Somthing went wrong Please try agin", "Error Message")

          }
        )
      }
    });

  }
}
