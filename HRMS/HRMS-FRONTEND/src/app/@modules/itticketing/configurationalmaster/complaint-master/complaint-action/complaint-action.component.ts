import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { CreateComplaintDialogComponent } from '../create-complaint-dialog/create-complaint-dialog.component';
import { ICellRendererParams } from 'ag-grid-enterprise';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-complaint-action',
  templateUrl: './complaint-action.component.html',
  styleUrls: ['./complaint-action.component.scss']
})
export class ComplaintActionComponent {
singleId: any;
  assignAction: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private _configurationalmasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private toaster: ToastrService,
  ) {
    // this.data = localStorage.getItem("jobId");
    //

  }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
  }
  public cellValue: any;
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);

  }

  getValueToDisplay(params: ICellRendererParams) {


    return params.valueFormatted ? params.valueFormatted : params.data.id
  }

  refresh(params: ICellRendererParams): boolean {

    // this.singleId = params.data.dept_id
    // wrirte code to modify cell

    if (params) {
      const data: any = {
        designation_name: params.data.designation_name.trim(),
        status: params.data.status,
      }
      if (params.data.color === null && params.data.color !== "") {
        this.createDepartment(data);
      } else {
        const designation_id: number = Number(params.data.designation_id);
        // this.updateDepartment(designation_id, data);
      }
    } else {
      this.toaster.error("designation_name is All Ready Exits!", 'Error Message');
    }


    this.cellValue = this.getValueToDisplay(params);
    return true;
  }
  // edit(){
  //   this.router.navigate(["master/hrms/rbacmaster/Rbac-role-create"],{queryParams:{role_master_id:this.cellValue}})
  // }

  createDepartment(data: any) {
    this._configurationalmasterService.createDesignation(data).subscribe(
      (res: any) => {

        this.toaster.success('Designation Created Successfully');
        this.reloadCurrentRoute();
      }, (err: any) => {

        this.toaster.error("designation_name is All Ready Exits!", 'Error Message');
      }
    )
  };

  // updateDepartment(id: any, data: any) {
  //   this._configurationalmasterService.updateDesignation(id, data).subscribe(
  //     (res: any) => {
  //
  //       this.toaster.success('Designation Updated Successfully')
  //     }, (err: any) => {
  //       this.toaster.error('Something went wrong please try again', 'Error Message');
  //
  //     });
  // };

  openDialog(e:any) {
    e.stopPropagation();
    const dialogRef
      = this.dialog.open(CreateComplaintDialogComponent, {
        width: '30%',
        data: { id: this.cellValue, view: 'visible' }
      });

    dialogRef.afterClosed().subscribe((result:any) => {
    });
  }
  editDesig: any;
  edit(e:any) {


    const dialogRef
      = this.dialog.open(CreateComplaintDialogComponent, {
        width: '30%',
        data: { id: this.cellValue }
      });

    dialogRef.afterClosed().subscribe((result:any) => {
    });
  }

  delete(event: any) {
    event.stopPropagation();
    Swal.fire({
      title: 'Are you sure want to Remove?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result:any) => {
      if (result.isConfirmed) {
        let data={
          id:this.cellValue,
          isDeleted:true
        }
        this._configurationalmasterService.changeIssue_Status(data).subscribe(
          (res:any) => {

            this.toaster.success('Deleted successfully ');
            this.reloadCurrentRoute();
          },
          (err:any) => {
            this.toaster.error("Somthing went wrong Please try agin", "Error Message")

          }
        )
      }
    });
  }

}


