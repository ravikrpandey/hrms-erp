import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
// import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { LeaveManagementService } from 'src/app/@shared/services/leave-managemnet/leave-management.service';





@Component({
  selector: 'app-policy-status',
  templateUrl: './policy-status.component.html',
  styleUrls: ['./policy-status.component.scss']
})



export class PolicyStatusComponent {

  
  assignAction: any;
  singleData: any = {};
  isChecked = false;
  checkBox: any;
  leaveId: any;
  leave_name: any;
  leave_code: any;
  status: any;
  is_deleted: any;



  
  constructor(private route: Router,
    public dialog: MatDialog,
    private _configurationalMasterService: ConfigurationalmasterService,
    private LeaveManagementService: LeaveManagementService,
    private toster: ToastrService,
    private _rbackService: RbacMasterService,
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
    // this.leaveId

    this.cellValue = this.getValueToDisplay(params);
    this.singleData = params?.data;
    
  }


  getValueToDisplay(params: ICellRendererParams) {



    this.leaveId=  params.data.id
    console.log('PARAMS =>',this.leaveId);
    this.leave_name=  params.data.leave_name
    this.leave_code=  params.data.leave_code
    this.is_deleted=  params.data.is_deleted
    


    this.checkBox = params.data.status;
    if (this.checkBox === "ACTIVE") {
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }


    return params.valueFormatted
      ? params.valueFormatted
      : params.data.emptype_id;
  }

  refresh(params: ICellRendererParams): boolean {

    // set value into cell again
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  // Form update start
  toggle(e: any, isChecked: boolean) {

      let status;
      if (isChecked) status = "ACTIVE";
      else status = "INACTIVE";
      
      const body = { "is_status": `${status}` };      
      this.LeaveManagementService.UpdateLeaveMasterStatusById(this.leaveId, body).subscribe((response: any) => {
        if (response) {
          this.reloadCurrentRoute();
          this.toster.success(response.message);
        }
      }, err => {
        console.log(err);
        this.toster.error(err.error.message);
      })
  }







}
