import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
// import { HelpDeskDialogComponent } from '../help-desk-dialog/help-desk-dialog.component';
import { AppListDialogComponent } from 'src/app/@shared/app-list-dialog/app-list-dialog.component';
import * as moment from 'moment';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ServiceMasterActionComponent } from '../service-master-action/service-master-action.component';
import { ServiceMasterStatusComponent } from '../service-master-action/service-master-status/service-master-status.component';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ShortcutService } from 'src/app/@shared/services/shortcut.service';
import { Router } from '@angular/router';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { ToastrService } from 'ngx-toastr';
import { MapTdsAccountComponent } from '../map-tds-account/map-tds-account.component';

@Component({
  selector: 'app-service-master-list',
  templateUrl: './service-master-list.component.html',
  styleUrls: ['./service-master-list.component.scss']
})
export class ServiceMasterListComponent {

  private gridApi!: GridApi<any>
  rowData: any;
  rowClass: any;
  assignAction: any;
  entity_id:any;
  financial_year_id:any;
  
  constructor(private empMaster: EmpMasterService,
    private _commonService :CommonService, 
    private _configurationalMasterService: ConfigurationalmasterService,
    private _finaceservice: FinaceService,
    private _rbackService: RbacMasterService,
    private toster : ToastrService,
    private shortcutService: ShortcutService,
    private route :Router,
    public dialog: MatDialog) {
      this.rowClass = 'rowClass';
    }
    ngOnInit(): void {
    this.financial_year_id = localStorage.getItem('financial_id');;
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.getList()
  }

  getList = () => {
    this._commonService?.showLoader()
    this._configurationalMasterService.getServiceMasterList(this.entity_id).subscribe((res: any) => {
      this._commonService?.hideLoader()
      // const aa = res.data
      // const newArray = aa.map((item: any, index: any) => ({ ...item, index: index + 1 }));
      // this.rowData = newArray
      const dataModify:any=[];
      res?.data?.map((data:any)=>{
        dataModify.push({
          service_code:data?.service_code,
          service_category_name:data?.MASTER_SERVICE_CATEGARY?.service_category_name,
          service_name:data?.service_name,
          service_id:data?.service_id,
          isDeleted:data?.isDeleted,
          status:data?.status,
          MVP:data?.MVP

        })
      })
      console.log(dataModify,'dataModify');
      
      this.rowData=dataModify;
      this.assignAction = this._rbackService.accessAssignAction();
    },(err:any) => {
      this._commonService?.hideLoader()
    })
    this.shortcutService.registerShortcut('a', () => {
      this.route.navigate(["/master/configurational-master/service-master/create"])
    });
    
  }
  mapChartOfAccount(){
    const dialogRef = this.dialog.open(MapTdsAccountComponent, {
      width: '600px',
      data :{ chart_account_id:this.rowData[0].chart_account_id}
       
    });
    dialogRef.afterClosed().subscribe((result) => {
       
    });
  }
  createServiceMaster(){
        
this._finaceservice.getFinancialYearActiveMonthByEntityId(this.entity_id, this.financial_year_id).subscribe({
  next: (res: any) => {

    let newMonth = this._finaceservice.getCurrentMonth();
    let isExistData = res.data.some((x: any) => x.month === newMonth);
      if (!isExistData && res.code===200) {
      this.toster.warning(res.message);
      return
    }
    if (!isExistData && res.code===201) {
      this.toster.warning(res.message);
      return
    }
    

    
    this.route.navigate(["/master/configurational-master/service-master/create"])
    
  }, error:(err)=> {
    console.log(err)
    this.toster.warning(err.error.message);
      return
  },
})


  }
  public columnDefs = [

    {
      headerName: 'S.No.',
      valueGetter: "node.rowIndex + 1",
      // field: 'i',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      // valueGetter: 'node.rowIndex+1',
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Service Code',
      field: 'service_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
    },

    // {
    //   headerName: 'Service Category',
    //   field: 'service_category_name',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: "grid-cell-centered",
    //   flex: 1,
    //   minWidth: 150
    // },


    {
      headerName: 'Service Name',
      field: 'service_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },

    {
      headerName: 'Status',
      field: 'status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex: 1,
      minWidth: 150,
      cellRenderer: ServiceMasterStatusComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },

    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: ServiceMasterActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    }
  ];


  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;


  }
  onCellClicked(e: any) {
    // console.log(e, 'eeeeeee');

    // const dialogRef = this.dialog.open(AppListDialogComponent, { width: '500px', data: { branchSetupViewId: e.data.id, index: e.data.index } });
    // dialogRef.afterClosed().subscribe(result => {

    // })
  }

  isShortcutVisible() {
    return this.shortcutService.isShortcutVisible();
  }
}

