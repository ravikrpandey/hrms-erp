import { Component, OnInit } from '@angular/core';
import {
  GridApi,
  GridReadyEvent
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AppListDialogComponent } from 'src/app/@shared/app-list-dialog/app-list-dialog.component';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import moment from 'moment';
import { OnBoardingActionComponent } from './on-boarding-action/on-boarding-action.component';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-on-boarding',
  templateUrl: './on-boarding.component.html',
  styleUrls: ['./on-boarding.component.scss']
})
export class OnBoardingComponent implements OnInit {
  errorMessage: any;
  products: any = [];
  id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  isLoading = true;
  jobIdNew: any;
  allOnboard_candidateList:any;
  employee_id: any;
  filterForm: FormGroup;
  now = new Date();
  year = this.now.getFullYear();
  month = this.now.getMonth();
  FromDate: string;
  toDate: string;
  date = this.now.getDate();
  maxDate = moment({ year: this.year + 100, month: this.month, date: this.date }).format('YYYY-MM-DD');
  minDate = moment({ year: this.year - 100, month: this.month, date: this.date }).format('YYYY-MM-DD');
  fromDate(e: any) {
    this.FromDate = moment(e.value).format('YYYY-MM-DD');
  }
  ToDate(e: any) {
    this.toDate = moment(e.value).format('YYYY/MM/DD');
  }
   data:any ={
    "startDate":null,
    "endDate":null
}
  // dateFormatter: any;
  constructor(private postServive: EmpMasterService,
    private router: Router,
    private route: ActivatedRoute,
    private _empService: EmpRegistrationService,
    private dialog: MatDialog,
    private toast: ToastrService,
    private recruitService: RecruitService) {
    this.rowClass = 'rowClass'
    this.filterForm = new FormGroup({
      startDate: new FormControl(null, [Validators.required]),
      endDate: new FormControl(null, [Validators.required])
    })
  }

  ngOnInit(): void {
    localStorage.removeItem("jobId")
    let data: any = [];


    let lg: any = localStorage.getItem('signInUser');
    let loginUser = JSON.parse(lg);
    console.log('loginUser', loginUser);
    this.employee_id = loginUser.employee_id;
    this.allOnboardList()
  }

  public columnDefs = [
    {
      headerName: 'S.No',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
    },
    {
      headerName: 'Candidate Name',
      field: 'condidate_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
    },
    {
      headerName: 'E-Mail Id',
      field: 'email', 
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
    },
    {
      headerName: 'Mobile Number',
      field: 'mobile', 
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Job Title',
      field: 'job_applied', 
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
    },
    {
      headerName: 'Application Date',
      field: 'application_date', 
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
      valueFormatter: function(params: any) {
        return moment(params.value).format('DD/MM/YYYY');
      },
    },
    {
      headerName: 'Status',
      field: 'status', 
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
    },
    {
      headerName: 'Action',
      field: 'id',
      flex:1,
      minWidth:150,
      cellRenderer: OnBoardingActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
      cellClass: "grid-cell-centered"
    }
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    

  }
  dateFormatter(createdAt: any) {
    return moment(createdAt).format('DD/MM/YYYY');
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

  onCellClicked(e: any) {
    console.log(e, 'e');
    
    this.jobIdNew = e.data.candidate_id;
    
    localStorage.setItem("jobId", this.jobIdNew);

  }

  allOnboardList(){
    this.recruitService.allOnboardList(this.employee_id, this.data).subscribe((res: any) => {
      this.allOnboard_candidateList = res.data;
      this.rowData = res.data;
      this.toast.success(res.message);
      console.log('data',this.rowData);
      
    },
    (err)=>{
    
      
      this.toast.error(err.error.message);
      
    }
    )
  }
  reset() {
    
    if (this.filterForm.invalid) {
      this.toast.warning('Already refreshed');
      return;
    }
    this.filterForm.reset();
    this.allOnboardList()

  }


  todate:any
  calculateDiff() {
    this.todate = this.filterForm.value.end_date;
  
  };

  searchAttendence() {
    if (this.filterForm.invalid) {
      this.toast.info('Please Select Date');
      return;
    }else{
      console.log(this.filterForm.value, 'log');
      this.data.startDate= moment(this.filterForm.value.startDate).format('YYYY-MM-DD');
      this.data.endDate= moment(this.filterForm.value.endDate).format('YYYY-MM-DD');
      console.log(this.data);
      
      this.allOnboardList()
    }
}
}