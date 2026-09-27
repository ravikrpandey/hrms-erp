import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
})
export class ActionsComponent {
  public cellValue: any;
  approvalstatus: any;
  assignAction: any;

  constructor(
   private route:Router,
   private travelrequestservice:TravelRequestService,
   private toast: ToastrService,
   private _rbackService: RbacMasterService
  ) { }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
  }

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    this.approvalstatus=this.cellValue.approvel_status
  }
  getValueToDisplay(params: ICellRendererParams) {


    return params.valueFormatted
      ? params.valueFormatted
      : params.data;
  }

  proceed_To_Approve() {
    this.route.navigate(['/master/ess/travel-request/create-travel-request'], {
      queryParams: { id: this.cellValue.travel_request_id ,Type:"process-approval"},
    });
  }
  view() {
    this.route.navigate(['/master/ess/travel-request/create-travel-request'], {
      queryParams: { id: this.cellValue.travel_request_id ,Type:"view",Loca:1},
    });
  }


  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
}
