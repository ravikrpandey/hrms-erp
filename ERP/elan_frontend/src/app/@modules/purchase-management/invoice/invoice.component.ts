import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridApi, ColDef, GridReadyEvent } from 'ag-grid-community';
import * as moment from 'moment';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import { InvoiceActionComponent } from './invoice-action/invoice-action.component';
import { GrnServiceService } from '../services/grn-service.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent {
  public tab: string;
  rowClass: any;
  private gridApi!: GridApi<any>;
  filteredData: any[] = [];

  actions = [
    // {
    //   label: 'Add Multi PO Invoice',
    //   callback: this.generateMultiPoInvoice.bind(this),
    // },
    // {
    //   label: 'Add Invoice',
    //   callback: this.addInvoice.bind(this),
    // },
  ];
  public rowData: any = [];

  public columnDefs: ColDef[] = [
    {
      headerName: 'S. No.',
      valueGetter: "node.rowIndex + 1",
      cellClass: "grid-cell-centered",
      maxWidth: 80,
      minWidth: 80,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'PO No.',
      field: 'po_number',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'GRN No.',
      field: 'grn_number',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 110,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Invoice No.',
      field: 'invoiceNo',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 110,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    // {
    //   headerName: 'PO Type',
    //   field: 'po_type',
    //   cellClass: "grid-cell-centered",
    //   flex: 1,
    //   minWidth: 150,
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    // },
    {
      headerName: 'Vendor Name',
      field: 'vendor_name',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 120,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Indent Type',
      field: 'po_category',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 110,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Warehouse Name',
      field: 'warehouse_name',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Invoice Date',
      field: 'invoiceDate',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 110,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      valueFormatter: (params: any) => moment(new Date(params.value)).format('DD-MM-YYYY'),
    },
    {
      headerName: 'QTY',
      field: 'item_quantity',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 70,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Total Purchase',
      field: 'total_amount',
      sortable: true,
      resizable: true,
      tooltipValueGetter: (p) =>
        '₹ ' + (p.data?.grand_total != null ? p.data.grand_total : p.value),
      minWidth: 120,
      flex: 1,
      cellClass: 'grid-cell-centered',
      valueFormatter: (params) => {
        const amount =
          params.data?.grand_total != null
            ? params.data.grand_total
            : params.value;
        return '₹ ' + amount;
      },
    },
    // {
    //   headerName: 'Invoice Status',
    //   field: 'invoice_status',
    //   cellClass: "grid-cell-centered",
    //   flex: 1,
    //   minWidth: 110,
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   valueFormatter: (params: any) => params.value === 'PENDING' ? 'INCOMPLETE' : params.value,
    // },
    {
      headerName: 'Action',
      pinned: 'right',
      cellRenderer: InvoiceActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
      cellClass: "grid-cell-centered",
      width: 80,
      maxWidth: 80,
      minWidth: 80,
      sortable: false,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
  ];

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private accessCtrl: AccessControlService,
    private grnService: GrnServiceService,

  ) {
    this.getAllGRNDataInvoice();
  }

  getAllGRNDataInvoice() {
    this.grnService.getAllGRNDataInvoice(
      this.accessCtrl.getFinancialId(),
      this.accessCtrl.getEntityId(),
      this.accessCtrl.getEmployeeId()
    ).subscribe((res: any) => {
      this.rowData = res.data;
      this.filteredData = this.rowData;
    })
  }


  generateMultiPoInvoice() {
    this.router.navigate(['master/purchase-management/invoice/create-multi-po-invoice'])
  }

  addInvoice() {
    this.router.navigate(['master/purchase-management/invoice/create-invoice'])
  }
  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  onFilterByDepartment(event: any) {
    if (event == null || undefined) {
      this.filteredData = this.rowData;
    } else {
      this.filteredData = this.rowData.filter((res: any) => res.department_name == event);
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}