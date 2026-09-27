import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vehicle-vendor-master-action',
  templateUrl: './vehicle-vendor-master-action.component.html',
  styleUrls: ['./vehicle-vendor-master-action.component.scss']
})
export class VehicleVendorMasterActionComponent {
 singleId: any;
  assignAction: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private _rbackService: RbacMasterService,
    private toast : ToastrService,
    private transport_service :TransportManagementService
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


    return params.valueFormatted ? params.valueFormatted : params.data.id
  }

  refresh(params: ICellRendererParams): boolean {

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }



  view(e:any) {
    this.route.navigate(['master/transport-management/vendor-vehicle-master/add-vehicle-vendor-master'], {
      queryParams: { id: this.cellValue, action_type: 'view' }
    });
  }
  editDesig: any;
  edit(e: any) {
    this.route.navigate(['master/transport-management/vendor-vehicle-master/add-vehicle-vendor-master'], {
      queryParams: { id: this.cellValue, action_type: 'update' }
    });
  }
  // delete(e: any) {
  //   this.route.navigate(['/master/transport-management/vendor-vehicle-master/add-vehicle-vendor-master'], {
  //     queryParams: { id: this.cellValue,action_type: 'delete' }
  //   });
  // }


   delete(event: any) {
    event.stopPropagation();
    Swal.fire({
      title: 'Are you sure want to Remove?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.transport_service.deleteVehicleVendorById(this.cellValue).subscribe(
          (res: any) => {
            this.toast.success('Deleted successfully');
             this.reloadCurrentRoute();
            // Reloads the current route properly
          },
          (err: any) => {
            this.toast.error("Something went wrong. Please try again", "Error Message");
          }
        )
      }
    });
  }

}
