import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { EmpListDialogComponent } from '../emp-list-dialog/emp-list-dialog.component';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit {
  assignAction: any;
  constructor(private route: Router,
    public dialog: MatDialog,
    private employService: EmpRegistrationService,
    private toster: ToastrService,
    private _rbackService: RbacMasterService,
  ) {
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

    return params.valueFormatted ? params.valueFormatted : params.data.employee_id;
  }

  refresh(params: ICellRendererParams): boolean {
    // set value into cell again

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  edit(e: any) {
    e.stopPropagation();
    // 
    this.route.navigate(['master/hrms/employee-master/employ/employee-create/basic-details'],
      { queryParams: { employee_id: this.cellValue } })
    this.employService.setEmpId(Number(this.cellValue))
    // edit(e: any) {
    //   e.stopPropagation();
    // }
  }

  delete(e: any) {
    e.stopPropagation();

    Swal.fire({
      title: 'Are you sure to delete this Employee ?',
      text: "You won't be able to revert this!",
      icon: 'question',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        const data = {
          status: "INACTIVE"
        }
        this.employService.deleteSingleEmployee(this.cellValue, data).subscribe(
          (res: any) => {

            this.toster.success('Deleted Successfully')
            this.reloadCurrentRoute();
          }, (err) => {

            this.toster.success('Something went wrong please try again', 'Error Message')
          }
        )
      };
    });
  }
  openDialog() {
    const dialogRef
      = this.dialog.open(EmpListDialogComponent, {
        width: '100%',
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        panelClass: 'full-screen-modal',
        data: { id: this.cellValue }
      });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  view() {
    this.route.navigate(['master/hrms/employee-master/employ/employee-create/basic-details'], { queryParams: { employee_id: this.cellValue, action_type: 'view' } })
  }

}
