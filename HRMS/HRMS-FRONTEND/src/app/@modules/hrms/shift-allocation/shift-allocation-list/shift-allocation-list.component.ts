import { Component } from '@angular/core';
import { ShiftAllocationActionComponent } from '../shift-allocation-action/shift-allocation-action.component';
import { CellRenderComponent } from '../cell-render/cell-render.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { EmployeeTransferService } from 'src/app/@shared/services/employee-transfer.service';
import { filter } from 'rxjs';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ShiftAllocationService } from 'src/app/@shared/services/shift-allocation.service';

@Component({
  selector: 'app-shift-allocation-list',
  templateUrl: './shift-allocation-list.component.html',
  styleUrls: ['./shift-allocation-list.component.scss'],
})
export class ShiftAllocationListComponent {
  listData: any = [];
  rowData: any = [];

  showGrid: boolean = true;

  rowClass: any;
  selectedEntityId: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private shiftAllocatedservices: ShiftAllocationService
  ) {}

  ngOnInit() {
    this.getAllDataEmployeeTransfer();
  }

  getAllDataEmployeeTransfer() {
    let entity = localStorage.getItem('selectedEntityId');
    if (entity) {
      this.selectedEntityId = parseInt(entity, 10);
    } else {
      console.error('No selectedEntityId found in localStorage');
      return;
    }
    this.shiftAllocatedservices
      .getAllShiftMasterListData(this.selectedEntityId)
      .subscribe(
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
      width: 200,
    },

    {
      headerName: 'Shift Name',
      field: 'shift_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      width: 200,
    },
    {
      headerName: 'Department Name',
      field: 'department_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      width: 200,
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
      width: 300,
      cellRendererFramework: CellRenderComponent,
    },

    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      width: 200,
      cellClass: 'grid-cell-centered',
      cellRendererFramework: ShiftAllocationActionComponent,
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

  onAdd() {
    this.router.navigate(['/master/hrms/shift-allocation/add']);
    console.log('hii');
  }
}
