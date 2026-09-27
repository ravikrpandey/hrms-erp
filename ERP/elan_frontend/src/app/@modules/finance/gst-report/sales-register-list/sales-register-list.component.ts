import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-sales-register-list',
  templateUrl: './sales-register-list.component.html',
  styleUrls: ['./sales-register-list.component.scss']
})
export class SalesRegisterListComponent {
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
  entity_id: any;

  currencyData: any = [];
  currencyCode: string = 'INR';
  currencySymbol: string = '₹';
  currencyRate: number = 1;
  currentDate: Date = new Date();

  private originalRowData: any[] = [];

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
    this.entity_id = localStorage.getItem('selectedEntityId');
    
    this._configurationalMasterService.currency$
      .subscribe((currency: any) => {
        if (!currency) return;
        
        this.currencyData = currency;
        this.currencyCode = currency.Currency_Type || currency.symbols || 'INR';
        this.currencyRate = Number(currency.rate) || 1;
        this.currencySymbol = currency.symbols || '₹';
        
        this.updateDisplayWithCurrencyRate();
      });
    
    this.getSalesRegisterGSTReport();
  }
 
  getSalesRegisterGSTReport() {
    this._finaceservice.getSalesRegisterGSTReport(this.entity_id).subscribe(
      (res: any) => {
        if (res && res.code === 200 && res.data) {
          this.originalRowData = res.data.map((item: any) => {
            const baseItem = { ...item };
            const fieldsToConvert = [
              'grand_total', 'discount_amount', 'taxable_amount',
              'cgst_amount', 'sgst_amount', 'igst_amount',
              'cgst', 'sgst', 'igst'
            ];
            
            fieldsToConvert.forEach(field => {
              if (baseItem[field] !== undefined && baseItem[field] !== null) {
                const baseValueField = field + '_base';
                baseItem[baseValueField] = Number(baseItem[field]);
                baseItem._isBaseCurrency = true;
              }
            });
            
            return baseItem;
          });
          
          this.updateDisplayWithCurrencyRate();
        } else {
          this.toast.warning('No data received from server');
        }
      },
      (error: any) => {
        console.error('Error fetching GST data:', error);
        this.toast.error('Failed to load GST Report data');
      }
    );
  }

  updateDisplayWithCurrencyRate() {
    if (!this.originalRowData || this.originalRowData.length === 0) {
      this.rowData = [];
      return;
    }

    this.rowData = this.originalRowData.map((item: any) => {
      const convertedItem = { ...item };
      
      const fieldsToConvert = [
        'grand_total', 'discount_amount', 'taxable_amount',
        'cgst_amount', 'sgst_amount', 'igst_amount',
        'cgst', 'sgst', 'igst'
      ];
      
      fieldsToConvert.forEach(field => {
        if (convertedItem[field] !== undefined && convertedItem[field] !== null) {
          let baseValue = Number(convertedItem[field]);
          if (item[field + '_base'] !== undefined) {
            baseValue = Number(item[field + '_base']);
          }
          convertedItem[field] = this.roundToTwoDecimals(baseValue * this.currencyRate);
        }
      });
      
      convertedItem.currencyCode = this.currencyCode;
      convertedItem.currencySymbol = this.currencySymbol;
      convertedItem.currencyRate = this.currencyRate;
      
      return convertedItem;
    });

    this.updateColumnHeaders();
    
    if (this.gridApi) {
      this.gridApi.setRowData(this.rowData);
      this.gridApi.refreshCells();
    }
  }

  private roundToTwoDecimals(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  updateColumnHeaders() {
    this.columnDefs = this.columnDefs.map(col => {
      if (col.headerName && typeof col.headerName === 'string') {
        const currencyPattern = /\(([A-Z]{3})\)/;
        if (currencyPattern.test(col.headerName)) {
          col.headerName = col.headerName.replace(currencyPattern, `(${this.currencyCode})`);
        }
      }
      return col;
    });

    if (this.gridApi) {
      this.gridApi.refreshHeader();
    }
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
      minWidth: 100,
    },
    {
      headerName: 'Date of Invoice',
      field: 'sales_invoice_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      valueGetter: (params: any) => {
        return params.data?.sales_invoice_date ? 
          new Date(params.data.sales_invoice_date).toLocaleDateString('en-IN') : '';
      }
    },
    {
      headerName: 'Invoice No',
      field: 'sales_invoice_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'GSTIN of Customer',
      field: 'billing_gst',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Goods or Services',
      field: 'goods',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Description of Goods/ Services',
      field: 'remarks',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Qty / UQC incase of Goods',
      field: 'qty',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Type of Supply',
      field: 'invoice_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'B2B/B2C',
      field: 'billing_gst',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      valueGetter: (params: any) => {
        return params.data.billing_gst ? 'B2B' : 'B2C';
      }
    },
    {
      headerName: 'Place of Supply',
      field: 'billing_state',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Domestic/ Export/ SEZ',
      field: 'invoice_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: `Total Value (${this.currencyCode})`,
      field: 'grand_total',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        const amount = Number(params.value);
        if (!isNaN(amount) && amount > 0) {
          return this.formatCurrency(amount);
        }
        return '0.00';
      }
    },
    {
      headerName: `Discount (${this.currencyCode})`,
      field: 'discount_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        const amount = Number(params.value);
        if (!isNaN(amount) && amount > 0) {
          return this.formatCurrency(amount);
        }
        return '0.00';
      }
    },
    {
      headerName: `Taxable Value (${this.currencyCode})`,
      field: 'taxable_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        const amount = Number(params.value);
        if (!isNaN(amount) && amount > 0) {
          return this.formatCurrency(amount);
        }
        return '0.00';
      }
    },
    {
      headerName: 'CGST Rate',
      field: 'cgst',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        const amount = Number(params.value);
        if (!isNaN(amount) && amount > 0) {
          return amount + '%';
        }
        return '0%';
      }
    },
    {
      headerName: 'SGST Rate',
      field: 'sgst',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        const amount = Number(params.value);
        if (!isNaN(amount) && amount > 0) {
          return amount + '%';
        }
        return '0%';
      }
    },
    {
      headerName: 'IGST Rate',
      field: 'igst',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        const amount = Number(params.value);
        if (!isNaN(amount) && amount > 0) {
          return amount + '%';
        }
        return '0%';
      }
    },
    {
      headerName: `CGST (${this.currencyCode})`,
      field: 'cgst_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        const amount = Number(params.value);
        if (!isNaN(amount) && amount > 0) {
          return this.formatCurrency(amount);
        }
        return '0.00';
      }
    },
    {
      headerName: `SGST (${this.currencyCode})`,
      field: 'sgst_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        const amount = Number(params.value);
        if (!isNaN(amount) && amount > 0) {
          return this.formatCurrency(amount);
        }
        return '0.00';
      }
    },
    {
      headerName: `IGST (${this.currencyCode})`,
      field: 'igst_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        const amount = Number(params.value);
        if (!isNaN(amount) && amount > 0) {
          return this.formatCurrency(amount);
        }
        return '0.00';
      }
    },
    {
      headerName: 'HSN',
      field: 'hsncode',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'IRN (Invoice Reference Number)',
      field: 'sales_invoice_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
  ];

  formatCurrency(amount: number): string {
    const symbol = this.currencySymbol;
    const code = this.currencyCode;
    const formattedAmount = amount.toFixed(2);
    
    if (code === 'INR') {
      return `₹ ${formattedAmount}`;
    } else if (code === 'USD') {
      return `$ ${formattedAmount}`;
    } else if (code === 'EUR') {
      return `€ ${formattedAmount}`;
    } else if (code === 'GBP') {
      return `£ ${formattedAmount}`;
    } else {
      return `${symbol} ${formattedAmount}`;
    }
  }

  getTotalValue(): number {
    if (!this.rowData || this.rowData.length === 0) return 0;
    return this.rowData.reduce((sum, item) => sum + (Number(item.grand_total) || 0), 0);
  }

  getTotalTaxable(): number {
    if (!this.rowData || this.rowData.length === 0) return 0;
    return this.rowData.reduce((sum, item) => sum + (Number(item.taxable_amount) || 0), 0);
  }

  getTotalGST(): number {
    if (!this.rowData || this.rowData.length === 0) return 0;
    return this.rowData.reduce((sum, item) => {
      const cgst = Number(item.cgst_amount) || 0;
      const sgst = Number(item.sgst_amount) || 0;
      const igst = Number(item.igst_amount) || 0;
      return sum + cgst + sgst + igst;
    }, 0);
  }

  addNewForm(){
    this.route.navigate(['master/finance/transactions/add-purchase-journal']);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    if (this.rowData && this.rowData.length > 0) {
      this.gridApi.setRowData(this.rowData);
    }
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
}