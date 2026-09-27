import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { SalesService } from '../service/sales.service';
import { CustomerActionComponent } from './customer-action/customer-action.component';
import { CommonService } from 'src/app/@shared/services/common.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any = [];
  entity_id: any;
  loginUser: any;
  financial_year_id: any;
  selectedView: string = 'list';

  constructor(
    private salesService: SalesService,
    public dialog: MatDialog,
    private _commonService: CommonService
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.localStorage();
    this.getAllCustomerList('Approve');
  }

  localStorage() {
    let a: any = localStorage.getItem('signInUser');
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    this.loginUser = JSON.parse(a);
  }

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
      headerName: 'Company Code',
      field: 'customer_code',
      cellClass: 'grid-cell-centered',
      sortable: true,
      resizable: true,
      flex: 0.8,
      minWidth: 120,
      tooltipField: 'customer_code',
    },
    {
      headerName: 'Company Name',
      field: 'company_name',
      cellClass: 'grid-cell-centered',
      sortable: true,
      resizable: true,
      flex: 1.2,
      minWidth: 180,
      tooltipField: 'company_name',
    },
    {
      headerName: 'GST Number',
      field: 'gst_in',
      cellClass: 'grid-cell-centered',
      sortable: true,
      resizable: true,
      flex: 1,
      minWidth: 160,
      tooltipField: 'gst_in',
      valueFormatter: (params: any) =>
        params.value ? String(params.value).toUpperCase() : '',
    },
    {
      headerName: 'Employee Name (Created By)',
      field: 'HRMS_REGISTERED_USER',
      cellClass: 'grid-cell-centered',
      sortable: true,
      resizable: true,
      flex: 1.2,
      minWidth: 180,
      valueFormatter: (params: any) =>
        `${params.value?.first_name || ''} ${params.value?.last_name || ''}`,
    },
    {
      headerName: 'Status',
      field: 'customer_status',
      cellClass: 'grid-cell-centered',
      sortable: true,
      resizable: true,
      flex: 0.8,
      minWidth: 120,
      tooltipField: 'customer_status',
      cellRenderer: (params: any) => {
        if (!params.value) return '';
        let color = '#6c757d'; // default gray
        if (params.value.toLowerCase().includes('active')) color = 'green';
        else if (params.value.toLowerCase().includes('inactive')) color = 'red';
        else if (params.value.toLowerCase().includes('pending'))
          color = 'orange';

        return `<span style="
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            color: white;
            background-color: ${color};
          ">${params.value}</span>`;
      },
    },
    {
      headerName: 'Action',
      field: 'states_name',
      cellRenderer: CustomerActionComponent,
      cellClass: 'grid-cell-centered',
      flex: 0.8,
      minWidth: 150,
      pinned: 'right', // ✅ keep action visible while scrolling
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
    },
  ];

  formatDate(dateString: any) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
    return `${day}/${month}/${year}`;
  }

  customerList: any = [];

  getAllCustomerList(status: string) {
    let data = {
      entity_id: this.entity_id,
      financial_year_id: this.financial_year_id,
      employee_id: this.loginUser?.employee_id,
      userRole: this.loginUser?.role,
      status: status,
    };
    this.customerList = [];
    this.salesService.getAllCustomersList(data).subscribe((res: any) => {
      if (res) {
        this.customerList = res.data;
        for(let i of this.customerList){
          i['gst_in']= i.CUSTOMER_ADDRESS_MSTs[0]?.gst_in || null
        }
      }
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onPageSizeChanged(value: any) {
    // Get the value from the input field with id 'page-size'
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onFilterTextBoxChanged(event: any) {
    const value = event.target.value.trim().toLowerCase();
    this.gridApi.setQuickFilter(value);
  }

  downloadCSV() {
    const updatedList = this.customerList.map((data: any) => {
      return {
        id: data.id,
        company_name: data.company_name,
        customer_code: data.customer_code,
        gst_in: data.gst_in,
        // customer_status: data.customer_status,
        // status: data.status,
        // data_status: data.data_status,
      };
    });
    this._commonService?.downloadCSV(updatedList, 'Approved_Costomer_List');
  }
}
