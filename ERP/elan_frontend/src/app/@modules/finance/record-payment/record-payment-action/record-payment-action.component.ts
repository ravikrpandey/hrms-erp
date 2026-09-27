import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-record-payment-action',
  templateUrl: './record-payment-action.component.html',
  styleUrls: ['./record-payment-action.component.scss']
})
export class RecordPaymentActionComponent {
  cellValue:any;
  assignAction:any;
  enviornment:any;
  constructor(private router:Router,public dialog: MatDialog,private financeService:FinaceService, private toasterService:ToastrService,private common:CommonService,private _rbackService:RbacMasterService){
    this.enviornment = environment.servralUrl;
  }
  
  ngOnInit(): void {
    this.assignAction = this._rbackService?.accessAssignAction();

  }
  
  agInit(params: ICellRendererParams): void {
    this.assignAction = this._rbackService?.accessAssignAction();

    this.cellValue = this.getValueToDisplay(params);
  }


  ngAfterViewInit(): void {
    setTimeout(() => {
      this.assignAction = this._rbackService.accessAssignAction();
    }, 0);
  }

  dataList:any;
  getValueToDisplay(params: ICellRendererParams) {
    this.dataList=params.data;
    return params.valueFormatted ? params.valueFormatted : params.data.id;
  }
  
  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }
  
  editChart(event:any){
     event.stopPropagation();
      this.router.navigate(['master/finance/record-payment'], {
        queryParams: { id: this.cellValue },skipLocationChange:true
      });
  }
  
 
  
  
  
  viewChart(event:any){
     event.stopPropagation();
      this.router.navigate(['master/finance/view-chart'], {
        queryParams: { id: this.cellValue },skipLocationChange:true
      });
  }
  
  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  navigateTopayment(event:any){
    event.stopPropagation();
    this.common.showLoader();
    let entity_id = localStorage.getItem('selectedEntityId')
    let login_id = localStorage.getItem('EmpMainId')
// this.financeService.downloadCreditDebitBuilder(this.cellValue,entity_id,login_id).subscribe((res:any)=>{
//   console.warn(res.data);
//   window.open(this.enviornment+'/'+'uploadDocInvoice' +'/'+res.backend_url,'_blank')
//      this.common.hideLoader();
// },err=>{
//   this.common.hideLoader()
// })

  }
}
