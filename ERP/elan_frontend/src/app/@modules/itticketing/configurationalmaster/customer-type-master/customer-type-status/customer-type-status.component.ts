import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
@Component({
  selector: 'app-customer-type-status',
  templateUrl: './customer-type-status.component.html',
  styleUrls: ['./customer-type-status.component.scss']
})
export class CustomerTypeStatusComponent {
  assignAction: any;
  singleData: any = {};
  isChecked = false;
  checkBox: any;
  entity_id: any;
  constructor(private route: Router,
    public dialog: MatDialog,
    private _configurationalMasterService: ConfigurationalmasterService,
    private toster: ToastrService,
    private _rbackService: RbacMasterService,
    private _commonService : CommonService
  ) {
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
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
      : params.data.id;
  }

  refresh(params: ICellRendererParams): boolean {
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
      this._commonService.showLoader()
      this._configurationalMasterService.updateCustomerTypeStatus(this.cellValue, body).subscribe((response: any) => {
        if (response) {
          this._commonService.hideLoader()
          this.toster.success("Status Updated Successfully");
        }
      }, err => {
        this._commonService.hideLoader()
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }
}
