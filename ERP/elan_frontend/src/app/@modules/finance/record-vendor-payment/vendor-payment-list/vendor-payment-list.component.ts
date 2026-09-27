import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EntityMasterService } from 'src/app/@shared/services/entity-master/entity-master.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-vendor-payment-list',
  templateUrl: './vendor-payment-list.component.html',
  styleUrls: ['./vendor-payment-list.component.scss']
})
export class VendorPaymentListComponent {
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
  ) {
    this.rowClass = 'rowClass';
  }
  ngOnInit(): void {
    this.assignAction = this._rbackService?.accessAssignAction();

   this.getAllVendorRecordPayment()
    this.activeroute.queryParams.subscribe((params) => {
      this.id = params;
      this.collegeids = this.id.id;
    });
    // this._configurationalMasterService.messageSubject.subscribe((id: any) => {
    //   this.collegeIdCopy = id;
    // });
    let a: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a);
    this.assignAction = this._rbackService.accessAssignAction();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.assignAction = this._rbackService.accessAssignAction();
    }, 0);
  }


  redirect() {
    this.route.navigate(['/master/finance/vendor-record-payment/create-vendor-payment'])
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
      minWidth: 80,
    },
    {
      headerName: 'Document Number',
      field: 'documentNo',
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
      headerName: 'Document Type',
      field: 'document_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    // {
    //   headerName: 'Invoice Number',
    //   field: 'invoiceNo',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    //   minWidth: 150,
    // },
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
      headerName: 'Beanch Name',
      field: 'branch_name',
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
      field: 'createdAt',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Total Amount',
      field: 'total_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        const amount = Number(params.value);
        if (!isNaN(amount)) {
          return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(amount);
        }
        return ' 0.00';
      }
    },
    
    
  ];

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

  getAllVendorRecordPayment() {
    try {
      let entity_id = localStorage.getItem('selectedEntityId')
      this._finaceService.getAllVendorRecordPayment(entity_id).subscribe((response: any) => {
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
