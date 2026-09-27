import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-customer-category-status',
  templateUrl: './customer-category-status.component.html',
  styleUrls: ['./customer-category-status.component.scss']
})
export class CustomerCategoryStatusComponent {
  assignAction: any;
  singleData: any = {};
  isChecked = false;
  checkBox: any;
  type: string = '';

  constructor(
    private route: Router,
    private _configurationalMasterService: ConfigurationalmasterService,
    private toster: ToastrService,
    private _rbackService: RbacMasterService,
    private _commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
  }

  public cellValue: any;

  reloadCurrentRoute() {
    const currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  agInit(params: ICellRendererParams): void {
    this.type = (params as any)?.type || (params as any)?.cellRendererParams?.type;
    this.cellValue = this.statuseServicecenterMasterById(params);
    this.singleData = params?.data;
  }

  statuseServicecenterMasterById(params: ICellRendererParams) {
    this.checkBox =
      this.type === 'quotation_scheme_status'
        ? params.data.quotation_scheme_status
        : params.data.status;

    this.isChecked = this.checkBox === 'ACTIVE';
    return params.valueFormatted
      ? params.valueFormatted
      : params.data.customer_category_id;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.statuseServicecenterMasterById(params);
    return true;
  }

  // ✅ Toggle for both (Status + Quotation Scheme Status)
  toggle(e: any, isChecked: boolean) {
    try {
      e.stopPropagation();
      const status = isChecked ? 'ACTIVE' : 'INACTIVE';
      let body = { status: status, type: this.type };

      this._commonService.showLoader();

      this._configurationalMasterService.updateCustomerCategoryStatus(
        this.cellValue,
        body
      ).subscribe(
        (response: any) => {
          this._commonService.hideLoader();
          if (response) {
          const formattedType = this.type
              .replace(/_/g, ' ') // underscores → spaces
              .replace(/^./, (char) => char.toUpperCase()); // only first letter capital

            this.toster.success(`${formattedType} changed successfully`);
          }
        },
        (err:any) => {
          this._commonService.hideLoader();
          console.log(err);
        }
      );
  
    } catch (error) {
      console.log(error);
    }
  }
}
