import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ProductionService } from 'src/app/@shared/services/production/production.service';
import { environment } from 'src/app/environments/environment';
import { SendEmailComponent } from '../../production-list/send-email/send-email.component';
import { SoDialogComponent } from '../so-dialog/so-dialog.component';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-so-action',
  templateUrl: './so-action.component.html',
  styleUrls: ['./so-action.component.scss']
})
export class SoActionComponent {
cellValue: any;
  assignAction: any;
  urlData: any;
  completedStatus :any ='';
  deliveredQty: any;
  proposedQuantity: any;
  soStatus : boolean = false;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private _production: ProductionService,
      private _rbackService: RbacMasterService,
  ) {}
  ngOnInit(): void {
    this.urlData = environment.servralUrl;
    this.assignAction = this._rbackService.accessAssignAction();
    
  }

  ngAfterViewInit(): void {}

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    this.deliveredQty = params.data.delivered_qty;
    this.completedStatus = params.data?.completedStatus;
    this.proposedQuantity = params.data.total_proposed_qty;
    this.soStatus = params.data?.proposal_version_status==='REJECTED'?true:false;
  }
  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data;
  }

  // send email

  sendEmail() {
    const dialogRef = this.dialog.open(SendEmailComponent, {
      width: '40%',
      height: '70%',
      position: { bottom: '10px', right: '10px' },
      panelClass: 'full-screen-modal',
      data: { id: this.cellValue },
    });
  }

  downloadData() {
    // this._production.downloadPDf(this.cellValue.id).subscribe((res: any) => {
    //   console.log(res);
    //   window.open(
    //     this.urlData + '/api/v1/salesOrderDownload/' + res.backend_url,
    //     '_blank'
    //   );
    // });
  }

  addDoformValue() {
    this.route.navigate(['/master/sales/add-DO'], {
      queryParams: { sales_id: this.cellValue.proposal_id },
    });
  }
  addChallanformValue() {
    this.route.navigate(['/master/sales/so/create-so'], {
      queryParams: { sales_id: this.cellValue.proposal_id,version_id:this.cellValue?.version_id },
    });
  }

  historyOfDO() {
    this.route.navigate(['/master/sales/so/so-history'], {
      queryParams: { so_history: this.cellValue.proposal_id },
    });
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  openDialog(type:string){
    const dialogRef = this.dialog.open(SoDialogComponent, {
      width: '40%',
      height: '48%', 
      disableClose: true,     
      panelClass: 'full-screen-modal',
      data: {
        data:this.cellValue,
        type:type
      } ,
      
    });

    dialogRef.afterClosed().subscribe({
      next:(res:any)=> {
        this.reloadCurrentRoute();
      },
    })
  }

  createInvoice(){
    this.route.navigate(['/master/sales/create-delivery-challan'], {
      queryParams: { sales_id: this.cellValue.proposal_id },
    });
  }
}
