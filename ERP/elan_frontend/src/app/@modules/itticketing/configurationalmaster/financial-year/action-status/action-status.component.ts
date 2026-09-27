import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { CommonService } from 'src/app/@shared/services/common.service';
 
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
    private _financeService: FinaceService,
    private toster: ToastrService,
    private _rbackService: RbacMasterService,
    private _commonService : CommonService
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
    this.idGet=params?.data?.id
  }
  getValueToDisplay(params: ICellRendererParams) {
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
      // console.log(this.cellValue,'this.cellValue');
      // console.log("this.idGet_staus",this.idGet);
      // console.log("body of status",body);
      
      
      this._commonService?.showLoader()
      this._financeService.Financial_Status(this.idGet, body).subscribe((response: any) => {
        if (response) {
          this._commonService?.hideLoader()
          this.toster.success("Status Changed Successfully");
          this.reloadCurrentRoute();
        }
      }, err => {
        this._commonService?.hideLoader()
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }
  // Form update end
}
