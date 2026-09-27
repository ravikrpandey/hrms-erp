import { Component } from '@angular/core';
import {
  GridApi,
  GridReadyEvent,
  CellValueChangedEvent,
  ICellRendererParams,
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ToastrService } from 'ngx-toastr';

import { CurrencyMasterActionComponent } from './currency-master-action/currency-master-action.component';
import { CurrencyStatusComponent } from './currency-master-action/currency-status/currency-status.component';
import { CurrencyMasterDialogComponent } from './currency-master-dialog/currency-master-dialog.component';
import { CommonService } from 'src/app/@shared/services/common.service';

@Component({
  selector: 'app-currency-master',
  templateUrl: './currency-master.component.html',
  styleUrls: ['./currency-master.component.scss']
})
export class CurrencyMasterComponent {
  errorMessage: any;
  id: any;
  states_id: any;
  countryss_id: any;
  Currency_Convert_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;
  countryData: any = [];
  stateData: any = [];

  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    public dialog: MatDialog, private route: Router, private activetRoute: ActivatedRoute,
    private toaster: ToastrService,
    private _commonService: CommonService
  ) {
    this.rowClass = 'rowClass'

  }

  ngOnInit(): void {

    this.getCurrency();
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;


      this.Currency_Convert_id = this.id.Currency_Convert_id

    });
  }
  public columnDefs: any = [
    {
      headerName: 'Currency ID',
      field: 'Currency_Convert_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Currency Type',
      field: 'Currency_Type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Rate',
      field: 'rate',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
    },
    // {
    //   headerName: 'Status',
    //   field: 'status',
    //   cellRenderer: CurrencyStatusComponent,
    //   cellRendererParams: {
    //     className: 'mat-blue',
    //     hideRequestButton: true,
    //     hideDetailsButton: false,
    //     hideDownloadIcon: false,
    //     showCustomIcon: false,
    //     someProperty: 'value',
    //   },
    //   cellClass: "grid-cell-centered",
    //   minWidth: 150,
    // },
    {
      headerName: 'Action',
      field: 'Currency_Type',
      flex: 1,
      minWidth: 150,
      cellRenderer: CurrencyMasterActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },

    }
  ];



  agInit(params: ICellRendererParams): void {

  }
  onCellValueChanged(event: CellValueChangedEvent) {
    let payload = {
      // Currency_Convert_id: event.data.Currency_Convert_id,
      Currency_Type: event.data.Currency_Type,
      rate: event.data.rate,
    }
    if (!event.data.Currency_Convert_id) {
      if (event.data.rate) {
        this.createCurrency(payload)
      }
    } else {
      this.updateCurrency(event.data.Currency_Convert_id, payload)
    }

  }
  downloadCSV() {
    this._commonService?.downloadCSV(this.rowData,"Currency_Master_List.xlsx");
  }
  createCurrency(data: any) {
    this._configurationalMasterService.CurrencyCreate(data).subscribe(
      (res: any) => {

        this.toaster.success('Currency Created Successfully');
        this.reloadCurrentRoute();
      },
      (err: any) => {

        this.toaster.error(
          "Currency is All Ready Exits!",
          'Error Message'
        );
      }
    );
  }
  updateCurrency(id: any, data: any) {
    console.log(data, 'trwerujfwjmqelogmjlsdf');
    console.log(id, 'iffrraswvdvgdvsv');

    this._configurationalMasterService.CurrencyUpdate(id, data).subscribe(
      (res: any) => {

        this.toaster.success('Currency Updated Successfully');
      },
      (err: any) => {
        this.toaster.error(
          "Currency is All Ready Exits!",
          'Error Message'
        );

      }
    );
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;


  }
  addRecordToGrid(data: any) {
    // if data missing or data has no it, do nothing
    if (!data || data.id == null) { return; }

    const api = this.gridApi;
    // do nothing if row is already in the grid, otherwise we would have duplicates
    const rowAlreadyInGrid = !!api.getRowNode(data.id);

    if (rowAlreadyInGrid) {

      return;
    }

    const transaction = {
      add: [data],
    };

    api.applyTransaction(transaction);
  }

  onFactoryButtonClick(e: any) {
    this.count++
    if (this.count === 1) {
      var button = e.currentTarget,
        buttonColor = button.getAttribute('data-color'),
        side = button.getAttribute('data-side'),
        data = createDataItem(buttonColor);
      this.addRecordToGrid(data);
      this.gridApi.paginationGoToLastPage();
    } else {
      this.toaster.warning("can't add without feel")
    }


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
  getCurrency() {
    this._configurationalMasterService.CurrencyList().subscribe((res: any) => {
      this.rowData = res.data;


    })
  }
  openDialog() {
    const dialogRef = this.dialog.open(CurrencyMasterDialogComponent, {
      // data: { id: this.queryParamss },

      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
let rowIdSequence = 100;

function createDataItem(color: string) {
  const obj = {
    id: rowIdSequence++,
    color: color,
    value1: Math.floor(Math.random() * 100),
    value2: Math.floor(Math.random() * 100)
  };

  return obj;
}


