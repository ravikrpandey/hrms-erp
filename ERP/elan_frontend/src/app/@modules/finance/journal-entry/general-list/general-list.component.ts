import { Component } from '@angular/core';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import 'ag-grid-enterprise';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { JournalActionComponent } from '../journal-action/journal-action.component';
import { ToastrService } from 'ngx-toastr';
import { ShortcutService } from 'src/app/@shared/services/shortcut.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-general-list',
  templateUrl: './general-list.component.html',
  styleUrls: ['./general-list.component.scss']
})
export class GeneralListComponent {
  errorMessage: any;
  products: any = [];
  id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  public gridOptions: any = { 
    rowSelection: 'multiple',
    enableRangeSelection: true,
    enableClipboard: true  
  };
  rowData: any;
  entity_id: any;
  assignAction: any;
  loginUser: any;
  publish: boolean = true;
  
  // Currency related properties
  currencySymbol: any = '₹';
  currencyCode: any = 'INR';
  currencyRate: any = 1;
  currencyData: any;
  
  // Initialize columnDefs as empty array
  public columnDefs: any[] = [];

  constructor(
    private _finaceService: FinaceService,
    public dialog: MatDialog,
    private location: Location,
    private toast: ToastrService,
    private shortcutService: ShortcutService,
    private route: Router,
    private _configurationalMasterService: ConfigurationalmasterService
  ) {
    this.rowClass = 'rowClass';
  }

  goBack() {
    this.location.back();
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem("selectedEntityId");
    let lg: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(lg);
    console.log(this.loginUser, "user login login user");

    // Subscribe to currency changes FIRST
    this._configurationalMasterService.currency$
      .subscribe((currency: any) => {
        this.currencyData = currency;
        this.currencyCode = currency.Currency_Type || 'INR';
        this.currencyRate = Number(currency.rate) || 1;
        this.currencySymbol = currency.symbols || '₹';
        
        // Update column definitions with new currency
        this.columnDefs = this.getColumnDefs();
        
        if (this.gridApi) {
          this.gridApi.setColumnDefs(this.columnDefs);
          this.gridApi.refreshCells();
        }
        
        // Refresh data to show new currency
        if (this.publish) {
          this.getJournalEntry();
        } else {
          this.getQuickEntry();
        }
      });

    // Initialize columns with default currency
    this.columnDefs = this.getColumnDefs();
    
    // Load initial data
    this._finaceService.getgeneralAccount('APPROVED', this.entity_id).subscribe({
      next: (res: any) => {
        this.rowData = res.data || [];
      },
      error: (err) => {
        this.rowData = [];
        this.toast.error('Something Went Wrong');
      }
    });

    this.shortcutService.registerShortcut('a', () => {
      this.route.navigate(["/master/finance/journal/journal-ledger/journal-entry"]);
    });
  }

  // Method to format currency for display
  formatCurrency(value: any): string {
    const numValue = Number(value || 0);
    if (isNaN(numValue)) return `${this.currencySymbol} 0.00`;
    const convertedValue = numValue * this.currencyRate;
    return `${this.currencySymbol} ${convertedValue.toFixed(2)}`;
  }

  // Method to get original INR value for payload
  getINRValue(value: any): number {
    const numValue = Number(value || 0);
    if (isNaN(numValue)) return 0;
    // Convert back to INR if currency rate is applied
    return this.currencyRate !== 0 ? numValue / this.currencyRate : numValue;
  }

  // Get column definitions with currency formatting
  getColumnDefs(): any[] {
    return [
      {
        headerName: 'S. no',
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
        headerName: 'Journal Number',
        field: 'journal_no',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        minWidth: 200,
        cellClass: 'grid-cell-centered',
        flex: 1,
      },
      {
        headerName: 'Entry Type',
        field: 'isReversal',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
        valueFormatter: (params: any) => {
          return params.data.isReversal == true ? 'Reversal' : 'Journal Entry';
        }
      },
      {
        headerName: 'Posting Date',
        field: 'posting_date',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: "grid-cell-centered",
        flex: 1,
        minWidth: 150,
        valueFormatter: (params: any) => {
          const date = new Date(params.value);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          return `${day}/${month}/${year}`;
        }
      },
      {
        headerName: `Total Debit (${this.currencyCode})`,
        field: 'total_of_debit',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        minWidth: 220,
        cellClass: 'grid-cell-centered',
        flex: 1,
        valueFormatter: (params: any) => {
          const amount = Number(params.value || 0) * this.currencyRate;
          return `${this.currencySymbol} ${amount.toFixed(2)}`;
        }
      },
      {
        headerName: `Total Credit (${this.currencyCode})`,
        field: 'total_of_credit',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        minWidth: 220,
        cellClass: 'grid-cell-centered',
        flex: 1,
        valueFormatter: (params: any) => {
          const amount = Number(params.value || 0) * this.currencyRate;
          return `${this.currencySymbol} ${amount.toFixed(2)}`;
        }
      },
      {
        headerName: 'Take Action',
        field: 'id',
        flex: 1,
        minWidth: 150,
        cellRenderer: JournalActionComponent,
        cellRendererParams: {
          className: 'mat-blue',
          hideRequestButton: true,
          hideDetailsButton: false,
          hideDownloadIcon: false,
          showCustomIcon: false,
        },
      },
    ];
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

  getJournalEntry() {
    this.publish = true;
    this.rowData = [];
    this._finaceService.getgeneralAccount('APPROVED', this.entity_id).subscribe({
      next: (res: any) => {
        this.rowData = res.data;
      },
      error: (err) => {
        this.toast.error('Error fetching journal entries');
      }
    });
  }

  getQuickEntry() {
    this.publish = false;
    this.rowData = [];
    this._finaceService.getgeneralAccount('PENDING', this.entity_id).subscribe({
      next: (res: any) => {
        this.rowData = res.data;
      },
      error: (err) => {
        this.toast.error('Error fetching quick entries');
      }
    });
  }

  onCellClicked(e: any) {
    // Handle cell click if needed
  }

  isShortcutVisible() {
    return this.shortcutService.isShortcutVisible();
  }
}