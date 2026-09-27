import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ShortcutService } from 'src/app/@shared/services/shortcut.service';
import { PriceStatusComponent } from './price-status/price-status.component';
import { PriceActionComponent } from './price-action/price-action.component';

@Component({
  selector: 'app-price-master',
  templateUrl: './price-master.component.html',
  styleUrls: ['./price-master.component.scss'],
})
export class PriceMasterComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  entity_id: any;
  financial_year_id: any;

  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    private route: Router,
    public dialog: MatDialog,
    private _commonService: CommonService,
    private shortcutService: ShortcutService
  ) {
    this.rowClass = 'rowClass';
  }
  ngOnInit(): void {
    this.financial_year_id = localStorage.getItem('financial_id');
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.getPriceList();
    this.shortcutService.registerShortcut('c', () => {
      this.downloadCSV();
    });
  }

  getPriceList = () => {
    this._configurationalMasterService
      .getPriceMasterList(this.entity_id)
      .subscribe((res: any) => {
        this.rowData = res.data;
      });
  };

  public columnDefs: ColDef[] = [
    {
      headerName: 'S.No.',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.5,
      minWidth: 90,
    },
    {
      headerName: 'Company Name',
      field: 'company_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      tooltipField: 'company_name',
      cellClass: 'grid-cell-centered',
      flex: 2,
      minWidth: 200,
    },
    {
      headerName: 'Customer Type',
      field: 'customer_type_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      tooltipField: 'customer_type_name',
      cellClass: 'grid-cell-centered',
      flex: 1.2,
      minWidth: 160,
    },
    {
      headerName: 'Customer Code',
      field: 'customer_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: PriceStatusComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
      cellClass: 'grid-cell-centered',
      flex: 0.8,
      minWidth: 130,
    },
    {
      headerName: 'Action',
      field: 'id',
      pinned: 'right',
      flex: 1,
      minWidth: 150,
      cellRenderer: PriceActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
      cellClass: 'grid-cell-centered',
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

  downloadCSV() {
    this._commonService?.downloadCSV(this.rowData, 'Price_Master_List');
  }

  isShortcutVisible() {
    return this.shortcutService.isShortcutVisible();
  }

  createPrice() {
    this.route.navigate(['master/configurational-master/price-master/create']);
  }
}
