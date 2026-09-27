import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ToastrService } from 'ngx-toastr';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-driver-action',
  templateUrl: './driver-action.component.html',
  styleUrls: ['./driver-action.component.scss']
})
export class DriverActionComponent {
  singleId: any;
  assignAction: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private _rbackService: RbacMasterService,
    private toast: ToastrService,private transport_service:TransportManagementService,
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
    return params.valueFormatted ? params.valueFormatted : params.data.driver_id
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  pageCall(e: any, mode:any) {
    this.route.navigate(['/master/transport-management/driver-master/create-driver'], {
      queryParams: { driver_id: this.cellValue, action_type: mode }
    });
  }

  delete(e: any) {
    let id=this.cellValue;
    Swal.fire({
      title: 'Are you sure?',
      text: 'This record will be deleted',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),

      preConfirm: () => {
        return new Promise((resolve, reject) => {
          this.transport_service.deleteDriverMaster(id).subscribe(
            (res: any) => {
              this.toast.success(res.message);
              location.reload(); // grid refresh
              resolve(res); // ✅ popup close
            },
            (err: any) => {
              this.toast.error(err.error?.message || 'Delete failed');
              Swal.showValidationMessage(
                err.error?.message || 'Something went wrong'
              );
              reject(); // ❌ popup stays open
            }
          );
        });
      }
    });
  }

}