import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { FinanceCreateComponent } from '../finance-create/finance-create.component';
import { MatDialog } from '@angular/material/dialog';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { ActionComponent } from '../action/action.component';
import { ActionStatusComponent } from '../action-status/action-status.component';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ShortcutService } from 'src/app/@shared/services/shortcut.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-financial-list',
  templateUrl: './financial-list.component.html',
  styleUrls: ['./financial-list.component.scss']
})
export class FinancialListComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  public gridOptions: any = { rowSelection: 'multiple', };
  rowData: any;
  entity_id: any;
  assignAction: any;
  id: any;
  countryss_id: any;
  xcount: any;
  financial_year_id: any;

  constructor(
    private _rbackService: RbacMasterService,
    private activetRoute: ActivatedRoute,
    public dialog: MatDialog,
    private financeService: FinaceService,
    private _commonService: CommonService,
    private shortcutService: ShortcutService,
  ) {
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');;
    this.assignAction = this._rbackService.accessAssignAction();
    this.getFinancialYears();
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.countryss_id = this.id.countryss_id;
    });
  }

  getFinancialYears() {
    this._commonService?.showLoader()
    this.financeService.getFinancialYear().subscribe((res: any) => {
      this.rowData = res.data;
      this._commonService?.hideLoader()
      console.log("Finance Years List", this.rowData);
    }, (err: any) => {
      this._commonService?.hideLoader()
      this.rowData = []
    })
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  openDialog() {
    const dialogRef = this.dialog.open(FinanceCreateComponent, {
      width: '35%',
      data: { mode: 'add' },
    });
    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  public columnDefs = [
    {
      headerName: 'S.No.',
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
      headerName: 'Financial Year',
      field: 'financial_year',
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
      headerName: 'Start Date',
      field: 'year_start_date',
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
      headerName: 'End Date',
      field: 'year_end_date',
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
      cellRenderer: ActionStatusComponent,
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
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: ActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },
  ];

  downloadCSV() {
    this._commonService?.downloadCSV(this.rowData);
  }
  isShortcutVisible() {
    return this.shortcutService.isShortcutVisible();
  }
}
