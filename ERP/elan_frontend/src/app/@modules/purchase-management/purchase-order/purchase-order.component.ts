import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import * as moment from 'moment';
import { ModuleAction } from 'src/app/@shared/interface/core.interface';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { PrStatusDialogComponent } from '../dialog/pr-status-dialog/pr-status-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { PoListActionComponent } from './po-list-action/po-list-action.component';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss'],
})
export class PurchaseOrderComponent {
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
  prRowData: any[] = [];
  quotationRowData: any[] = [];
  public gridOptions: any = { rowSelection: 'multiple' };
  getDataPath = (data: any) => {
    return data.hierarchy;
  };

  frameworkComponents: any;

  actions = [
    {
      label: 'Add PO',
      icon: 'add',
      callback: this.createPo.bind(this),
    },
    {
      label: 'PO From PR',
      icon: 'add',
      callback: this.createPoFromPr.bind(this),
    },
    {
      label: 'PO From Quotation',
      icon: 'add',
      callback: this.createPoFromRfp.bind(this),
    },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private accessCtrl: AccessControlService,
    private prService: PurchaseRequestService,
    private _rbackService: RbacMasterService,
    private toast: ToastrService,
  ) {
    this.assignAction = this._rbackService.accessAssignAction();

    this.frameworkComponents = {
      // buttonRenderer: CoaHierarchyActionComponent,
    };
    this.route.queryParams.subscribe((params: any) => {
      this.tab = params['tab'];
      this.rowData = [];
      this.filteredData = [];
      if (!this.tab) {
        this.tab = 'raise-po';
        this.selectedIndex = 0;
        this.router.navigate(['master/purchase-management/purchase-order'], {
          queryParams: { tab: 'raise-po' },
        });
      }
      if (this.tab == 'raise-po') {
        this.selectedIndex = 0;
        this.getAllPO();
        this.getAllPr();
        this.getAllVendorQuotation();
      } else if (this.tab == 'po-issued') {
        this.selectedIndex = 1;
        this.getAllIssuedPOData();
      } else if (this.tab == 'approved-po') {
        this.selectedIndex = 2;
        this.getApprovePoList();
      } else if (this.tab == 'rejected-po') {
        this.selectedIndex = 3;
        this.getRejectedPo();
      } else if (this.tab == 'draft-po') {
        this.selectedIndex = 4;
        this.getAlldraftPOData();
      }
    });
  }

  getAllPO() {
    const data = {
      user_id: this.accessCtrl.getEmployeeId(),
      entity_id: this.accessCtrl.getEntityId(),
      user_role: this.accessCtrl.getRoleId(),
      financial_year_id: this.accessCtrl.getFinancialId(),
    };
    this.prService.getAllPoDataNew(data).subscribe(
      (res: any) => {
        this.rowData = res.data;
        this.filteredData = this.rowData;
      },
      (err: any) => {
        this.toast.error(`${err.error.message}`);
      },
    );
  }

  getAllPr() {
    this.prService
      .getPRList(
        this.accessCtrl.getEntityId(),
        this.accessCtrl.getFinancialId(),
      )
      .subscribe((res: any) => {
        if (res?.data) {
          this.prRowData = this.flattenChildrenRecursively(res.data);
        }
      });
  }

  getAllVendorQuotation() {
    const data = {
      user_id: this.accessCtrl.getEmployeeId(),
      entity_id: this.accessCtrl.getEntityId(),
      user_role: this.accessCtrl.getRoleId(),
      financial_year_id: this.accessCtrl.getFinancialId(),
    };
    this.prService
      .get_all_Quotation_for_PO(data.entity_id, data.financial_year_id)
      .subscribe((res: any) => {
        if (res && res.data) {
          this.quotationRowData = this.flattenChildrenRecursively(res.data);
          console.log(this.quotationRowData);
        }
      });
  }

  getAllIssuedPOData() {
    this.prService
      .getTobeApproved(this.accessCtrl.getEmployeeId())
      .subscribe((res: any) => {
        this.rowData = res.data;
        this.filteredData = this.rowData;
      });
  }

  getApprovePoList() {
    this.prService
      .getApprovedApprovel(this.accessCtrl.getEmployeeId())
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

  getRejectedPo() {
    this.prService.getRejectApprovel(this.accessCtrl.getEmployeeId()).subscribe(
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

  getAlldraftPOData() {
    const data = {
      user_id: this.accessCtrl.getEmployeeId(),
      entity_id: this.accessCtrl.getEntityId(),
      user_role: this.accessCtrl.getRoleId(),
      financial_year_id: this.accessCtrl.getFinancialId(),
    };
    this.prService.getAlldraftPO(data).subscribe(
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

  flattenChildrenRecursively = (
    data: any[],
    parentHierarchy: string[] = [],
  ): any[] => {
    let newData: any[] = [];

    if (!data) return newData;

    data.forEach((row: any) => {
      // Build the hierarchy path for this row
      const isParent = parentHierarchy.length === 0;
      const currentHierarchy = isParent
        ? [row.pr_number] // Parent: path is ["PR002"]
        : [...parentHierarchy, row.quotation_code ? `${row.vendor_name} (${row.quotation_code})` : (row.vendor_name || `Vendor_${row.vendor_id}`)];

      const flatRow = { ...row, hierarchy: currentHierarchy };
      delete flatRow.children; // Remove nested children from the flat row

      newData.push(flatRow);

      // Recursively flatten children if they exist
      if (row.children?.length) {
        newData = [
          ...newData,
          ...this.flattenChildrenRecursively(row.children, currentHierarchy),
        ];
      }
    });

    return newData;
  };

  onTabChange(event: MatTabChangeEvent) {
    const tabs = [
      'raise-po',
      'po-issued',
      'approved-po',
      'rejected-po',
      'draft-po',
    ];
    this.router.navigate(['master/purchase-management/purchase-order'], {
      queryParams: { tab: tabs[event.index] },
      queryParamsHandling: 'merge',
    });
  }

  createPo() {
    this.router.navigate([
      'master/purchase-management/purchase-order/create-po',
    ]);
  }

  createPoFromPr() {
    document.getElementById('drawerPoPr')?.classList.add('sidebarDialogOpen');
  }

  createPoFromRfp() {
    document.getElementById('drawerPoRfp')?.classList.add('mySidenavPofromRfp');
  }

  statusCellClicked(e: any) {
    if (this.assignAction.Write) {
      const dialogRef = this.dialog.open(PrStatusDialogComponent, {
        width: '500px',
        data: { ...e.data, type: 'po' },
      });
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

  closeNav(id: string) {
    document.getElementById(id)?.classList.remove('sidebarDialogOpen');
    document.getElementById(id)?.classList.remove('mySidenavPofromRfp');
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  public rowData: any = [];

  public columnDefs: ColDef[] = [
    {
      headerName: 'S. No.',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      // flex: 1,
      width: 80,
      maxWidth: 80,
      minWidth: 80,
    },
    {
      headerName: 'PO No.',
      field: 'po_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100,
    },
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
      headerName: 'Department',
      field: 'department_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100,
    },
    {
      headerName: 'PO Date',
      field: 'po_date',
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
      headerName: 'Approval Status',
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
      headerName: 'Created By',
      field: 'created_by',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 110,
    },
    {
      headerName: 'Indent Type',
      field: 'po_category',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 110,
    },
    {
      headerName: 'Budget Type',
      field: 'po_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100,
    },
    {
      headerName: 'Actions',
      field: 'procurement_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      // flex: 1,
      width: 100,
      maxWidth: 100,
      minWidth: 100,
      pinned: 'right',
      cellRenderer: PoListActionComponent,
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

  public columnDefsPR: ColDef[] = [
    {
      headerName: 'Vendor Name',
      field: 'vendor_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 2,
      // valueGetter: (params: any) => {
      //   if (params.node.allChildrenCount > 0) {
      //     return '--';
      //   }
      //   return params.data?.vendor_name || '';
      // }
    },
    {
      headerName: 'Action',
      field: 'pr_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex: 1,
      maxWidth: 90,
      cellClass: 'grid-cell-centered',
      pinned: 'right', // ✅ always visible
      cellRenderer: (params: any) => {
        // if (params.node.allChildrenCount > 0) {
        //   return '';
        // }
        return `
          <span 
            class="material-icons action-btn"
            title="Create PO"
            style="cursor:pointer;"
          >
            navigate_next
          </span>
        `;
      },
      onCellClicked: (params: any) => {
        if (params.event.target.classList.contains('action-btn')) {
          this.router.navigate(
            ['master/purchase-management/purchase-order/create-po'],
            {
              queryParams: {
                id: params.data.pr_id,
                type: 'Add',
                status: params.data?.po_category,
                vendor_id: params.data.vendor_id,
              },
            },
          );
        }
      },
    },
  ];

  autoGroupColumnDef: any = {
    headerName: 'PR No.',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'grid-cell-centered',
    flex: 1.2,
    cellRendererParams: {
      suppressCount: false,
    },
    valueGetter: (params: any) => {
      // Show pr_number for parent, vendor_name for child
      if (params.data) {
        return params.data.hierarchy?.length === 1
          ? params.data.pr_number
          : params.data.pr_number;
      }
      return '';
    },
  };

  autoGroupQuotationColumnDef = {
    headerName: 'Quotation Code',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: 'grid-cell-centered',
    minWidth: 250,
    flex: 2,
    tooltipValueGetter: (params: any) => params.value,

    cellRendererParams: {
      suppressCount: false,
    },

    valueGetter: (params: any) => {
      if (!params.data) return '';
      return `${params.data.quotation_code || ''} - ${params.data.pr_number || ''}`;
    },
  };

  public columnDefsQuotation: ColDef[] = [
    {
      headerName: 'Vendor Name',
      field: 'vendor_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      tooltipField: 'vendor_name',
      cellClass: 'grid-cell-centered text-ellipsis',
      minWidth: 180,
      flex: 2,
    },

    {
      headerName: 'Action',
      field: 'id',
      sortable: false,
      resizable: false,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      minWidth: 120,
      maxWidth: 140,
      pinned: 'right', // ✅ always visible
      cellRenderer: (params: any) => {
        if (params.node.allChildrenCount > 0 || !params.data?.vendor_id) {
          return '';
        }
        return `
        <span 
          class="material-icons action-btn"
          title="Create PO"
          style="cursor:pointer;font-size:20px;color:#1976d2;"
        >
          navigate_next
        </span>
      `;
      },
      onCellClicked: (params: any) => {
        if (params.event.target.classList.contains('action-btn')) {
          this.router.navigate(
            ['master/purchase-management/purchase-order/create-po'],
            {
              queryParams: {
                id: params.data.pr_id,
                type: 'Add',
                status: params.data?.po_category,
                vendor_id: params.data.vendor_id,
                quotation_id: params.data.quotation_id,
              },
            },
          );
        }
      },
    },
  ];
}
