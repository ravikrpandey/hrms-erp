import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import Swal from 'sweetalert2';
import { SalesService } from '../../../service/sales.service';

@Component({
  selector: 'app-define-credit-limit-action',
  templateUrl: './define-credit-limit-action.component.html',
  styleUrls: ['./define-credit-limit-action.component.scss']
})
export class DefineCreditLimitActionComponent {
  assignAction: any;
  public cellValue: any;
  checkCustomer:any;
  lead_id:any;
  constructor(private route: Router ,private _rbackService: RbacMasterService,
    public dialog: MatDialog,private salesService: SalesService, private toast: ToastrService,) {
  }
  ngOnInit(): void {
    
    this.assignAction = this._rbackService.accessAssignAction();    
  }
 
  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    this.lead_id=params.data?.lead_id;
if(params.data?.status === true){
this.checkCustomer="Exit"
}else{
this.checkCustomer="New"

}
  }
  getValueToDisplay(params: ICellRendererParams) {
    return params.data.id;
    // return params.data.id+"&code="+params.data.customer_code+"&name="+params.data.name;
  }
  refresh(params: ICellRendererParams): boolean {
    // set value into cell again
    
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }
  
  defineCreditLimit(event:any){
    this.route.navigate(['/master/sales/customer-list/add-credit-limit'],{queryParams:{id:this.cellValue}})
  }
    reloadCurrentRoute() {
      let currentUrl = this.route.url;
      this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.route.navigate([currentUrl]);
      });
    }
}
