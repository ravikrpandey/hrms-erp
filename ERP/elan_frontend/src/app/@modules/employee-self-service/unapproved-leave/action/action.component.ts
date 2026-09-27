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
  departmentId: string | null;
  marital: string | null;
  userlocation: string | null;
  gender: string | null;
  designation: string | null;
  role_id: any;
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
    this.departmentId = params.data.HRMS_REGISTERED_USER.department_id;
    this.marital = params.data.HRMS_REGISTERED_USER.marital_status;
    this.userlocation = params.data.HRMS_REGISTERED_USER.location_id;
    this.gender = params.data.HRMS_REGISTERED_USER.gender;
    this.designation = params.data.HRMS_REGISTERED_USER.designation_id;
    this.role_id = params.data.HRMS_REGISTERED_USER.role_master_id;
    return params.data.leave_apply_id;
  }

  refresh(params: ICellRendererParams): boolean {
    // set value into cell again

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  approvalAction(actionType: any) {
    
    this.route.navigate(['master/ess/leave-apply-form'], { queryParams: { leave_ID: this.singleData?.id, approvalEmployeeId: this.singleData?.employee_id, actionFrom: this.singleData?.approval_status, actionFor: actionType, mode: 'viewMode',
      departmentId : this.departmentId,
      marital : this.marital,
      userlocation : this.userlocation,
      gender : this.gender,
      designation : this.designation,
      role : this.role_id
    } })
  }

}
