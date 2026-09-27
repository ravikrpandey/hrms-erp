import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-purchase-register-list',
  templateUrl: './purchase-register-list.component.html',
  styleUrls: ['./purchase-register-list.component.scss']
})
export class PurchaseRegisterListComponent {
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
  entity_id:any
  currencySymbol: any = '₹';
  currencyCode: any = 'INR';
  currencyData: any;
  currencyRate: any = 1;
  public columnDefs: any[] = [];

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
    this.company_id = localStorage.getItem('company_id')
    this.entity_id = localStorage.getItem('selectedEntityId');
   
    this._configurationalMasterService.currency$
      .subscribe((currency: any) => {
        this.currencyData = currency;
        this.currencyCode = currency.Currency_Type || 'INR';
        this.currencyRate = Number(currency.rate) || 1;
        this.currencySymbol = currency.symbols || '₹';
     
        // Rebuild columns with new currency
        this.columnDefs = this.getColumnDefs();
        
        if (this.gridApi) {
          // Refresh the grid with new columns
          this.gridApi.setColumnDefs(this.columnDefs);
          this.gridApi.refreshCells();
        }
       
        this.purchaseRegister()
      });
    
    // Initialize columns with default currency
    this.columnDefs = this.getColumnDefs();
  }
 
  // Currency formatter for all monetary values
  currencyFormatter = (params: any) => {
    const value = Number(params.value || 0) * this.currencyRate;
    return `${this.currencySymbol} ${value.toFixed(2)}`;
  };

  purchaseRegister(){
    this._finaceservice.purchaseRegister(this.entity_id).subscribe(
      (res: any) => {
        if (res.data && res.data.length > 0) {
          this.rowData = res.data;
        } else {
          this.toast.error('No Data found....');
        }
      },
      (error) => {
        this.toast.error('Something went wrong');
      }
    );
  }

  // Method to get column definitions with current currency
  getColumnDefs(): any[] {
    return [
      {
        headerName: 'S.No.',
        valueGetter: 'node.rowIndex + 1',
        sortable: true,
        resizable: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        maxWidth: 100
      },
      {
        headerName: 'Date of Invoice',
        field: 'invoiceDate',
        sortable: true,
        resizable: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150
      },
      {
        headerName: 'Invoice No',
        field: 'invoiceNo',
        sortable: true,
        resizable: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150
      },
      {
        headerName: 'GSTIN of Vendor',
        field: 'gst_in',
        sortable: true,
        resizable: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 160
      },
      {
        headerName: 'Vendor Name',
        field: 'vendor_name',
        sortable: true,
        resizable: true,
        flex: 1,
        minWidth: 180
      },
      {
        headerName: 'Goods or Services',
        field: 'goods_services',
        sortable: true,
        resizable: true,
        flex: 1,
        minWidth: 160
      },
      // {
      //   headerName: 'Description of Goods / Services',
      //   field: 'description',
      //   sortable: true,
      //   resizable: true,
      //   flex: 1,
      //   minWidth: 220
      // },
      {
        headerName: 'Type of Supply',
        field: 'Type_of_Supply',
        sortable: true,
        resizable: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150
      },
      {
        headerName: 'B2B/B2C',
        field: 'b2b_b2c',
        sortable: true,
        resizable: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 120
      },
      {
        headerName: 'Place of Supply',
        field: 'Place_of_Supply',
        sortable: true,
        resizable: true,
        flex: 1,
        minWidth: 160
      },
      {
        headerName: 'RCM Applicable',
        field: 'rcm_applicable',
        sortable: true,
        resizable: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 140
      },
      {
        headerName: 'ITC Eligible',
        field: 'itc_eligible',
        sortable: true,
        resizable: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 130
      },
      {
        headerName: `Taxable Value (${this.currencyCode})`,
        field: 'taxble_value',
        valueFormatter: (params: any) => {
          const value = Number(params.value || 0) * this.currencyRate;
          return `${this.currencySymbol} ${value.toFixed(2)}`;
        },
        sortable: true,
        resizable: true,
        flex: 1,
        minWidth: 160
      },
      {
        headerName: 'CGST Rate',
        field: 'cgst_rate',
        sortable: true,
        resizable: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 120
      },
      {
        headerName: 'SGST Rate',
        field: 'sgst_rate',
        sortable: true,
        resizable: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 120
      },
      {
        headerName: 'IGST Rate',
        field: 'igst_rate',
        sortable: true,
        resizable: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 120
      },
      {
        headerName: `CGST (${this.currencyCode})`,
        field: 'cgst_amount',
        valueFormatter: (params: any) => {
          const value = Number(params.value || 0) * this.currencyRate;
          return `${this.currencySymbol} ${value.toFixed(2)}`;
        },
        sortable: true,
        resizable: true,
        flex: 1,
        minWidth: 150
      },
      {
        headerName: `SGST (${this.currencyCode})`,
        field: 'sgst_amount',
        valueFormatter: (params: any) => {
          const value = Number(params.value || 0) * this.currencyRate;
          return `${this.currencySymbol} ${value.toFixed(2)}`;
        },
        sortable: true,
        resizable: true,
        flex: 1,
        minWidth: 150
      },
      {
        headerName: `IGST (${this.currencyCode})`,
        field: 'igst_amount',
        valueFormatter: (params: any) => {
          const value = Number(params.value || 0) * this.currencyRate;
          return `${this.currencySymbol} ${value.toFixed(2)}`;
        },
        sortable: true,
        resizable: true,
        flex: 1,
        minWidth: 150
      },
      {
        headerName: 'HSN/SAC',
        field: 'hsn_sac_code',
        sortable: true,
        resizable: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150
      },
      {
        headerName: `Invoice Total (${this.currencyCode})`,
        field: 'invoice_total',
        valueFormatter: (params: any) => {
          const value = Number(params.value || 0) * this.currencyRate;
          return `${this.currencySymbol} ${value.toFixed(2)}`;
        },
        sortable: true,
        resizable: true,
        flex: 1,
        minWidth: 170
      },
      {
        headerName: `TDS Amount (${this.currencyCode})`,
        field: 'tds_amount',
        valueFormatter: (params: any) => {
          const value = Number(params.value || 0) * this.currencyRate;
          return `${this.currencySymbol} ${value.toFixed(2)}`;
        },
        sortable: true,
        resizable: true,
        flex: 1,
        minWidth: 160
      },
      {
        headerName: `Net Amount (${this.currencyCode})`,
        field: 'net_amount',
        valueFormatter: (params: any) => {
          const value = Number(params.value || 0) * this.currencyRate;
          return `${this.currencySymbol} ${value.toFixed(2)}`;
        },
        sortable: true,
        resizable: true,
        flex: 1,
        minWidth: 160
      },
      {
        headerName: 'IRN (Invoice Reference Number)',
        field: 'irn',
        sortable: true,
        resizable: true,
        flex: 1,
        minWidth: 220
      }
    ];
  }

  addNewForm(){
    this.route.navigate(['master/finance/transactions/add-purchase-journal'])
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    // Set initial columns
    this.gridApi.setColumnDefs(this.columnDefs);
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
}