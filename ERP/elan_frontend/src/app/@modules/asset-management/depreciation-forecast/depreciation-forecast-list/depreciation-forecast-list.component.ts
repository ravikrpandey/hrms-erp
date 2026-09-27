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
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subscription } from 'rxjs';
import { DepreciationForecastActionComponent } from '../depreciation-forecast-action/depreciation-forecast-action.component';
import { DepreciationService } from 'src/app/@shared/services/depreciation.service';
import { ExcelDialogComponent } from '../excel-dialog/excel-dialog.component';
import { CommonService } from 'src/app/@shared/services/common.service';
@Component({
  selector: 'app-depreciation-forecast-list',
  templateUrl: './depreciation-forecast-list.component.html',
  styleUrls: ['./depreciation-forecast-list.component.scss']
})
export class DepreciationForecastListComponent {
  errorMessage: any;
  id: any;
  rowClass: any;
  fid:any;
  private gridApi!: GridApi<any>;
  rowData: any;
  entity_id:any;
  filter_fy:any;
  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    private _commonService : CommonService,
    public dialog: MatDialog, private route: Router, private activetRoute: ActivatedRoute,
    private toaster: ToastrService, private router: Router,
    private depreciationService : DepreciationService
  ) {
    this.rowClass = 'rowClass'
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem("selectedEntityId");
    this.filter_fy = localStorage.getItem('financial_id');
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.getDepreciationList();
    })
    this.getDepreciationList();
  }

  uploadExcel = () => {
    const dialogRef = this.dialog.open(ExcelDialogComponent, {
      width: '600px',
      data: { id: this.fid, entity_id : this.entity_id },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getDepreciationList();
    });
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
      headerName: 'Financial Year',
      field: 'financial_year',
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
      headerName: 'Month',
      field: 'depreciation_month',
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
      headerName: 'Type',
      field: 'depreciation_type',
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
      headerName: 'Amount',
      field: 'depreciation_amount',
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
      cellRenderer: DepreciationForecastActionComponent,
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
    this.getDepreciationList();
  }


  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onCellClicked(e:any){
  }

  agInit(params: ICellRendererParams): void {

  }

  goToAdd = () => {
    this.router.navigate(['/master/asset-management/depreciation/create'])
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

  getDepreciationList() {
    this._commonService?.showLoader()
    this.depreciationService.getAllDepreciation(this.entity_id,this.filter_fy).subscribe((res: any) => {
      this._commonService?.hideLoader()
      this.rowData = res.data;
      this.rowData = this.rowData.map((row:any)=>{
        row.depreciation_amount = Math.floor(row.depreciation_amount)
        return row;
      })
    },
    ((err:any)=>{
      this._commonService?.hideLoader()
      this.rowData=[]
      // this.toaster.error(`${err.error.message}`)
    })
    )
  }
}