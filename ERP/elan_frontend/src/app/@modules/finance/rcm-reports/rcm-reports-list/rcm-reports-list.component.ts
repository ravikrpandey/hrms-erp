import { Component, OnInit } from '@angular/core';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ActivatedRoute } from '@angular/router';
import { REPORT_CONFIG } from '../reports-config';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-rcm-reports-list',
  templateUrl: './rcm-reports-list.component.html',
  styleUrls: ['./rcm-reports-list.component.scss']
})
export class RcmReportsListComponent implements OnInit {

  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any[] = [];
  public gridOptions: any = { rowSelection: 'multiple' };

  getAllProfitCenterData: any = [];
  columnDefs: any = [];
  breadcrumbs: any = [];
  
  // Currency related properties
  currencySymbol: any = '₹';
  currencyCode: any = 'INR';
  currencyRate: any = 1;
  currencyData: any;
  
  transactionList: any = [];
  selectedSacCode: any = null;
  
  // Detail cell renderer params
  detailCellRendererParams: any;

  // List of monetary fields to format
  private monetaryFields = [
    'debit_amount', 'credit_amount', 'taxableValue', 'total_debit_amount',
    'cgst_amount', 'sgst_amount', 'igst_amount', 'totalRcmLiability',
    'totalTaxableValueRcm', 'totalCgst', 'totalSgst', 'totalIgst',
    'cgst', 'sgst', 'igst', 'debit_amount', 'rcm_amount',
    'balancePayable', 'totalLiability', 'cashPaid', 'closingBalance',
    'openingRcmLiability', 'currentMonthRcm', 'rcmPayableGlBalance',
    'inputGstRcmGlBalance', 'gstr3bLiability', 'difference',
    'debit_amount', 'total_amount', 'purchase_value', 'taxble_value',
    'cgstItc', 'sgstItc', 'igstItc', 'totalItcAvailable',
    'itcClaimedThisMonth', 'itcReversed', 'netItcAvailed',
    'itcClaimed', 'itcPending'
  ];

  constructor(
    private route: ActivatedRoute,
    private _finaceService: FinaceService,
    private _configurationalMasterService: ConfigurationalmasterService
  ) {}

  ngOnInit() {
    const routeName: any = this.route.snapshot.routeConfig?.path;
    const config = REPORT_CONFIG[routeName];
    this.breadcrumbs = config?.breadcrumbs || [];
    
    // Subscribe to currency changes
    this._configurationalMasterService.currency$
      .subscribe((currency: any) => {
        this.currencyData = currency;
        this.currencyCode = currency.Currency_Type || 'INR';
        this.currencyRate = Number(currency.rate) || 1;
        this.currencySymbol = currency.symbols || '₹';
        
        // Rebuild columns with new currency
        this.columnDefs = this.getColumnDefs();
        this.detailCellRendererParams = this.getDetailCellRendererParams();
        
        if (this.gridApi) {
          // Update main grid columns
          this.gridApi.setColumnDefs(this.columnDefs);
          
          // Update detail grid columns
          this.updateDetailGridColumns();
          
          this.gridApi.refreshCells();
        }
        
        this.getRCMPurchaseRegister();
      });
    
    // Initialize columns with default currency
    this.columnDefs = this.getColumnDefs();
    this.detailCellRendererParams = this.getDetailCellRendererParams();
  }

  // Method to format currency values with current currency settings
  formatCurrency(value: any): string {
    const numValue = Number(value || 0);
    if (isNaN(numValue)) return `${this.currencySymbol} 0.00`;
    const convertedValue = numValue * this.currencyRate;
    return `${this.currencySymbol} ${convertedValue.toFixed(2)}`;
  }

  // Currency formatter for AG Grid
  currencyFormatter = (params: any) => {
    const value = Number(params.value || 0) * this.currencyRate;
    return `${this.currencySymbol} ${value.toFixed(2)}`;
  };

  // Method to get main column definitions with current currency
  getColumnDefs(): any[] {
    const routeName: any = this.route.snapshot.routeConfig?.path;
    const config = REPORT_CONFIG[routeName];
    const baseColumns = config?.columns || [];
    
    // Process each column
    return baseColumns.map((col: any) => {
      // Check if this is a monetary field
      const fieldName = col.field || '';
      
      if (this.monetaryFields.includes(fieldName)) {
        // If the column already has a valueFormatter, keep it but wrap with currency
        if (col.valueFormatter) {
          const originalFormatter = col.valueFormatter;
          return {
            ...col,
            headerName: `${col.headerName} (${this.currencyCode})`,
            valueFormatter: (params: any) => {
              // Call original formatter first if needed, then apply currency
              const originalValue = originalFormatter(params);
              // Extract numeric value from params
              const value = Number(params.value || 0) * this.currencyRate;
              return `${this.currencySymbol} ${value.toFixed(2)}`;
            }
          };
        } else {
          // No existing formatter, apply currency formatting
          return {
            ...col,
            headerName: `${col.headerName} (${this.currencyCode})`,
            valueFormatter: (params: any) => {
              const value = Number(params.value || 0) * this.currencyRate;
              return `${this.currencySymbol} ${value.toFixed(2)}`;
            }
          };
        }
      }
      
      // For GST Rate fields, keep as percentage
      if (fieldName === 'gst_rate' || col.headerName?.includes('Rate') || col.headerName?.includes('Rate %')) {
        return {
          ...col,
          valueFormatter: (params: any) => {
            return `${params?.value || 0}%`;
          }
        };
      }
      
      return col;
    });
  }

  // Method to get detail grid columns with current currency
  getDetailGridColumns(): any[] {
    return [
      {
        field: 'invoiceNo',
        headerName: 'Invoice No'
      },
      {
        field: 'invoiceDate',
        headerName: 'Invoice Date'
      },
      {
        field: 'po_number',
        headerName: 'PO Number'
      },
      {
        field: 'vendor_name',
        headerName: 'Vendor'
      },
      {
        field: 'item_name',
        headerName: 'Item Name'
      },
      {
        field: 'sac_code',
        headerName: 'SAC Code'
      },
      {
        field: 'debit_amount',
        headerName: `Taxable Value (${this.currencyCode})`,
        valueFormatter: (params: any) => {
          const value = Number(params?.value || 0) * this.currencyRate;
          return `${this.currencySymbol} ${value.toFixed(2)}`;
        }
      },
      {
        field: 'gst_rate',
        headerName: 'GST Rate',
        valueFormatter: (params: any) => {
          return `${params?.value || 0}%`;
        }
      },
      {
        field: 'cgst',
        headerName: `CGST (${this.currencyCode})`,
        valueFormatter: (params: any) => {
          const value = Number(params?.value || 0) * this.currencyRate;
          return `${this.currencySymbol} ${value.toFixed(2)}`;
        }
      },
      {
        field: 'sgst',
        headerName: `SGST (${this.currencyCode})`,
        valueFormatter: (params: any) => {
          const value = Number(params?.value || 0) * this.currencyRate;
          return `${this.currencySymbol} ${value.toFixed(2)}`;
        }
      },
      {
        field: 'igst',
        headerName: `IGST (${this.currencyCode})`,
        valueFormatter: (params: any) => {
          const value = Number(params?.value || 0) * this.currencyRate;
          return `${this.currencySymbol} ${value.toFixed(2)}`;
        }
      },
      {
        field: 'debit_amount',
        headerName: `Total RCM (${this.currencyCode})`,
        valueFormatter: (params: any) => {
          const value = Number(params?.value || 0) * this.currencyRate;
          return `${this.currencySymbol} ${value.toFixed(2)}`;
        }
      }
    ];
  }

  // Method to get detail cell renderer params with current currency
  getDetailCellRendererParams(): any {
    return {
      detailGridOptions: {
        columnDefs: this.getDetailGridColumns(),
        defaultColDef: {
          flex: 1,
          resizable: true
        }
      },
      getDetailRowData: (params: any) => {
        params.successCallback(
          params.data.transactions || []
        );
      }
    };
  }

  // Method to update detail grid columns when currency changes
  updateDetailGridColumns() {
    if (this.gridApi) {
      // Update the detailCellRendererParams
      this.detailCellRendererParams = this.getDetailCellRendererParams();
      
      // Force refresh of detail grids
      this.gridApi.forEachNode((node: any) => {
        if (node.detailNode) {
          // If there's an open detail, refresh it
          const detailGridInfo = this.gridApi.getDetailGridInfo(node.id);
          if (detailGridInfo && detailGridInfo.api) {
            const newColumns = this.getDetailGridColumns();
            detailGridInfo.api.setColumnDefs(newColumns);
            detailGridInfo.api.refreshCells();
          }
        }
      });
    }
  }

  onRowClicked(event: any) {
    const sacCode = event.data.sac_code;

    if (this.selectedSacCode === sacCode) {
      this.selectedSacCode = null;
      this.transactionList = [];
      return;
    }

    this.selectedSacCode = sacCode;

    this._finaceService
      .getSacWiseTransactions(sacCode)
      .subscribe((res: any) => {
        this.transactionList = res.data || [];
        this.gridApi.redrawRows();
      });
  }

  rowClassRules = {
    'active-row': (params: any) => {
      return params.data?.sac_code === this.selectedSacCode;
    }
  };

  getSacTransactions(sacCode: string, node: any) {
    this._finaceService.getSacWiseTransactions(sacCode)
      .subscribe((res: any) => {
        node.setData({
          ...node.data,
          transactions: res.data
        });
        node.setExpanded(true);
      });
  }

  getRCMPurchaseRegister() {
    try {
      console.log(this.breadcrumbs, 'breadcrumbs');
      let entity_id = localStorage.getItem('selectedEntityId');
      let financial_id = localStorage.getItem('financial_id');
      this._finaceService.getRCMPurchaseRegister(entity_id, financial_id, this.breadcrumbs[0]).subscribe((response: any) => {
        if (response) {
          this.getAllProfitCenterData = response.data;
          this.rowData = response.data;
        }
      }, (err: any) => {
        console.log(err);
      });
    } catch (error) {
      console.log(error);
    }
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