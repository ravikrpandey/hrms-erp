import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import 'ag-grid-enterprise';
import { CommonService } from 'src/app/@shared/services/common.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { AssetListService } from 'src/app/@shared/services/asset-list.service';
import { AllocatedActionComponent } from './allocated-action/allocated-action.component';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-asset-allocated-list',
  templateUrl: './asset-allocated-list.component.html',
  styleUrls: ['./asset-allocated-list.component.scss']
})
export class AssetAllocatedListComponent {
  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;
  public gridOptions: any = { rowSelection: 'multiple', rowHeight: 55};
  employee_id:any;
  entity_id: any;
  finance_id: any;
  loginUserDetails: any;
  role: any;
  rowList:any;
  constructor(
    private _rbackService:RbacMasterService,
    private _configurationalMasterService: ConfigurationalmasterService,
    public dialog: MatDialog, private route: Router, private activetRoute: ActivatedRoute,
    private toaster: ToastrService,
    private _commonService: CommonService,
     private asset_service:AssetListService
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem("selectedEntityId");
    this.employee_id = localStorage.getItem("EmpMainId");
    this.finance_id = localStorage.getItem("financial_id");
    this.loginUserDetails = localStorage.getItem("signInUser");
    this.loginUserDetails = JSON.parse(this.loginUserDetails);
    this.role = this.loginUserDetails.roles;
    this.getAssetAllocatedEmp();
  }

  public columnDefs = [
     {
      headerName: '',
      headerCheckboxSelection: true,
      width: 30,
      checkboxSelection: (params: any) => {
        return true;
      },
    },
    {
      headerName: 'S.NO',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Employee code',
      field: 'employee_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Employee name',
      field: 'employee_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Department Name',
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
      headerName: 'Branch Name',
      field: 'branch_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Asset Allocated Qty',
      field: 'total_quantity',
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
      cellRenderer: AllocatedActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
        someProperty: 'value',
      },
      cellClass: "grid-cell-centered",
    },
  ];

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

  getAssetAllocatedEmp() {
    this._commonService?.showLoader()
    this.asset_service.getAssetAllocatedEmp(this.entity_id).subscribe((res: any) => {
      this.rowData = res.data;
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

exportToExcel(): void {
   const selectedRows = this.gridApi.getSelectedRows();

    if (this.rowData.length <= 0) {
     this.toaster.error('Data is not available');
     return
    }
    else if(selectedRows.length > 0){
      this.rowList = selectedRows
    }else{
      this.rowList = this.rowData;
    }
    
  const exportData = this.rowList.map((emp: any) => ({
    "Employee Code": emp.employee_code,
    "Employee Name": emp.employee_name,
    "Department Name": emp.department_name,
    "Branch Name": emp.branch_name,
    "Allocated Asset": emp.total_quantity
  }));

  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
  worksheet['!cols'] = [
    { wch: 20 },
    { wch: 30 },
    { wch: 30 },
    { wch: 25 },
    { wch: 20 }
  ];

  const workbook: XLSX.WorkBook = {
    Sheets: { 'Employees': worksheet },
    SheetNames: ['Employees']
  };

  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  this.saveAsExcelFile(excelBuffer, 'employee_data');
}

private saveAsExcelFile(buffer: any, fileName: string): void {
  const data: Blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  });
  FileSaver.saveAs(data, `${fileName}_${new Date().getTime()}.xlsx`);
}

}


