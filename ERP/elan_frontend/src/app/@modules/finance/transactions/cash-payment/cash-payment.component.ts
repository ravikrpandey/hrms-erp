import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { CashPaymentActionComponent } from './cash-payment-action/cash-payment-action.component';
import * as moment from 'moment';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { CommonService } from 'src/app/@shared/services/common.service';

@Component({
  selector: 'app-cash-payment',
  templateUrl: './cash-payment.component.html',
  styleUrls: ['./cash-payment.component.scss']
})
export class CashPaymentComponent {
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
  company_id:any;
  totalDebit: number = 0;
  totalCredit: number = 0;
  totalAmount: number = 0;

  // Currency properties
  currencyCode: string = 'INR';
  currencySymbol: string = '₹';
  currencyRate: number = 1;
  private gridDataBase: any[] = [];

  constructor(
    public dialog: MatDialog,
    private _finaceservice: FinaceService,
    private _rbackService: RbacMasterService,
    private toast: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private _configurationalMasterService: ConfigurationalmasterService,
    public $common: CommonService
  ) {
    this.rowClass = 'rowClass';

    // Initialize columnDefs in constructor with current currency
    this.initializeColumnDefs();
  }

  ngOnInit(): void {
    this.company_id = localStorage.getItem('company_id');

    // Subscribe to currency changes
    this._configurationalMasterService.currency$
      .subscribe((currency: any) => {
        if (currency) {
          const oldRate = this.currencyRate;
          this.currencyCode = currency.Currency_Type || currency.symbols || 'INR';
          this.currencyRate = Number(currency.rate);
          this.currencySymbol = currency.symbols || '₹';

          this.updateGridWithCurrencyRate();

          this.updateGridColumns();
        }
      });

    this.getTrialBalanceReport();
  }

  initializeColumnDefs() {
    this.columnDefs = [
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
        field: 'createdAt',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
        cellRenderer: (params:any) => {
          return moment(params.value).format('YYYY-MM-DD,HH:MM a ')
        },
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
        headerName: 'Transaction Date',
        field: 'transaction_date',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
        cellRenderer: (params:any) => {
          return moment(params.value).format('YYYY-MM-DD')
        },
      },
      {
        headerName: 'Total Amount (' + this.currencyCode + ')',
        field: 'credit_amount',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
        cellRenderer: (params:any) => {
          const amount = params.value;
          if (amount != null && !isNaN(amount)) {
            return this.$common.formatCurrency(amount, this.currencyCode);
          }
          return this.$common.formatCurrency(0, this.currencyCode);
        },
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
        cellRenderer: CashPaymentActionComponent
      }
    ];
  }

  // Method to update grid data when currency changes
  updateGridWithCurrencyRate() {
    if (!this.gridDataBase || this.gridDataBase.length === 0) {
      return;
    }

    const updatedGridData = this.gridDataBase.map((item: any) => {
      const convertedItem = { ...item };

      const fieldsToConvert = ['credit_amount', 'total_debit_amount', 'total_credit_amount'];

      fieldsToConvert.forEach(field => {
        if (convertedItem[field] !== undefined && convertedItem[field] !== null) {
          convertedItem[field] = parseFloat((Number(convertedItem[field]) * this.currencyRate).toFixed(2));
        }
      });

      return convertedItem;
    });

    this.rowData = updatedGridData;

    if (this.gridApi) {
      this.gridApi.setRowData(this.rowData);
    }

    this.calculateTotals();
  }

  setGridData(data: any[]) {
    this.gridDataBase = data.map(item => {
      const baseItem = { ...item };
      const fieldsToConvert = ['credit_amount', 'total_debit_amount', 'total_credit_amount'];

      fieldsToConvert.forEach(field => {
        if (baseItem[field] !== undefined && baseItem[field] !== null) {
          baseItem[field] = parseFloat((Number(baseItem[field]) / this.currencyRate).toFixed(2));
        }
      });

      return baseItem;
    });

    this.updateGridWithCurrencyRate();
  }

  public columnDefs: any[] = [];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.updateGridColumns();
  }

  updateGridColumns() {
    this.columnDefs = this.columnDefs.map(col => {
      if (col.headerName && col.headerName.includes('Total Amount')) {
        return {
          ...col,
          headerName: 'Total Amount (' + this.currencyCode + ')'
        };
      }
      return col;
    });

    if (this.gridApi) {
      this.gridApi.refreshHeader();
      this.gridApi.sizeColumnsToFit();
    }
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  getTrialBalanceReport() {
    let entity_id = localStorage.getItem("selectedEntityId");
    this._finaceservice.getCashPaymentList(entity_id).subscribe((response: any) => {
      if (response) {
        this.setGridData(response.data);
        this.calculateTotals();
      }
    }, (err: any) => {
      // Handle error
    });
  }

  calculateTotals() {
    this.totalDebit = this.rowData.reduce((sum, row) => sum + parseFloat(row.total_debit_amount || 0), 0);
    this.totalCredit = this.rowData.reduce((sum, row) => sum + parseFloat(row.total_credit_amount || 0), 0);
    this.totalAmount = this.rowData.reduce((sum, row) => sum + parseFloat(row.credit_amount || 0), 0);
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  navigateToForm(){
    this.route.navigate(['master/finance/transactions/add-cash-payment'])
  }
}
