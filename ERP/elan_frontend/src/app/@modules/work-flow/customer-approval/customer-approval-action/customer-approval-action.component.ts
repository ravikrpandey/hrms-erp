import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-approval-action',
  templateUrl: './customer-approval-action.component.html',
  styleUrls: ['./customer-approval-action.component.scss']
})
export class CustomerApprovalActionComponent {
  assignAction: any;

  constructor(
    private route: Router,
    public dialog: MatDialog,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private _commonService: CommonService,
    private toaster: ToastrService,
  ) { }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
  }

  public cellValue: any;

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.data?.id;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  edit(e: any) {
    this.route.navigate(
      ['master/workflow/customer-approval/create'],
      { queryParams: { id: this.cellValue, mode: 'edit' } }
    );
  }

  delete(e: any) {
    Swal.fire({
      title: 'Are you sure you want to Remove it?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#858586',
      confirmButtonColor: '#f44336',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        this._commonService?.showLoader()
        this._configurationalMasterService.deleteCustomerApprovalById(this.cellValue).subscribe((res) => {
          this._commonService?.hideLoader()
          this.toaster.success('Delete successfully ');
          this.reloadCurrentRoute();
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }


}
