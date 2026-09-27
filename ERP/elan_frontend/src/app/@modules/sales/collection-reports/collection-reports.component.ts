import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { SalesService } from '../service/sales.service';

@Component({
  selector: 'app-collection-reports',
  templateUrl: './collection-reports.component.html',
  styleUrls: ['./collection-reports.component.scss']
})
export class CollectionReportsComponent {
 rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any=[];
  entityId:any
  public gridOptions: any = { rowSelection: 'multiple', rowHeight: 55 };

  constructor(
    public dialog: MatDialog,
    private _rbackService: RbacMasterService,
    private toast: ToastrService,
    private route: Router,
    private _sales: SalesService,
    private activeroute: ActivatedRoute,
  ) {
    this.rowClass = 'rowClass';
  }

 async ngOnInit() {
  this.entityId = sessionStorage.getItem('selectedEntityId');
  this.getCustomerEging()
  }
  async getCustomerEging() {
    try {
      this._sales.getAllcollectionReportData().subscribe(
        (response: any) => {
          if (response.code == 200) {
            this.rowData = response.data;
          }
          if (response.code == 201) {
            this.rowData = [];
          }
        },
        (err: any) => {
          console.log(err);
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  goToCustomerInvoices(data: any) {
    this.route.navigate([`/master/sales/customer-invoice-list/${data.customer_id}` ]);
  }
  public columnDefs: any = [
      {
        headerName: 'S No.',
        valueGetter: 'node.rowIndex + 1',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered ',
        flex: 1,
        minWidth:200
      },
      {
        headerName: 'Customer Code',
        field: 'customer_code',


      },
      {
        headerName: 'Customer Name',
        field: 'company_name',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth:200
      },
      {
        headerName: 'Invoice Number',
        field: 'sales_invoice_no',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth:200
      },
      {
        headerName: 'Invoice Value',
        field: 'amount',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth:200
      },
        {
        headerName: 'Amount Paid',
        field: 'paid_amount',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth:200
      },
      {
        headerName: 'Payment Due Date',
        field: 'payment_due_days',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth:200
      },
      {
        headerName: 'Advance Receipt Amount',
        field: 'advance_amount',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth:200
      },
      {
        headerName: 'Advance Receipt Date',
        field: 'advance_reciept_date',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth:200
      },
     {
  headerName: 'Collection Date',
  field: 'createdAt',
  sortable: true,
  resizable: true,
  wrapHeaderText: true,
  autoHeaderHeight: true,
  cellClass: 'grid-cell-centered',
  flex: 1,
  minWidth: 200,

  valueFormatter: (params: any) => {
    if (!params.value) return '';

    return new Date(params.value).toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }
},
      {
        headerName: 'Payment Mode',
        field: 'document_type',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth:200
      },
      {
        headerName: 'Receipt Voucher No.',
        field: 'document_number',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth:200
      },
      {
        headerName: 'Reference Voucher No.',
        field: 'reference_number',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth:200
      },
      // {
      //   headerName: 'Reference Doc No.',
      //   field: 'amt_211_240',
      //   sortable: true,
      //   resizable: true,
      //   wrapHeaderText: true,
      //   autoHeaderHeight: true,
      //   cellClass: 'grid-cell-centered',
      //   flex: 1,
      //   minWidth:200
      // },
      {
        headerName: 'Assigned Sales Reprentative',
        field: 'amt_241_270',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth:200
      },


    ];





  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }
  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }




}
