import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
// import { EmpListDialogComponent } from '../emp-list-dialog/emp-list-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { IncentiveService } from '../incentive-service/incentive-service';
import { CommonService } from 'src/app/@shared/services/common.service';


@Component({
  selector: 'app-incentive-action',
  templateUrl: './incentive-action.html',
  styleUrls: ['./incentive-action.scss']
})
export class IncentiveAction {

assignAction: any;

  constructor(private route: Router,
    public dialog: MatDialog,
    private _incentiveservice: IncentiveService,
    private _commonService: CommonService,
    private toast: ToastrService,
    private _rbackService: RbacMasterService,
    private location: Location,
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

  singleData: any;
  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    this.singleData = params.data;

  }
  getValueToDisplay(params: ICellRendererParams) {

    return params.valueFormatted ? params.valueFormatted : params.data.service_id;
  }

  refresh(params: ICellRendererParams): boolean {
    // set value into cell again

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  edit(e: any) {
    e.stopPropagation();
    this.route.navigate(['master/payroll/incentives/create-incentive'], {
      queryParams: {
        actionType: 'edit',
        id: this.singleData?.id,
        entity_id: this.singleData?.entity_id
      }
    })
  }

  delete(e: any) {
    e.stopPropagation();
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
        this._commonService?.showLoader()
        this._incentiveservice.deletePayrollIncentive(this.singleData?.id).subscribe(
          (res) => {
            this._commonService?.hideLoader()
            this.toast.success('Deleted successfully ');
            this.reloadCurrentRoute();
          },
          (err) => {
            this._commonService?.hideLoader()
            this.toast.error("Somthing went wrong Please try agin", "Error Message")
          }
        )
      }
    });
  }

  openDialog() {
    this.route.navigate(['master/payroll/incentives/create-incentive'], {
      queryParams: {
        id: this.singleData?.id,
        entity_id: this.singleData?.entity_id, actionType: 'view'
      }
    })
  }
}
