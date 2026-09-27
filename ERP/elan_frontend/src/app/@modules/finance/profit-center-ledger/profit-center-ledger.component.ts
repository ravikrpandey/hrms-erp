import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs';
import { CommonService } from 'src/app/@shared/services/common.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profit-center-ledger',
  templateUrl: './profit-center-ledger.component.html',
  styleUrls: ['./profit-center-ledger.component.scss']
})
export class ProfitCenterLedgerComponent {
  private gridApi!: GridApi<any>;
  rowClass: any;
  public gridOptions: any = {
    rowSelection: 'multiple',
    enableRangeSelection: true,
    enableClipboard: true,
    onCellClicked: this.onCellClicked.bind(this),
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
  profitCentreList: any[] = [];
  profitCentre1: any[] = [];
  profitCentre2: any[] = [];
  selectedProfitCenter: any = null;
  summaryData: any = {};

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
    private router: Router
  ) {
    this.rowClass = 'rowClass';
    this.JournalForm = this.fb.group({
      report_type: new FormControl('profit-center-ledger'),
      from_date: new FormControl(null),
      to_date: new FormControl(null),
      profit_center_id: new FormControl(null),
    });
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem("selectedEntityId");
    this.getAllProfitCenter();
    this.getProfitCenterLedger();

    // Store component instance globally
    (window as any).profitCenterComponent = this;
  }

  ngOnDestroy(): void {
    // Clean up global reference
    delete (window as any).profitCenterComponent;
  }

  onCellClicked(params: any) {
    
    if (params.colDef?.field === 'total_transactions') {
      const profitCenterId = params.data?.profit_row_id;
      if (profitCenterId) {
        this.viewTransactionDetails(profitCenterId);
      }
    }
  }

  getAllProfitCenter() {
    this._finaceservice.getAllProfitCenter(this.entity_id).subscribe((res: any) => {
      if (res && res.data) {
        this.profitCentreList = res.data;
        this.profitCentre1 = this.profitCentreList.map((item: any) => item?.profit_center_name);
        this.profitCentre2 = this.profitCentreList;
      }
    });
  }

  profitCenterFilter(e: any) {
    const searchText = e;
    let filteredVariable = this.profitCentre2.filter((item: any) =>
      item.profit_center_name.toLowerCase().includes(searchText.toLowerCase())
    );
    this.profitCentreList = filteredVariable;
  }

  onProfitCenterSelect(event: any) {
    const selectedId = event.value;
    if (selectedId) {
      this.selectedProfitCenter = this.profitCentreList.find((item: any) => item.id === selectedId);
    } else {
      this.selectedProfitCenter = null;
    }
    this.getProfitCenterLedger();
  }

  getProfitCenterLedger() {
    this.rowData = [];
    this.rowData1 = [];

    this._finaceservice.getProfitCenterLedger(this.JournalForm.value, this.entity_id).subscribe(
      (response: any) => {
        if (response?.data) {
          let data = response.data;

          let dataArray = [];
          if (Array.isArray(data)) {
            dataArray = data;
          } else {
            dataArray = [data];
          }

          this.rowData = dataArray;

          const processedData = dataArray.map((entry: any) => {
            if (entry.date) {
              entry.date_formatted = moment(entry.date).format('DD/MM/YYYY');
            }

            const debit = parseFloat(entry.debit_amount) || 0;
            const credit = parseFloat(entry.credit_amount) || 0;
            if (debit > 0) {
              entry.amount_display = `${debit.toFixed(2)} Dr`;
            } else if (credit > 0) {
              entry.amount_display = `${credit.toFixed(2)} Cr`;
            } else {
              entry.amount_display = '0.00';
            }

            entry.total_debit = parseFloat(entry.total_debit) || 0;
            entry.total_credit = parseFloat(entry.total_credit) || 0;
            entry.net_balance = parseFloat(entry.net_balance) || 0;
            entry.total_gst = parseFloat(entry.total_gst) || 0;
            entry.total_tds = parseFloat(entry.total_tds) || 0;
            entry.total_transactions = parseInt(entry.total_transactions) || 0;
            entry.total_documents = parseInt(entry.total_documents) || 0;
            entry.unique_entry_statuses = parseInt(entry.unique_entry_statuses) || 0;
            entry.unique_chart_accounts = parseInt(entry.unique_chart_accounts) || 0;
            entry.vendor_debit = parseFloat(entry.vendor_debit) || 0;
            entry.vendor_credit = parseFloat(entry.vendor_credit) || 0;
            entry.customer_debit = parseFloat(entry.customer_debit) || 0;
            entry.customer_credit = parseFloat(entry.customer_credit) || 0;
            entry.employee_debit = parseFloat(entry.employee_debit) || 0;
            entry.employee_credit = parseFloat(entry.employee_credit) || 0;
            entry.sales_amount = parseFloat(entry.sales_amount) || 0;
            entry.purchase_amount = parseFloat(entry.purchase_amount) || 0;
            entry.cancellation_amount = parseFloat(entry.cancellation_amount) || 0;
            entry.payment_amount = parseFloat(entry.payment_amount) || 0;
            entry.receipt_amount = parseFloat(entry.receipt_amount) || 0;
            entry.credit_to_debit_ratio = parseFloat(entry.credit_to_debit_ratio) || 0;
            entry.transaction_days_span = parseInt(entry.transaction_days_span) || 0;
            entry.active_transactions = parseInt(entry.active_transactions) || 0;
            entry.pending_transactions = parseInt(entry.pending_transactions) || 0;
            entry.approved_transactions = parseInt(entry.approved_transactions) || 0;
            entry.rejected_transactions = parseInt(entry.rejected_transactions) || 0;

            if (entry.first_transaction_date) {
              entry.first_transaction_date_formatted = moment(entry.first_transaction_date).format('DD/MM/YYYY');
            }
            if (entry.last_transaction_date) {
              entry.last_transaction_date_formatted = moment(entry.last_transaction_date).format('DD/MM/YYYY');
            }
            if (entry.last_transaction_datetime) {
              entry.last_transaction_datetime_formatted = moment(entry.last_transaction_datetime).format('DD/MM/YYYY HH:mm:ss');
            }
            if (entry.profit_center_created_at) {
              entry.profit_center_created_at_formatted = moment(entry.profit_center_created_at).format('DD/MM/YYYY HH:mm:ss');
            }
            if (entry.profit_center_updated_at) {
              entry.profit_center_updated_at_formatted = moment(entry.profit_center_updated_at).format('DD/MM/YYYY HH:mm:ss');
            }

            return entry;
          });

          this.rowData = processedData;
          this.rowData1 = processedData;

          // Apply date filters if selected
          const fromDate = this.JournalForm.get('from_date')?.value;
          const toDate = this.JournalForm.get('to_date')?.value;

          if (fromDate && toDate) {
            const from = moment(fromDate).startOf('day');
            const to = moment(toDate).endOf('day');
            this.rowData1 = this.rowData.filter((row: any) => {
              const rowDate = moment(row.date);
              return rowDate.isBetween(from, to, undefined, '[]');
            });
          } else if (fromDate) {
            const from = moment(fromDate).startOf('day');
            this.rowData1 = this.rowData.filter((row: any) => {
              return moment(row.date).isSameOrAfter(from);
            });
          } else if (toDate) {
            const to = moment(toDate).endOf('day');
            this.rowData1 = this.rowData.filter((row: any) => {
              return moment(row.date).isSameOrBefore(to);
            });
          }

          if (this.rowData1.length > 0) {
            this.summaryData = this.rowData1[0];
            this.selectedProfitCenter = this.rowData1[0];
          }

          this.calculateTotals();

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
        console.error("Error while fetching profit center ledger:", err);
        this.toast.error('Failed to fetch data');
      }
    );
  }

  calculateTotals() {
    this.totalDebit = 0;
    this.totalCredit = 0;
    this.totalBalance = 0;
    this.totalGST = 0;
    this.totalTDS = 0;
    this.totalTransactions = 0;

    this.rowData1.forEach((item: any) => {
      this.totalDebit += parseFloat(item.total_debit) || 0;
      this.totalCredit += parseFloat(item.total_credit) || 0;
      this.totalGST += parseFloat(item.total_gst) || 0;
      this.totalTDS += parseFloat(item.total_tds) || 0;
      this.totalTransactions += parseInt(item.total_transactions) || 0;
    });

    this.totalBalance = this.totalDebit - this.totalCredit;
  }

  onAccountChange() {
    this.getProfitCenterLedger();
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement).value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  public columnDefs = [
    {
      headerName: 'S No.',
      minWidth: 60,
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.3,
    },
    {
      headerName: 'Transactions',
      minWidth: 130,
      field: 'total_transactions',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.6,
      cellRenderer: (params: any) => {
        const value = params.value || 0;
        return `
          <span style="
            color: #063178;
            font-weight: bold;
            font-size: 14px;
            cursor: pointer;
            text-decoration: underline;
            text-underline-offset: 2px;
            display: inline-block;
          ">
            ${value}
          </span>
        `;
      }
    },
    {
      headerName: 'Profit Center Code',
      minWidth: 150,
      field: 'profit_center_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.8,
    },
    {
      headerName: 'Profit Center Name',
      minWidth: 180,
      field: 'profit_center_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1.2,
    },
    {
      headerName: 'Manager',
      minWidth: 120,
      field: 'manager_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.6,
    },
    {
      headerName: 'Department',
      minWidth: 130,
      field: 'department_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.7,
    },
    {
      headerName: 'Entity',
      minWidth: 120,
      field: 'entity_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.6,
    },
    {
      headerName: 'From Date',
      minWidth: 110,
      field: 'from_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.6,
      valueFormatter: (params: any) => {
        if (params.value) {
          return moment(params.value).format('DD/MM/YYYY');
        }
        return '-';
      }
    },
    {
      headerName: 'To Date',
      minWidth: 110,
      field: 'to_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.6,
      valueFormatter: (params: any) => {
        if (params.value) {
          return moment(params.value).format('DD/MM/YYYY');
        }
        return '-';
      }
    },
    {
      headerName: 'Total Debit',
      minWidth: 130,
      field: 'total_debit',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.8,
      cellRenderer: (params: any) => {
        const amount = parseFloat(params.value) || 0;
        if (amount > 0) {
          return `<span style="color:#dc3545;">${amount.toFixed(2)}</span>`;
        }
        return '0.00';
      }
    },
    {
      headerName: 'Total Credit',
      minWidth: 130,
      field: 'total_credit',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.8,
      cellRenderer: (params: any) => {
        const amount = parseFloat(params.value) || 0;
        if (amount > 0) {
          return `<span style="color:#28a745;">${amount.toFixed(2)}</span>`;
        }
        return '0.00';
      }
    },
    {
      headerName: 'Net Balance',
      minWidth: 130,
      field: 'net_balance',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.8,
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
      headerName: 'Total GST',
      minWidth: 120,
      field: 'total_gst',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.6,
      cellRenderer: (params: any) => {
        const amount = parseFloat(params.value) || 0;
        if (amount > 0) {
          return `${amount.toFixed(2)}`;
        }
        return '0.00';
      }
    },
    {
      headerName: 'Total TDS',
      minWidth: 120,
      field: 'total_tds',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.6,
      cellRenderer: (params: any) => {
        const amount = parseFloat(params.value) || 0;
        if (amount > 0) {
          return `${amount.toFixed(2)}`;
        }
        return '0.00';
      }
    },

    {
      headerName: 'Vendor Debit',
      minWidth: 130,
      field: 'vendor_debit',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.6,
      cellRenderer: (params: any) => {
        const amount = parseFloat(params.value) || 0;
        if (amount > 0) {
          return `<span style="color:#dc3545;">${amount.toFixed(2)}</span>`;
        }
        return '0.00';
      }
    },
    {
      headerName: 'Vendor Credit',
      minWidth: 130,
      field: 'vendor_credit',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.6,
      cellRenderer: (params: any) => {
        const amount = parseFloat(params.value) || 0;
        if (amount > 0) {
          return `<span style="color:#28a745;">${amount.toFixed(2)}</span>`;
        }
        return '0.00';
      }
    },
    {
      headerName: 'Customer Debit',
      minWidth: 130,
      field: 'customer_debit',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.6,
      cellRenderer: (params: any) => {
        const amount = parseFloat(params.value) || 0;
        if (amount > 0) {
          return `<span style="color:#dc3545;">${amount.toFixed(2)}</span>`;
        }
        return '0.00';
      }
    },
    {
      headerName: 'Customer Credit',
      minWidth: 130,
      field: 'customer_credit',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.6,
      cellRenderer: (params: any) => {
        const amount = parseFloat(params.value) || 0;
        if (amount > 0) {
          return `<span style="color:#28a745;">${amount.toFixed(2)}</span>`;
        }
        return '0.00';
      }
    },
    {
      headerName: 'Employee Debit',
      minWidth: 130,
      field: 'employee_debit',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.6,
      cellRenderer: (params: any) => {
        const amount = parseFloat(params.value) || 0;
        if (amount > 0) {
          return `<span style="color:#dc3545;">${amount.toFixed(2)}</span>`;
        }
        return '0.00';
      }
    },
    {
      headerName: 'Employee Credit',
      minWidth: 130,
      field: 'employee_credit',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.6,
      cellRenderer: (params: any) => {
        const amount = parseFloat(params.value) || 0;
        if (amount > 0) {
          return `<span style="color:#28a745;">${amount.toFixed(2)}</span>`;
        }
        return '0.00';
      }
    },
    {
      headerName: 'Sales Amount',
      minWidth: 130,
      field: 'sales_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.6,
      cellRenderer: (params: any) => {
        const amount = parseFloat(params.value) || 0;
        if (amount > 0) {
          return `<span style="color:#28a745;">${amount.toFixed(2)}</span>`;
        }
        return '0.00';
      }
    },
    {
      headerName: 'Purchase Amount',
      minWidth: 130,
      field: 'purchase_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.6,
      cellRenderer: (params: any) => {
        const amount = parseFloat(params.value) || 0;
        if (amount > 0) {
          return `<span style="color:#dc3545;">${amount.toFixed(2)}</span>`;
        }
        return '0.00';
      }
    },
    {
      headerName: 'Cancellation',
      minWidth: 120,
      field: 'cancellation_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.6,
      cellRenderer: (params: any) => {
        const amount = parseFloat(params.value) || 0;
        if (amount > 0) {
          return `<span style="color:#dc3545;">${amount.toFixed(2)}</span>`;
        }
        return '0.00';
      }
    },
    {
      headerName: 'Payment',
      minWidth: 120,
      field: 'payment_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.6,
      cellRenderer: (params: any) => {
        const amount = parseFloat(params.value) || 0;
        if (amount > 0) {
          return `<span style="color:#dc3545;">${amount.toFixed(2)}</span>`;
        }
        return '0.00';
      }
    },
    {
      headerName: 'Receipt',
      minWidth: 120,
      field: 'receipt_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.6,
      cellRenderer: (params: any) => {
        const amount = parseFloat(params.value) || 0;
        if (amount > 0) {
          return `<span style="color:#28a745;">${amount.toFixed(2)}</span>`;
        }
        return '0.00';
      }
    },
    {
      headerName: 'Last Doc No.',
      minWidth: 150,
      field: 'last_document_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.7,
    },
    {
      headerName: 'Last Entry Status',
      minWidth: 150,
      field: 'last_entry_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.7,
    },
    {
      headerName: 'Last Activity',
      minWidth: 160,
      field: 'last_transaction_datetime_formatted',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.8,
    },
    {
      headerName: 'Credit/Debit Ratio',
      minWidth: 130,
      field: 'credit_to_debit_ratio',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.6,
      cellRenderer: (params: any) => {
        const amount = parseFloat(params.value) || 0;
        return `${amount.toFixed(2)}%`;
      }
    },
    {
      headerName: 'Performance',
      minWidth: 120,
      field: 'financial_performance',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.6,
      cellRenderer: (params: any) => {
        const value = params.value || 'BREAK EVEN';
        if (value === 'PROFIT') {
          return `<span style="color:#28a745;font-weight:bold;">${value}</span>`;
        } else if (value === 'LOSS') {
          return `<span style="color:#dc3545;font-weight:bold;">${value}</span>`;
        }
        return `<span style="color:#ffc107;font-weight:bold;">${value}</span>`;
      }
    },
    {
      headerName: 'Created At',
      minWidth: 160,
      field: 'profit_center_created_at_formatted',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.7,
    },
    {
      headerName: 'Updated At',
      minWidth: 160,
      field: 'profit_center_updated_at_formatted',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.7,
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
    this.getProfitCenterLedger();
  }

  ToDate(e: any) {
    this.toDate = moment(e.value).format('YYYY/MM/DD');
    this.getProfitCenterLedger();
  }

  clearDate(control: any) {
    this.JournalForm.get(control)?.reset();
    this.getProfitCenterLedger();
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
      'Transactions': parseInt(x.total_transactions) || 0,
      'Profit Center Code': x.profit_center_id || '-',
      'Profit Center Name': x.profit_center_name || '-',
      'Manager': x.manager_name || '-',
      'Department': x.department_name || '-',
      'Entity': x.entity_name || '-',
      'From Date': x.from_date ? moment(x.from_date).format('DD/MM/YYYY') : '-',
      'To Date': x.to_date ? moment(x.to_date).format('DD/MM/YYYY') : '-',
      'Total Debit': parseFloat(x.total_debit) || 0,
      'Total Credit': parseFloat(x.total_credit) || 0,
      'Net Balance': parseFloat(x.net_balance) || 0,
      'Total GST': parseFloat(x.total_gst) || 0,
      'Total TDS': parseFloat(x.total_tds) || 0,
      'Documents': parseInt(x.total_documents) || 0,
      'Vendor Debit': parseFloat(x.vendor_debit) || 0,
      'Vendor Credit': parseFloat(x.vendor_credit) || 0,
      'Customer Debit': parseFloat(x.customer_debit) || 0,
      'Customer Credit': parseFloat(x.customer_credit) || 0,
      'Sales Amount': parseFloat(x.sales_amount) || 0,
      'Purchase Amount': parseFloat(x.purchase_amount) || 0,
      'Cancellation': parseFloat(x.cancellation_amount) || 0,
      'Payment': parseFloat(x.payment_amount) || 0,
      'Receipt': parseFloat(x.receipt_amount) || 0,
      'Performance': x.financial_performance || 'BREAK EVEN',
      'Credit/Debit Ratio': `${parseFloat(x.credit_to_debit_ratio) || 0}%`,
      'Last Doc No.': x.last_document_number || '-',
      'Last Entry Status': x.last_entry_status || '-'
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

    const titleRow = ['', '', 'Profit Center Ledger', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
    const titleRow1 = ['', '', `${fromDate} To ${toDate}`, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];

    const headerRow = [
      'Sr No', 'Transactions', 'Profit Center Code', 'Profit Center Name',
      'Manager', 'Department', 'Entity', 'From Date', 'To Date', 'Total Debit', 'Total Credit',
      'Net Balance', 'Total GST', 'Total TDS', 'Documents',
      'Vendor Debit', 'Vendor Credit', 'Customer Debit', 'Customer Credit',
      'Sales Amount', 'Purchase Amount', 'Cancellation', 'Payment', 'Receipt',
      'Performance', 'Credit/Debit Ratio', 'Last Doc No.', 'Last Entry Status'
    ];

    const finalData = [titleRow, titleRow1, headerRow, ...data.map((item: any) => Object.values(item))];

    this.commonService.exportAsExcelFile(finalData, 'Profit-Center-Ledger');
  }

  viewTransactionDetails(profitCenterId: string) {
    if (profitCenterId) {
      this.router.navigate(['/master/finance/reports/profit-center-ledger-detailed'], {
        queryParams: {
          profit_center_id: profitCenterId,
          from_date: this.JournalForm.get('from_date')?.value || '',
          to_date: this.JournalForm.get('to_date')?.value || ''
        }
      });
    }
  }
}
