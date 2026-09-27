import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { PurchaseServiceActionComponent } from './purchase-service-action/purchase-service-action.component';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-purchase-service-voucher',
  templateUrl: './purchase-service-voucher.component.html',
  styleUrls: ['./purchase-service-voucher.component.scss']
})
export class PurchaseServiceVoucherComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any[] = [];
  public gridOptions: any = { rowSelection: 'multiple', };
  isDeleteButtonVisible: boolean = false;
  selectedRows: any[] = [];
  queryParamss: any;
  id: any;
  collegeids: any;
  collegeIdCopy: any;
  loginUser: any;
  assignAction: any;
  company_id: any;
  totalDebit: number = 0;
  totalCredit: number = 0;

  // Currency properties
  currencyCode: string = 'INR';
  currencySymbol: string = '₹';
  currencyRate: number = 1;
  currencyData: any = [];

  // Store base data in INR
  private baseRowData: any[] = [];

  constructor(
    public dialog: MatDialog,
    private _finaceservice: FinaceService,
    private _rbackService: RbacMasterService,
    private toast: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private _configurationalMasterService: ConfigurationalmasterService
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.company_id = localStorage.getItem('company_id');

    this._configurationalMasterService.currency$
      .subscribe((currency: any) => {
        if (!currency) return;

        this.currencyData = currency;
        this.currencyCode = currency.Currency_Type || currency.symbols || 'INR';
        this.currencyRate = Number(currency.rate) || 1;
        this.currencySymbol = currency.symbols || '₹';

        this.applyCurrencyConversion();
      });

    this.getPurchaseServiceList();
  }

  public columnDefs = [
    {
      headerName: 'S.No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      maxWidth: 85,
    },
    {
      headerName: 'Posting Date',
      field: 'posting_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Document Number',
      field: 'document_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Branch',
      field: 'branch_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Vendor',
      field: 'vendor_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Reference Number',
      field: 'reference_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Net Amount',
      field: 'net_display',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        const amount = Number(params.value);
        if (!isNaN(amount) && amount > 0) {
          return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: this.currencyCode,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(amount);
        }
        return this.currencySymbol + ' 0.00';
      }
    },
    {
      headerName: 'Action',
      field: 'id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      cellRenderer: PurchaseServiceActionComponent
    }
  ];

  public taxableColumn = {
    headerName: 'Taxable Amount',
    field: 'taxable_display',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'grid-cell-centered',
    flex: 1,
    minWidth: 150,
    cellRenderer: (params: any) => {
      const amount = Number(params.value);
      if (!isNaN(amount) && amount > 0) {
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: this.currencyCode,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(amount);
      }
      return this.currencySymbol + ' 0.00';
    }
  };

  public totalDebitColumn = {
    headerName: 'Total Debit',
    field: 'total_debit_display',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'grid-cell-centered',
    flex: 1,
    minWidth: 150,
    cellRenderer: (params: any) => {
      const amount = Number(params.value);
      if (!isNaN(amount) && amount > 0) {
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: this.currencyCode,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(amount);
      }
      return this.currencySymbol + ' 0.00';
    }
  };

  // Total Credit Column (if needed)
  public totalCreditColumn = {
    headerName: 'Total Credit',
    field: 'total_credit_display',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'grid-cell-centered',
    flex: 1,
    minWidth: 150,
    cellRenderer: (params: any) => {
      const amount = Number(params.value);
      if (!isNaN(amount) && amount > 0) {
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: this.currencyCode,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(amount);
      }
      return this.currencySymbol + ' 0.00';
    }
  };

  addNewForm() {
    this.route.navigate(['master/finance/transactions/add-purchase-service-voucher']);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement).value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  getPurchaseServiceList() {
    let entity_id = localStorage.getItem("selectedEntityId");
    this._finaceservice.getPurchaseServiceList(entity_id).subscribe((response: any) => {
      if (response) {
        // Store base data in INR
        this.baseRowData = response.data;
        this.applyCurrencyConversion();
      }
    }, (err: any) => {
      // Handle error
    });
  }

  applyCurrencyConversion() {
    if (!this.baseRowData || this.baseRowData.length === 0) {
      this.rowData = [];
      this.calculateTotals();
      return;
    }

    this.rowData = this.baseRowData.map((row: any) => {
      const convertedRow = { ...row };

      if (row.net) {
        convertedRow.net_display = this.convertAmount(row.net);
        convertedRow.net_converted = this.convertAmount(row.net);
      }

      if (row.taxable) {
        convertedRow.taxable_display = this.convertAmount(row.taxable);
        convertedRow.taxable_converted = this.convertAmount(row.taxable);
      }

      if (row.total_debit_amount) {
        convertedRow.total_debit_display = this.convertAmount(row.total_debit_amount);
        convertedRow.total_debit_converted = this.convertAmount(row.total_debit_amount);
      }

      if (row.total_credit_amount) {
        convertedRow.total_credit_display = this.convertAmount(row.total_credit_amount);
        convertedRow.total_credit_converted = this.convertAmount(row.total_credit_amount);
      }

      if (row.gross) {
        convertedRow.gross_display = this.convertAmount(row.gross);
        convertedRow.gross_converted = this.convertAmount(row.gross);
      }

      if (row.gst_total) {
        convertedRow.gst_display = this.convertAmount(row.gst_total);
        convertedRow.gst_converted = this.convertAmount(row.gst_total);
      }

      if (row.discount_amount) {
        convertedRow.discount_display = this.convertAmount(row.discount_amount);
        convertedRow.discount_converted = this.convertAmount(row.discount_amount);
      }

      return convertedRow;
    });

    this.calculateTotals();

    if (this.gridApi) {
      this.gridApi.setRowData(this.rowData);
    }
  }

  convertAmount(value: any): number {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue === 0) return 0;
    return this.roundToTwoDecimals(numValue * this.currencyRate);
  }

  private roundToTwoDecimals(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  calculateTotals() {
    if (!this.rowData || this.rowData.length === 0) {
      this.totalDebit = 0;
      this.totalCredit = 0;
      return;
    }

    this.totalDebit = this.rowData.reduce((sum, row) => {
      const val = row.total_debit_display || row.total_debit_amount || 0;
      return sum + parseFloat(val);
    }, 0);

    this.totalCredit = this.rowData.reduce((sum, row) => {
      const val = row.total_credit_display || row.total_credit_amount || 0;
      return sum + parseFloat(val);
    }, 0);

    this.totalDebit = this.roundToTwoDecimals(this.totalDebit);
    this.totalCredit = this.roundToTwoDecimals(this.totalCredit);
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  getFormattedTotalDebit(): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: this.currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(this.totalDebit);
  }

  getFormattedTotalCredit(): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: this.currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(this.totalCredit);
  }

  refreshData() {
    this.getPurchaseServiceList();
  }
}
