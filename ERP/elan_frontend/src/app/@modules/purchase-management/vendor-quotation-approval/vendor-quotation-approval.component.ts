import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, ColDef, GridReadyEvent } from 'ag-grid-community';
import { ModuleAction } from 'src/app/@shared/interface/core.interface';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { VendorQuotationApprovalDialogComponent } from '../dialog/vendor-quotation-approval-dialog/vendor-quotation-approval-dialog.component';
import { VendorQuotationActionComponent } from './vendor-quotation-action/vendor-quotation-action.component';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-vendor-quotation-approval',
  templateUrl: './vendor-quotation-approval.component.html',
  styleUrls: ['./vendor-quotation-approval.component.scss'],
})
export class VendorQuotationApprovalComponent {
  private tab: string;
  selectedIndex = 0;

  quickFilter: string;
  rowClass: any;
  private gridApi!: GridApi<any>;
  assignAction: ModuleAction;
  filteredData: any[] = [];

  showList: boolean = false;
  public rowData: any = [];
  public columnDefs: ColDef[] = [];

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
        this.columnDefs = this.myRequestColDef;
        this.showList = true;
        this.tab = 'pending-approval';
        this.router.navigate(['master/purchase-management/vendor-quotation'], {
          queryParams: { tab: this.tab },
        });
      }
      if (this.tab == 'my-request') {
        this.columnDefs = this.myRequestColDef;
        this.selectedIndex = 3;
        this.showList = true;
        this.getMyRequestApprovel();
      } else if (this.tab == 'pending-approval') {
        this.columnDefs = this.pendingApprovalColDef;
        this.selectedIndex = 0;
        this.showList = true;
        this.getPendingApproval();
      } else if (this.tab == 'approved-cost') {
        this.columnDefs = this.pendingApprovalColDef;
        this.selectedIndex = 1;
        this.showList = true;
        this.getAllApprovedApprover();
      } else if (this.tab === 'rejected') {
        this.columnDefs = this.pendingApprovalColDef;
        this.selectedIndex = 2;
        this.showList = true;
        this.getAllRejectedApprover();
      }
    });
  }

  getMyRequestApprovel() {
    let data = {
      entity_id: this.accessCtrl.getEntityId(),
      financial_year_id: this.accessCtrl.getFinancialId(),
      user_role: this.accessCtrl.getRoleId(),
      login_employe_id: this.accessCtrl.getEmployeeId(),
    };
    this.prService
      .getMyRequestApprovel(this.accessCtrl.getEmployeeId(), data)
      .subscribe(
        (res: any) => {
          res.data.forEach((item: any, i: number) => {
            for (let j = i + 1; j < res.data.length; j++) {
              const element = res.data[j];
              if (
                element.nego_approval_id &&
                item.nego_approval_id === element.nego_approval_id &&
                !element.renego
              ) {
                element.renego = true;
              }
            }
          });

          res.data.map((item: any) => {
            let x = null;
            if (item.nego_approval_id) {
              x = item.final_approval_status_NGO;
            } else {
              x = item.final_approval_status_RFP;
            }
            if (item.approval_for == 'ReNegotiation') {
              x = item.final_approval_status_RE_NGO;
            }
          });
          this.rowData = res.data;
          this.filteredData = this.rowData;
        },
        (err: any) => {},
      );
  }

  getPendingApproval() {
    let data = {
      user_id: this.accessCtrl.getEmployeeId(),
      entity_id: this.accessCtrl.getEntityId(),
      user_role: this.accessCtrl.getRoleId(),
      financial_year_id: this.accessCtrl.getFinancialId(),
    };
    this.prService
      .getApproverSendData(this.accessCtrl.getEmployeeId(), data)
      .subscribe(
        (res: any) => {
          if (res && res.data) {
            this.rowData = res.data;
            this.filteredData = this.rowData;
          }
        },
        (err: any) => {
          this.rowData = [];
        },
      );
  }

  getAllApprovedApprover() {
    let data = {
      user_id: this.accessCtrl.getEmployeeId(),
      entity_id: this.accessCtrl.getEntityId(),
      user_role: this.accessCtrl.getRoleId(),
      financial_year_id: this.accessCtrl.getFinancialId(),
    };
    this.prService
      .getAllApprovedApprover(this.accessCtrl.getEmployeeId(), data)
      .subscribe(
        (res: any) => {
          if (res && res.data) {
            this.rowData = res.data;
            this.filteredData = this.rowData;
          }
        },
        (err: any) => {
          this.rowData = [];
        },
      );
  }

  getAllRejectedApprover() {
    let data = {
      user_id: this.accessCtrl.getEmployeeId(),
      entity_id: this.accessCtrl.getEntityId(),
      user_role: this.accessCtrl.getRoleId(),
      financial_year_id: this.accessCtrl.getFinancialId(),
    };
    this.prService
      .getAllRejectedApprover(this.accessCtrl.getEmployeeId(), data)
      .subscribe(
        (res: any) => {
          if (res && res.data) {
            this.rowData = res.data;
            this.filteredData = this.rowData;
          }
        },
        (err: any) => {
          this.rowData = [];
        },
      );
  }

  onTabChange(event: MatTabChangeEvent) {
    const tabs = [
      'pending-approval',
      'approved-cost',
      'rejected',
      'my-request',
    ];
    this.router.navigate(['master/purchase-management/vendor-quotation'], {
      queryParams: { tab: tabs[event.index] },
      queryParamsHandling: 'merge',
    });
  }

  statusCellClicked(e: any) {
    if (this.assignAction.Write) {
      const dialogRef = this.dialog.open(
        VendorQuotationApprovalDialogComponent,
        { width: '500px', data: e.data },
      );
      dialogRef.afterClosed().subscribe((result) => {});
    }
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

  public myRequestColDef: ColDef[] = [
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
      minWidth: 120,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Quotation Code',
      field: 'quotation_code',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
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
      headerName: 'Quotation For',
      field: 'approval_for',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 120,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Start Date',
      field: 'start_date',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 120,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'End Date',
      field: 'end_date',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 120,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Status',
      field: 'approval_status',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 130,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellRenderer: (params: any) => {
        const status = params.value;
        const approval_for = params.data.approval_for;
        const approval_status = params.data.approval_status;
        if (approval_for === 'RFP') {
          if (status === 'APPROVED') {
            return '<span style="color: green;">APPROVED</span>';
          } else if (status === 'REJECTED') {
            return '<span style="color: red;">REJECTED</span>';
          } else {
            return status;
          }
        } else if (
          approval_for === 'Negotiation' ||
          approval_for === 'ReNegotiation'
        ) {
          if (approval_status === 'APPROVED') {
            return '<span style="color: green;">APPROVED</span>';
          } else if (approval_status === 'REJECTED') {
            return '<span style="color: red;">REJECTED</span>';
          } else {
            return status;
          }
        }
      },
    },
  ];

  public pendingApprovalColDef: ColDef[] = [
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
      headerName: 'Quotation Code',
      field: 'quotation_code',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
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
      headerName: 'Quotation For',
      field: 'approval_for',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 120,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Start Date',
      field: 'start_date',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 120,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'End Date',
      field: 'end_date',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 120,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      headerName: 'Status',
      field: 'approval_status',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 120,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellRenderer: (params: any) => {
        const status = params.value;
        const approval_for = params.data.approval_for;
        const approval_status = params.data.approval_status;
        if (approval_for === 'RFP') {
          if (status === 'APPROVED') {
            return '<span style="color: green;">APPROVED</span>';
          } else if (status === 'REJECTED') {
            return '<span style="color: red;">REJECTED</span>';
          } else {
            return status;
          }
        } else if (
          approval_for === 'Negotiation' ||
          approval_for === 'ReNegotiation'
        ) {
          if (approval_status === 'APPROVED') {
            return '<span style="color: green;">APPROVED</span>';
          } else if (approval_status === 'REJECTED') {
            return '<span style="color: red;">REJECTED</span>';
          } else {
            return status;
          }
        }
      },
    },
    {
      headerName: 'Actions',
      cellRenderer: VendorQuotationActionComponent,
      pinned: 'right',
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
}
