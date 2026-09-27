import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, GridOptions, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { ViewLeadStatusDialogComponent } from '../dialogs/view-lead-status-dialog/view-lead-status-dialog.component';
import { Location } from '@angular/common';
import { ActionLeadStatusComponent } from '../action/action-lead-status/action-lead-status.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { CrmSubjectService } from 'src/app/@shared/services/crm/crm-subject.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lead-summary',
  templateUrl: './lead-summary.component.html',
  styleUrls: ['./lead-summary.component.scss'],
})
export class LeadSummaryComponent implements OnInit, AfterViewInit {
  private gridApi!: GridApi<any>;
  rowData: Candidate[] = [];
  candidate_id?: number;
  assignAction: any;
  rowClass: any;
  matBtnColor: boolean = true;
  leadSummaryForm: FormGroup;
  public gridOptions: any = { rowSelection: 'multiple', };
  selectedLeadList: any = [];
  userLoginId: any;
  entityId: string | null;
  financial_year_id: string | null;
  loginUser: any;

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private recruitService: RecruitService,
    private _rbackService: RbacMasterService,
    private $crm: CrmService,
    private crmSubject: CrmSubjectService,
    private toast: ToastrService,
  ) {
    this.rowClass = 'rowClass';
    this.leadSummaryForm = this.fb.group({
      user_id: new FormControl(null),
      from_date: new FormControl(null),
      to_date: new FormControl(null),
      status: new FormControl(null),
      assign_id: new FormControl(null),
    });
  }

  ngOnInit(): void {
    this.entityId = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    let lg: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(lg);
    this.userLoginId = localStorage.getItem('EmpMainId')
    if (this.userLoginId) {
      this.getLeadSummaryData();
      this.getEmployee();
      this.getLeadStatusData();
    }
  }

  dateRangeValidator(formGroup: FormGroup) {
    const fromDate = formGroup?.get('from_date')?.value;
    const toDate = formGroup?.get('to_date')?.value;
    if (fromDate && toDate && fromDate > toDate || !fromDate && toDate) {
      formGroup?.get('to_date')?.setErrors({ invalidDateRange: true });
      this.leadSummaryForm.patchValue({
        to_date: '',
      });
    } else {
      formGroup?.get('to_date')?.setErrors(null);
    }
  }

  // Get all start
  getLeadSummaryData() {
    try {
      this.rowData = [];
      let data = this.leadSummaryForm?.value;
      data.from_date = moment(data?.from_date).format('YYYY-MM-DD');
      data.to_date = moment(data?.to_date).format('YYYY-MM-DD');
      //
      this.$crm.getLeadSummaryData(data, this.userLoginId).subscribe((response: any) => {
        if (response) {
          this.rowData = response.data;
          this.rowData?.map((item: any) => {
            item.isChecked = false;
          })
        }
      }, err => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }
  // Get all end

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.assignAction = this._rbackService.accessAssignAction();
    }, 0);
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  public columnDefs = [
    {
      headerName: '', // Empty header for checkbox column
      field: 'isChecked',
      filter: true,
      sortable: true,
      headerCheckboxSelection: true,
      // headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
      width: 50,
    },
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
      headerName: 'Contact Person Name',
      field: 'contact_person_name',
      minWidth: 175,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Contact Number',
      field: 'contact_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Company Name',
      field: 'company_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Lead Owner',
      field: 'lead_owner',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Status',
      field: 'dynamic_fields.status',
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
      cellRenderer: ActionLeadStatusComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },
  ];


  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    //
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  onCellClicked(e: any) {
    return
    this.candidate_id = e.data.candidate_id;
    const dialogRef = this.dialog.open(ViewLeadStatusDialogComponent, {
      width: '500px',
      data: e.data,
    });
    dialogRef.afterClosed().subscribe((result: any) => {

    });
  }

  goBack() {
    this.location.back()
  }

  // Get employee start
  employeeList: any = [];
  getEmployee() {
    try {
      this.$crm.registrationall(this.entityId,this.loginUser?.roles).subscribe((response: any) => {
        if (response) {
          this.employeeList = response.data;
        }
      }, err => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }
  // Get employee end

  // Get status start
  statusList: any = [];
  getLeadStatusData() {
    try {
      this.$crm.getLeadStatusData().subscribe((response: any) => {
        if (response) {
          this.statusList = response.data;
        }
      }, err => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }
  // Get status end

  assignLead() {
    let userId = this.leadSummaryForm?.value?.assign_id;
    if (!userId || !this.selectedLeadList?.length) {
      return this.toast.error("Required fields should not be empty", "Fields Error")
    }
    if (userId && this.selectedLeadList?.length) {
      try {
        let req = {
          assign_id: userId,
          leadList: this.selectedLeadList,
          login_id: this.userLoginId,
        }
        this.$crm.createLeadSummary(req).subscribe((response: any) => {
          if (response) {
            this.toast.success(response.message);
          }
        }, err => {
          console.log(err);
        })
      } catch (error) {
        console.log(error);
      }
    }
  }

  onSelectionChanged(event: any): void {
    // Access the selected rows
    this.selectedLeadList = [];
    let selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows?.length) {
      selectedRows?.map((item: any) => {
        this.selectedLeadList.push({ create_lead_id: item?.id })
      })
    }
    console.log('Selected Rows:', selectedRows, this.selectedLeadList);
  }

  // from date and to date validation start
  now = new Date();
  year = this.now.getFullYear();
  month = this.now.getMonth();
  FromDate: string;
  toDate: string;
  noOfDay: any;
  todate: any;
  // day = this.now.getDay();
  date = this.now.getDate();
  maxDate = moment({ year: this.year + 100, month: this.month, date: this.date }).format('YYYY-MM-DD');
  minDate = moment({
    year: this.year - 0,
    month: this.month,
    date: this.date,
  }).format('YYYY-MM-DD');
  fromDate(e: any) {
    this.FromDate = moment(e.value).format('YYYY-MM-DD');
    this.leadSummaryForm.patchValue({ to_date: '' });
    this.getLeadSummaryData();
  }
  ToDate(e: any) {
    this.toDate = moment(e.value).format('YYYY/MM/DD');
    this.getLeadSummaryData();
  }

  calculateDiff() {
    this.todate = this.leadSummaryForm.value.to_date;
    if (this.leadSummaryForm.value.from_date && this.leadSummaryForm.value.to_date) {
      let currentDate = new Date(this.leadSummaryForm.value.from_date);
      let dateSent = new Date(this.leadSummaryForm.value.to_date);
      this.noOfDay = (Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()) -
        Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())) / 86400000;

      this.leadSummaryForm.controls['leaveCountDays'].patchValue(this.noOfDay + 1)
    }
  }
  // from date and to date validation end

}

export interface Candidate {
  candidate_id: number;
  condidate_name: string;
  email: string;
  mobile: string;
  assigned_hiring_manager: string;
  status: string;
  updatedAt: string;
  upload_resume: string;
}
