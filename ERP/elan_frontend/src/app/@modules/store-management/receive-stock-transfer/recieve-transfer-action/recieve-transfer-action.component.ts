import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-recieve-transfer-action',
  templateUrl: './recieve-transfer-action.component.html',
  styleUrls: ['./recieve-transfer-action.component.scss']
})
export class RecieveTransferActionComponent {
  jobIdNew: any;
  // data: string | null;
rowValue:any;

  assignAction: any;
  default_status: any;
  constructor(
    private route: Router,
    private _rbackService: RbacMasterService,
    public dialog: MatDialog,
  ) {
    // this.data = localStorage.getItem("jobId");
    //
  }

  ngOnInit(): void {}
  public cellValue: any;

  agInit(params: ICellRendererParams): void {
    this.default_status = params.data.stock_receiver_acknowlwdge
    this.cellValue = this.getValueToDisplay(params);
  }
  getValueToDisplay(params: ICellRendererParams) {
    if (params.data.id) {
      this.jobIdNew = params.data.id;
      this.rowValue=params.data;
      this.assignAction = this._rbackService.accessAssignAction();
      return params.data.id;
    }
  }

  refresh(params: ICellRendererParams): boolean {
    // set value into cell again

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }


edit(e:any){
  e.stopPropagation();
  this.route.navigate(['/master/store-management/receive-stock-transfer/create-receive-stock-transfer'], {
    queryParams: { id: this.cellValue ,view:'edit',status:this.default_status},
  });
}
  view(e: any) {

    e.stopPropagation();
    this.route.navigate(['master/store-management/receive-stock-transfer/create-receive-stock-transfer'], {
      queryParams: { id: this.cellValue ,view:'view',status:this.default_status},
    });
  }













}
