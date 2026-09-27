import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { EmployeeTransferService } from 'src/app/@shared/services/employee-transfer.service';
import { ColDef } from 'ag-grid-community';
import { ActionComponent } from '../action/action.component';
import { CellRenderComponent } from '../cell-render/cell-render.component';

@Component({
  selector: 'app-employee-transferlist',
  templateUrl: './employee-transferlist.component.html',
  styleUrls: ['./employee-transferlist.component.scss'],
})
export class EmployeeTransferlistComponent implements OnInit {
  listData: any = [];
  rowData: any = [];
  fromEmpId: any;
  showGrid: boolean = true; // Flag to control visibility of the grid
  currentTab: string = 'myRequest'; // To track the current selected tab

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private employeeTransfer: EmployeeTransferService
  ) {}

  ngOnInit() {
    this.fromEmpId = localStorage.getItem('EmpMainId');
    this.getAllDataEmployeeTransfer();

    // Listen to route changes to determine whether to show or hide the grid
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentRoute =
          this.activatedRoute.snapshot.firstChild?.routeConfig?.path ?? '';
        if (
          ['pending-for-approval', 'approval', 'reject'].includes(currentRoute)
        ) {
          this.showGrid = false; // Hide the grid for these routes
        } else {
          this.showGrid = true; // Show the grid for others
        }
      });
  }

  getAllDataEmployeeTransfer() {
    this.employeeTransfer.getListdataEmployeeTransfer(this.fromEmpId).subscribe(
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
    this.currentTab = tab; // Update current tab
    this.showGrid = tab === 'myRequest'; // Show grid only for 'myRequest' tab
  }

  columnDefs: ColDef[] = [
    {
      headerName: 'S.No',
      valueGetter: (params: any) =>
        params.node ? params.node.rowIndex + 1 : '',
      sortable: false,
      filter: false,
      width: 80,
    },
    {
      headerName: 'Name',
      field: 'full_name',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Employee Code',
      field: 'employee_code',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Entity Name',
      field: 'entity_name',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Status',
      flex: 1,
      field: 'status',
      minWidth: 150,
      cellRendererFramework: CellRenderComponent,
    },
    {
      headerName: 'Remark',
      field: 'toRemark',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
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

  addEmployeetranfser() {
    this.router.navigate(['/master/hrms/employee-transfer/transfer']);
  }
}
