import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { SalesService } from 'src/app/@modules/sales/service/sales.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-service-voucher-action',
  templateUrl: './service-voucher-action.component.html',
  styleUrls: ['./service-voucher-action.component.scss']
})
export class ServiceVoucherActionComponent {

assignAction: any;
  public cellValue: any;
  checkCustomer:any;
  lead_id:any;
  new_customer:any;
  constructor(private route: Router ,private _rbackService: RbacMasterService,
    public dialog: MatDialog,private salesService: SalesService, private toast: ToastrService,) {
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
  viewData(e:any) {
    e.stopPropagation();
    this.route.navigate(['/master/finance/transactions/add-service-voucher'], { queryParams: { id: this.cellValue}})

  }
  
  
    reloadCurrentRoute() {
      let currentUrl = this.route.url;
      this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.route.navigate([currentUrl]);
      });
    }


}
