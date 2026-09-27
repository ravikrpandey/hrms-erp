import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
// import { ApplyLeaveDialogComponent } from '../leave-apply-list/apply-leave-dialog/apply-leave-dialog.component';
import Swal from 'sweetalert2';
import { LeaveApplyService } from 'src/app/@shared/services/ess/leave-apply.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';




@Component({
  selector: 'app-applied-leave-action',
  templateUrl: './applied-leave-action.component.html',
  styleUrls: ['./applied-leave-action.component.scss']
})
export class AppliedLeaveActionComponent {


  
  leave_id: any;
  leaveId: any;
  paramsVal: any;
  employeeId: any;
  signInUser: string | null;
  public cellValue: any;




  constructor(private route: Router,
    public dialog: MatDialog,
    private emp_master: EmpMasterService,
    private LeaveApplyService: LeaveApplyService,
    private toast: ToastrService, private _rabcService: RbacMasterService,) {
  }

  ngOnInit(): void {
    // Retrieve the stored JSON string from localStorage
    this.signInUser = localStorage.getItem('signInUser');
    if (this.signInUser) {
      // Parse the JSON string to get the JavaScript object
      const userObject = JSON.parse(this.signInUser);

      // Access the employee_id field from the parsed object
      this.employeeId = userObject.employee_id;
      console.log("THE EMPLOYEE ID ", this.employeeId);
    } else {
      console.error("No signInUser found in localStorage");
    }
  }



  agInit(params: ICellRendererParams): void {
    this.leaveId = params.data.id
    this.paramsVal = params.data.emptype_id;
    this.cellValue = this.getValueToDisplay(params);
  }


  getValueToDisplay(params: ICellRendererParams) {
    this.leave_id = params.data.emp_leave_id
    return params.valueFormatted ? params.valueFormatted : params.data.emp_leave_id;
  }

  
  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }


  edit() {
    this.route.navigate(['master/ess/leave-apply-form'], { queryParams: { leave_ID: this.leaveId, mode: 'editMode' } })
  }

  visible() {
    this.route.navigate(['master/ess/leave-apply-form'], { queryParams: { leave_ID: this.leaveId, mode: 'viewMode' } })
  }

  delete() {
    Swal.fire({
      title: 'Are you sure you want to delete your applied leave?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: '#858586',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result: any) => {
      if (result.value) {
        this.LeaveApplyService.deleteAppliedLeave(this.leaveId).subscribe(
          (res: any) => {
            // this.route.navigate(['master/ess/leave-apply']);
              this.reloadCurrentRoute()
            this.toast.success(res.message);
          },
          (err: any) => {
            this.toast.error(`${err.error.message}`);
            console.error('Error fetching leave data', err);
          }
        );


      }
    }
    )

  }



  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }



  
}
