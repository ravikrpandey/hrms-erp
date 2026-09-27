import { Component, OnInit } from '@angular/core';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import 'ag-grid-enterprise';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { ActionComponent } from './action/action.component';
import { EmpListDialogComponent } from './emp-list-dialog/emp-list-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  userRole: any;
  customS_data: number;
  getAllData: any;
  exportToExceldata: any;
  sortType: boolean;
  assignAction: any;
  getUserRole: any;


  constructor(
    private _empService: EmpRegistrationService,
    public dialog: MatDialog,
    private _rbackService: RbacMasterService,
    private router: Router
  ) {
    this.rowClass = 'rowClass';
  }


  ngOnInit(): void {
    localStorage.setItem('MyEmpIdLocalstorage', '');
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
      .grtEmployeeListbyentity(entity_id, this.getUserRole)
      .subscribe((res: any) => {
        this.rowData = res.data;
        console.log('res.data;', res.data);
        this.getAllData = res.data;
        this.rowData.map((row: any) => {
          row.full_name = row.first_name + ' ' + row.last_name;
          return row;
        });
        const userId: any = [];
        for (let i = 0; i < res.data.length; i++) {
          userId.push(res.data[i].user_role);
          this.userRole = userId;
        }
      });
      this.getAllUserListDataAndExportExcel();
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

  public columnDefs = [
    {
      headerName: 'S No.',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
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
    },
    {
      headerName: 'Login Id',
      field: 'login_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
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
    },
    {
      headerName: 'Email ID',
      field: 'employee_official_email',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Mobile Number',
      field: 'contact_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    // {
    //   headerName: 'Position',
    //   field: 'designation_name',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    // },
    {
      headerName: 'Department Name',
      field: 'department_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Designation',
      field: 'designation_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Status',
      field: 'status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },

    {
      headerName: 'Action',
      field: 'employee_id',
      flex: 1,
      minWidth: 120,
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

 

  getAllUserListDataAndExportExcel() {
    let entity_id = localStorage.getItem('selectedEntityId');
    this._empService
      .exportAllUserInExcel(entity_id, this.getUserRole)
      .subscribe((res: any) => {
        this.exportToExceldata = res.data;
      });
  }

  exportToExcel(): void {
    if (!this.exportToExceldata || this.exportToExceldata.length === 0) {
      console.warn('No data available to export.');
      return;
    }
    const fieldsToRemove = [
      'primary_entity_id','entity_id','countryss_id','employee_country_id','states_id','city_id',
      'employee_state_id','employee_city_id','primary_branch_id','branch_id','department_id',
      'dept_id','area_id','grade_id','emplyoment_type_id','emptype_id'
    ];
    const filteredData = this.exportToExceldata.map((row: any) => {
      const newRow = { ...row };
      fieldsToRemove.forEach((field) => delete newRow[field]);
      return newRow;
    });
    const sortedData = filteredData.map((row: { [x: string]: any }) => {
      const sortedRow: any = {};
      ['login_id','employee_id','employee_code','full_name',...Object.keys(row),].forEach((key) => {
        if (row[key] !== undefined) {sortedRow[key] = row[key]}
      });
      return sortedRow;
    });
    const spacedData: any[] = [];
    sortedData.forEach((row: any, index: number) => {
      spacedData.push(row);
      if ((index + 1) % 5 === 0) {
        spacedData.push({});
      }
    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(spacedData);
    const columnWidths = Object.keys(spacedData[0] || {}).map((key) => ({
      wch: Math.max(10,...spacedData.map((row) => row[key] ? row[key].toString().length : 0)) + 2}));
    worksheet['!cols'] = columnWidths;
    const workbook: XLSX.WorkBook = {
      Sheets: { Data: worksheet },
      SheetNames: ['Data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });

    saveAs(data, 'EmployeeList.xlsx');
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

  onCellClicked(e: any) {}
  back() {
    // this.router.navigateByUrl()
  }
}

function myFunction() {
  alert('I am an alert box!');
}

function rowGroupCallback(params: any) {
  return params.node.key;
}

function setPrinterFriendly(api: any) {
  var eGridDiv = document.querySelector('#myGrid');

  api.setDomLayout('print');
}
function setNormal(api: any) {
  var eGridDiv = document.querySelector('#myGrid');

  api.setDomLayout(null);
}

// onBtnExportDataAsExcel() {
//   this.gridApi.exportDataAsExcel({
//     processRowGroupCallback: rowGroupCallback,
//   });
// }
