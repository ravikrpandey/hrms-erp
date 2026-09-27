import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import * as moment from 'moment';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { ActionPayableComponent } from '../../action-payable/action-payable.component';
@Component({
  selector: 'app-vendor-invoice-payable',
  templateUrl: './vendor-invoice-payable.component.html',
  styleUrls: ['./vendor-invoice-payable.component.scss'],
})
export class VendorInvoicePayableComponent {
  private gridApi!: GridApi<any>;
  rowData: any;
  rowData2: any;
  rowData1: any;
  personalIdData: any;
  propertyManager: any;
  text: any;
  firstLastName: any;
  rowClass: any;
  clicked: boolean = false;
  id: any;
  lead_id: any;
  menuAccessData: any;
  employId: string | null;
  userId: any;
  assignById: any;
  constructor(
    private activeroute: ActivatedRoute,
    public route: Router,
    public dialog: MatDialog,
    private _finaceService: FinaceService
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.activeroute.queryParams.subscribe((params) => {
      this.id = params;

      this.lead_id = this.id.lead_id;
    });
    this.getListExpense();
  }
  // getListExpense(){
  //   this._itteketService.getApproved().subscribe((res:any)=>{
  //
  //     this.rowData=res.result;
  //

  //   })
  // }
  getListExpense() {
    this._finaceService.getRecivedVendorInvoice().subscribe((res: any) => {
      this.rowData = res.data;
    });
  }

  openCreate() {
    this.route.navigate(
      ['master/lead/lead-management/assign-lead/assign-lead'],
      { queryParams: { lead_id: this.lead_id } }
    );
  }

  public columnDefs = [
    {
      headerName: 'S.No',
      field: 'vendor_management_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Vendor Name',
      field: 'vendor_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
    },
    // {
    //   headerName: 'P.O Number',
    //   field: 'expense_report_no',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: "grid-cell-centered"
    // },
    {
      headerName: 'Invoice Number',
      field: 'vendor_management_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Date',
      field: 'expiry_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
    },
    // {
    //   headerName: 'Invoice Amount',
    //   field: 'task_order',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: "grid-cell-centered"
    // },
    {
      headerName: 'Paid amount',
      field: 'task_order',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Pending amount',
      field: 'task_order',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Reference No',
      field: 'task_order',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
    },

    // no wireframe fileds
    {
      headerName: 'Account Type',
      field: 'account_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Account Number',
      field: 'bank_account_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Bank Address',
      field: 'bank_address',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Bank Name',
      field: 'bank_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Branch',
      field: 'branch',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Contact Number',
      field: 'contact_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
    },

    {
      headerName: 'Action',
      field: 'vendor_management_id',
      cellRenderer: ActionPayableComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
      cellClass: 'grid-cell-centered',
    },
  ];

  dateFormatter(createdAt: any) {
    return moment(createdAt).format('DD/MM/YYYY');
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
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}
