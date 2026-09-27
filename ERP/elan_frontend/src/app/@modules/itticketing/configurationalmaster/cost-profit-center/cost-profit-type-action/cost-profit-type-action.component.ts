import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import Swal from 'sweetalert2';
import { AddCostProfitCenterComponent } from '../add-cost-profit-center/add-cost-profit-center.component';

@Component({
  selector: 'app-cost-profit-type-action',
  templateUrl: './cost-profit-type-action.component.html',
  styleUrls: ['./cost-profit-type-action.component.scss']
})
export class CostProfitTypeActionComponent {
  singleId: any;
  paramsVal: any;
  params: any;
  cellValue1: any;
  assignAction: any;
  scannedData: any;
  qrCodeImageUrl: string | null = null;
  itemType: any = [];

  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _configurationalmasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private toaster: ToastrService,
    private prService: PurchaseRequestService,
    private _commonService: CommonService

  ) { }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
    this.getItemType();
  }
  public cellValue: any;
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.paramsVal = params.data.id;
    this.cellValue = this.getValueToDisplay(params);
    // console.log("this.cellValue ---this.cellValue", this.cellValue)
    this.cellValue1 = params.data;
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data
  }

  getItemType() {
    this._configurationalmasterService.getItemType().subscribe(
      (res: any) => {
        if (res.data) {
          this.itemType = res.data;
        }
      },
      (err: any) => {
        console.log(err.error.message);
      }
    );
  }

  edit(e: any) {
    let data={
      data:this.cellValue,
      status:'edit'
    }
    e.stopPropagation();
    const dialogRef = this.dialog.open(AddCostProfitCenterComponent, {
      width: '600px',
      data:data
    });

    dialogRef.afterClosed().subscribe((result) => {})
  }

  view(e: any) {
    e.stopPropagation();
    let data={
      data:this.cellValue,
      status:'view'
    }
    const dialogRef = this.dialog.open(AddCostProfitCenterComponent, {
      width: '600px',
      data:data
    });

    dialogRef.afterClosed().subscribe((result) => {})
  }


  delete(e: any) {
    e.stopPropagation();
    Swal.fire({
      title: 'Do You Want to Remove?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this._commonService?.showLoader()
        this._configurationalmasterService.deleteCostProfitTypeById(this.cellValue?.id).subscribe(
          (res) => {
            this._commonService?.hideLoader()
            this.toaster.success('Delete successfully ');
            this.reloadCurrentRoute();
          },
          (err) => {
            this._commonService?.hideLoader()
            this.toaster.error("Somthing went wrong.. Please try agin", "Error Message")

          }
        )
      }
    });
  }

}
