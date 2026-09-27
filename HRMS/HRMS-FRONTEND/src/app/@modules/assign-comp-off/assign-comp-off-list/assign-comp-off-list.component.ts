import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  CellValueChangedEvent,
  ColDef,
  GridApi,
  GridReadyEvent,
} from 'ag-grid-community';
import { Router, ActivatedRoute } from '@angular/router';
import { CompServiceService } from 'src/app/@shared/services/comp-service.service';
import { AssignCompActionComponent } from '../assign-comp-action/assign-comp-action.component';
import { CompOffDialogComponent } from '../comp-off-dialog/comp-off-dialog.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-assign-comp-off-list',
  templateUrl: './assign-comp-off-list.component.html',
  styleUrls: ['./assign-comp-off-list.component.scss'],
})
export class AssignCompOffListComponent {
  listData: any = [];
  rowData: any = [];

  showGrid: boolean = true;

  rowClass: any;
  selectedEntityId: any;
  employeeCount: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private comservice: CompServiceService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getAllCompOffData();
  }

  getAllCompOffData() {
    let entity = localStorage.getItem('selectedEntityId');
    if (entity) {
      this.selectedEntityId = parseInt(entity, 10);
    } else {
      console.error('No selectedEntityId found in localStorage');
      return;
    }
    this.comservice.getCompListData(this.selectedEntityId).subscribe(
      (res: any) => {
        if (res && res.data) {
          this.listData = res.data;
          const reversedData = [...res.data].reverse();
          this.rowData = reversedData;
          const allEmployeeIds = reversedData
            .map((item: any) => item.employee_id || [])
            .flat();
          this.employeeCount = allEmployeeIds.length;
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
      width: 100,
    },
    {
      headerName: 'No of Employee',
      valueGetter: (params: any) => {
        return params.data.employee_id?.length || 0;
      },
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'From',
      field: 'from_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'To',
      field: 'to_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Create Date',
      field: 'createdAt',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      valueFormatter: (params) => {
        if (!params.value) return '';
        const date = new Date(params.value);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
      },
    },
    {
      headerName: 'Created By',
      valueGetter: (params: any) => {
        const { first_name, middle_name, last_name } = params.data;
        return [first_name, middle_name, last_name].filter(Boolean).join(' ');
      },
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },

    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      cellClass: 'grid-cell-centered',
      cellRendererFramework: AssignCompActionComponent,
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
    this.router.navigate(['/master/comp-off/add']);
    console.log('hii');
  }
}
