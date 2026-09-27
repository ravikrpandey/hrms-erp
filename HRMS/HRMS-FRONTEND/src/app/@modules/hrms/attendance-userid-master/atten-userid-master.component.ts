import { Component } from '@angular/core';
import {
  GridApi,
  GridReadyEvent,
  CellValueChangedEvent,
  ICellRendererParams,
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AttendanceUserIDService } from 'src/app/@shared/services/service/attendance/attand_userid.services';
import { ToastrService } from 'ngx-toastr';

import { AttUseridMasterActionComponent } from './atten-userid-master-action/attan_userid-action.component';
import { AttUseridMasterDialogComponent } from './atten-userid-master-dialog/attuserid-master-dialog.component';
import { CommonService } from 'src/app/@shared/services/common.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-currency-master',
  templateUrl: './atten-userid-master.component.html',
  styleUrls: ['./atten-userid-master.component.scss'],
})
export class AttUseridComponent {
  errorMessage: any;
  id: any;
  states_id: any;
  countryss_id: any;
  user_id: any;
  entity_id: any;
  employee_id: any;
  de_user_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;
  countryData: any = [];
  stateData: any = [];
  entityList: any = [];
  entityData: any = [];
  entityData2: any = [];

  constructor(
    private AttendanceUserIDService: AttendanceUserIDService,
    public dialog: MatDialog,
    private route: Router,
    private activetRoute: ActivatedRoute,
    private _commonService: CommonService,
    private toaster: ToastrService
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.getuserID_list();
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;

      this.user_id = this.id.user_id;
    });
  }
  public columnDefs: any = [
    {
      headerName: 'S.NO.',
      field: 'id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Entity Name',
      field: 'company_branch',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Employee Name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      valueGetter: (params: any) =>
        `${params.data.first_name} ${params.data.last_name} (${params.data.employee_code})`,
    },
    {
      headerName: 'Device User ID',
      field: 'de_user_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Device ID',
      field: 'device_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Serial Number',
      field: 'serial_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'WFH Tool ID',
      field: 'wfh_tool_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },

    {
      headerName: 'Action',
      field: 'Currency_Type',
      flex: 1,
      minWidth: 150,
      cellRenderer: AttUseridMasterActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },
  ];

  agInit(params: ICellRendererParams): void {}

  createUserMaster(data: any) {
    this.AttendanceUserIDService.Create_device_user(data).subscribe(
      (res: any) => {
        this.toaster.success('UserID defined Successfully');
        this.reloadCurrentRoute();
      },
      (err: any) => {
        this.toaster.error('UserID Already Exits!', 'Error Message');
      }
    );
  }

  getuserID_list() {
    this.AttendanceUserIDService.get_AlluserID().subscribe((res: any) => {
      this.rowData = res.data;
    });
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
  addRecordToGrid(data: any) {
    if (!data || data.id == null) {
      return;
    }
    const api = this.gridApi;
    const rowAlreadyInGrid = !!api.getRowNode(data.id);

    if (rowAlreadyInGrid) {
      return;
    }

    const transaction = {
      add: [data],
    };
    api.applyTransaction(transaction);
  }

  onFactoryButtonClick(e: any) {
    this.count++;
    if (this.count === 1) {
      var button = e.currentTarget,
        buttonColor = button.getAttribute('data-color'),
        side = button.getAttribute('data-side'),
        data = createDataItem(buttonColor);
      this.addRecordToGrid(data);
      this.gridApi.paginationGoToLastPage();
    } else {
      this.toaster.warning("can't add without feel");
    }
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
  downloadCSV(): void {
    if (!this.rowData || this.rowData.length === 0) {
      console.warn('No data available to export.');
      return;
    }

    const fieldsToRemove = [
      'de_user_id',
      'employee_id',
      'updatedAt',
      'createdAt',
      'isDeleted',
      'id',
      'entity_id',
    ];

    const filteredData = this.rowData.map((row: any) => {
      const newRow = { ...row };
      fieldsToRemove.forEach((field) => delete newRow[field]);
      return newRow;
    });
    const sortedData = filteredData.map((row: { [x: string]: any }) => {
      const sortedRow: any = {};
      ['de_user_id', ...Object.keys(row)].forEach((key) => {
        if (row[key] !== undefined) {
          sortedRow[key] = row[key];
        }
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
      wch:
        Math.max(
          10,
          ...spacedData.map((row) =>
            row[key] ? row[key].toString().length : 0
          )
        ) + 2,
    }));
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

    saveAs(data, 'Device_UserId.xlsx');
  }

  openDialog() {
    const dialogRef = this.dialog.open(AttUseridMasterDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
let rowIdSequence = 100;

function createDataItem(color: string) {
  const obj = {
    id: rowIdSequence++,
    color: color,
    value1: Math.floor(Math.random() * 100),
    value2: Math.floor(Math.random() * 100),
  };

  return obj;
}
