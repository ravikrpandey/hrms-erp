import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmptDialogComponent } from '../empt-dialog/empt-dialog.component';
import Swal from 'sweetalert2';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-empt-action',
  templateUrl: './empt-action.component.html',
  styleUrls: ['./empt-action.component.scss']
})
export class EmptActionComponent {
  paramsVal: any;
  assignAction: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
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
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  agInit(params: ICellRendererParams): void {
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
      const data: any = {
        emptype_name: params.data.emptype_name.trim(),
        status: params.data.status,
      };
      if (params.data.color === null && params.data.color !== '') {

      } else {
        const emptype_id: number = Number(params.data.emptype_id);
        //this.updateEmpt(emptype_id, data);
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



  // updateEmpt(emptype_id: any, data: any) {
  //   this._configurationalmasterService
  //     .editEmployement(emptype_id, data)
  //     .subscribe(
  //       (res: any) => {
  //         
  //         this.toaster.success('Updated Successfully');
  //       },
  //       (err: any) => {
  //         this.toaster.error(
  //           'Something went wrong please try again',
  //           'Error Message'
  //         );
  //         
  //       }
  //     );
  // }
  openDialog() {
    const dialogRef = this.dialog.open(EmptDialogComponent, {
      data: { visible: 'visible', id: this.paramsVal },

      width: '30%',
    });

    dialogRef.afterClosed().subscribe((result) => {

    });

  }
  editDataParams: any = 'edit'
  editData() {
    const dialogRef = this.dialog.open(EmptDialogComponent, {
      data: { id: this.paramsVal, edit: this.editDataParams },
      width: '30%',
    });

    dialogRef.afterClosed().subscribe((result) => {

    });
  }
  deleteData(event: any) {
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
        this._configurationalmasterService.DeleteEmployement(this.cellValue).subscribe(
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
