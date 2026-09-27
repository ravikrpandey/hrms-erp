import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { BankRecieptActionComponent } from '../bank-reciept/bank-reciept-action/bank-reciept-action.component';
import { AddSalesJournalComponent } from './add-sales-journal/add-sales-journal.component';
import { SalesJournalActionComponent } from './sales-journal-action/sales-journal-action.component';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-sales-journal',
  templateUrl: './sales-journal.component.html',
  styleUrls: ['./sales-journal.component.scss']
})
export class SalesJournalComponent {
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

    // Subscribe to currency changes
    this._configurationalMasterService.currency$
      .subscribe((currency: any) => {
        if (!currency) return;

        this.currencyData = currency;
        this.currencyCode = currency.Currency_Type || currency.symbols || 'INR';
        this.currencyRate = Number(currency.rate) || 1;
        this.currencySymbol = currency.symbols || '₹';

        // Update displayed data with new currency
        this.applyCurrencyConversion();
      });

    this.getSalesJournalData();
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
      headerName: 'Transaction Date',
      field: 'transaction_date',
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
      headerName: 'Customer',
      field: 'customer_name',
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
      headerName: 'Bill Amount',
      field: 'bill_amount_display',
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
      cellRenderer: SalesJournalActionComponent
    }
  ];

  // Debit Column (if needed)
  public debitColumn = {
    headerName: 'Debit',
    field: 'debit_amount_display',
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

  // Credit Column (if needed)
  public creditColumn = {
    headerName: 'Credit',
    field: 'credit_amount_display',
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

  // Balance Column (if needed)
  public balanceColumn = {
    headerName: 'Balance',
    field: 'sales_value_display',
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
    this.route.navigate(['master/finance/transactions/add-sales-journal']);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement).value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  getSalesJournalData() {
    let entity_id = localStorage.getItem("selectedEntityId");
    this._finaceservice.getSalesJournalData(entity_id).subscribe((response: any) => {
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

    // Convert amounts based on currency rate
    this.rowData = this.baseRowData.map((row: any) => {
      const convertedRow = { ...row };

      // Convert bill amount
      if (row.bill_amount) {
        convertedRow.bill_amount_display = this.convertAmount(row.bill_amount);
        convertedRow.bill_amount_converted = this.convertAmount(row.bill_amount);
      }

      // Convert debit amount
      if (row.debit_amount) {
        convertedRow.debit_amount_display = this.convertAmount(row.debit_amount);
        convertedRow.debit_amount_converted = this.convertAmount(row.debit_amount);
      }

      // Convert credit amount
      if (row.credit_amount) {
        convertedRow.credit_amount_display = this.convertAmount(row.credit_amount);
        convertedRow.credit_amount_converted = this.convertAmount(row.credit_amount);
      }

      // Convert sales value (balance)
      if (row.sales_value) {
        convertedRow.sales_value_display = this.convertAmount(row.sales_value);
        convertedRow.sales_value_converted = this.convertAmount(row.sales_value);
      }

      // Convert taxable amount if exists
      if (row.taxable_value) {
        convertedRow.taxable_value_display = this.convertAmount(row.taxable_value);
      }

      // Convert gross total if exists
      if (row.gross_total) {
        convertedRow.gross_total_display = this.convertAmount(row.gross_total);
      }

      // Convert GST total if exists
      if (row.gst_total) {
        convertedRow.gst_total_display = this.convertAmount(row.gst_total);
      }

      // Convert grand total if exists
      if (row.grand_total) {
        convertedRow.grand_total_display = this.convertAmount(row.grand_total);
      }

      // Convert final amount if exists
      if (row.final_amount) {
        convertedRow.final_amount_display = this.convertAmount(row.final_amount);
      }

      // Convert total debit
      if (row.total_debit_amount) {
        convertedRow.total_debit_display = this.convertAmount(row.total_debit_amount);
      }

      // Convert total credit
      if (row.total_credit_amount) {
        convertedRow.total_credit_display = this.convertAmount(row.total_credit_amount);
      }

      return convertedRow;
    });

    this.calculateTotals();

    // Refresh grid if it exists
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

    // Calculate totals in converted currency
    this.totalDebit = this.rowData.reduce((sum, row) => {
      const val = row.total_debit_display || row.total_debit_amount || 0;
      return sum + parseFloat(val);
    }, 0);

    this.totalCredit = this.rowData.reduce((sum, row) => {
      const val = row.total_credit_display || row.total_credit_amount || 0;
      return sum + parseFloat(val);
    }, 0);

    // Round totals
    this.totalDebit = this.roundToTwoDecimals(this.totalDebit);
    this.totalCredit = this.roundToTwoDecimals(this.totalCredit);
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  // Method to get formatted currency display for totals
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

  // Method to refresh data with current currency
  refreshData() {
    this.getSalesJournalData();
  }
}
