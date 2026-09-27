import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ModuleAction } from 'src/app/@shared/interface/core.interface';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { RfpListActionComponent } from './rfp-list-action/rfp-list-action.component';
import { PrRfpStatusDialogComponent } from '../dialog/pr-rfp-status-dialog/pr-rfp-status-dialog.component';
import * as moment from 'moment';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-rfp',
  templateUrl: './rfp.component.html',
  styleUrls: ['./rfp.component.scss']
})
export class RfpComponent {
  private tab: string;
  selectedIndex = 0;

  quickFilter: string;
  departments: any[] = [];
  rowClass: any;
  private gridApi!: GridApi<any>;
  depData: any;
  catData: any;
  assignAction: ModuleAction;
  filteredData: any[] = [];
  userDetails: any;

  showList: boolean = false;
  public rowData: any = [];
  public columnDefs: ColDef[] = [];

  public initiateColDef: ColDef[] = [
    {
      headerName: 'S. No.',
      valueGetter: "node.rowIndex + 1",
      cellClass: "grid-cell-centered",
      maxWidth: 100,
      minWidth: 80,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'PR No.',
      field: 'pr_number',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Department',
      field: 'MASTER_DEPARTMENT.department_name',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 180,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Create Date',
      field: 'createdAt',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 160,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      valueFormatter: (params: any) => {
        return moment(new Date(params.value)).format('DD-MM-YYYY');
      },
    },
    {
      headerName: 'Indent Type',
      field: 'pr_category',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Budget Type',
      field: 'pr_type',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 120,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Actions',
      cellRenderer: RfpListActionComponent,
      pinned: 'right',
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 180,
      sortable: false,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
  ];

  public liveColDef: ColDef[] = [
    {
      headerName: 'S. No.',
      valueGetter: "node.rowIndex + 1",
      cellClass: "grid-cell-centered",
      maxWidth: 100,
      minWidth: 80,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'PR No.',
      field: 'pr_number',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'RFP No.',
      field: 'rfp_number',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Department',
      field: 'department_name',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 120,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Vendor Invited',
      field: 'vendors_invited_count',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      valueFormatter: (params: any) => params.value || 0,
    },
    {
      headerName: 'Vendor Responded',
      field: 'vendors_responded_count',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      valueFormatter: (params: any) => params.value || 0,
    },
    {
      headerName: 'End Date',
      field: 'end_date',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      valueFormatter: (params: any) => moment(new Date(params.value)).format('DD-MM-YYYY'),
    },
    {
      headerName: 'RFP Status',
      field: 'rfp_status',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Indent Type',
      field: 'pr_category',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 110,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Actions',
      cellRenderer: RfpListActionComponent,
      pinned: 'right',
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 180,
      sortable: false,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
  ];


  public closeColDef: ColDef[] = [
    {
      headerName: 'S. No.',
      valueGetter: "node.rowIndex + 1",
      cellClass: "grid-cell-centered",
      maxWidth: 100,
      minWidth: 80,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'PR No.',
      field: 'pr_number',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'RFP No.',
      field: 'rfp_number',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Department',
      field: 'department_name',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 180,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'End Date',
      field: 'end_date',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      valueFormatter: (params: any) => moment(new Date(params.value)).format('DD-MM-YYYY'),
    },
    {
      headerName: 'Indent Type',
      field: 'pr_category',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Status',
      field: 'rfp_status',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Actions',
      cellRenderer: RfpListActionComponent,
      pinned: 'right',
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 180,
      sortable: false,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
  ];


  public allColDef: ColDef[] = [
    {
      headerName: 'S. No.',
      valueGetter: "node.rowIndex + 1",
      cellClass: "grid-cell-centered",
      maxWidth: 100,
      minWidth: 80,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'PR No.',
      field: 'pr_number',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'RFP No.',
      field: 'rfp_number',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Department',
      field: 'department_name',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 180,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Vendor Invited',
      field: 'vendors_invited_count',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Vendor Responded',
      field: 'vendors_responded_count',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      valueFormatter: (params: any) => params.value || 0,
    },
    {
      headerName: 'End Date',
      field: 'end_date',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      valueFormatter: (params: any) => moment(new Date(params.value)).format('DD-MM-YYYY'),
    },
    {
      headerName: 'RFP Status',
      field: 'rfp_status',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Indent Type',
      field: 'pr_category',
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private accessCtrl: AccessControlService,
    private prService: PurchaseRequestService,
    private _rbackService: RbacMasterService,
  ) {
    this.assignAction = this._rbackService.accessAssignAction();

    this.route.queryParams.subscribe((params: any) => {
      this.showList = false;
      this.tab = params['tab'];
      this.rowData = [];
      this.filteredData = [];
      if (!this.tab) {
        this.columnDefs = this.initiateColDef;
        this.showList = true;
        this.tab = 'initiate-rfp';
        this.selectedIndex = 0;
        this.router.navigate(['master/purchase-management/rfp'], { queryParams: { tab: 'initiate-rfp' } })
      }
      if (this.tab == 'initiate-rfp') {
        this.columnDefs = this.initiateColDef;
        this.selectedIndex = 0;
        this.showList = true;
        this.getInitiateRfp();
      } else if (this.tab == 'live-rfp') {
        this.columnDefs = this.liveColDef;
        this.selectedIndex = 1;
        this.showList = true;
        this.getLiveRfp();
      }
      else if (this.tab == 'close-rfp') {
        this.columnDefs = this.closeColDef;
        this.selectedIndex = 2;
        this.showList = true;
        this.getCloseRfp();
      } else if (this.tab === 'all-rfp-list') {
        this.columnDefs = this.allColDef;
        this.selectedIndex = 3;
        this.showList = true;
        this.getAllRfpList();
      }
    })
  }

  getInitiateRfp() {
    this.prService.getInitiateRfp(this.accessCtrl.getEmployeeId(), this.accessCtrl.getEntityId(), this.accessCtrl.getFinancialId()).subscribe((res: any) => {
      this.rowData = res.data;
      this.filteredData = this.rowData;
    })
  }

  getLiveRfp() {
    let data = {
      user_id: this.accessCtrl.getEmployeeId(),
      entity_id: this.accessCtrl.getEntityId(),
      user_role: this.accessCtrl.getRoleId(),
      financial_year_id: this.accessCtrl.getFinancialId()
    }
    this.prService.getAllLiveRfp(data).subscribe((res: any) => {
      if (res && res.data) {
        this.rowData = res.data;
        this.filteredData = this.rowData;
      }
    }, (err: any) => {
      this.rowData = []
    })
  }

  getCloseRfp() {
    let data = {
      user_id: this.accessCtrl.getEmployeeId(),
      entity_id: this.accessCtrl.getEntityId(),
      user_role: this.accessCtrl.getRoleId(),
      financial_year_id: this.accessCtrl.getFinancialId()
    }
    this.prService.getAllCloseRfp(data).subscribe((res: any) => {
      if (res && res.data) {
        this.rowData = res.data;
        this.filteredData = this.rowData;
      }
    }, (err: any) => {
      this.rowData = []
    })
  }

  getAllRfpList() {
    let data = {
      entity_id: this.accessCtrl.getEntityId(),
      financial_year_id: this.accessCtrl.getFinancialId()
    }
    this.prService.getAllRfpList(data).subscribe((res: any) => {
      if (res && res.data) {
        this.rowData = res.data;
        this.filteredData = this.rowData;
      }
    }, (err: any) => {
      this.rowData = []
    })
  }

  onTabChange(event: MatTabChangeEvent) {
    const tabs = ['initiate-rfp', 'live-rfp', 'close-rfp', 'all-rfp-list'];
    this.router.navigate(['master/purchase-management/rfp'], {
      queryParams: { tab: tabs[event.index] },
      queryParamsHandling: 'merge'
    });
  }

  changeTab(tab: string) {
    this.router.navigate(['master/purchase-management/rfp'], { queryParams: { tab: tab } })
  }

  navigate() {
    this.router.navigate(['master/purchase-management/rfp/create-rfp'])
  }

  statusCellClicked(e: any) {
    if (this.assignAction.Write) {
      const dialogRef = this.dialog.open(PrRfpStatusDialogComponent, { width: '500px', data: e.data });
      dialogRef.afterClosed().subscribe(result => {
      })
    }
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

  onFilterByDepartment(event: any) {
    if (event == null || undefined) {
      this.filteredData = this.rowData;
    } else {
      this.filteredData = this.rowData.filter((res: any) => res.department_name == event);
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}