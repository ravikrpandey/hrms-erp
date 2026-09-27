import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { BankRecieptActionComponent } from './bank-reciept-action/bank-reciept-action.component';

@Component({
  selector: 'app-bank-reciept',
  templateUrl: './bank-reciept.component.html',
  styleUrls: ['./bank-reciept.component.scss']
})
export class BankRecieptComponent {
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
  currencyRate: any = 1;
  currencyData: any;

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
        if (currency) {
          this.currencyData = currency;
          this.currencyCode = currency.Currency_Type || 'INR';
          this.currencyRate = Number(currency.rate) || 1;
          this.currencySymbol = currency.symbols || '₹';
          this.updateColumnDefs();
          this.getBankReciept();
        }
      });
    
    this.getBankReciept();
  }

  navigateToForm(){
    this.route.navigate(['/master/finance/transactions/add-bank-reciept']);
  }

  public columnDefs: any[] = [
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
        return params.value ? new Date(params.value).toLocaleDateString('en-IN') : '';
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
        return params.value ? new Date(params.value).toLocaleDateString('en-IN') : '';
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
      headerName: `Amount (${this.currencyCode})`,
      field: 'debit_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        const amount = Number(params.value || 0) * this.currencyRate;
        if (!isNaN(amount)) {
          return `${this.currencySymbol} ${amount.toFixed(2)}`;
        }
        return `${this.currencySymbol} 0.00`;
      }
    },
    {
      headerName: `Total Debit (${this.currencyCode})`,
      field: 'total_debit_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        const amount = Number(params.value || 0) * this.currencyRate;
        if (!isNaN(amount)) {
          return `${this.currencySymbol} ${amount.toFixed(2)}`;
        }
        return `${this.currencySymbol} 0.00`;
      }
    },
    {
      headerName: `Total Credit (${this.currencyCode})`,
      field: 'total_credit_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        const amount = Number(params.value || 0) * this.currencyRate;
        if (!isNaN(amount)) {
          return `${this.currencySymbol} ${amount.toFixed(2)}`;
        }
        return `${this.currencySymbol} 0.00`;
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
      cellRenderer: BankRecieptActionComponent
    }
  ];

  updateColumnDefs(): void {
    const updatedDefs = this.columnDefs.map(col => {
      if (col.field === 'debit_amount' || col.field === 'total_debit_amount' || col.field === 'total_credit_amount') {
        return {
          ...col,
          headerName: col.field === 'debit_amount' 
            ? `Amount (${this.currencyCode})` 
            : col.field === 'total_debit_amount'
            ? `Total Debit (${this.currencyCode})`
            : `Total Credit (${this.currencyCode})`,
          cellRenderer: (params: any) => {
            const amount = Number(params.value || 0) * this.currencyRate;
            if (!isNaN(amount)) {
              return `${this.currencySymbol} ${amount.toFixed(2)}`;
            }
            return `${this.currencySymbol} 0.00`;
          }
        };
      }
      return col;
    });
    
    this.columnDefs = updatedDefs;
    if (this.gridApi) {
      this.gridApi.setColumnDefs(this.columnDefs);
      this.gridApi.refreshCells();
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.setColumnDefs(this.columnDefs);
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement).value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  getBankReciept() {
    let entity_id = localStorage.getItem("selectedEntityId");
    this._finaceservice.getBankReciept(entity_id).subscribe((response: any) => {
      if (response) {
        this.rowData = response.data;
        this.calculateTotals();
        if (this.gridApi) {
          this.gridApi.setRowData(this.rowData);
        }
      }
    }, (err: any) => {
      // Handle error
    });
  }

  calculateTotals() {
    this.totalDebit = this.rowData.reduce((sum, row) => sum + parseFloat(row.total_debit_amount || 0), 0);
    this.totalCredit = this.rowData.reduce((sum, row) => sum + parseFloat(row.total_credit_amount || 0), 0);
  }

  getTotalDebitDisplay(): string {
    const amount = this.totalDebit * this.currencyRate;
    return `${this.currencySymbol} ${amount.toFixed(2)}`;
  }

  getTotalCreditDisplay(): string {
    const amount = this.totalCredit * this.currencyRate;
    return `${this.currencySymbol} ${amount.toFixed(2)}`;
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }
}