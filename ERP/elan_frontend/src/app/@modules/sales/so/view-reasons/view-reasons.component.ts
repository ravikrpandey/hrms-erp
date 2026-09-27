import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';
import { ProductionService } from 'src/app/@shared/services/production/production.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { SalesService } from '../../service/sales.service';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-view-reasons',
  templateUrl: './view-reasons.component.html',
  styleUrls: ['./view-reasons.component.scss']
})
export class ViewReasonsComponent {
  rowClass: any;
    private gridApi!: GridApi<any>;
    rowData: any;
    public gridOptions: any = { rowSelection: 'multiple', };
    isDeleteButtonVisible: boolean = false;
    selectedRows: any[] = [];
    queryParamss: any;
    id: any;
    collegeids: any;
    collegeIdCopy: any;
    loginUser: any;
    assignAction: any;
    role_master_id: any;
   selected = new FormControl(0);
  constructor(
    public dialogRef: MatDialogRef<ViewReasonsComponent>,   
       @Inject(MAT_DIALOG_DATA) public data: any,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private toast: ToastrService,
    private route: Router,
    private $proposal: ProposalService,
    private activeroute: ActivatedRoute,
    private _productionService:ProductionService,private _seles:SalesService
  ) {
    this.rowClass = 'rowClass';
     
    console.log(data);
    this.reasonStatusList(data);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public columnDefs = [
    {
      headerName: 'S No.',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered ',
      flex: 1,
    },
    {
      headerName: 'Sales Reason',
      field: 'sales_reason', 
      valueGetter: (params:any) => params.data?.resionData?.sales_reason || params.data?.versionRejectedReason?.sales_reason||'',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    
    {
      headerName: 'Remark',
      field: 'remark',
      valueGetter: (params:any) => params.data?.remark || params.data?.version_rejected_remark||'',

      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
       
    },
  ]
  onGridReady(params: GridReadyEvent) {
      this.gridApi = params.api;
    }
  reasonStatusList(reason:any){
    

    if(reason.tab!==3){    
    this._seles.reasonStatusList(reason?.data.version_id,reason?.tab).subscribe({
      next:(res:any) =>{
        console.log(res);
        this.rowData = res.data;
      },error:(err) =>{
        console.log(err)
      },
    })
  }else{    
    this._seles.reasonStatusList(reason?.data.pi_id,reason?.tab).subscribe({
      next:(res:any) =>{
        console.log(res);
        this.rowData = res.data;
      },error:(err) =>{
        console.log(err)
      },
    })
  }
  }
}
