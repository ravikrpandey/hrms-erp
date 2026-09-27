import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { AmountPipe } from 'src/app/@shared/pipe/amount.pipe';
import { CompliancesService } from '../compliances-service';
import { HealthAction } from '../health-action/health-action';

@Component({
  selector: 'app-health-list',
  templateUrl: './health-list.html',
  styleUrls: ['./health-list.scss'],
})
export class HealthList {
  private gridApi!: GridApi<any>
  rowData: any;
  rowClass: any;
  assignAction: any;
  entity_id: any;
  loginUser: any;
  amountPipe = new AmountPipe();
  constructor(private empMaster: EmpMasterService,
    private _commonService: CommonService,
    private _compliancesservice: CompliancesService, private _rbackService: RbacMasterService,
    public dialog: MatDialog) {
    this.rowClass = 'rowClass';
  }
  ngOnInit(): void {

    this.entity_id = localStorage.getItem('selectedEntityId');
    let a: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a);
    this.getList()
  }

  getList = () => {
    this._commonService?.showLoader()
    this._compliancesservice.getAllHealthInspection(this.entity_id).subscribe((res: any) => {
      this._commonService?.hideLoader()
      this.rowData = res.data;
      this.assignAction = this._rbackService.accessAssignAction();
    }, (err: any) => {
      this._commonService?.hideLoader()
    })
  }

  public columnDefs = [

    {
      headerName: 'S.No',
      valueGetter: "node.rowIndex + 1",
      // field: 'i',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      // valueGetter: 'node.rowIndex+1',
      flex: 1,
      minWidth: 85
    },
        {
      headerName: 'Branch',
      field: 'branch_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },
    // {
    //   headerName: 'Department Name',
    //   field: 'department_name',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: "grid-cell-centered",
    //   flex: 1,
    //   minWidth: 150
    // },
    {
      headerName: 'Inspected By',
      field: 'full_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Inspection Date',
      field: 'date_of_inspec',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
      valueFormatter: (params: any) => {
        if (!params.value) return '';
        const date = new Date(params.value);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      }
    },
    {
      headerName: 'Supervisor',
      field: 'supervisor',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: HealthAction,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    }
  ];


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
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;


  }
  onCellClicked(e: any) {
    // console.log(e, 'eeeeeee');

    // const dialogRef = this.dialog.open(AppListDialogComponent, { width: '500px', data: { branchSetupViewId: e.data.id, index: e.data.index } });
    // dialogRef.afterClosed().subscribe(result => {

    // })
  }
}

