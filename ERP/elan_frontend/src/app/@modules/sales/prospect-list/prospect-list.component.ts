import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SalesService } from '../service/sales.service';
import { CustomerActionComponent } from '../customer-list/customer-action/customer-action.component';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { CommonService } from 'src/app/@shared/services/common.service';

@Component({
  selector: 'app-prospect-list',
  templateUrl: './prospect-list.component.html',
  styleUrls: ['./prospect-list.component.scss'],
})
export class ProspectListComponent implements OnInit {
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

  constructor(
    private salesService: SalesService,
    private toastr: ToastrService,
    private _commonService: CommonService
  ) {}

  ngOnInit(): void {
    let a: any = localStorage.getItem('signInUser');
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    this.loginUser = JSON.parse(a);
    this.getAllProspectList();
  }

  getAllProspectList() {
    let data = {
      entity_id: this.entity_id,
      financial_year_id: this.financial_year_id,
      employee_id: this.loginUser?.employee_id,
      userRole: this.loginUser?.role,
      status: 'Pending',
    };
    this.salesService.getAllCustomersList(data).subscribe((res: any) => {
      if (res && res.data) {
        this.customerList = res.data;
        for(let i of this.customerList){
          i['gst_in']= i.CUSTOMER_ADDRESS_MSTs[0]?.gst_in || null
        }
      } else {
        this.customerList = [];
      }
    });
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
    this._commonService?.downloadCSV(updatedList, 'Prospect_Customer_List');
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
