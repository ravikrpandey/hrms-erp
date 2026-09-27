import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { HrServiceService } from 'src/app/@shared/services/hr-service.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionForUnaprovedLeaveComponent {
  public cellValue: any;
  assignAction: any;
  constructor(
    private route: Router,
    private toast: ToastrService,
    private _hrService: HrServiceService,
    private _rbackService: RbacMasterService,
  ) {

  }
  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  singleData: any;
  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    this.singleData = params?.data;
  }

  getValueToDisplay(params: ICellRendererParams) {

    return params.data.leave_apply_id;
  }

  refresh(params: ICellRendererParams): boolean {
    // set value into cell again

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  approvalAction(actionType: any) {
    
    this.route.navigate(['master/ess/leave-apply-form'], { queryParams: { leave_ID: this.singleData?.id, approvalEmployeeId: this.singleData?.employee_id, actionFrom: this.singleData?.approval_status, actionFor: actionType, mode: 'viewMode' } })
  }

}
