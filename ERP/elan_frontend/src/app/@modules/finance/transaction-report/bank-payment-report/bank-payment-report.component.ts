import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-bank-payment-report',
  templateUrl: './bank-payment-report.component.html',
  styleUrls: ['./bank-payment-report.component.scss']
})
export class BankPaymentReportComponent {
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
  currencySymbol: any = '₹';
  currencyCode: any = 'INR';
  currencyData: any;
  currencyRate: any = 1;
  public columnDefs: any[] = [];

  constructor(
    public dialog: MatDialog,
    private _finaceservice: FinaceService,
    private _rbackService: RbacMasterService,
    private toast: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private _configurationalMasterService: ConfigurationalmasterService,
  ) {
    this.rowClass = 'rowClass';
    this.columnDefs = this.getColumnDefs();
  }

  ngOnInit(): void {
    this.company_id = localStorage.getItem('company_id');
    this.getBankPaymentReport();
    this._configurationalMasterService.currency$
      .subscribe((currency: any) => {
        this.currencyData = currency;
        this.currencyCode = currency.Currency_Type || 'INR';
        this.currencyRate = Number(currency.rate) || 1;
        this.currencySymbol = currency.symbols || '₹';
        this.columnDefs = this.getColumnDefs();
        if (this.gridApi) {
          this.gridApi.setColumnDefs(this.columnDefs);
          this.gridApi.refreshCells();
        }
        this.getBankPaymentReport();
      });
  }

  convertAmount(amount: number): number {
    if (!amount) return 0;
    return this.currencyRate ? amount * this.currencyRate : amount;
  }

  formatCurrency(amount: number): string {
    const convertedAmount = this.convertAmount(amount);
    if (!convertedAmount && convertedAmount !== 0) {
      return `${this.currencySymbol} 0.00`;
    }
    return `${this.currencySymbol} ${convertedAmount.toFixed(2)}`;
  }

  getColumnDefs() {
    return [
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
        valueFormatter: (params: any) => {
          if (!params.value) return '';
          const date = new Date(params.value);
          return date.toLocaleDateString('en-IN');
        }
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
        headerName: 'Transaction Date',
        field: 'transaction_date',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
        valueFormatter: (params: any) => {
          if (!params.value) return '';
          const date = new Date(params.value);
          return date.toLocaleDateString('en-IN');
        }
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
        headerName: 'Notes',
        field: 'notes',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: 'GL Account',
        field: 'chart_account_name',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: 'Party Type',
        field: 'party_type',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: `Credit (${this.currencySymbol})`,
        field: 'credit_amount',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
        cellRenderer: (params: any) => {
          const amount = Number(params.value);
          if (!isNaN(amount) && amount !== 0) {
            return `${this.currencySymbol} ${amount.toFixed(2)}`;
          }
          return `${this.currencySymbol} 0.00`;
        },
        valueGetter: (params: any) => {
          return params.data && params.data.credit_amount ? params.data.credit_amount : 0;
        }
      },
      {
        headerName: `Debit (${this.currencySymbol})`,
        field: 'debit_amount',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
        cellRenderer: (params: any) => {
          const amount = Number(params.value);
          if (!isNaN(amount) && amount !== 0) {
            return `${this.currencySymbol} ${amount.toFixed(2)}`;
          }
          return `${this.currencySymbol} 0.00`;
        },
        valueGetter: (params: any) => {
          return params.data && params.data.debit_amount ? params.data.debit_amount : 0;
        }
      },
      {
        headerName: 'Cost Center',
        field: 'cost_center_name',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: 'Profit Center',
        field: 'profit_center_name',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: 'Bank Name',
        field: 'bank_name',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: 'TDS',
        field: 'tds',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: 'TDS Rate',
        field: 'tds_rate',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: `TDS Amount (${this.currencySymbol})`,
        field: 'tds_rate_amount',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
        cellRenderer: (params: any) => {
          const amount = Number(params.value);
          if (!isNaN(amount) && amount !== 0) {
            return `${this.currencySymbol} ${amount.toFixed(2)}`;
          }
          return `${this.currencySymbol} 0.00`;
        },
        valueGetter: (params: any) => {
          return params.data && params.data.tds_rate_amount ? params.data.tds_rate_amount : 0;
        }
      },
      {
        headerName: 'Cheque Reference Number',
        field: 'cheque_ref_no',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: 'Cheque Reference Date',
        field: 'cheque_ref_date',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
        valueFormatter: (params: any) => {
          if (!params.value) return '';
          const date = new Date(params.value);
          return date.toLocaleDateString('en-IN');
        }
      }
    ];
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  navigateToBank() {
    this.route.navigate(['/master/finance/transactions/add-bank-payment']);
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement).value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  getBankPaymentReport() {
    let entity_id = localStorage.getItem("selectedEntityId");
    this._finaceservice.getBankPaymentReport(entity_id).subscribe((response: any) => {
      if (response && response.data) {
        this.rowData = response.data.map((item: any) => ({
          ...item,
          debit_amount: this.convertAmount(item.debit_amount || 0),
          credit_amount: this.convertAmount(item.credit_amount || 0),
          tds_rate_amount: this.convertAmount(item.tds_rate_amount || 0)
        }));
        this.calculateTotals();
      }
    }, (err: any) => {
      this.toast.error(err.error?.message || 'Error loading bank payment report');
    });
  }

  calculateTotals() {
    this.totalDebit = this.rowData.reduce((sum, row) => sum + parseFloat(row.debit_amount || 0), 0);
    this.totalCredit = this.rowData.reduce((sum, row) => sum + parseFloat(row.credit_amount || 0), 0);
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }
}