import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { GridOptions } from 'ag-grid-community';
import 'ag-grid-enterprise';
import { AreaDilogComponent } from './area-dilog/area-dilog.component';
import { AreaActionComponent } from './area-action/area-action.component';
import { AreaStatusActionComponent } from './area-action/area-status-action/area-status-action.component';
import { CommonService } from 'src/app/@shared/services/common.service';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent {
  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;
  gridOptions: GridOptions = {}

  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    public dialog: MatDialog, private route: Router, private activetRoute: ActivatedRoute,
    private toaster: ToastrService,
    private _commonService: CommonService,
    private prService: PurchaseRequestService,

  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.getAllArea();
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.countryss_id = this.id.countryss_id;
      
    });
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
      minWidth:150
    },
    {
      headerName: 'Sub Department',
      field: 'area_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth:150,
    },
    {
      headerName: 'Department Name',
      field: 'department_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth:150,
    },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: AreaStatusActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
        someProperty: 'value',
      },
      cellClass: "grid-cell-centered",
    },
    {
      headerName: 'Action',
      cellRenderer: AreaActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
        someProperty: 'value',

      },
      cellClass: "grid-cell-centered",
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

  openDialog() {
    const dialogRef = this.dialog.open(AreaDilogComponent, {
      // data: { id: this.queryParamss },

      width: '30%',
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  getAllArea() {
    const entity_id = localStorage.getItem('selectedEntityId')
    this._configurationalMasterService.getAreaMasterList(entity_id).subscribe((res: any) => {
      this.rowData = res.data;
      console.log("?????????????", this.rowData)
    },(err : any) => {
      this.rowData = []
    })
  }
  downloadCSV() {
    this._commonService?.downloadCSV(this.rowData,"Sub_Department_List.xlsx");
  }
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
}