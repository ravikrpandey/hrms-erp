import {
  Component,
  HostListener,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  PinnedRowModel,
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { ActionComponent } from './action/action.component';
import { EmpListDialogComponent } from './emp-list-dialog/emp-list-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { Router } from '@angular/router';
import { DownloadCsvDialogComponent } from './download-csv-dialog/download-csv-dialog.component';
import { ShortcutService } from 'src/app/@shared/services/shortcut.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EmployeeListComponent implements OnInit {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  userRole: any;
  customS_data: number;
  getAllData: any;
  sortType: boolean;
  assignAction: any;
  getUserRole: any;
  showShortcuts = false;
  altPressed = false;

  start: any = new Date();
  end: any = new Date();
  constructor(
    private _empService: EmpRegistrationService,
    public dialog: MatDialog,
    private _rbackService: RbacMasterService,
    private shortcutService: ShortcutService,
    private router: Router
  ) {
    this.rowClass = 'rowClass';
  }
  ngOnInit(): void {
    localStorage.setItem('employee_id:', 'undefined');
    const signInUserData = localStorage.getItem('signInUser');

    if (signInUserData) {
      const signInUserObject = JSON.parse(signInUserData);
      this.getUserRole = signInUserObject.role;
    } else {
      console.log('Value for signInUser not found in localStorage');
    }
    let entity_id = localStorage.getItem('selectedEntityId');

    this._empService
      .grtEmployeeList(entity_id, this.getUserRole)
      .subscribe((res: any) => {
        this.rowData = res.data;
        this.getAllData = res.data;
        console.log(
          '*&^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^',
          this.getAllData
        );
        this.rowData.map((row: any) => {
          row.full_name = row.first_name + ' ' + row.last_name;
          return row;
        });
        //
        const userId: any = [];
        for (let i = 0; i < res.data.length; i++) {
          userId.push(res.data[i].user_role);
          this.userRole = userId;
        }
      });

    this.shortcutService.registerShortcut('a', () => {
      this.router.navigate([
        '/master/hrms/employee-master/employ/employee-create/basic-details',
      ]);
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.assignAction = this._rbackService.accessAssignAction();
    }, 0);
  }

  shortRole(type: any) {
    if (this.sortType) {
      this.sortType = false;
      const arrar = [
        'MD & CEO',
        'Sr VP',
        'VP',
        'AVP',
        'Sr.GM',
        'GM',
        'AGM',
        'Sr. Manager',
        'Manager',
        'Asso. Manager',
        'Sr. Executive',
        'Executive',
        'Asso. Executive ',
      ];

      function customSort(a: any, b: any) {
        const indexA = arrar.indexOf(a.designation);
        const indexB = arrar.indexOf(b.designation);
        return indexA - indexB;
      }
      const sorted_components = this.getAllData.sort(customSort);
      this.rowData = [];
      this.gridApi.setRowData([]);
      this.gridApi.setRowData(sorted_components);
      this.rowData = sorted_components;
    } else {
      this.sortType = true;
      const arrar = [
        'MD & CEO',
        'Sr VP',
        'VP',
        'AVP',
        'Sr.GM',
        'GM',
        'AGM',
        'Sr. Manager',
        'Manager',
        'Asso. Manager',
        'Sr. Executive',
        'Executive',
        'Asso. Executive ',
      ];

      function customSort(a: any, b: any) {
        const indexA = arrar.indexOf(a.designation);
        const indexB = arrar.indexOf(b.designation);
        return indexB - indexA;
      }
      const sorted_components = this.getAllData.sort(customSort);
      this.rowData = [];
      this.gridApi.setRowData([]);
      this.gridApi.setRowData(sorted_components);
      this.rowData = sorted_components;
    }
  }

  public columnDefs: ColDef[] = [
    {
      headerName: 'S No.',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 70,
    },
    {
      headerName: 'Employee Code',
      field: 'employee_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 130,
      cellRenderer: (params: any) => {
        const div = document.createElement('div');
        div.className = 'custom-button';
        div.innerText = params.value;
        return div;
      },
    },
    {
      headerName: 'Employee Name',
      field: 'full_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Email ID (Login ID)',
      field: 'employee_official_email',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 200,
      tooltipField: 'employee_official_email',
    },
    {
      headerName: 'Mobile Number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 140,
      valueGetter: (params: any) =>
        `${params.data.country_code ? params.data.country_code : ''} ${
          params.data.contact_number
        }`,
    },
    // {
    //   headerName: 'Designation',
    //   field: 'designation_name',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    //   minWidth: 190,
    //   tooltipField: 'designation_name',
    // },
    {
      headerName: 'Reporting Manager',
      field: 'reporting_manager',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 190,
      tooltipField: 'reporting_manager',
    },
    {
      headerName: 'Employee Role',
      field: 'role_master_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 135,
    },
    {
      headerName: 'Action',
      field: 'employee_id',
      flex: 2,
      maxWidth: 200,
      pinned: 'right',
      cellRenderer: ActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
      cellClass: 'grid-cell-centered',
    },
  ];

  onBtnExportDataAsExcel() {
    this.gridApi.exportDataAsExcel({
      processRowGroupCallback: rowGroupCallback,
    });
  }

  onBtPrint() {
    window.print();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  //   gridOptions = {
  //     // Add event handlers

  // }
  onCellClicked(e: any) {
    // const dialogRef = this.dialog.open(EmpListDialogComponent, {
    //   width: '600px',
    //   data: { id: e.data.employee_id },
    // });
    // dialogRef.afterClosed().subscribe((result) => {
    // });
  }
  back() {
    // this.router.navigateByUrl()
  }

  openDialogForDownloadCsv() {
    const dialogRef = this.dialog.open(DownloadCsvDialogComponent, {
      width: '600px',
      data: { value: null },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }

  onDownloadExcel() {
    const startKey = new Date(this.start).toLocaleDateString('en-CA'); // YYYY-MM-DD
    const endKey = new Date(this.end).toLocaleDateString('en-CA'); // YYYY-MM-DD
    this._empService
      .downloadLoginHistory({ startKey, endKey })
      .subscribe((blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `login_history_${startKey}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
      });
    // log
  }

  ngOnDestroy() {
    // Remove the shortcut when component is destroyed
    this.shortcutService.unregisterShortcut('a');
  }
  isShortcutVisible() {
    return this.shortcutService.isShortcutVisible();
  }
}

function rowGroupCallback(params: any) {
  return params.node.key;
}