import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reimbursement-budget-action',
  templateUrl: './reimbursement-budget-action.component.html',
  styleUrls: ['./reimbursement-budget-action.component.scss']
})
export class ReimbursementBudgetActionComponent {

  assignAction: any;

  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private toaster: ToastrService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService
  ) { }

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
    return params.valueFormatted ? params.valueFormatted : params.data.id;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  edit(e: any) {
    this.router.navigate(
      ['/master/configurational-master/reimbursement-master/reimbursement-budget/create'],
      {
        queryParams: { id: this.cellValue, mode: 'edit' },
      }
    );
  }

  view(e: any) {
    this.router.navigate(
      ['/master/configurational-master/reimbursement-master/reimbursement-budget/create'],
      {
        queryParams: { id: this.cellValue, mode: 'view' },
      }
    );
  }

  delete(e: any) {
    Swal.fire({
      title: 'Are you sure you want to Remove it?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#f44336',
      confirmButtonColor: '#3f51b5',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this._configurationalMasterService
          .deleteTravelBudget(this.cellValue)
          .subscribe(
            (res) => {
              this.toaster.success('Deleted successfully ');
              this.reloadCurrentRoute();
            },
            (err) => {
              this.toaster.error(
                'Somthing went wrong Please try agin',
                'Error Message'
              );
            }
          );
      }
    });
  }
}

