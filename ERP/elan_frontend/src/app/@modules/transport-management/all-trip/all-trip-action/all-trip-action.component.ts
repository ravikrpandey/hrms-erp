
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-all-trip-action',
  templateUrl: './all-trip-action.component.html',
  styleUrls: ['./all-trip-action.component.scss']
})
export class AllTripActionComponent {

  activeTab: any = 'Schedule Trip';

  onTabChange(tabKey: string) {
    this.activeTab = tabKey;
  }

  assignAction: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private toaster: ToastrService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private _transport_service : TransportManagementService
  ) { }
  showViewtripButton: boolean = false;
  showViewtripInfoButton: boolean = false;
  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();

       const currentUrl = this.router.url.split('?')[0];  // Remove query params
     console.log(currentUrl);
    if (currentUrl === 'master/transport-management/all-trip/live-trip-list') {
      this.showViewtripButton = true;
    }
    if (currentUrl === 'master/transport-management/all-trip/live-trip-info') {
         this.showViewtripInfoButton = true;
    }
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
status : any;
  getValueToDisplay(params: ICellRendererParams) {
    this.status = params.data;
    return params.valueFormatted ? params.valueFormatted : params.data.id;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  scheduleTrip(e: any) {
    console.warn(this.cellValue, 'cell');

    this.route.navigate(['master/transport-management/all-trip/create-schedule-trip'], { queryParams: { id: this.cellValue ,status:this.status.status_type,tripStatus:'schedule'} });
  }

   view(e: any) {
    
    this.route.navigate(['master/transport-management/all-trip/create-schedule-trip'], {
      queryParams: { id: this.status.transport_req_id,trip_id: this.cellValue,mode:'view',status:this.status.status_type },
    });
    // this.route.navigate(['/master/transport-management/all-trip/create-schedule-trip'], {
    //   queryParams: { id: this.cellValue,mode:'view',status:this.status.status_type },
    // });
  }
   shecduleNavigateview(e: any) {
    this.route.navigate(['master/transport-management/all-trip/create-schedule-trip'], {
      queryParams: { id: this.status.transport_req_id,trip_id: this.cellValue,mode:'view',status:this.status.status_type ,schedule:'2'},
    });
  }

  StartTrip(e: any) {
    const data = {
      status_type: 'STARTED'
    };

    console.log(data);

    this._transport_service.changeTripStatus(this.cellValue ,data).subscribe({
      next: (response: any) => {
        console.log(response);
        this.toaster.success('Trip started successfully');
   this._transport_service.notifyTripRefresh();
      },
      error: (error: any) => {
        console.error(error);
        this.toaster.error('Failed to start trip');
      }
    });
  }

viewTripDetails() {
  this.route.navigate(
    ['master/transport-management/all-trip/live-trip-info'],
    { queryParams: { id: this.cellValue, status:this.status.TRANSPORT_REQUEST?.status_type,request_id:this.status?.TRANSPORT_REQUEST?.id} }
  );
}

showViewLivetripInfo(){
  const fileURL = `${environment.servralUrl}/uploaded_files/${this.status?.expense_document}`;
  window.open(fileURL, '_blank');

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
    }).then((result:any) => {
      if (result.isConfirmed) {
        this._transport_service.deleteExpense(this.cellValue).subscribe(
          (res) => {

            this.toaster.success('Deleted successfully ');
            // this.reloadCurrentRoute();
            window.location.reload()
          },
          (err) => {
            this.toaster.error("Somthing went wrong Please try agin", "Error Message")

          }
        )
      }
    });
  }

}
