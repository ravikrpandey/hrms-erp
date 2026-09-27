import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-quotation-approval-action',
  templateUrl: './quotation-approval-action.component.html',
  styleUrls: ['./quotation-approval-action.component.scss']
})
export class QuotationApprovalActionComponent {
  assignAction: any;

  constructor(
    private route: Router,
    public dialog: MatDialog,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService
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

  edit(e: any) {
    this.route.navigate(
      ['master/workflow/quotation-approval/create'],
      { queryParams: { id: this.cellValue, mode: 'edit' } }
    );
  }
  view(e: any) {
    this.route.navigate(
      ['master/workflow/quotation-approval/create'],
      { queryParams: { id: this.cellValue, mode: 'view' } }
    );
  }
  reloadCurrentRoute() {
    let currentUrl = `master/workflow/quotation-approval`;
    this.route
      .navigateByUrl(currentUrl, { skipLocationChange: true })
      .then(() => {
        this.route.navigate([currentUrl]);
      });
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
        this._configurationalMasterService
          .deleteQuotationApprovalById(this.cellValue)
          .subscribe((res) => {
            window.location.reload();
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }
}
