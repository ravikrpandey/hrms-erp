import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent {
singleId:any;
  cellValue1:any; 
  assignAction: any;
  entity_id: any;
 
  constructor(
    private route: Router,
    private _rbackService: RbacMasterService,
    private toaster: ToastrService,
  ) {
    // this.data = localStorage.getItem("jobId");
    // 
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.assignAction = this._rbackService.accessAssignAction();
  }

  public cellValue: any;
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  agInit(params: ICellRendererParams): void {
   
    this.cellValue = this.getValueToDisplay(params);
    this.cellValue1 = params.data;
    // console.log("paramsss",this.cellValue);
    // console.log("paramsss11",this.cellValue1)
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data.request_id
  }

  refresh(params: ICellRendererParams): boolean {
    
 

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  edit(e: any) { 
   e.stopPropagation();
    this.route.navigate(['/master/ess/overtime-request/create-request'], { queryParams: { id: this.cellValue,type:'approver' } })
  }

  view(e: any) {
   e.stopPropagation();
    this.route.navigate(['/master/ess/overtime-request/create-request'], { queryParams: { id: this.cellValue,type:'view' } })
  }

  
}

