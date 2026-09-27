import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
 
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { BankPaymentActionComponent } from './bank-payment-action/bank-payment-action.component';

@Component({
  selector: 'app-bank-payment',
  templateUrl: './bank-payment.component.html',
  styleUrls: ['./bank-payment.component.scss']
})
export class BankPaymentComponent {
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


  constructor(
    public dialog: MatDialog,
    private _finaceservice: FinaceService,
    private _rbackService: RbacMasterService,
    private toast: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.company_id = localStorage.getItem('company_id')
    this.getBankPaymentRecord()
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
      field:'posting_date', 
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
    // {
    //   headerName: 'Voucher Type',
    //   field: 'voucher_name',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    //   minWidth: 150,
    // },
    // {
    //   headerName: 'Reference Number',
    //   field: 'reference_number',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    //   minWidth: 150,
    // },
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
 
    // {
    //   headerName: 'Debit',
    //   field: 'debit_amount',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    //   minWidth: 150,
    //   cellRenderer: (params: any) => {
    //     const amount = Number(params.value);
    //     if (!isNaN(amount)) {
    //       return new Intl.NumberFormat('en-IN', {
    //         style: 'currency',
    //         currency: 'INR',
    //         minimumFractionDigits: 2,
    //         maximumFractionDigits: 2
    //       }).format(amount);
    //     }
    //     return '₹ 0.00';
    //   }
    // },

    {
      headerName: 'Amount',
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
        if (!isNaN(amount)) {
          return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(amount);
        }
        return '₹ 0.00';
      }
    },

    // {
    //   headerName: 'Balance',
    //   field: 'gross_amount',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    //   minWidth: 150,
    //   cellRenderer: (params: any) => {
    //     const amount = Number(params.value);
    //     if (!isNaN(amount)) {
    //       return new Intl.NumberFormat('en-IN', {
    //         style: 'currency',
    //         currency: 'INR',
    //         minimumFractionDigits: 2,
    //         maximumFractionDigits: 2
    //       }).format(amount);
    //     }
    //     return '₹ 0.00';
    //   }
    // },

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
      cellRenderer:BankPaymentActionComponent
    }

  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }


  navigateToBank(){
    this.route.navigate(['/master/finance/transactions/add-bank-payment'])
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  getBankPaymentRecord() {
    let entity_id = localStorage.getItem("selectedEntityId");
    this._finaceservice.getBankPaymentRecord(entity_id).subscribe((response: any) => {
      if (response) {
        this.rowData = response.data;
        this.calculateTotals();
      }
    }, (err: any) => {
      // Handle error
    });
  }

  calculateTotals() {
    this.totalDebit = this.rowData.reduce((sum, row) => sum + parseFloat(row.total_debit_amount || 0), 0);
    this.totalCredit = this.rowData.reduce((sum, row) => sum + parseFloat(row.total_credit_amount || 0), 0);
  }
  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }
}
