import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTabGroup, MatTabChangeEvent } from '@angular/material/tabs';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ActionsComponent } from './actions/actions.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/@shared/services/common.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';
import { TravelExpenseWorkflowLevelDialogComponent } from '../travel-expense/travel-expense-workflow-level/travel-expense-workflow-level-dialog.component';
import { OtherExpenseWorkflowLevelComponent } from './other-expense-workflow-level/other-expense-workflow-level.component';

@Component({
  selector: 'app-other-expense-list',
  templateUrl: './other-expense-list.component.html',
  styleUrls: ['./other-expense-list.component.scss']
})
export class OtherExpenseListComponent implements OnInit, AfterViewInit {
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  status: string = '0';
  rowData: any = [];
  private gridApi!: GridApi;
  entity_Id: any;
  financial_id: any;
  public gridOptions: any = { rowSelection: 'multiple', rowHeight: 55 };
  loginUser: any;
  constructor(private travelService: TravelRequestService,
    private _commonService: CommonService,
    private _rbackService: RbacMasterService,
    public dialog: MatDialog,) { }
  tabs = [
    { label: 'My Other Expense' },
    { label: 'Pending For Approval' },
    { label: 'Approved' },
    { label: 'Rejected' }
  ];

  columnDefs = [
    {
      headerName: 'S.No',
      valueGetter: 'node.rowIndex + 1',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 100
    },
    {
      headerName: 'Expense Request Number',
      field: 'expense_request_number',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Expense Request Type',
      field: 'expense_request_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Expense Month',
      field: 'current_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      valueFormatter: (params: any) => {
        const date = new Date(params.data.current_date);
        return date.toLocaleString('default', { month: 'long' });
      }
    },
    {
      headerName: 'Employee Name',
      field: 'first_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Status',
      valueGetter: (params: any) => this.status === '0' ? params.data.expense_final_status : params.data.expense_approvel_status,
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
      field: 'action',
      flex: 1,
      minWidth: 150,
      cellRenderer: ActionsComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
    },
  ];

  ngOnInit(): void {
    this.localStorage()
    this.loadDummyData();
    this.loadGridData();

  }
  localStorage() {
    let a: any = localStorage.getItem('signInUser');
    let entity: any = localStorage.getItem('selectedEntityId');
    let financialid: any = localStorage.getItem('financial_id');
    this.loginUser = JSON.parse(a);
    this.entity_Id = JSON.parse(entity);
    this.financial_id = JSON.parse(financialid);
  }
  ngAfterViewInit(): void {
    this.setTabIndexBasedOnStatus();
  }

  setTabIndexBasedOnStatus() {
    this.tabGroup.selectedIndex = parseInt(this.status, 10) || 0;
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onPageSizeChanged() {
    const value = (document.getElementById('page-size') as HTMLInputElement).value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  tabChange(event: MatTabChangeEvent) {
    this.status = String(event.index);
    this.loadGridData();
    this.loadDummyData();
  }

  loadDummyData() {
    // this.rowData = [
    //   {
    //     expense_request_number: 'EXP001',
    //     expense_type: 'Miscellaneous',
    //     employee_name: 'John Doe',
    //     status: this.getStatusText(this.status)
    //   },
    //   {
    //     expense_request_number: 'EXP002',
    //     expense_type: 'Stationery',
    //     employee_name: 'Jane Smith',
    //     status: this.getStatusText(this.status)
    //   }
    // ];
  }
  loadGridData(): void {
    if (this.status == "0") {
      this.travelService.changeStatus('0');
      this.rowData = []
      const payload = {
        "entity_id": this.entity_Id,
        "employee_id": this.loginUser.employee_id,
        "financial_year_id": this.financial_id,
        "role": this.loginUser.role,
        expense_request_type: "Other_Expense"
      }
      this._commonService?.showLoader()
      this.travelService.get_all_exp_request(payload).subscribe(
        (res: any) => {
          this._commonService?.hideLoader();
          this.rowData = res.data;
        },
        (err: any) => {
          this._commonService?.hideLoader()
          console.error('Error fetching data', err.error.message);
        }
      );
    } else if (this.status == "1") {
      this.travelService.changeStatus('1');
      this.rowData = []
      this._commonService?.showLoader()
      this.travelService.get_all_otherExpense(this.loginUser.employee_id, this.entity_Id, "Other_Expense").subscribe(
        (res: any) => {
          this._commonService?.hideLoader();
          this.rowData = res.data;
        },
        (err: any) => {
          this._commonService?.hideLoader()
          console.error('Error fetching data', err.error.message);
        }
      );
    } else if (this.status == "2") {
      this.travelService.changeStatus('2');
      this.rowData = []
      this._commonService?.showLoader()
      this.travelService.get_expense_approved_list(this.loginUser.employee_id, this.entity_Id, "Other_Expense").subscribe(
        (res: any) => {
          this._commonService?.hideLoader();
          this.rowData = res.data;
        },
        (err: any) => {
          this._commonService?.hideLoader()
          console.error('Error fetching data', err.error.message);
        }
      );
    } else if (this.status == "3") {
      this.travelService.changeStatus('3');
      this.rowData = []
      this._commonService?.showLoader()
      this.travelService.get_expense_rejected_list(this.loginUser.employee_id, this.entity_Id, "Other_Expense").subscribe(
        (res: any) => {
          this._commonService?.hideLoader();
          this.rowData = res.data;
        },
        (err: any) => {
          this._commonService?.hideLoader()
          console.error('Error fetching data', err.error.message);
        }
      );
    }
  }
  getStatusText(status: string): string {
    switch (status) {
      case '0': return 'Draft';
      case '1': return 'Pending';
      case '2': return 'Approved';
      case '3': return 'Rejected';
      default: return 'Unknown';
    }
  }
  statusCellClicked(e: any) {

    if (e.colDef && e.colDef.headerName === 'Action') {
      return;
    }
    if (this.status == '0') {
      const dialogRef = this.dialog.open(OtherExpenseWorkflowLevelComponent, { width: '400px', data: e.data });
    }
  }
}
