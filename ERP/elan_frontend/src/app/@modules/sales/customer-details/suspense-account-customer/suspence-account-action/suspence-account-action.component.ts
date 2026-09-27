import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ICellRendererParams } from 'ag-grid-community';
import Swal from 'sweetalert2';
import { SalesService } from '../../../service/sales.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-suspence-account-action',
  templateUrl: './suspence-account-action.component.html',
  styleUrls: ['./suspence-account-action.component.scss']
})
export class SuspenceAccountActionComponent implements OnInit {
  assignAction: any;
  public cellValue: any;
  checkCustomer: any;
  lead_id: any;
  new_customer: any;
  constructor(
    private route: Router,
    private _rbackService: RbacMasterService,
    public dialog: MatDialog,
    private salesService: SalesService,
    private toast: ToastrService
  ) {}
  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
  }

  agInit(params: ICellRendererParams): void {
    console.log('params', params);
    this.cellValue = this.getValueToDisplay(params);
    this.new_customer = params.data?.new_customer;
    this.lead_id = params.data?.lead_id;
    if (params.data?.status === true) {
      this.checkCustomer = 'Exit';
    } else {
      this.checkCustomer = 'New';
    }
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.data;
  }

  refresh(params: ICellRendererParams): boolean {
    // set value into cell again

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  openDialog(e: any) {
    e.stopPropagation();
    this.route.navigate(['/master/sales/customer-list/suspense-account-customer/add-suspense-account'], {
      queryParams: {
        id: this.cellValue.id,
        action_type: 'view',
      },
    });
  }

  edit(e: any) {
    e.stopPropagation();
    this.route.navigate(['/master/sales/customer-list/suspense-account-customer/add-suspense-account'], {
      queryParams: {
        id: this.cellValue.id,
        action_type: 'edit',
      },
    });
  }


  delete(event: any) {
    event.stopPropagation();
    Swal.fire({
      title: 'Are you sure want to Remove?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#f44336',
      confirmButtonColor: '#3f51b5',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.salesService.deleteCustomerById(this.cellValue.id).subscribe(
          (res: any) => {
            this.toast.success(res.message);
            this.reloadCurrentRoute();
          },
          (err: any) => {
            this.toast.error(
              'Somthing went wrong Please try agin',
              'Error Message'
            );
          }
        );
      }
    });
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
}

