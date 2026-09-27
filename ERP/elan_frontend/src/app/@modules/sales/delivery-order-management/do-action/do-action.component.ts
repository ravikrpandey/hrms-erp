import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams, Logger } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-do-action',
  templateUrl: './do-action.component.html',
  styleUrls: ['./do-action.component.scss'],
})
export class DoAction {
  assignAction: any;
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private toast: ToastrService,

  ) {}

  ngOnInit(): void {}

  // ngAfterViewInit(): void {
  //   setTimeout(() => {
  //     this.assignAction = this._rbackService.accessAssignAction();
  //   }, 0);
  // }
  public cellValue: any;

  agInit(params: ICellRendererParams): void {
    this.cellValue = params.data;
  }
  getValueToDisplay(params: ICellRendererParams) {
    return params;
  }
  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  navigateToGRN(e: any) {
    e.stopPropagation();
    if (this.cellValue.grnStatus != 'COMPLETED') {
      this.router.navigate(['/master/purchase-main/grn/POList-Details'], {
        queryParams: {
          po_id: this.cellValue.po_master_id,
          status: 'partial-list',
          version_id: this.cellValue.version_id,
        },
      });
    }
    if (this.cellValue.grnStatus == 'COMPLETED') {
      this.router.navigate(['/master/purchase-main/grn/POList-Details'], {
        queryParams: {
          po_id: this.cellValue.po_master_id,
          version_id: this.cellValue.version_id,
        },
      });
    }
  }
  viewChallan(e:any){    
    e.stopPropagation();
    if(this.cellValue.challan_type_status=='DIRECT'){
      this.router.navigate(['master/sales/create-direct-delivery-challan'], {
        queryParams: {
          status_type: 'viewChallan',
          id: this.cellValue.id,
        },
      });
    }else{
      this.router.navigate(['master/sales/create-delivery-challan'], {
        queryParams: {
          status_type: 'viewChallan',
          id: this.cellValue.id,
        },
      });
    }
     
  }
  // navigateToQualParams(e: any){
  //   e.stopPropagation();
  //   this.router.navigate(['/master/purchase-main/item-quality-check/approve-grn-item-quality-check'], {
  //     queryParams: {
  //       quality_check_master_id: this.cellValue.item_quality_master_id,
  //       dep_id: this.cellValue.qualityCheckDepId,
  //       grn_no: this.cellValue.grn_number,
  //       id: this.cellValue.id,
  //       type: 'view',
  //     },
  //   });

  // }

  approveItemQuality(e: any) {
    e.stopPropagation();
      this.router.navigate(['/master/purchase-main/item-quality-check/approve-grn-item-quality-check'], {
        queryParams: {
          quality_check_master_id: this.cellValue.item_quality_master_id,
          dep_id: this.cellValue.qualityCheckDepId,
          grn_no: this.cellValue.grn_number,
          id: this.cellValue.id,
        },
      });
  }
  qualParametersNotFount(){
    this.toast.error("Please add quallity parameters first!")
  }

  generateEwayWithoutIRN(e:any){    
    e.stopPropagation();
      this.router.navigate(['master/sales/create-direct-eway'], {
        queryParams: {
          status_type: 'eway_without_irn',
          id: this.cellValue.id,
          customer_id: this.cellValue.customer_id
        },
      });
  }
}
