import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, ColDef, GridReadyEvent } from 'ag-grid-community';
import * as moment from 'moment';
import { ModuleAction } from 'src/app/@shared/interface/core.interface';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { ToastrService } from 'ngx-toastr';
import { NegotiationActionComponent } from './negotiation-action/negotiation-action.component';

@Component({
  selector: 'app-negotiation',
  templateUrl: './negotiation.component.html',
  styleUrls: ['./negotiation.component.scss'],
})
export class NegotiationComponent {
  public tab: string;
  selectedIndex = 0;
  subheading: string = 'Initiate Negotiate List';
  rowClass: any;
  private gridApi!: GridApi<any>;
  assignAction: ModuleAction;
  filteredData: any[] = [];

  showList: boolean = false;
  public rowData: any = [];
  public columnDefs: ColDef[] = [];

  public initiateColDef: ColDef[] = [
    {
      headerName: 'S. No.',
      valueGetter: 'node.rowIndex + 1',
      cellClass: 'grid-cell-centered',
      maxWidth: 80,
      minWidth: 80,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'PR No.',
      field: 'pr_number',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'RFP No.',
      field: 'rfp_number',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Negotiate No.',
      field: 'purchase_request_id',
      cellClass: 'grid-cell-centered',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      valueFormatter: (params: any) => 'Nego-' + params.value,
      flex: 1,
      minWidth: 120,
    },
    {
      headerName: 'Department',
      field: 'department_name',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 120,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Create Date',
      field: 'createdAt',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 120,
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
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 110,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Budget Type',
      field: 'pr_type',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Status',
      field: 'rfp_status',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 120,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Actions',
      pinned: 'right',
      cellRenderer: NegotiationActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
      cellClass: 'grid-cell-centered',
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
      valueGetter: 'node.rowIndex + 1',
      cellClass: 'grid-cell-centered',
      maxWidth: 100,
      minWidth: 80,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Negotiate Code',
      field: 'negotiation_code',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      valueFormatter: function (params: any) {
        return params.value;
      },
    },
    {
      headerName: 'Department',
      field: 'department_name',
      cellClass: 'grid-cell-centered',
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
      cellClass: 'grid-cell-centered',
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
      cellClass: 'grid-cell-centered',
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
      field: 'end_date_nego',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      valueFormatter: (params: any) => {
        return moment(new Date(params.value)).format('DD-MM-YYYY');
      },
    },
    {
      headerName: 'Negotiate Status',
      field: 'nego_status_pvn',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Indent Type',
      field: 'pr_category',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 110,
    },
    {
      headerName: 'Actions',
      pinned: 'right',
      cellRenderer: NegotiationActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
      cellClass: 'grid-cell-centered',
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
      valueGetter: 'node.rowIndex + 1',
      cellClass: 'grid-cell-centered',
      maxWidth: 100,
      minWidth: 80,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Negotiate Code',
      field: 'negotiation_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Department',
      field: 'department_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'End Date',
      field: 'end_date_nego',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      valueFormatter: (params: any) => {
        return params.value !== null
          ? moment(new Date(params.value)).format('LL')
          : 'N/A';
      },
    },
    {
      headerName: 'Indent Type',
      field: 'pr_category',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 110,
    },
    {
      headerName: 'Status',
      field: 'nego_status_pvn',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Actions',
      pinned: 'right',
      cellRenderer: NegotiationActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
      cellClass: 'grid-cell-centered',
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
      valueGetter: 'node.rowIndex + 1',
      cellClass: 'grid-cell-centered',
      maxWidth: 100,
      minWidth: 80,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Negotiate Code',
      field: 'negotiation_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      valueFormatter: function (params: any) {
        return params.value;
      },
    },
    {
      headerName: 'Department',
      field: 'department_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'End Date',
      field: 'end_date_nego',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      valueFormatter: (params: any) => {
        return params.value !== null
          ? moment(new Date(params.value)).format('LL')
          : 'N/A';
      },
    },

    {
      headerName: 'Indent Type',
      field: 'pr_category',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Status',
      field: 'nego_status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private accessCtrl: AccessControlService,
    private _rbackService: RbacMasterService,
    private prService: PurchaseRequestService,
    private toast: ToastrService,
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
        this.tab = 'initiate-negotiation';
        this.selectedIndex = 0;
        this.router.navigate(['master/purchase-management/negotiation'], {
          queryParams: { tab: 'initiate-negotiation' },
        });
      }
      if (this.tab == 'initiate-negotiation') {
        this.selectedIndex = 0;
        this.columnDefs = this.initiateColDef;
        this.subheading = 'Initiate Negotiate List';
        this.showList = true;
        this.getAllInitiateList();
      } else if (this.tab == 'live-negotiation') {
        this.selectedIndex = 1;
        this.columnDefs = this.liveColDef;
        this.subheading = 'Live Negotiation List';
        this.showList = true;
        this.getAllLiveNego();
      } else if (this.tab == 'close-negotiation') {
        this.selectedIndex = 2;
        this.columnDefs = this.closeColDef;
        this.subheading = 'Close Negotiation List';
        this.showList = true;
        this.getAllCloseNego();
      } else if (this.tab == 'all-negotiation') {
        this.selectedIndex = 3;
        this.columnDefs = this.allColDef;
        this.subheading = 'All Negotiation List';
        this.showList = true;
        this.getALLNegotiation();
      }
    });
  }

  getAllInitiateList() {
    const data = {
      entity_id: this.accessCtrl.getEntityId(),
      financial_year_id: this.accessCtrl.getFinancialId(),
    };

    this.prService.getAllInitiate(data).subscribe(
      (res: any) => {
        this.rowData = res.data;
        this.filteredData = this.rowData;
      },
      (err: any) => {
        if (err.error?.code == 404) {
          //this.toast.error("Record Not Found")
          this.rowData = [];
        }
      },
    );
  }

  getAllLiveNego() {
    const data = {
      entity_id: this.accessCtrl.getEntityId(),
      financial_year_id: this.accessCtrl.getFinancialId(),
    };

    this.prService.getAllLiveNego(data).subscribe(
      (res: any) => {
        this.rowData = res.data;
        this.filteredData = this.rowData;
      },
      (err: any) => {
        if (err.error?.code == 404) {
          //this.toast.error("Record Not Found")
          this.rowData = [];
        }
      },
    );
  }

  getAllCloseNego() {
    const data = {
      entity_id: this.accessCtrl.getEntityId(),
      financial_year_id: this.accessCtrl.getFinancialId(),
    };

    this.prService.getAllCloseNego(data).subscribe(
      (res: any) => {
        this.rowData = res.data;
        this.filteredData = this.rowData;
      },
      (err: any) => {
        if (err.error?.code == 404) {
          //this.toast.error("Record Not Found")
          this.rowData = [];
        }
      },
    );
  }

  getALLNegotiation() {
    const data = {
      entity_id: this.accessCtrl.getEntityId(),
      financial_year_id: this.accessCtrl.getFinancialId(),
    };

    this.prService.getALLNegotiation(data).subscribe(
      (res: any) => {
        this.rowData = res.data;
        this.filteredData = this.rowData;
      },
      (err: any) => {
        if (err.error?.code == 404) {
          //this.toast.error("Record Not Found")
          this.rowData = [];
        }
      },
    );
  }

  onTabChange(event: MatTabChangeEvent) {
    const tabs = [
      'initiate-negotiation',
      'live-negotiation',
      'close-negotiation',
      'all-negotiation',
    ];
    this.router.navigate(['master/purchase-management/negotiation'], {
      queryParams: { tab: tabs[event.index] },
      queryParamsHandling: 'merge',
    });
  }

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

  onFilterByDepartment(event: any) {
    if (event == null || undefined) {
      this.filteredData = this.rowData;
    } else {
      this.filteredData = this.rowData.filter(
        (res: any) => res.department_name == event,
      );
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}
