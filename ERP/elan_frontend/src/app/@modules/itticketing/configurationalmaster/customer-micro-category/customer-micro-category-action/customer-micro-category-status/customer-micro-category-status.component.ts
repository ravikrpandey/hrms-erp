import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-customer-micro-category-status',
  templateUrl: './customer-micro-category-status.component.html',
  styleUrls: ['./customer-micro-category-status.component.scss']
})
export class CustomerMicroCategoryStatusComponent {
  assignAction: any;
  singleData: any = {};
  isChecked = false;
  checkBox: any;

  constructor(private route: Router,
    private _configurationalMasterService: ConfigurationalmasterService,
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
    // this.cellValue = this.getValueToDisplay(params);
    this.cellValue = this.statuseServicecenterMasterById(params);
    this.singleData = params?.data;

  }
  // agInit(params: ICellRendererParams): void {
  //   this.cellValue = this.statuseServicecenterMasterById(params);
  //   this.singleData = params?.data;

  // }
  statuseServicecenterMasterById(params: ICellRendererParams) {
    this.checkBox = params.data.status;
    console.log(params.data,"+++++++++++++++++++++++")
    if (this.checkBox === "ACTIVE") {
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }

    return params.valueFormatted
      ? params.valueFormatted
      : params.data.id;
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
      this._commonService?.showLoader()
      this._configurationalMasterService.updateCustomerMicroCategoryStatus(this.cellValue, body).subscribe((response: any) => {
        this._commonService?.hideLoader()
        if (response) {
          this.toster.success("Status Changed Successfully");
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
