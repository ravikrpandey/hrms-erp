import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
} from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { AssetListService } from 'src/app/@shared/services/asset-list.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ActionMaintenanceComponent } from '../action-maintenance/action-maintenance.component';

@Component({
  selector: 'app-maintenance-list',
  templateUrl: './maintenance-list.component.html',
  styleUrls: ['./maintenance-list.component.scss'],
})
export class MaintenanceListComponent {
  errorMessage: any;
  id: any;
  rowClass: any;
  fid: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  entity_id: any;
  filter_fy: any;
  //databaseKey: any = environment.servralUrl;
  emp_id: any;
  assignAction: any;
  constructor(
    private readonly _configurationalMasterService: ConfigurationalmasterService,
    private _commonService: CommonService,
    public dialog: MatDialog,
    private route: Router,
    private activetRoute: ActivatedRoute,
    private toaster: ToastrService,
    private router: Router,
    private asset_service: AssetListService,
    private _rbackService: RbacMasterService,
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
    let lg: any = localStorage.getItem('signInUser');
    let loginUser = JSON.parse(lg);
    this.emp_id = loginUser?.employee_id;
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.filter_fy = localStorage.getItem('financial_id');
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
    });
    if (this.entity_id) {
      this.getAllMaintenanceList();
    }
  }

  public columnDefs = [
    {
      headerName: 'S No.',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Asset No',
      field: 'asset_tagIds',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      //editable: true,
      minWidth: 150,
      valueGetter: (params: any) => {
        return Array.isArray(params.data.asset_tagIds)
          ? params.data.asset_tagIds.join(', ')
          : '';
      },
    },
    {
      headerName: 'Maintenance BY',
      field: 'maintenanceBy',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      //editable: true,
      minWidth: 150,
    },
    {
      headerName: 'Repair Detail',
      field: 'repairDetails',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      //editable: true,
      minWidth: 150,
    },
    {
      headerName: 'Scheduled Date',
      field: 'scheduledDate',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      //editable: true,
      minWidth: 150,
      valueFormatter: (params: any) => this.formatDate(params.value),
    },

    {
      headerName: 'Completion Date',
      field: 'completionDate',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      //editable: true,
      minWidth: 150,
      valueFormatter: (params: any) => this.formatDate(params.value),
    },
    {
      headerName: 'Amount',
      field: 'amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      //editable: true,
      minWidth: 150,
    },
    {
      headerName: 'Status',
      field: 'maintenanceStatus',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      //editable: true,
      minWidth: 150,
    },

    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: ActionMaintenanceComponent,
      cellRendererParams: (params: any) => {
        return {
          className: 'mat-blue',
          hideRequestButton: true,
          hideDetailsButton: false,
          hideDownloadIcon: false,
          showCustomIcon: false,
        };
      },
    },
  ];

  formatDate(dateValue: any): string {
    if (dateValue) {
      const date = new Date(dateValue);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
    return '';
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onCellClicked(e: any) {}

  agInit(params: ICellRendererParams): void {}

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value,
    );
  }

  getAllMaintenanceList() {
    this.asset_service.getAllMaintenanceList(this.entity_id).subscribe(
      (res: any) => {
        if (res.data) {
          this.rowData = res.data;
        }
      },
      (err: any) => {
        this.rowData = [];
      },
    );
  }
}
