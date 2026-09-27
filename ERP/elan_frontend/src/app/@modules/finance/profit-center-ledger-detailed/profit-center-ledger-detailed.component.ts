import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';

@Component({
  selector: 'app-profit-center-ledger-detailed',
  templateUrl: './profit-center-ledger-detailed.component.html',
  styleUrls: ['./profit-center-ledger-detailed.component.scss']
})
export class ProfitCenterLedgerDetailedComponent {
  private gridApi!: GridApi<any>;
  rowClass: any;
  public gridOptions: any = {
    rowSelection: 'multiple',
    enableRangeSelection: true,
    enableClipboard: true,
  };
  JournalForm: FormGroup;
  rowData: any = [];
  rowData1: any = [];
  totalDebit: number = 0;
  totalCredit: number = 0;
  totalBalance: number = 0;
  totalGST: number = 0;
  totalTDS: number = 0;
  totalTransactions: number = 0;
  filterControl = new FormControl();
  entity_id: any;
  profitCenterId: any;
  profitCenterName: string = '';
  profitCenterCode: string = '';
  profitCenterType: string = '';
  profitCenterStatus: string = '';
  fromDateFilter: string = '';
  toDateFilter: string = '';
  summaryData: any = {};
  selectedRowData: any = null;

  now = new Date();
  year = this.now.getFullYear();
  month = this.now.getMonth();
  date = this.now.getDate();
  FromDate: string = '';
  toDate: string = '';
  maxDate = moment({ year: this.year + 100, month: this.month, date: this.date }).format('YYYY-MM-DD');
  minDate = moment({ year: this.year - 0, month: this.month, date: this.date }).format('YYYY-MM-DD');

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private toast: ToastrService,
    private _finaceservice: FinaceService,
    private commonService: CommonService,
    private router: Router,
    private _active: ActivatedRoute
  ) {
    this.rowClass = 'rowClass';
    this.JournalForm = this.fb.group({
      report_type: new FormControl('profit-center-ledger-detailed'),
      from_date: new FormControl(null),
      to_date: new FormControl(null),
    });
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem("selectedEntityId");

    this._active.queryParams.subscribe((params: any) => {
      this.profitCenterId = params.profit_center_id;
      this.profitCenterName = params.profit_center_name || '';
      this.profitCenterCode = params.profit_center_code || '';
      this.fromDateFilter = params.from_date || '';
      this.toDateFilter = params.to_date || '';

      if (this.fromDateFilter) {
        this.JournalForm.patchValue({ from_date: this.fromDateFilter });
        this.FromDate = moment(this.fromDateFilter).format('YYYY-MM-DD');
      }
      if (this.toDateFilter) {
        this.JournalForm.patchValue({ to_date: this.toDateFilter });
      }

      this.getProfitCenterDetailedLedger();
    });
  }

  getProfitCenterDetailedLedger() {
    this.rowData = [];
    this.rowData1 = [];

    const params = {
      from_date: this.JournalForm.get('from_date')?.value || '',
      to_date: this.JournalForm.get('to_date')?.value || ''
    };

    this._finaceservice.getProfitCenterDetailedLedger(this.entity_id, this.profitCenterId, params).subscribe(
      (response: any) => {
        if (response?.data) {
          const data = response.data;

          // Check if data is array or single object
          let transactions = [];
          if (Array.isArray(data)) {
            transactions = data;
            // Set profit center info from first row
            if (transactions.length > 0) {
              this.profitCenterName = transactions[0].profit_center_name || this.profitCenterName;
              this.profitCenterCode = transactions[0].profit_center_code || this.profitCenterCode;
              this.profitCenterType = transactions[0].profit_center_type || '';
              this.profitCenterStatus = transactions[0].profit_center_status || '';
            }
          } else {
            // Single object response
            transactions = [data];
            this.profitCenterName = data.profit_center_name || this.profitCenterName;
            this.profitCenterCode = data.profit_center_code || this.profitCenterCode;
            this.profitCenterType = data.profit_center_type || '';
            this.profitCenterStatus = data.profit_center_status || '';
          }

          this.rowData = transactions;

          // Calculate totals
          let totalDebit = 0;
          let totalCredit = 0;
          let totalGST = 0;
          let totalTDS = 0;

          const processedData = transactions.map((entry: any, index: number) => {
            entry.s_no = index + 1;

            if (entry.transaction_date) {
              entry.transaction_date_formatted = moment(entry.transaction_date).format('DD/MM/YYYY');
            }

            const debit = parseFloat(entry.debit_amount) || 0;
            const credit = parseFloat(entry.credit_amount) || 0;

            totalDebit += debit;
            totalCredit += credit;
            totalGST += parseFloat(entry.total_gst) || 0;
            totalTDS += parseFloat(entry.tds_amount) || 0;

            if (debit > 0) {
              entry.amount_display = `${debit.toFixed(2)} Dr`;
            } else if (credit > 0) {
              entry.amount_display = `${credit.toFixed(2)} Cr`;
            } else {
              entry.amount_display = '0.00';
            }

            entry.net_amount = parseFloat(entry.net_amount) || 0;
            entry.total_gst = parseFloat(entry.total_gst) || 0;
            entry.tds_amount = parseFloat(entry.tds_amount) || 0;

            return entry;
          });

          this.rowData = processedData;
          this.rowData1 = processedData;

          // Set summary
          this.totalDebit = totalDebit;
          this.totalCredit = totalCredit;
          this.totalBalance = totalDebit - totalCredit;
          this.totalGST = totalGST;
          this.totalTDS = totalTDS;
          this.totalTransactions = transactions.length;

          this.summaryData = {
            total_debit: totalDebit,
            total_credit: totalCredit,
            net_balance: totalDebit - totalCredit,
            total_gst: totalGST,
            total_tds: totalTDS,
            total_transactions: transactions.length
          };

          if (this.gridApi) {
            this.gridApi.setRowData(this.rowData1);
          }
        } else {
          this.rowData = [];
          this.rowData1 = [];
          this.totalDebit = 0;
          this.totalCredit = 0;
          this.totalBalance = 0;
          this.totalGST = 0;
          this.totalTDS = 0;
          this.totalTransactions = 0;
          this.summaryData = {};
          this.toast.info('No data found for the selected criteria');
        }
      },
      (err: any) => {
        console.error("Error while fetching profit center detailed ledger:", err);
        this.toast.error('Failed to fetch data');
      }
    );
  }

  onAccountChange() {
    this.getProfitCenterDetailedLedger();
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement).value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  public columnDefs = [
    {
      headerName: 'S No.',
      minWidth: 60,
      field: 's_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.3,
    },
    {
      headerName: 'Date',
      minWidth: 110,
      field: 'transaction_date_formatted',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.6,
    },
    {
      headerName: 'Document No.',
      minWidth: 150,
      field: 'document_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.8,
    },
    {
      headerName: 'Entry Status',
      minWidth: 140,
      field: 'entry_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.7,
    },
    {
      headerName: 'Debit Amount',
      minWidth: 130,
      field: 'debit_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.7,
      cellRenderer: (params: any) => {
        const amount = parseFloat(params.value) || 0;
        if (amount > 0) {
          return `<span style="color:#dc3545;">${amount.toFixed(2)}</span>`;
        }
        return '0.00';
      }
    },
    {
      headerName: 'Credit Amount',
      minWidth: 130,
      field: 'credit_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.7,
      cellRenderer: (params: any) => {
        const amount = parseFloat(params.value) || 0;
        if (amount > 0) {
          return `<span style="color:#28a745;">${amount.toFixed(2)}</span>`;
        }
        return '0.00';
      }
    },
    {
      headerName: 'Net Amount',
      minWidth: 130,
      field: 'net_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.7,
      cellRenderer: (params: any) => {
        const amount = parseFloat(params.value) || 0;
        if (amount > 0) {
          return `<span style="color:#28a745;font-weight:bold;">${amount.toFixed(2)}</span>`;
        } else if (amount < 0) {
          return `<span style="color:#dc3545;font-weight:bold;">${amount.toFixed(2)}</span>`;
        }
        return `${amount.toFixed(2)}`;
      }
    },
    {
      headerName: 'Account',
      minWidth: 180,
      field: 'chart_account_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1.0,
    },
    {
      headerName: 'Account Code',
      minWidth: 120,
      field: 'account_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.5,
    },
    {
      headerName: 'Party Name',
      minWidth: 150,
      field: 'party_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.8,
    },
    {
      headerName: 'Party Type',
      minWidth: 120,
      field: 'party_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.5,
    },
    {
      headerName: 'Branch',
      minWidth: 130,
      field: 'branch_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.6,
    },
    {
      headerName: 'Journal No.',
      minWidth: 130,
      field: 'journal_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.6,
    },
    {
      headerName: 'GST',
      minWidth: 120,
      field: 'total_gst',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.5,
      cellRenderer: (params: any) => {
        const amount = parseFloat(params.value) || 0;
        if (amount > 0) {
          return `${amount.toFixed(2)}`;
        }
        return '0.00';
      }
    },
    {
      headerName: 'TDS',
      minWidth: 120,
      field: 'tds_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.5,
      cellRenderer: (params: any) => {
        const amount = parseFloat(params.value) || 0;
        if (amount > 0) {
          return `${amount.toFixed(2)}`;
        }
        return '0.00';
      }
    },
    {
      headerName: 'Status',
      minWidth: 120,
      field: 'transaction_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.5,
      cellRenderer: (params: any) => {
        const value = params.value || 'ACTIVE';
        if (value === 'ACTIVE') {
          return `<span style="color:#28a745;">${value}</span>`;
        } else if (value === 'PENDING') {
          return `<span style="color:#ffc107;">${value}</span>`;
        } else if (value === 'REJECTED') {
          return `<span style="color:#dc3545;">${value}</span>`;
        }
        return value;
      }
    }
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    if (this.rowData1 && this.rowData1.length > 0) {
      this.gridApi.setRowData(this.rowData1);
    }
  }

  onFilterTextBoxChanged() {
    if (this.gridApi) {
      this.gridApi.setQuickFilter(
        (document.getElementById('filter-text-box') as HTMLInputElement).value
      );
    }
  }

  goBack() {
    this.location.back();
  }

  fromDate(e: any) {
    this.FromDate = moment(e.value).format('YYYY-MM-DD');
    this.JournalForm.patchValue({ to_date: '' });
    this.getProfitCenterDetailedLedger();
  }

  ToDate(e: any) {
    this.toDate = moment(e.value).format('YYYY/MM/DD');
    this.getProfitCenterDetailedLedger();
  }

  clearDate(control: any) {
    this.JournalForm.get(control)?.reset();
    this.getProfitCenterDetailedLedger();
    if (control == 'from_date') {
      const from_date = this.JournalForm.get(control)?.value;
      this.FromDate = from_date ? moment(from_date).format('YYYY-MM-DD') : '';
    }
  }

  onBtnExportDataAsExcel() {
    if (!this.rowData1 || this.rowData1.length === 0) {
      this.toast.warning('No data to export');
      return;
    }

    let data = this.rowData1.map((x: any, i: number) => ({
      'Sr No': i + 1,
      'Date': x.transaction_date_formatted || '-',
      'Document No.': x.document_number || '-',
      'Entry Status': x.entry_status || '-',
      'Debit Amount': parseFloat(x.debit_amount) || 0,
      'Credit Amount': parseFloat(x.credit_amount) || 0,
      'Net Amount': parseFloat(x.net_amount) || 0,
      'Account': x.chart_account_name || '-',
      'Account Code': x.account_code || '-',
      'Party Name': x.party_name || '-',
      'Party Type': x.party_type || '-',
      'Branch': x.branch_name || '-',
      'Journal No.': x.journal_no || '-',
      'GST': parseFloat(x.total_gst) || 0,
      'TDS': parseFloat(x.tds_amount) || 0,
      'Status': x.transaction_status || 'ACTIVE'
    }));

    let fromDate = this.JournalForm.get('from_date')?.value;
    let toDate = this.JournalForm.get('to_date')?.value;

    if (!fromDate && !toDate) {
      fromDate = moment().startOf('month').format("DD/MM/YYYY");
      toDate = moment().endOf('month').format("DD/MM/YYYY");
    } else {
      fromDate = fromDate ? moment(fromDate).format("DD/MM/YYYY") : '';
      toDate = toDate ? moment(toDate).format("DD/MM/YYYY") : '';
    }

    const titleRow = ['', '', 'Profit Center Detailed Ledger', '', '', '', '', '', '', '', '', '', '', '', '', ''];
    const titleRow1 = ['', '', `${this.profitCenterName} (${this.profitCenterCode})`, '', '', '', '', '', '', '', '', '', '', '', '', ''];
    const titleRow2 = ['', '', `${fromDate} To ${toDate}`, '', '', '', '', '', '', '', '', '', '', '', '', ''];

    const headerRow = [
      'Sr No', 'Date', 'Document No.', 'Entry Status', 'Debit Amount', 'Credit Amount',
      'Net Amount', 'Account', 'Account Code', 'Party Name', 'Party Type',
      'Branch', 'Journal No.', 'GST', 'TDS', 'Status'
    ];

    const finalData = [titleRow, titleRow1, titleRow2, headerRow, ...data.map((item: any) => Object.values(item))];

    this.commonService.exportAsExcelFile(finalData, `Profit-Center-Detailed-Ledger-${this.profitCenterCode}`);
  }
}
