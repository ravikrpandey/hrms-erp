import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UploadSoDocComponent } from '../upload-so-doc/upload-so-doc.component';
@Component({
  selector: 'dispatch-list-action',
  templateUrl: './dispatch-list-action.component.html',
  styleUrls: ['./dispatch-list-action.component.scss']
})
export class DispatchListActionComponent {

  @Input() showEdit = false;
  @Input() showDetails = false;
  @Input() showView = false;
  cellValue:any;
  constructor(private router:Router,public dialog: MatDialog, private toasterService:ToastrService){

  }

  ngOnInit(): void {

  }

  agInit(params: ICellRendererParams): void {

    this.cellValue = this.getValueToDisplay(params);
  
    console.log('===================cell value========================',this.cellValue);
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  editSubtype(event:any){

    const combinedValue = this.cellValue.salesOrderId;
     event.stopPropagation();
     
     if(this.cellValue.status==='edit'){

       this.router.navigate(['/master/warehouse-management/proceed-to-dispatch'],
        {queryParams:{sales_id:combinedValue,status:'edit',proposal_id: this.cellValue.proposal_id}})
      }else{
       this.router.navigate(['/master/warehouse-management/dispatched-product'],
        {queryParams:{sales_id:combinedValue,status:'dispatch',proposal_id: this.cellValue.proposal_id}})

     }
  }
  veiwSubtype(event:any){
    
    const combinedValue = this.cellValue.salesOrderId;
     event.stopPropagation();
     this.router.navigate(['/master/warehouse-management/dispatched-product'],{queryParams:{sales_id:combinedValue,status:'view'
     }})
  }
  viewDetails(event:any){


    const combinedValue = `view_${this.cellValue.order_no_id}`;
     event.stopPropagation();
     this.router.navigate(['/master/warehouse-management/order-dispatch-details-view'],{queryParams:{sales_id:combinedValue
     }})
  }

  addChallanformValue() {
    this.router.navigate(['/master/sales/so/create-so'], {
      queryParams: { sales_id: this.cellValue.proposal_id,version_id:this.cellValue?.version_id },
    });
  }
  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
  openDialog(){
   let dialogRef=  this.dialog.open(UploadSoDocComponent,{
      data:this.cellValue,
      width:"600px"
    })
    dialogRef.afterClosed().subscribe((result) => {
      if(result.code===200){
        this.reloadCurrentRoute();
      }
    });

  }
}






