import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EntityMasterService } from 'src/app/@shared/services/entity-master/entity-master.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { CreditDebitNoteActionComponent } from '../credit-debit-note-action/credit-debit-note-action.component';

@Component({
  selector: 'app-credit-debit-list',
  templateUrl: './credit-debit-list.component.html',
  styleUrls: ['./credit-debit-list.component.scss']
})
export class CreditDebitListComponent {
rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  public gridOptions: any = { rowSelection: 'multiple', getRowHeight: this.getRowHeight.bind(this) };
  isDeleteButtonVisible: boolean = false;
  selectedRows: any[] = [];
  queryParamss: any;
  id: any;
  collegeids: any;
  collegeIdCopy: any;
  loginUser: any;
  assignAction: any;
  formattedShiftTime: string = '';
  currencySymbol: any = '₹';
  currencyCode: any = 'INR';
  currencyRate: any = 1;
  currencyData: any;
  columnDefs: any[] = [];
  getRowHeight(params: any) {
    // Adjust this logic as per your requirements
    return 40; // Example: return a fixed height like 50px
  }

  constructor(
    public dialog: MatDialog,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private toast: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private entityService: EntityMasterService,
    private _finaceService: FinaceService,
    private _configurationalmasterService: ConfigurationalmasterService
  ) {
    this.rowClass = 'rowClass';
  }
  ngOnInit(): void {
    this.assignAction = this._rbackService?.accessAssignAction();
    this.columnDefs = this.getColumnDefs();
  this.rowData=[]
   this.getAllCreditDebitBuilder()
    this.activeroute.queryParams.subscribe((params) => {
      this.id = params;
      this.collegeids = this.id.id;
    });
    this._configurationalmasterService.currency$
    .subscribe((currency: any) => {
  
      this.currencyData = currency;
      this.currencyCode = currency?.Currency_Type || 'INR';
      this.currencyRate = Number(currency?.rate) || 1;
      this.currencySymbol = currency?.symbols || '₹';
  
      this.columnDefs = this.getColumnDefs();
  
      if (this.gridApi) {
        this.gridApi.setColumnDefs(this.columnDefs);
        this.gridApi.refreshCells({ force: true });
      }
    });
    let a: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a);
    this.assignAction = this._rbackService.accessAssignAction();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.assignAction = this._rbackService.accessAssignAction();
    }, 0);
  }
  formatCurrency(amount: any): string {
    const value = Number(amount || 0);
  
    const convertedAmount = value * this.currencyRate;
  
    return `${this.currencySymbol} ${convertedAmount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  redirect() {
    this.route.navigate(['/master/finance/credit-debit-note/add-credit-debit-note'])
  }

historyData:any=[]
getColumnDefs() {
  return  [
    {
      headerName: 'S.No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 80,
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
      // minHeight: 150,

      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },
    {
      headerName: 'Party Name',
      field: 'company_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Party Type',
      field: 'party_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },

    // {
    //   headerName: 'Reference Invoice',
    //   field: 'reference_number',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    //   minWidth: 150,
    // },

    {
      headerName: 'Note Type',
      field: 'note_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Date',
      field: 'builder_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: `Amount (${this.currencyCode})`,
      field: 'amount',
      sortable: true,
      resizable: true,
      flex: 1,
      minWidth: 170,
      cellClass: 'grid-cell-centered',
      cellRenderer: (params: any) => this.formatCurrency(params.value)
    },
    {
      headerName: 'Action',
      field: 'quotation_doc_code',
      flex: 1,
      minWidth: 160,
      cellRenderer: CreditDebitNoteActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: true,
      },
      cellClass: 'action-column',
    },
  ];
}

  onSelectionChanged(event: any) {
    this.selectedRows = event.api.getSelectedRows();

    this.isDeleteButtonVisible = this.selectedRows.length > 0;
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.addEventListener('selectionChanged', this.onSelectionChanged.bind(this));

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

  onCellClicked() {

  }
  getAllCreditDebitBuilder() {
    try {
      let entity_id = localStorage.getItem('selectedEntityId')
      this._finaceService.getCreditNoteList(entity_id).subscribe((response: any) => {
        if (response) {
          this.rowData = response.data
        }
      }, (err: any) => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }

}
