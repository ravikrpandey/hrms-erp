import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import Swal from 'sweetalert2';
import { EntityMasterService } from '../../../@shared/services/entity-master/entity-master.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { SalesService } from '../../sales/service/sales.service';

@Component({
  selector: 'app-entity-action',
  templateUrl: './entity-action.component.html',
  styleUrls: ['./entity-action.component.scss']
})
export class EntityActionComponent {
  assignAction: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private toaster: ToastrService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private entityService: EntityMasterService,
    private salesService: SalesService,
    
    private _commonService : CommonService
  ) {}

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
    return params.valueFormatted ? params.valueFormatted : params.data.entity_id;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }
  // openDialog() { 
  //   const dialogRef = this.dialog.open(ViewComponent, {
  //     width: '35%',
  //     // maxWidth: '100vw',
  //     // maxHeight: '100vh',
  //     // height: '100%',
  //     // panelClass: 'full-screen-modal',
  //     data: { id: this.cellValue },
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {});
  // }

  edit(e: any) {
    e.stopPropagation();
    this.router.navigate(['/master/entity/add-entity'], {
      queryParams: { id: this.cellValue,mode:'edit' },
    });
  }
  view(e: any) {
    e.stopPropagation();
    this.router.navigate(['/master/entity/add-entity'], {
      queryParams: { id: this.cellValue,mode:'view' },
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
          id: this.cellValue,
          otp: otpResult.value
        };
  
        this.salesService.verifyOtpForGSTPortalEntity(payload).subscribe(
          (verifyRes: any) => {
            this.toaster.success('OTP Verified Successfully!');
          },
          (err: any) => {
            this.toaster.error(err.error.message);
            this.showOtpPopup(res);
          }
        );
      }
    });
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
        this.salesService.registerForGSTPortalEntity(this.cellValue).subscribe(
          (res: any) => {
            this.toaster.success(res.message);
            this.showOtpPopup(res); 
          },
          (err: any) => {
            this.toaster.error(err.error.message);
          }
        );
      }
    });
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
        this.entityService.deleteEntity(this.cellValue).subscribe(
          (res) => { 
            this._commonService?.hideLoader()
            this.toaster.success('Deleted successfully ');
            this.reloadCurrentRoute();
          },
          (err) => {
            this._commonService?.hideLoader()
            this.toaster.error("Somthing went wrong Please try agin", "Error Message")
          }
        )
      }
    });
  } 
}
