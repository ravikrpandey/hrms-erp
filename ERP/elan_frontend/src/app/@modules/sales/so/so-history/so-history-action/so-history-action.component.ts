import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ProductionService } from 'src/app/@shared/services/production/production.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-so-history-action',
  templateUrl: './so-history-action.component.html',
  styleUrls: ['./so-history-action.component.scss']
})
export class SoHistoryActionComponent {
cellValue: any;
  assignAction: any;
  urlData: any;
  completedStatus :any ='';
  deliveredQty: any;
  proposedQuantity: any;
  soStatus : boolean = false;
  constructor(private route: Router,private _production: ProductionService,private _rbackService: RbacMasterService,
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
    
  }
  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data;
  }

 

  

  

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  

  createInvoice(){
    this.route.navigate(['/master/sales/create-delivery-challan'], {
      queryParams: { sales_id: this.cellValue.do_id },
    });
  }
}
