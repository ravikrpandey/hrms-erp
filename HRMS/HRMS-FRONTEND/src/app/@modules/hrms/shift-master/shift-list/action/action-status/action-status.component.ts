import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
// import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ShiftServiceService } from 'src/app/@shared/services/service/hrmServices/shift-service.service';
import { id } from 'date-fns/locale';
import { HrServiceService } from 'src/app/@shared/services/hr-service.service';

@Component({
  selector: 'app-action-status',
  templateUrl: './action-status.component.html',
  styleUrls: ['./action-status.component.scss']
})
export class ActionStatusComponent {
  assignAction: any;
  singleData: any = {};
  isChecked = false;
  checkBox: any;
  idGet: any;
  deduction_erning: any
  constructor(private route: Router,
    public dialog: MatDialog,
    private service: ShiftServiceService,
    private toster: ToastrService,
        private hrmsService: HrServiceService,
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
  agInit(params: any): void {
    console.log(params, params?.someProperty, 'params');
    this.deduction_erning = params?.someProperty
    this.cellValue = this.getValueToDisplay(params);
    this.singleData = params?.data;
    this.idGet = params?.data?.id
  }
  getValueToDisplay(params: ICellRendererParams) {
    console.log(params, 'params');

    this.checkBox = params.data.status;
    if (this.checkBox === "ACTIVE") {
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }


    return params.valueFormatted
      ? params.valueFormatted
      : params.data.dept_id;
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

      let body = {
        status: status,
      }

      console.log(this.cellValue,this.deduction_erning, 'this.cellValue');
      if (this.deduction_erning) {
        this.hrmsService.updateDeductionRuleStatus(this.idGet, body).subscribe((response: any) => {
          if (response) {
            this.toster.success("Status Changed Successfully");
            this.reloadCurrentRoute()
          }
        }, err => {
          console.log(err);
        })
      } else {
        this.service.updateShiftStatus(this.idGet, status).subscribe((response: any) => {
          if (response) {
            this.toster.success("Status Changed Successfully");
            this.reloadCurrentRoute()
          }
        }, err => {
          console.log(err);
        })
      }


    } catch (error) {
      console.log(error);
    }
  }
  // Form update end

}


