import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { PayrollService } from 'src/app/@shared/services/payroll.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-tax-slab-toggle',
  templateUrl: './variable-earning-toggle.component.html',
  styleUrls: ['./variable-earning-toggle.component.scss']
})
export class VariableEarningToggleComponent {
  assignAction: any;
  singleData: any = {};
  isChecked = false;
  checkBox: any;
  leaveId: any;
  leave_name: any;
  leave_code: any;
  status: any;
  isDeleted: any;



  constructor(private route: Router,
    public dialog: MatDialog,
    private payrollService: PayrollService,
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
    this.cellValue = this.getValueToDisplay(params);
    this.singleData = params?.data;

    console.log('PARAMS =>', params.data);

  }


  getValueToDisplay(params: ICellRendererParams) {



    this.leaveId = params.data.id
    this.leave_name = params.data.leave_name
    this.leave_code = params.data.leave_code
    this.isDeleted = params.data.isDeleted




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
      console.log("Status >>>", body);

      // this.LeaveManagementService.UpdateLeaveMasterStatusById(this.leaveId, body).subscribe((response: any) => {
      //   if (response) {
      //     this.reloadCurrentRoute();
      //     this.toster.success("Status Changed Successfully");
      //   }
      // }, err => {
      //   console.log(err);
      // })
      this.payrollService.UpdateVariableAllotmentStatusById(this.leaveId, body).subscribe((response: any) => {
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
