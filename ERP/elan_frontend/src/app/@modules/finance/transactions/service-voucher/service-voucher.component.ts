import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ServiceVoucherActionComponent } from './service-voucher-action/service-voucher-action.component';

@Component({
  selector: 'app-service-voucher',
  templateUrl: './service-voucher.component.html',
  styleUrls: ['./service-voucher.component.scss']
})
export class ServiceVoucherComponent {
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
    this.getPurchaseJournalData()
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
  valueGetter: (params: any) => {
    return params.data?.MASTER_BRANCH?.branch_name || '-';
  },
  sortable: true,
  resizable: true,
  wrapHeaderText: true,
  autoHeaderHeight: true,
  cellClass: 'grid-cell-centered',
  flex: 1,
  minWidth: 150,
},

{
  headerName: 'Customer Name',
  valueGetter: (params: any) => {
    return params.data?.CUSTOMER_PROFILE_MST?.company_name || '-';
  },
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
      headerName: 'Amount',
      field: 'netAmt',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params:any) => {
        const amount = params.value;  
        if (amount != null) {
          return `${amount}`;
        }
        return '0.00';
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
      cellRenderer:ServiceVoucherActionComponent
    }


    // {
    //   headerName: 'Credit',
    //   field: 'credit_amount',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    //   minWidth: 150,
    //   cellRenderer: (params:any) => {
    //     const amount = params.value;  
    //     if (amount != null) {
    //       return `${amount}`;
    //     }
    //     return '0.00';
    //   },
    // },

    // {
    //   headerName: 'Balance',
    //   field: 'purchase_value',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    //   minWidth: 150,
    //   cellRenderer: (params:any) => {
    //     const amount = params.value;  
    //     if (amount != null) {
    //       return `${amount}`;
    //     }
    //     return '0.00';
    //   },
    // }

  ];

  addNewForm(){
    this.route.navigate(['master/finance/transactions/add-service-voucher'])
  }



  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  getPurchaseJournalData() {
    let entity_id = localStorage.getItem("selectedEntityId");
    this._finaceservice.getAllServiceVoucherList(entity_id).subscribe((response: any) => {
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
