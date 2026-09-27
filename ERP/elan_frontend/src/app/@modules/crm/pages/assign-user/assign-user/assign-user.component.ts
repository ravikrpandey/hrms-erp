import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColumnApi, GridApi, GridReadyEvent } from 'ag-grid-community';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { AddLeadFormSetupDialogComponent } from '../../dialogs/add-lead-form-setup-dialog/add-lead-form-setup-dialog.component';
import { Location } from '@angular/common';
import { ActionAssignUserComponent } from '../action-assign-user/action-assign-user.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AssignUserService } from 'src/app/@shared/services/crm/assign-user.service';

@Component({
  selector: 'app-assign-user',
  templateUrl: './assign-user.component.html',
  styleUrls: ['./assign-user.component.scss'],
})
export class AssignUserComponent implements OnInit {
  private gridApi!: GridApi<any>;
  private gridColumnApi: ColumnApi;
  rowData: any = [];
  candidate_id?: number;
  assignAction: any;
  rowClass: any;
  leadSummaryForm: FormGroup;
  userLoginId: any;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private recruitService: RecruitService,
    private _rbackService: RbacMasterService,
    private $crm: CrmService,
    private $assignUser: AssignUserService,
    private location: Location,

  ) {
    this.rowClass = 'rowClass';
    this.leadSummaryForm = this.fb.group({
      branch_id: new FormControl(null),
    });
  }

  ngOnInit(): void {
    this.userLoginId = localStorage.getItem('EmpMainId')
    if (this.userLoginId) {
      this.getAssignUserList();
      this.branchSetup_get();
    }
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  // Get all start
  getAssignUserList() {
    try {
      let branch_id = this.leadSummaryForm?.value?.branch_id;
      this.$assignUser.getAssignUserList(branch_id, 'branch_id', this.userLoginId).subscribe((response: any) => {
        if (response) {
          this.rowData = response.data;
        }
      }, err => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }
  // Get all end

  public columnDefs = [
    {
      headerName: 'S No.',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered ',
      flex: 1,
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
    },
    {
      headerName: 'Emp Code',
      field: 'employee_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Branch',
      field: 'branch_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Role',
      field: 'role_master_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Date',
      field: 'createdAt',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: ActionAssignUserComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },
  ];

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  goBack() {
    this.location.back();
  }

  // Get branch start
  branchList: any = [];
  branchSetup_get() {
    try {
      this.$crm.branchSetup_get().subscribe((response: any) => {
        if (response) {
          this.branchList = response.data;
        }
      }, err => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }
  // Get branch end

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

}