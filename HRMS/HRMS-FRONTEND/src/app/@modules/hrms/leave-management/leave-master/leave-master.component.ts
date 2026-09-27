import { Component } from '@angular/core';
import {
  GridApi,
  GridReadyEvent,
  CellValueChangedEvent
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LeaveManagementService } from 'src/app/@shared/services/leave-managemnet/leave-management.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
// import { EmploymentStatusComponent } from '../../../itticketing/configurationalmaster/employement-type/employment-status/employment-status.component';
import { LeaveActionsComponent } from 'src/app/@modules/hrms/leave-management/leave-actions/leave-actions.component';
import { AddLeaveComponent } from '../add-leave/add-leave.component';
import { LeaveMgtStatusComponent } from '../leave-mgt-status/leave-mgt-status.component';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';



@Component({
  selector: 'app-leave-master',
  templateUrl: './leave-master.component.html',
  styleUrls: ['./leave-master.component.scss']
})




export class LeaveMasterComponent {


  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;
  subscription: Subscription;
  entity_id: any;
  responseData: any;
  columnDefs: any;
  employeeId: any;
  financial_id: string | null;
  assignAction: any;


  constructor(
    private leaveManagementService: LeaveManagementService,
    public dialog: MatDialog,
    private route: Router,
    private activetRoute: ActivatedRoute,
    private toaster: ToastrService,
    private _rbackService: RbacMasterService,
  ) {
    this.rowClass = 'rowClass';
    this.subscription = route.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        // Handle navigation start event if needed
      }
    });
  }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
    this.entity_id = localStorage.getItem("selectedEntityId");
    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.countryss_id = this.id.countryss_id;

      // console.log(this.id, this.countryss_id);

    });




    //LOCAL STORAGE DATA============

    this.entity_id = localStorage.getItem('selectedEntityId')
    this.financial_id = localStorage.getItem('financial_id')

    let localStorageJSON: any = localStorage.getItem('signInUser')
    // Parse the JSON string into an object
    const jsonObject = JSON.parse(localStorageJSON);
    // Extract the employee_id
    this.employeeId = jsonObject.employee_id;


    console.log('entity_id :-', this.entity_id);
    console.log('financial_id :-', this.financial_id);
    console.log('employee_id :-', this.employeeId);



    //==============================










    this.updateColumnDefs();
    this.getData();
  }


  getData() {

    // let body = {
    //   entity_id: this.entity_id,
    //   employee_id: this.employeeId,
    //   financial_year_id: this.financial_id
    // }

    this.leaveManagementService.GetLeaveMasterList(this.financial_id, this.entity_id, this.employeeId).subscribe((res: any) => {
      this.responseData = res;
      this.rowData = res.data; // Set the rowData here

    },
      (err: any) => {
        this.rowData = [];
        console.log("No leave data found");

        // this.toaster.error(`${err.error.message}`);
      });
  }



  private updateColumnDefs() {
    this.columnDefs = [
      {
        field: 'S.No',
        valueGetter: (params: any) => params.node.rowIndex + 1,
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: "grid-cell-centered",
        flex: 1,
        minWidth: 150
      },
      {
        field: 'leave_code',
        headerName: 'Leave Code',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: "grid-cell-centered",
        flex: 1,
        minWidth: 150
      },
      {
        field: 'leave_name',
        headerName: 'Leave Name',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: "grid-cell-centered",
        flex: 1,
        minWidth: 150
      },
      {
        field: 'status',
        headerName: 'Status',
        cellRenderer: LeaveMgtStatusComponent,
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150
      },
      {
        headerName: 'Action',
        cellRenderer: LeaveActionsComponent,
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150
      }
    ];
  }



  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onCellValueChanged(event: CellValueChangedEvent) {
    // Handle cell value changes if needed
    if (event.colDef.field === 'status' && event.oldValue !== event.newValue) {
      // console.log('event  = ', event);

      this.updateLeaveStatus(event.data);
    }

  }


  updateLeaveStatus(data: any) {
    this.leaveManagementService.UpdateLeaveMasterById(data.leaveId, data).subscribe(
      (res: any) => {
        this.toaster.success('Status updated successfully');
        this.getData();
      },
      (err: any) => {
        this.toaster.error('Error updating status');
      }
    );
  }


  addRecordToGrid(data: any) {
    if (!data || data.id == null) { return; }

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

  onPageSizeChanged() {
    const value = (document.getElementById('page-size') as HTMLInputElement).value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter((document.getElementById('filter-text-box') as HTMLInputElement).value);
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddLeaveComponent, {
      width: '750px',
    });



    dialogRef.afterClosed().subscribe((result) => {
      this.getData()
    });
  }


  // onFilterTextBoxChanged() {
  //   this.gridApi.setQuickFilter( (document.getElementById('filter-text-box') as HTMLInputElement).value );
  // }



}
