import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Color, ICellRendererParams, Logger } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { DesignationDialogComponent } from '../designation-dialog/designation-dialog.component';
import Swal from 'sweetalert2';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-designation-action',
  templateUrl: './designation-action.component.html',
  styleUrls: ['./designation-action.component.scss']
})
export class DesignationActionComponent {
  singleId: any;
  assignAction: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
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


    return params.valueFormatted ? params.valueFormatted : params.data.designation_id
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

  openDialog() {
    const dialogRef
      = this.dialog.open(DesignationDialogComponent, {
        width: '30%',
        data: { id: this.cellValue, view: 'visible' }
      });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  editDesig: any = 'Designation'
  edit(event: any) {
    const dialogRef
      = this.dialog.open(DesignationDialogComponent, {
        width: '30%',
        data: { id: this.cellValue, edit: this.editDesig },
      });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  delete(event: any) {
    event.stopPropagation();
    Swal.fire({
      title: 'Are you sure you want to Remove it?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this._configurationalmasterService.deleteDesignation(this.cellValue).subscribe(
          (res) => {

            this.toaster.success('Deleted successfully ');
            this.reloadCurrentRoute();
          },
          (err) => {
            this.toaster.error("Somthing went wrong Please try agin", "Error Message")

          }
        )
      }
    });
  }


}
