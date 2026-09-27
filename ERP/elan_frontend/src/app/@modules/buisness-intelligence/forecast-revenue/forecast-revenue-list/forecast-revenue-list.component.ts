import { Component } from '@angular/core';
import {
  GridApi,
  GridReadyEvent,
  CellValueChangedEvent,
  ICellRendererParams,
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ForecastRevenueActionComponent } from '../forecast-revenue-action/forecast-revenue-action.component';
import { BuisnessIntelligenceService } from 'src/app/@shared/services/buisness-intelligence.service';
import { ExcelDialogComponent } from '../excel-dialog/excel-dialog.component';
import { CommonService } from 'src/app/@shared/services/common.service';

@Component({
  selector: 'app-forecast-revenue-list',
  templateUrl: './forecast-revenue-list.component.html',
  styleUrls: ['./forecast-revenue-list.component.scss']
})
export class ForecastRevenueListComponent {
  errorMessage: any;
  id: any;
  rowClass: any;
  fid:any;
  private gridApi!: GridApi<any>;
  rowData: any;
  entity_id:any;
  filter_fy:any;
  constructor(
    public dialog: MatDialog, private route: Router, private activetRoute: ActivatedRoute,
    private toaster: ToastrService, private router: Router,
    private buisnessIntelligenceService: BuisnessIntelligenceService,
    private _commonService : CommonService
  ) {
    this.rowClass = 'rowClass'
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem("selectedEntityId");
    this.filter_fy = localStorage.getItem('financial_id');
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.fid = this.id.fid;
      this.getForecastRevenueList();
    })
    this.getForecastRevenueList();
  }

  public columnDefs = [
    {
      headerName: 'S No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Month',
      field: 'forcast_month',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150
    },
    {
      headerName: 'Total Amount',
      field: 'total_Amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      //editable: true,
      minWidth: 150
    },
    {
      headerName: 'Action',
      field: 'countryss_name',
      flex: 1,
      minWidth: 150,
      cellRenderer: ForecastRevenueActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
        onActionPerform: (data: any) => this.handleActions(data),
      },
    }
  ];

  handleActions = (data: any) => {
    this.getForecastRevenueList();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  agInit(params: ICellRendererParams): void {

  }

  goToAdd = () => {
    this.router.navigate(['/master/business-intelligence/revenue-forecasting/create'], { queryParams: { fid: this.fid }})
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

  uploadExcel = () => {
    const dialogRef = this.dialog.open(ExcelDialogComponent, {
      width: '600px',
      data: { fid: this.fid ,entity_id:this.entity_id},
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getForecastRevenueList();
    });
  }

  getForecastRevenueList() {
    this._commonService?.showLoader()
    this.buisnessIntelligenceService.getAllForecastRevenue(this.entity_id,this.fid,this.filter_fy).subscribe((res: any) => {
      this.rowData = res.data;
      this._commonService?.hideLoader()
      this.rowData = this.rowData.map((row:any) => {
        row.fid = this.fid
        return row;
      })
      // this.rowData = res.data.filter((item:any)=>item?.status == "ACTIVE")
    },
    ((err:any)=>{
      this._commonService?.hideLoader()
      this.rowData=[]
      // this.toaster.error(`${err.error.message}`)
    })
    )
  }
}