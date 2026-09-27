import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GridApi, GridReadyEvent, CellValueChangedEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';
import { TransportRequestActionComponent } from './transport-request-action/transport-request-action.component';

@Component({
  selector: 'app-transport-request',
  templateUrl: './transport-request.component.html',
  styleUrls: ['./transport-request.component.scss']
})
export class TransportRequestComponent {
  rowClass: any = 'rowClass';
  private gridApi!: GridApi<any>;

  allData: any[] = []; // Full data
  rowData: any[] = []; // Filtered data for grid

  selectedTab: string = 'my';

  assignAction: any;
  entity_id: string | null;
  financial_year_id: string | null;
  loginUser: any;

  public gridOptions: any = { rowSelection: 'multiple', rowHeight: 55 };

  constructor(
    private route: Router,
    private _rbackService: RbacMasterService,
    private toaster: ToastrService,
    private transport_service: TransportManagementService
  ) {}

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    this.loginUser = JSON.parse(localStorage.getItem('signInUser') || '{}');

    this.getAllRequests();
  }

  getAllRequests() {
    this.transport_service.getAll_vehicleMaster(
      this.entity_id
    ).subscribe((res: any) => {
      if (res?.data) {
        this.allData = res.data;
        this.filterGridData(this.selectedTab); // Initially "My Request"
      }
    }, () => {
      this.toaster.error('Error fetching transport data');
    });
  }

  filterGridData(tab: string) {
    this.selectedTab = tab;

    switch (tab) {
      case 'my':
        this.rowData = this.allData.filter(x => x.status === 'MyRequest');
        break;
      case 'pending':
        this.rowData = this.allData.filter(x => x.status === 'Pending');
        break;
      case 'approved':
        this.rowData = this.allData.filter(x => x.status === 'Approved');
        break;
      case 'rejected':
        this.rowData = this.allData.filter(x => x.status === 'Rejected');
        break;
      default:
        this.rowData = [];
    }

    if (this.gridApi) {
      this.gridApi.paginationGoToFirstPage();
    }
  }

  public columnDefs = [
    {
      headerName: 'S.NO',
      valueGetter: "node.rowIndex + 1",
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Request ID',
      field: 'request_id',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'From Location',
      field: 'from_location',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'To Location',
      field: 'to_location',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Priority Type',
      field: 'priority',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Vehicle Type',
      field: 'vehicle_type',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Status Type',
      field: 'status',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: TransportRequestActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
    },
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement).value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter((document.getElementById('filter-text-box') as HTMLInputElement).value);
  }

  openDialog() {
    this.route.navigate(['master/transport-management/transport-request/add-new-request']);
  }
}
