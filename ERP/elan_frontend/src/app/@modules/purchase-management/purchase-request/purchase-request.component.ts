import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import * as moment from 'moment';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import { MatDialog } from '@angular/material/dialog';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { PrListActionComponent } from './pr-list-action/pr-list-action.component';
import { ModuleAction } from 'src/app/@shared/interface/core.interface';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { PrStatusDialogComponent } from '../dialog/pr-status-dialog/pr-status-dialog.component';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-purchase-request',
  templateUrl: './purchase-request.component.html',
  styleUrls: ['./purchase-request.component.scss'],
})
export class PurchaseRequestComponent {
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
  depData2: any;

  actions = [
    {
      label: 'Create New PR',
      icon: 'add',
      callback: this.navigate.bind(this),
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
      this.tab = params['tab'];
      this.rowData = [];
      this.filteredData = [];
      if (!this.tab) {
        this.tab = 'all-pr-list';
        this.selectedIndex = 0;
        this.router.navigate(['master/purchase-management/purchase-request'], {
          queryParams: { tab: 'all-pr-list' },
        });
      }
      if (this.tab == 'all-pr-list') {
        this.selectedIndex = 0;
        this.getAllPr();
      } else if (this.tab == 'to-be-approved') {
        this.selectedIndex = 1;
        this.getToBeApprovePr();
      } else if (this.tab == 'approved-pr') {
        this.selectedIndex = 2;
        this.getApprovePrList();
      } else if (this.tab == 'rejected-pr') {
        this.selectedIndex = 3;
        this.getRejectedPrList();
      }
      console.log(params);
    });
  }

  getAllPr() {
    const data = {
      user_id: this.accessCtrl.getEmployeeId(),
      entity_id: this.accessCtrl.getEntityId(),
      user_role: this.accessCtrl.getRoleId(),
      financial_year_id: this.accessCtrl.getFinancialId(),
    };
    this.prService.getAllPRRequest(data).subscribe(
      (res: any) => {
        if (res && res.data) {
          this.rowData = res.data;
          this.filteredData = this.rowData;
          // this.filteredData.forEach((element: any) => {
          //   let x: any = this.approveLeavel(element)
          //   if (!x) {
          //     element.showEdit = true;
          //   } else {
          //     element.showEdit = false;
          //   }
          // })
        }
      },
      (err: any) => {
        this.rowData = [];
      },
    );
  }

  getApprovePrList() {
    let data = {
      user_id: this.accessCtrl.getEmployeeId(),
      entity_id: this.accessCtrl.getEntityId(),
      user_role: this.accessCtrl.getRoleId(),
      financial_year_id: this.accessCtrl.getFinancialId(),
    };
    this.prService
      .getApprovedAll(this.accessCtrl.getEmployeeId(), data)
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

  getToBeApprovePr() {
    const data = {
      user_id: this.accessCtrl.getEmployeeId(),
      entity_id: this.accessCtrl.getEntityId(),
      user_role: this.accessCtrl.getRoleId(),
      financial_year_id: this.accessCtrl.getFinancialId(),
    };
    this.prService
      .levelApprovels(this.accessCtrl.getEmployeeId(), data)
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

  getRejectedPrList() {
    let data = {
      user_id: this.accessCtrl.getEmployeeId(),
      entity_id: this.accessCtrl.getEntityId(),
      user_role: this.accessCtrl.getRoleId(),
      financial_year_id: this.accessCtrl.getFinancialId(),
    };
    this.prService
      .getRejectedAll(this.accessCtrl.getEmployeeId(), data)
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
      'all-pr-list',
      'to-be-approved',
      'approved-pr',
      'rejected-pr',
    ];
    this.router.navigate(['master/purchase-management/purchase-request'], {
      queryParams: { tab: tabs[event.index] },
      queryParamsHandling: 'merge',
    });
  }

  navigate() {
    this.router.navigate([
      'master/purchase-management/purchase-request/create-pr',
    ]);
  }

  statusCellClicked(e: any) {
    if (this.assignAction.Write) {
      const dialogRef = this.dialog.open(PrStatusDialogComponent, {
        width: '500px',
        data: { ...e.data, type: 'pr' },
      });
      dialogRef.afterClosed().subscribe((result) => {});
    }
  }

  departmentFilter(e: any) {
    const aa = e;
    let filteredVariable = this.depData2.filter((item: any) =>
      aa.includes(item.department_name),
    );
    this.depData = filteredVariable;
  }

  approveLeavel(paramsData: any) {
    let serviceType: any = null;
    if (paramsData?.pr_category == 'Service') {
      serviceType = 'Service';
    } else if (paramsData?.pr_category == 'Item') {
      serviceType = 'Item';
    }

    let data = {
      dep_id: paramsData?.department_id,
      workflow_type: serviceType,
    };
    this.prService.levelsShowPR(paramsData?.id, data).subscribe((res: any) => {
      const isApproved = res.data.some(
        (item: any) => item.status === 'APPROVED',
      );
      return isApproved;
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

  public rowData: any = [];

  public columnDefs = [
    {
      headerName: 'S. No.',
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
      headerName: 'PR No.',
      field: 'pr_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      // valueGetter: (params:any) => {
      //   return `PR00${params.data.id}`;
      // }
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
      headerName: 'Created By',
      field: 'created_by',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 110,
      valueFormatter: (params: any) => {
        return (
          params.data.created_by ||
          `${params.data.first_name} ${params.data.last_name}`
        );
      },
    },
    {
      headerName: 'Created Date',
      field: 'pr_date',
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
      headerName: 'Status',
      field: 'final_status',
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
      field: 'procurement_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex: 1,
      minWidth: 150,
      cellRenderer: PrListActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
      cellClass: 'grid-cell-centered',
    },
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}
