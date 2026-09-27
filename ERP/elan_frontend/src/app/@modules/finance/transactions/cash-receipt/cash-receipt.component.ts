import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { CashRecieptActionComponent } from './cash-reciept-action/cash-reciept-action.component';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { CommonService } from 'src/app/@shared/services/common.service';

@Component({
  selector: 'app-cash-receipt',
  templateUrl: './cash-receipt.component.html',
  styleUrls: ['./cash-receipt.component.scss']
})
export class CashReceiptComponent {
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
  currencyCode: string = 'INR';
  currencySymbol: string = '₹';
  currencyRate: number = 1;

  public columnDefs: any[] = [];

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
    this.initializeColumnDefs();
  }

  ngOnInit(): void {
    this.company_id = localStorage.getItem('company_id');
    
    this._configurationalMasterService.currency$
      .subscribe((currency: any) => {
        if (currency) {
          this.currencyCode = currency.Currency_Type || 'INR';
          this.currencySymbol = currency.symbols || '₹';
          this.currencyRate = Number(currency.rate) || 1;
          this.updateColumnDefs();
          this.updateGridData();
        }
      });

    this.getCashRecieptList();
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
        headerName: 'Voucher Type',
        field: 'voucher_name',
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
        headerName: 'Total Amount (' + this.currencyCode + ')',
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
          if (!isNaN(amount)) {
            return this.$common.formatCurrency(amount, this.currencyCode);
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
        cellRenderer: CashRecieptActionComponent
      }
    ];
  }

  updateColumnDefs() {
    this.columnDefs = this.columnDefs.map(col => {
      if (col.headerName && typeof col.headerName === 'string') {
        const currencyPattern = /\(([A-Z]{3})\)/;
        if (currencyPattern.test(col.headerName)) {
          col.headerName = col.headerName.replace(currencyPattern, `(${this.currencyCode})`);
        }
        if (col.field === 'debit_amount') {
          col.cellRenderer = (params: any) => {
            const amount = Number(params.value);
            if (!isNaN(amount)) {
              const convertedAmount = amount * this.currencyRate;
              return this.$common.formatCurrency(convertedAmount, this.currencyCode);
            }
            return this.currencySymbol + ' 0.00';
          };
        }
      }
      return col;
    });

    if (this.gridApi) {
      this.gridApi.refreshHeader();
      this.gridApi.refreshCells({ force: true });
    }
  }

  updateGridData() {
    if (this.rowData && this.rowData.length > 0 && this.gridApi) {
      this.gridApi.refreshCells({ force: true });
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  getCashRecieptList() {
    let entity_id = localStorage.getItem("selectedEntityId");
    this._finaceservice.getCashRecieptList(entity_id).subscribe((response: any) => {
      if (response) {
        this.rowData = response.data;
        this.calculateTotals();
        this.updateGridData();
      }
    }, (err: any) => {
      // Handle error
    });
  }

  calculateTotals() {
    this.totalDebit = this.rowData.reduce((sum, row) => {
      const amount = parseFloat(row.debit_amount || 0);
      return sum + (amount * this.currencyRate);
    }, 0);
    
    this.totalCredit = this.rowData.reduce((sum, row) => {
      const amount = parseFloat(row.debit_amount || 0);
      return sum + (amount * this.currencyRate);
    }, 0);
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  navigateToForm() {
    this.route.navigate(['/master/finance/transactions/add-cash-reciept']);
  }
}