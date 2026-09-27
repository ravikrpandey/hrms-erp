import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ICellRendererParams } from 'ag-grid-community';
import Swal from 'sweetalert2';
import { SalesService } from '../../service/sales.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-customer-action',
  templateUrl: './customer-action.component.html',
  styleUrls: ['./customer-action.component.scss'],
})
export class CustomerActionComponent implements OnInit {
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
    this.route.navigate(['/master/sales/customer-details/profile'], {
      queryParams: {
        id: this.cellValue.id,
        action_type: 'view',
        new_customer: this.new_customer,
        lead_id: this.lead_id,
        status: this.cellValue.data_status,
      },
    });
  }

  edit(e: any) {
    e.stopPropagation();
    this.route.navigate(['/master/sales/customer-details/profile'], {
      queryParams: {
        id: this.cellValue.id,
        action_type: 'edit',
        new_customer: this.new_customer,
        lead_id: this.lead_id,
        status: this.cellValue.data_status,
      },
    });
    // edit(e: any) {
    //   e.stopPropagation();
    // }
  }
  navigateToGstPortal(event: any) {
    event.stopPropagation();
  
    Swal.fire({
      title: 'Are you sure want to Register On GST Portal?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#f44336',
      confirmButtonColor: '#3f51b5',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.salesService.registerForGSTPortal(this.cellValue.id).subscribe(
          (res: any) => {
            this.toast.success(res.message);
            this.showOtpPopup(res); 
          },
          (err: any) => {
            this.toast.error(err.error.message);
          }
        );
      }
    });
  }

  showOtpPopup(res: any) {
    Swal.fire({
      title: 'Enter OTP',
      html: `
        <input type="text" id="otp" class="swal2-input" placeholder="Enter OTP">
      `,
      confirmButtonText: 'Submit',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const otp = (document.getElementById('otp') as HTMLInputElement)?.value;
        
        if (!otp) {
          Swal.showValidationMessage('OTP is required');
          return false;
        }
        
        return otp;
      }
    }).then((otpResult: any) => {
      if (otpResult.isConfirmed && otpResult.value) {
        const payload = {
          id: this.cellValue.id,
          otp: otpResult.value
        };
  
        this.salesService.verifyOtpForGSTPortal(payload).subscribe(
          (verifyRes: any) => {
            this.toast.success('OTP Verified Successfully!');
          },
          (err: any) => {
            this.toast.error(err.error.message);
            this.showOtpPopup(res);
          }
        );
      }
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
