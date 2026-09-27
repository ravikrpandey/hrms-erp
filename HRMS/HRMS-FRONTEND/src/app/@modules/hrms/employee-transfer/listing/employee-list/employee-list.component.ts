import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { EmployeeTransferService } from 'src/app/@shared/services/employee-transfer.service';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { CellRenderComponent } from '../../cell-render/cell-render.component';
import { ActionComponent } from '../../action/action.component';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent {
  listData: any = [];
  rowData: any = [];
  createdBy: any;
  showGrid: boolean = true;
  currentTab: string = 'employee-transfer';
  rowClass: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private employeeTransfer: EmployeeTransferService
  ) {}

  ngOnInit() {
    this.createdBy = localStorage.getItem('EmpMainId');
    this.getAllDataEmployeeTransfer();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentRoute =
          this.activatedRoute.snapshot.firstChild?.routeConfig?.path ?? '';
        if (
          [
            'employee-transfer',
            'pending-for-approval',
            'approval',
            'reject',
          ].includes(currentRoute)
        ) {
          this.showGrid = false;
        } else {
          this.showGrid = true;
        }
      });
  }

  getAllDataEmployeeTransfer() {
    this.employeeTransfer.getListdataEmployeeTransfer(this.createdBy).subscribe(
      (res: any) => {
        if (res && res.data) {
          this.listData = res.data;
          this.rowData = res.data;
          console.log('API Response:', res);
        } else {
          console.error('Invalid response format', res);
          this.rowData = [];
        }
      },
      (error) => {
        console.error('API Error:', error);
        this.rowData = [];
      }
    );
  }

  onTabSelect(tab: string) {
    this.currentTab = tab;
    this.showGrid = tab === 'employee-transfer';
  }

  columnDefs: ColDef[] = [
    {
      headerName: 'S.No',
      valueGetter: (params: any) =>
        params.node ? params.node.rowIndex + 1 : '',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      width: 150,
    },
    {
      headerName: 'Name',
      field: 'from_employee_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      width: 150,
    },
    {
      headerName: 'Employee Code',
      field: 'from_employee_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      width: 150,
    },
    {
      headerName: 'Entity Name',
      field: 'entity_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      width: 150,
    },
    {
      headerName: 'Approval Manager Name',
      field: 'approval_employee_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      width: 150,
    },
    {
      headerName: 'Approval Status',
      field: 'IsStatus',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      width: 100,
    },

    {
      headerName: 'Status',
      flex: 1,
      field: 'status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      minWidth: 100,
      cellRendererFramework: CellRenderComponent,
    },
    {
      headerName: 'Remark',
      field: 'toRemark',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      minWidth: 100,
    },
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 100,
      cellRendererFramework: ActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
    },
  ];
  private gridApi!: GridApi<any>;

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }
}
