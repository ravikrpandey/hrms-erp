import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';
import { ActionsComponent } from './actions/actions.component';
import { MatDialog } from '@angular/material/dialog';
import { TravelExpenseWorkflowLevelDialogComponent } from './travel-expense-workflow-level/travel-expense-workflow-level-dialog.component';
import { CommonService } from 'src/app/@shared/services/common.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-travel-expense-list',
  templateUrl: './travel-expense-list.component.html',
  styleUrls: ['./travel-expense-list.component.scss']
})
export class TravelExpenseListComponent implements OnInit, AfterViewInit {
  @ViewChild('tabGroup') tabGroup: MatTabGroup;
  public gridOptions: any = { rowSelection: 'multiple', rowHeight: 55};
  private gridApi!: GridApi<any>;
  rowData: any = [];
  status: string = '0';
  rowClass: any;
  loginUser: any;
  entity_Id: any;
  financial_id: any;
  assignAction: any;

  constructor(private travelService: TravelRequestService,
    private _commonService : CommonService,  
    private _rbackService:RbacMasterService,
    public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
    this.selectingtab()
    this.localStorage()
    this.loadGridData();
  }

  selectingtab() {
    this.travelService.currentStatus.subscribe(status => {
      if (status) {
        this.status = status;
      }
    });
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

  public columnDefs = [
    {
      headerName: 'S.No',
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
      headerName: 'Expense Request Number',
      field: 'expense_request_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
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

  formatDate(dateString: any) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  }

  tabs = [
    { label: 'My Travel Expense' },
    { label: 'Pending For Approval' },
    { label: 'Approved' },
    { label: 'Rejected' },
  ];

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

  tabChange(event: MatTabChangeEvent): void {
    const tabIndex = event.index;
    this.status = String(tabIndex);
    this.loadGridData();
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
        expense_request_type: "Indirect_Expense"
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
      this.travelService.get_exp_levels_to_be_approved(this.loginUser.employee_id, this.entity_Id).subscribe(
        (res: any) => {
          this._commonService?.hideLoader()
          const modify:any=[]
          res.data.filter((data:any)=>{
            if(data?.expense_request_type === "Indirect_Expense"){
              modify.push(data)
            }
          })
          console.log(modify,"this.rowData<<<<<<<<<<<<<<<")
          this.rowData =modify;
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
      this.travelService.get_expense_approved_list(this.loginUser.employee_id, this.entity_Id, "Indirect_Expense").subscribe(
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
      this.travelService.get_expense_rejected_list(this.loginUser.employee_id, this.entity_Id, "Indirect_Expense").subscribe(
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

  setTabIndexBasedOnStatus(): void {
    this.tabGroup.selectedIndex = parseInt(this.status, 10) || 0;
  }

  statusCellClicked(e: any) {
  
    if (e.colDef && e.colDef.headerName === 'Action') {
      return;
    }
    if(this.status=='0'){
    const dialogRef = this.dialog.open(TravelExpenseWorkflowLevelDialogComponent, { width: '400px', data: e.data });
    }
  }

}
