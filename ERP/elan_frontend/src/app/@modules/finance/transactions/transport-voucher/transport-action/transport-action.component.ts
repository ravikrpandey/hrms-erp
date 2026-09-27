import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { SalesService } from 'src/app/@modules/sales/service/sales.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-transport-action',
  templateUrl: './transport-action.component.html',
  styleUrls: ['./transport-action.component.scss']
})
export class TransportActionComponent {
assignAction: any;
  public cellValue: any;
  checkCustomer:any;
  lead_id:any;
  new_customer:any;
  constructor(private route: Router ,private _rbackService: RbacMasterService,
    public dialog: MatDialog, private _finaceService : FinaceService, private toast: ToastrService,) {
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


viewPaymentAdvise(event:any){
    this.route.navigate(['master/finance/transactions/transport-voucher/add-transport-voucher'],{queryParams:{
      id:this.cellValue,status:'view'
    }})
}



    reloadCurrentRoute() {
      let currentUrl = this.route.url;
      this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.route.navigate([currentUrl]);
      });
    }


download(event:any){
   this.route.navigate(['master/finance/transactions/transport-voucher/download-transport-voucher'],{queryParams:{
      id:this.cellValue,status:'view'
    }})
}

}
