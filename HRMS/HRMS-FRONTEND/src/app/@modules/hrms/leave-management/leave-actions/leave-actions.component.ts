import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
// import { EmptDialogComponent } from '../empt-dialog/empt-dialog.component';
import Swal from 'sweetalert2';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { LeaveManagementService } from 'src/app/@shared/services/leave-managemnet/leave-management.service';
import { AddLeaveComponent } from '../add-leave/add-leave.component';
import { EditLeaveComponent } from '../edit-leave/edit-leave.component';





@Component({
  selector: 'app-leave-actions',
  templateUrl: './leave-actions.component.html',
  styleUrls: ['./leave-actions.component.scss']
})
export class LeaveActionsComponent {

  leaveId: any

  paramsVal: any;
  assignAction: any;
  currentUrl: string;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router, private leaveManagementService: LeaveManagementService,
    private _configurationalmasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private toaster: ToastrService
  ) {
    // this.data = localStorage.getItem("jobId");
    // 
  }




  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
  }
  public cellValue: any;
  reloadCurrentRoute() {
    this.currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([this.currentUrl]);
    });
  }
  agInit(params: ICellRendererParams): void {
    this.leaveId = params.data.id

    this.paramsVal = params.data.emptype_id;
    this.cellValue = this.getValueToDisplay(params);

  }
  getValueToDisplay(params: ICellRendererParams) {


    return params.valueFormatted
      ? params.valueFormatted
      : params.data.emptype_id;
  }
  refresh(params: ICellRendererParams): boolean {

    // write code to modify cell

    //EDIT DATA FROM API
    if (params) {

      // this.leaveId = params

      const data: any = {
        emptype_name: params.data.emptype_name.trim(),
        status: params.data.status,
      };
      if (params.data.color === null && params.data.color !== '') {

      } else {
        const emptype_id: number = Number(params.data.emptype_id);
      }
    } else {
      this.toaster.error(
        "emptype_name is All Ready Exits!",
        'Error Message'
      );
    }

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }



  openDialog() {
    const dialogRef = this.dialog.open(EditLeaveComponent, {
      width: '750px',
      data: { leaveId: this.leaveId, pageMode: 'viewMode' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Leave editing process cancelled');
    });
  }


  editData() {
    const dialogRef = this.dialog.open(EditLeaveComponent, {
      width: '750px',
      data: { leaveId: this.leaveId, pageMode: 'editMode' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Leave editing process cancelled');
    });
  }




  editDataParams: any = 'edit'


  deleteData() {

    Swal.fire({
      title: 'Are you sure you want to delete the leave?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        let status = { 'status': 'INACTIVE' }
        this.leaveManagementService.DeleteLeaveMasterById(this.leaveId, status).subscribe(
          (res) => {
            this.toaster.success('Leave deleted successfully ');
            this.reloadCurrentRoute();
          },
          (err) => {
            this.toaster.error("Somthing went wrong Please try agin", "Error Message")
          })
      }
    });
  }





}
