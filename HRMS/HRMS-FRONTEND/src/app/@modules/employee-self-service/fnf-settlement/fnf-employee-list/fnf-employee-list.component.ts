import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';

import { CommonService } from 'src/app/@shared/services/common.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { FnfActionComponent } from '../fnf-action/fnf-action.component';

@Component({
  selector: 'app-fnf-employee-list',
  templateUrl: './fnf-employee-list.component.html',
  styleUrls: ['./fnf-employee-list.component.scss']
})
export class FnfEmployeeListComponent {
  rowData: any = [];
  entity_id: number;
  employee_id: any;
  id: string | null;
  userDetails: any;

  private gridApi!: GridApi<any>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _commonService: CommonService,
    private recruitService: RecruitService,
  ) { }

  ngOnInit() {
    const idEntity = localStorage.getItem('selectedEntityId');
    this.entity_id = Number(idEntity);

    const empData: any = localStorage.getItem('signInUser');
    const singleEmpData = JSON.parse(empData);
    this.userDetails = singleEmpData;
    console.log(this.userDetails,"rrrrrrrrrr")
    this.employee_id = singleEmpData?.employee_id;

    this._commonService?.showLoader();
    this.getAllApproveResignationList();
  }

  onAddBasicDetails() {
    this.router.navigate(['/master/ess/fnf-settlement/common/basic-details'], {
      queryParams: { mode: 'add' }
    });
  }

  getAllApproveResignationList() {
    this.id = localStorage.getItem('EmpMainId');
    this._commonService?.showLoader();

    this.recruitService
      .getAllApproveResignationList()
      .subscribe(
        (params: any) => {
          this.rowData = params.data;
          this._commonService?.hideLoader();
        },
        (err: any) => {
          this.rowData = [];
          this._commonService?.hideLoader();
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
      headerName: 'Employee Code',
      field: 'HRMS_REGISTERED_USER.employee_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      width: 150,
    },
    {
      headerName: 'Employee Name',
      field: 'employee_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      width: 150,
    },
    {
      headerName: 'Department',
      field: 'department',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      width: 120,
    },
    {
      headerName: 'DOJ',
      field: 'joining_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      width: 150,
    },
    {
      headerName: 'LWD',
      field: 'last_working_day',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      width: 150,
    },
    {
      headerName: 'FNF Status',
      field: 'fnf_status',
      filter: "agTextColumnFilter", 
      flex: 1,
      width: 100,
      cellClass: 'grid-cell-centered',
      cellRenderer: (params: any) => {
        return params.value ? params.value : 'PENDING';
      },
    },
    {
      headerName: 'Action',
      field: 'employee_id',
      flex: 1,
      minWidth: 100,
      cellRenderer: FnfActionComponent,
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

  onFilterTextBoxChanged() {
    const value = (document.getElementById('filter-text-box') as HTMLInputElement).value;
    this.gridApi.setQuickFilter(value);
  }

  onPageSizeChanged() {
    const value = (document.getElementById('page-size') as HTMLInputElement).value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onStatusFilterChanged(event: any): void {
    const selectedStatus = event.target.value;

    if (selectedStatus) {
      this.gridApi.setFilterModel({
        fnf_status: {
          type: 'equals',
          filter: selectedStatus.toUpperCase()
        }
      });
    } else {
      this.gridApi.setFilterModel(null); 
    }

    this.gridApi.onFilterChanged();
  }
}
