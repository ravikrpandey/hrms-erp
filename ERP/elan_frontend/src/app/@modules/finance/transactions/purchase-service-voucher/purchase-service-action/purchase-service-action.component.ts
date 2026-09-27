import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { SalesService } from 'src/app/@modules/sales/service/sales.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-purchase-service-action',
  templateUrl: './purchase-service-action.component.html',
  styleUrls: ['./purchase-service-action.component.scss']
})
export class PurchaseServiceActionComponent {
  assignAction: any;
    public cellValue: any;
    checkCustomer:any;
    lead_id:any;
    new_customer:any;
    constructor(private route: Router ,private _rbackService: RbacMasterService,
      public dialog: MatDialog,private salesService: SalesService, private toast: ToastrService,private _financeService:FinaceService) {
    }
    ngOnInit(): void {

      this.assignAction = this._rbackService.accessAssignAction();
    }

    agInit(params: ICellRendererParams): void {
      console.log("params", params);
      this.cellValue = this.getValueToDisplay(params);
      this.new_customer=params.data?.new_customer;
      this.lead_id=params.data?.lead_id;
  if(params.data?.status === true){
  this.checkCustomer="Exit"
  }else{
  this.checkCustomer="New"

  }
    }
    getValueToDisplay(params: ICellRendererParams) {

      return params.data.id;
    }
    refresh(params: ICellRendererParams): boolean {
      // set value into cell again

      this.cellValue = this.getValueToDisplay(params);
      return true;
    }
    viewPurchaseJournal(e:any) {
      this.route.navigate(['master/finance/transactions/add-purchase-service-voucher'],{queryParams:{id:this.cellValue}})
    }


      reloadCurrentRoute() {
        let currentUrl = this.route.url;
        this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.route.navigate([currentUrl]);
        });
      }

      downloadPdf(event:any){
         this._financeService.purchaseServiceVoucherRoutesDownload(this.cellValue).subscribe((res:any)=>{
          console.log(res.data)
          if(res.data)
          {
            window.open(res.data.fileUrl,'_blank')
          }
         })
      }
  }
