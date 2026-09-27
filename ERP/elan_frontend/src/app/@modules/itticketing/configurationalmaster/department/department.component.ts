import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { DepartmentDialogComponent } from './department-dialog/department-dialog.component';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { DepartmentActionStatusComponent } from './department-action/department-action-status/department-action-status.component';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ShortcutService } from 'src/app/@shared/services/shortcut.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { DepartmentActionComponent } from './department-action/department-action.component';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss'],
})
export class DepartmentComponent {
  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  entity_id: any;
  private gridApi!: GridApi<any>;
  public gridOptions: any = { rowSelection: 'multiple', };
  rowData: any;
  count: any = 0;
  assignAction: any;
  columnDefs: any[] = [
    {
      headerName: "S. No.",
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      maxWidth: 85,
    },
    {
      headerName: "Department Name",
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
      headerName: 'Department Code',
      field: 'department_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Status",
      field: 'status',
      cellRenderer: DepartmentActionStatusComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
        someProperty: 'value',
      },
      cellClass: "grid-cell-centered",
      minWidth: 150,
    },
    {
      headerName: "Action",
      field: 'status',
      cellRenderer: DepartmentActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
        someProperty: 'value',
      },
      cellClass: "grid-cell-centered",
      minWidth: 150,
    },
  ];

  employee_login: any;
  financial_year_id: any;

  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    public dialog: MatDialog, private route: Router, private activetRoute: ActivatedRoute,
    private _commonService: CommonService,
    private shortcutService: ShortcutService,
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    let lg: any = localStorage.getItem('signInUser')
    this.financial_year_id = localStorage.getItem('financial_id');;

    this.employee_login = JSON.parse(lg);
    this.assignAction = this._rbackService.accessAssignAction();
    this.getDepartment();
    this.shortcutService.registerShortcut('a', () => {
      this.openDialog()
    });
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.countryss_id = this.id.countryss_id;
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  getDepartment() {
    this._commonService?.showLoader()
    this._configurationalMasterService.getDepartmentAll(this.entity_id).subscribe((res: any) => {
      this.rowData = res.data;
      this.rowData?.map((item: any) => {
        item.full_name = (item?.first_name ?? '') + ' ' + (item?.last_name ?? '');
      })
      this._commonService?.hideLoader()
    }, (err: any) => {
      this.rowData = []
      this._commonService?.hideLoader()
    })
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  openDialog() {
    const dialogRef = this.dialog.open(DepartmentDialogComponent, {
      // data: { id: this.queryParamss },
      width: '500px',
    });
    dialogRef.afterClosed().subscribe((result) => { });
  }

  downloadCSV() {
    this._commonService?.downloadCSV(this.rowData);
  }
}
