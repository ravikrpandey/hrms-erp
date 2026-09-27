import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { SalesService } from '../../service/sales.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/app/environments/environment';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import { SoInvoiceActionComponent } from './so-invoice-action/so-invoice-action.component';

@Component({
  selector: 'app-so-invoice',
  templateUrl: './so-invoice.component.html',
  styleUrls: ['./so-invoice.component.scss']
})
export class SoInvoiceComponent implements OnInit {
rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  public gridOptions: any = { rowSelection: 'multiple' };
  isDeleteButtonVisible: boolean = false;
  selectedRows: any[] = [];
  queryParamss: any;
  id: any;
  collegeids: any;
  collegeIdCopy: any;
  loginUser: any;
  assignAction: any;
  role_master_id: any;
  selected = new FormControl(0);

    constructor( private toaster: ToastrService,  private salesService: SalesService) 
  {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    const entity_id = localStorage.getItem('selectedEntityId')
    const financial_id = localStorage.getItem('financial_id')
  this.getAllSalesInvoiceData(financial_id,entity_id);
}
getAllSalesInvoiceData(financial_id:any,entity_id:any){
this.salesService.getAllSalesInvoiceData(financial_id,entity_id).subscribe({
  next:(res:any)=> {
    console.log(res.data);
    this.rowData = res.data;
  },error(err) {
    console.log(err);
  },
})
}
 
 public columnDefs: ColDef[] = [

  {
    headerName: 'S.No.',
    valueGetter: 'node.rowIndex + 1',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'grid-cell-centered',
    flex: 1,
    minWidth: 90,
    // pinned: 'left',
  },

  {
    headerName: 'Invoice No',
    field: 'sales_invoice_no',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    tooltipField: 'sales_invoice_no',
    cellClass: 'grid-cell-centered',
    flex: 1,
    minWidth: 180,
  },


  {
    headerName: 'Invoice Date',
    field: 'sales_invoice_date',

    sortable: true,
    resizable: true,

    wrapHeaderText: true,
    autoHeaderHeight: true,

    tooltipField: 'sales_invoice_date',

    cellClass: 'grid-cell-centered',

    flex: 1,

    minWidth: 120,

    valueFormatter: (params: any) => {

      if (!params.value) return '';

      return new Date(params.value)
        .toLocaleDateString('en-IN');
    },
  },


  {
    headerName: 'SO No.',

    valueGetter: (params: any) =>
      params.data?.sales_order?.sales_order_no || '',

    sortable: true,
    resizable: true,

    wrapHeaderText: true,
    autoHeaderHeight: true,

    tooltipValueGetter: (params: any) =>
      params.data?.sales_order?.sales_order_no || '',

    cellClass: 'grid-cell-centered',

    flex: 1.2,

    minWidth: 120,
  },


  {
    headerName: 'Company Name',

    valueGetter: (params: any) =>
      params.data?.customer?.company_name || '',

    sortable: true,
    resizable: true,

    wrapHeaderText: true,
    autoHeaderHeight: true,

    tooltipValueGetter: (params: any) =>
      params.data?.customer?.company_name || '',

    cellClass: 'grid-cell-centered',

    flex: 1.5,

    minWidth: 150,
  },

  {
    headerName: 'Payment Terms',

    field: 'payment_due_days',

    sortable: true,
    resizable: true,

    wrapHeaderText: true,
    autoHeaderHeight: true,

    tooltipField: 'payment_due_days',

    cellClass: 'grid-cell-centered',

    flex: 1,

    minWidth: 150,
  },

  // {
  //   headerName: 'Subtotal',

  //   field: 'subtotal',

  //   sortable: true,
  //   resizable: true,

  //   wrapHeaderText: true,
  //   autoHeaderHeight: true,

  //   cellClass: 'grid-cell-centered',

  //   flex: 1,

  //   minWidth: 150,

  //   valueFormatter: (params: any) =>
  //     params.value != null
  //       ? `₹ ${Number(params.value)
  //           .toLocaleString('en-IN', {
  //             minimumFractionDigits: 2,
  //             maximumFractionDigits: 2
  //           })}`
  //       : '',
  // },

  // // =========================================
  // // TAXABLE AMOUNT
  // // =========================================

  // {
  //   headerName: 'Taxable Amount',

  //   field: 'taxable_amount',

  //   sortable: true,
  //   resizable: true,

  //   wrapHeaderText: true,
  //   autoHeaderHeight: true,

  //   cellClass: 'grid-cell-centered',

  //   flex: 1,

  //   minWidth: 170,

  //   valueFormatter: (params: any) =>
  //     params.value != null
  //       ? `₹ ${Number(params.value)
  //           .toLocaleString('en-IN', {
  //             minimumFractionDigits: 2,
  //             maximumFractionDigits: 2
  //           })}`
  //       : '',
  // },

  // // =========================================
  // // CGST
  // // =========================================

  // {
  //   headerName: 'CGST',

  //   field: 'cgst_amount',

  //   sortable: true,
  //   resizable: true,

  //   wrapHeaderText: true,
  //   autoHeaderHeight: true,

  //   cellClass: 'grid-cell-centered',

  //   flex: 1,

  //   minWidth: 130,

  //   valueFormatter: (params: any) =>
  //     params.value != null
  //       ? `₹ ${Number(params.value).toFixed(2)}`
  //       : '',
  // },

  // // =========================================
  // // SGST
  // // =========================================

  // {
  //   headerName: 'SGST',

  //   field: 'sgst_amount',

  //   sortable: true,
  //   resizable: true,

  //   wrapHeaderText: true,
  //   autoHeaderHeight: true,

  //   cellClass: 'grid-cell-centered',

  //   flex: 1,

  //   minWidth: 130,

  //   valueFormatter: (params: any) =>
  //     params.value != null
  //       ? `₹ ${Number(params.value).toFixed(2)}`
  //       : '',
  // },

  // // =========================================
  // // IGST
  // // =========================================

  // {
  //   headerName: 'IGST',

  //   field: 'igst_amount',

  //   sortable: true,
  //   resizable: true,

  //   wrapHeaderText: true,
  //   autoHeaderHeight: true,

  //   cellClass: 'grid-cell-centered',

  //   flex: 1,

  //   minWidth: 130,

  //   valueFormatter: (params: any) =>
  //     params.value != null
  //       ? `₹ ${Number(params.value).toFixed(2)}`
  //       : '',
  // },

  // // =========================================
  // // GRAND TOTAL
  // // =========================================

  // {
  //   headerName: 'Grand Total',

  //   field: 'grand_total',

  //   sortable: true,
  //   resizable: true,

  //   wrapHeaderText: true,
  //   autoHeaderHeight: true,

  //   cellClass: 'grid-cell-centered fw-bold',

  //   flex: 1.2,

  //   minWidth: 180,

  //   valueFormatter: (params: any) =>
  //     params.value != null
  //       ? `₹ ${Number(params.value)
  //           .toLocaleString('en-IN', {
  //             minimumFractionDigits: 2,
  //             maximumFractionDigits: 2
  //           })}`
  //       : '',
  // },

  // // =========================================
  // // PAYMENT STATUS
  // // =========================================

  {
    headerName: 'Payment Status',

    field: 'payment_status',

    sortable: true,
    resizable: true,

    wrapHeaderText: true,
    autoHeaderHeight: true,

    tooltipField: 'payment_status',

    cellClass: (params: any) => {

      if (params.value === 'PAID') {
        return 'paid-status';
      }

      if (params.value === 'UNPAID') {
        return 'unpaid-status';
      }

      return 'grid-cell-centered';
    },

    flex: 1,

    minWidth: 120,
  },

  // =========================================
  // INVOICE STATUS
  // =========================================

  {
    headerName: 'Invoice Status',

    field: 'invoice_status',

    sortable: true,
    resizable: true,

    wrapHeaderText: true,
    autoHeaderHeight: true,

    tooltipField: 'invoice_status',

    cellClass: (params: any) => {

      if (params.value === 'APPROVED') {
        return 'approved-status';
      }

      if (params.value === 'PENDING') {
        return 'pending-status';
      }

      if (params.value === 'CANCELLED') {
        return 'cancel-status';
      }

      return 'grid-cell-centered';
    },

    flex: 1,

    minWidth: 120,
  },
 {
    headerName: 'Action',
    field: 'id',
    cellRenderer: SoInvoiceActionComponent,
    sortable: true,
    resizable: false,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'grid-cell-centered',
    // pinned: 'right',
    maxWidth: 125
  }
  // =========================================
  // CREATED DATE
  // =========================================

  // {
  //   headerName: 'Created Date',

  //   field: 'createdAt',

  //   sortable: true,
  //   resizable: true,

  //   wrapHeaderText: true,
  //   autoHeaderHeight: true,

  //   cellClass: 'grid-cell-centered',

  //   flex: 1.2,

  //   minWidth: 180,

  //   valueFormatter: (params: any) => {

  //     if (!params.value) return '';

  //     return new Date(params.value)
  //       .toLocaleDateString('en-IN');
  //   },
  // },

  // =========================================
  // STATUS
  // =========================================

  // {
  //   headerName: 'Status',

  //   field: 'status',

  //   sortable: true,
  //   resizable: true,

  //   wrapHeaderText: true,
  //   autoHeaderHeight: true,

  //   tooltipField: 'status',

  //   cellClass: 'grid-cell-centered',

  //   flex: 1,

  //   minWidth: 120,

  //   pinned: 'right',
  // },

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