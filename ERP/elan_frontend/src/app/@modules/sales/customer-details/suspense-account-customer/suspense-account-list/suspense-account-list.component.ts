import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SalesService } from '../../../service/sales.service';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { SuspenceAccountActionComponent } from '../suspence-account-action/suspence-account-action.component';
@Component({
  selector: 'app-suspense-account-list',
  templateUrl: './suspense-account-list.component.html',
  styleUrls: ['./suspense-account-list.component.scss']
})
export class SuspenseAccountListComponent implements OnInit {
  customerList: any[] = [];
  selectedView: string = 'list';
  entity_id: any;
  loginUser: any;
  financial_year_id: any;
  private gridApi!: GridApi<any>;
  public columnDefs: ColDef[] = [
    {
      headerName: 'S.No.',
      valueGetter: 'node.rowIndex + 1',
      cellClass: 'grid-cell-centered',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex: 0.4,
      minWidth: 70,
    },
    {
      headerName: 'Customer Name',
      field: 'name',
      cellClass: 'grid-cell-centered',
      sortable: true,
      resizable: true,
      flex: 0.8,
      minWidth: 120,
      tooltipField: 'customer_code',
    },
    {
      headerName: 'Payment Mode',
      field: 'payment_mode',
      cellClass: 'grid-cell-centered',
      sortable: true,
      resizable: true,
      flex: 1.2,
      minWidth: 180,
      tooltipField: 'company_name',
    },
    // {
    //   headerName: 'GST Number',
    //   field: 'gst_in',
    //   cellClass: 'grid-cell-centered',
    //   sortable: true,
    //   resizable: true,
    //   flex: 1,
    //   minWidth: 160,
    //   tooltipField: 'gst_in',
    //   valueFormatter: (params: any) =>
    //     params.value ? String(params.value).toUpperCase() : '',
    // },
    // {
    //   headerName: 'Employee Name (Created By)',
    //   field: 'HRMS_REGISTERED_USER',
    //   cellClass: 'grid-cell-centered',
    //   sortable: true,
    //   resizable: true,
    //   flex: 1.2,
    //   minWidth: 180,
    //   valueFormatter: (params: any) =>
    //     `${params.value?.first_name || ''} ${params.value?.last_name || ''}`,
    // },
    {
      headerName: 'Amount',
      field: 'advance_amount',
      cellClass: 'grid-cell-centered',
      sortable: true,
      resizable: true,
      flex: 0.8,
      minWidth: 120,
      tooltipField: 'Amount',
     
    },
    {
      headerName: 'Action',
      field: 'states_name',
      cellRenderer: SuspenceAccountActionComponent,
      cellClass: 'grid-cell-centered',
      flex: 0.8,
      minWidth: 150,
      pinned: 'right', 
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
    },
  ];

  constructor(
    private _salesServices: SalesService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    let a: any = localStorage.getItem('signInUser');
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    this.loginUser = JSON.parse(a);
    this.suspenseCustomerAccountList();
  }

  suspenseCustomerAccountList(): void {
    this._salesServices.suspenseCustomerAccountList(this.entity_id).subscribe({
      next: (res: any) => {
        if (res?.data) {
          this.customerList = res.data;
        } else {
          this.customerList = [];
          this.toastr.warning('No records found.');
        }
      },
      error: (error: any) => {
        console.error('API Error:', error);
        this.customerList = [];
        this.toastr.error(
          error?.error?.message || 'Something went wrong. Please try again.'
        );
      },
      complete: () => {
        console.log('API call completed');
      }
    });
  }

  

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
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

