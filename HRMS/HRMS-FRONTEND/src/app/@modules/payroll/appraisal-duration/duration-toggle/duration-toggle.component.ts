import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
// import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { LeaveManagementService } from 'src/app/@shared/services/leave-managemnet/leave-management.service';
import { PayrollService } from 'src/app/@shared/services/payroll.service';

@Component({
  selector: 'app-duration-toggle',
  templateUrl: './duration-toggle.component.html',
  styleUrls: ['./duration-toggle.component.scss']
})
export class DurationToggleComponent {
  assignAction: any;
  singleData: any = {};
  isChecked = false;
  checkBox: any;
  leaveId: any;
  leave_name: any;
  leave_code: any;
  status: any;
  isDeleted: any;
  durationId:any;

  
  constructor(private route: Router,
    public dialog: MatDialog,
    private _configurationalMasterService: ConfigurationalmasterService,
    private LeaveManagementService: LeaveManagementService,
    private toster: ToastrService,
    private _rbackService: RbacMasterService,
    private _payrollService:PayrollService
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
    this.singleData = params?.data;

    console.log('PARAMS =>',params.data);

  }


  getValueToDisplay(params: ICellRendererParams) {



    this.durationId=  params.data.id
    this.leave_name=  params.data.leave_name
    this.leave_code=  params.data.leave_code
    this.isDeleted=  params.data.isDeleted
    
    
 

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
    try {

      e.stopPropagation();
      let status;
      if (isChecked) status = "ACTIVE";
      else status = "INACTIVE";

      const body = { "status": `${status}` };      
      console.log("Status >>>",body);
      
      this._payrollService.updateStatusDuration(this.durationId,body).subscribe((response: any) => {
        if (response) {
          this.reloadCurrentRoute();
          this.toster.success("Status Changed Successfully");
        }
      }, err => {
        console.log(err);
      })




      
    } catch (error) {
      console.log(error);
    }
  }
  // Form update end

}
