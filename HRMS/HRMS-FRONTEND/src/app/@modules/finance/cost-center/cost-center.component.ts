import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { environment } from 'src/app/environments/environment';
import { CostCenterActionComponent } from './cost-center-action/cost-center-action.component';
import { CostCenterStatusComponent } from './cost-center-action/cost-center-status/cost-center-status.component';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import moment from 'moment';

@Component({
  selector: 'app-cost-center',
  templateUrl: './cost-center.component.html',
  styleUrls: ['./cost-center.component.scss']
})
export class CostCenterComponent {
  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  public gridOptions: any = { rowSelection: 'multiple',enableRangeSelection: true,  
    enableClipboard: true,  };
  rowData: any;
  count: any = 0;
  assignAction: any;
  entity_id:any;
  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    private finance: FinaceService,
    private _rbackService: RbacMasterService,
    public dialog: MatDialog, private route: Router, private activetRoute: ActivatedRoute,
    private toaster: ToastrService,
    private prService: PurchaseRequestService,
    private commonService: CommonService

  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.assignAction = this._rbackService.accessAssignAction();
    this.getAllCostCenter();
    
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
    });
  }


  ngAfterViewInit(): void {
    setTimeout(() => {
      this.assignAction = this._rbackService.accessAssignAction();
    }, 0);
  }


  getClassForPrice(lowThsthresholdStock: any): string {
    return 'low_hershold_stock';
  }

  public columnDefs = [
    {
      headerName: 'S.NO',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'CC Code',
      field: 'cost_center_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      // cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      //editable: true,
      cellClass: (params: { value: any; }) => this.getClassForPrice(params)
    },
    {
      headerName: 'Name of Cost Center',
      field: 'cost_center_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      //editable: true,
    },

    {
      headerName: 'Region',
      field: 'region_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      //editable: true,
    },
    {
      headerName: 'Department',
      field: 'department_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      //editable: true,
    },
    {
      headerName: 'Status',
      field: 'status',
      flex: 1,
      minWidth: 150,
      cellRenderer: CostCenterStatusComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
      cellClass: "grid-cell-centered",
    },
    {
      headerName: 'Take Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: CostCenterActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
      cellClass: 'action-column',
    },
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  getAllCostCenter() {
    this.finance.getAllCostCenter(this.entity_id).subscribe((res: any) => {
      this.rowData = res.data;
    },
    ((err:any)=>{
      this.toaster.error(`${err?.error.message}`);
      this.rowData=[]
    })
    )
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  cellClicked(e: any) {

    // const dialogRef = this.dialog.open(PrItemDilogComponent, { width: '400px', data: { cellData: e.data } });
    // dialogRef.afterClosed().subscribe(result => {

    // })

  }
  onBtnExportDataAsExcel(){
    
    let data = this.rowData.map((x:any,i:number)=>({
      SrNo:i+1,
      CostCenterCode:x.cost_center_code,
      CostCenterName:x.cost_center_name,
      RegionName:x.region_name,
      DepartmentName:x.department_name,
      Date:moment(x.cost_center_createdAt).format("YYYY-MM-DD"),
    }))
    
        this.commonService.exportAsExcelFile(data, 'Cost of Center');
    }


}


