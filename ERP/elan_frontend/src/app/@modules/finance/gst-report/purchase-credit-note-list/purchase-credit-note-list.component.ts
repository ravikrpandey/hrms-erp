import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-purchase-credit-note-list',
  templateUrl: './purchase-credit-note-list.component.html',
  styleUrls: ['./purchase-credit-note-list.component.scss']
})
export class PurchaseCreditNoteListComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any[] = [];
  public gridOptions: any = { rowSelection: 'multiple' };
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
  entity_id: any;

  // Currency properties
  currencySymbol: string = '₹';
  currencyCode: string = 'INR';
  currencyRate: number = 1;

  constructor(
    public dialog: MatDialog,
    private _finaceservice: FinaceService,
    private _rbackService: RbacMasterService,
    private toast: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute,
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.company_id = localStorage.getItem('company_id');
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.getPurchaseCreditLimitList();
  }

  getPurchaseCreditLimitList() {
    this._finaceservice.getPurchaseCreditLimitList(this.entity_id).subscribe(
      (res: any) => {
        if (res.data && res.data.length > 0) {
          this.rowData = res.data;
          if (this.gridApi) {
            this.gridApi.setRowData(this.rowData);
          }
          this.toast.success('Data loaded successfully');
        } else {
          this.rowData = [];
          this.toast.warning('No Data found');
        }
      },
      (error) => {
        this.toast.error('Something went wrong');
        console.error(error);
      }
    );
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
      headerName: 'Date of Credit Note',
      field: 'builder_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      valueFormatter: (params: any) => {
        if (params.value) {
          const date = new Date(params.value);
          return date.toLocaleDateString('en-IN');
        }
        return '-';
      }
    },
    {
      headerName: 'Credit Note No',
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
      headerName: 'Vendor Name',
      field: 'vendor_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'GSTIN of Vendor',
      field: 'gst_in',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      valueFormatter: (params: any) => params.value || '-'
    },
    {
      headerName: 'Taxable Value',
      field: 'total_with_gst',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-right',
      flex: 1,
      minWidth: 150,
      valueGetter: (params: any) => {
        const amount = parseFloat(params.data.total_with_gst) || 0;
        return this.convertCurrency(amount);
      },
      valueFormatter: (params: any) => this.formatCurrency(params.value)
    },
    {
      headerName: 'CGST',
      field: 'total_cgst',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-right',
      flex: 1,
      minWidth: 150,
      valueGetter: (params: any) => {
        const amount = parseFloat(params.data.total_cgst) || 0;
        return this.convertCurrency(amount);
      },
      valueFormatter: (params: any) => this.formatCurrency(params.value)
    },
    {
      headerName: 'SGST',
      field: 'total_sgst',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-right',
      flex: 1,
      minWidth: 150,
      valueGetter: (params: any) => {
        const amount = parseFloat(params.data.total_sgst) || 0;
        return this.convertCurrency(amount);
      },
      valueFormatter: (params: any) => this.formatCurrency(params.value)
    },
    {
      headerName: 'IGST',
      field: 'total_igst',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-right',
      flex: 1,
      minWidth: 150,
      valueGetter: (params: any) => {
        const amount = parseFloat(params.data.total_igst) || 0;
        return this.convertCurrency(amount);
      },
      valueFormatter: (params: any) => this.formatCurrency(params.value)
    },
    {
      headerName: 'Total GST',
      field: 'total_with_gst',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-right',
      flex: 1,
      minWidth: 150,
      valueGetter: (params: any) => {
        const amount = parseFloat(params.data.total_with_gst) || 0;
        return this.convertCurrency(amount);
      },
      valueFormatter: (params: any) => this.formatCurrency(params.value)
    },
    {
      headerName: 'Total Amount',
      field: 'amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-right',
      flex: 1,
      minWidth: 150,
      valueGetter: (params: any) => {
        const amount = parseFloat(params.data.amount) || 0;
        return this.convertCurrency(amount);
      },
      valueFormatter: (params: any) => this.formatCurrency(params.value),
      cellStyle: { 'font-weight': 'bold', 'color': '#1976d2' }
    },
    // {
    //   headerName: 'Total Items',
    //   field: 'items',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    //   minWidth: 120,
    //   valueGetter: (params: any) => {
    //     return params.data.items ? params.data.items.length : 0;
    //   }
    // }
  ];

  // Currency conversion methods
  convertCurrency(amount: number): number {
    if (!amount || isNaN(amount)) return 0;
    return this.roundToTwoDecimals(amount * this.currencyRate);
  }

  private roundToTwoDecimals(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  formatCurrency(amount: number): string {
    if (!amount || isNaN(amount)) return `${this.currencySymbol} 0.00`;
    return `${this.currencySymbol} ${amount.toFixed(2)}`;
  }

  addNewForm() {
    this.route.navigate(['master/finance/transactions/add-purchase-credit-note']);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement).value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  refreshData() {
    this.getPurchaseCreditLimitList();
  }
}
