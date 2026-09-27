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
import { holidayServiceService } from 'src/app/@shared/services/service/hrmServices/holiday-service.service ';
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

  constructor(private route: Router,
    public dialog: MatDialog,
    private service: holidayServiceService,
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
    console.log(params, 'params');

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

      console.log(this.cellValue, 'this.cellValue');
      

      this.service.updateHolidayStatus(this.idGet, status).subscribe((response: any) => {
        if (response) {
          this.toster.success("Status Changed Successfully");
          this.reloadCurrentRoute()
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

