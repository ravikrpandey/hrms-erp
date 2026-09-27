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
import { ActionsComponent } from './actions/actions.component';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { QuotationCurrencyDialogComponent } from './quotation-currency-dialog/quotation-currency-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { QuotationCurrencyStatusComponent } from './actions/quotation-currency-status/quotation-currency-status.component';

@Component({
  selector: 'app-quotation-currency',
  templateUrl: './quotation-currency.component.html',
  styleUrls: ['./quotation-currency.component.scss']
})
export class QuotationCurrencyComponent {
  errorMessage: any;
  id: any;
  quotation_currency_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;
  subscription: Subscription;
  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    public dialog: MatDialog, private route: Router, private activetRoute: ActivatedRoute,
    private toaster: ToastrService, private router: Router
  ) {
    this.rowClass = 'rowClass'
    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // browserRefresh = !router.navigated;
      }
    });
  }
  ngOnInit(): void {
    this.getQuotationcurrency();
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.quotation_currency_id = this.id.quotation_currency_id

    })

  }

  public columnDefs = [
    {
      headerName: 'S.NO',
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
      headerName: 'Quotation Currency Name',
      field: 'quotation_currency_name',
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
      headerName: 'Status',
      field: 'status',
      cellRenderer: QuotationCurrencyStatusComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
        someProperty: 'value',
      },
      cellClass: "grid-cell-centered",
      minWidth: 150,
    },

    {
      headerName: 'Action',
      field: 'quotation_currency_id',
      flex: 1,
      minWidth: 150,
      cellRenderer: ActionsComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },

    }
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;


  }

  agInit(params: ICellRendererParams): void {

  }

  onCellValueChanged(event: CellValueChangedEvent) {
    let id1 = event.data.quotation_currency_id;
    let val = event.newValue;

    //  --------------- change on cell -------------------


    let sta = event.data;


    if (val == event.data.status) {
      this._configurationalMasterService.updateSingleQuotationcurrency(id1, sta).subscribe(
        (res: any) => {

          this.toaster.success('Status Updated Successfully')
        }, (err: any) => {
          // this.toaster.error('Something went wrong please try again', 'Error Message');

        });
    }
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

  openDialog() {
    const dialogRef = this.dialog.open(QuotationCurrencyDialogComponent, {
      // data: { id: this.queryParamss },

      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }

  getQuotationcurrency() {
    this._configurationalMasterService.getQuotationcurrency().subscribe((res: any) => {
      this.rowData = res.data;
    },(err : any) => {
      this.rowData = [];
    })
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
