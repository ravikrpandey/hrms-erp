import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { SalesManagementService } from 'src/app/@modules/sales-management/sales-management-service/sales-management.service';
import { AppListDialogComponent } from 'src/app/@shared/app-list-dialog/app-list-dialog.component';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import Swal from 'sweetalert2';

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
  constructor(
    private route: Router,
    private _rbackService: RbacMasterService,
    private recruitService: RecruitService,
    private toast: ToastrService,
    private _empMasterService: EmpMasterService,
    public dialog: MatDialog,
    private SalesService:SalesManagementService
  ) {
    // this.data = localStorage.getItem("jobId");
    //
  }

  ngOnInit(): void {}
  public cellValue: any;

  agInit(params: ICellRendererParams): void {

    this.cellValue = this.getValueToDisplay(params);
  }
  getValueToDisplay(params: ICellRendererParams) {
    if (params.data.id) {
      this.jobIdNew = params.data.id;
      this.rowValue=params.data;
      this.assignAction = this._rbackService.accessAssignAction();
      return params.data.id;
    }



    //help disk


  }

  refresh(params: ICellRendererParams): boolean {
    // set value into cell again

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }


edit(e:any){
  e.stopPropagation();
    this.route.navigate(['/master/warehouse-management/receive-stock-transfer/create-receive-stock-transfer'], {
    queryParams: { id: this.cellValue ,view:'edit'},
  });
}
  view(e: any) {

    e.stopPropagation();
    this.route.navigate(['/master/warehouse-management/receive-stock-transfer/create-receive-stock-transfer'], {
      queryParams: { id: this.cellValue ,view:'view'},
    });
  }













}
