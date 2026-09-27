import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import * as moment from 'moment';
import { AppListDialogComponent } from 'src/app/@shared/app-list-dialog/app-list-dialog.component';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { ToastrService } from 'ngx-toastr';
import { OnActionComponent } from './on-action/on-action.component';

@Component({
  selector: 'app-on-boarding-emp-list',
  templateUrl: './on-boarding-emp-list.component.html',
  styleUrls: ['./on-boarding-emp-list.component.scss']
})
export class OnBoardingEmpListComponent {
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
  // dateFormatter: any;
  constructor(private postServive: EmpMasterService,
    private router: Router,
    private route: ActivatedRoute,
    private _empService: EmpRegistrationService,
    private dialog: MatDialog,
    private toast: ToastrService,
    private recruitService: RecruitService) {
    this.rowClass = 'rowClass'

  }

  ngOnInit(): void {
    localStorage.removeItem("jobId")
    let data: any = [];
    // this.recruitService.onBoargingList().subscribe((res: any) => {
     
    //   this.rowData = res.data;
      
    // })

    let lg: any = localStorage.getItem('signInUser');
    let loginUser = JSON.parse(lg);
    this.employee_id = loginUser.employee_id;
    this.allOnboardList()
  }

  public columnDefs = [
    {
      headerName: 'S.No',
      field:'employee_id',
      valueGetter: "",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
    },
    {
      headerName: 'Candidate Name',
      field: 'first_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
    },
    {
      headerName: 'E-Mail Id',
      field: 'personal_email', 
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
    },
    {
      headerName: 'Mobile Number',
      field: 'mobile_number', 
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150,
    },
    {
      headerName: 'Gender',
      field: 'gender', 
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
      cellRenderer: OnActionComponent,
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
    this.jobIdNew = e.data.candidate_id;
    
    localStorage.setItem("jobId", this.jobIdNew);
    // this.router.navigate(['hrms/recruitment-module/job-description/job-description-list/action.component'], { queryParams: { job_id: this.jobIdNew } })
    const dialogRef = this.dialog.open(AppListDialogComponent, { width: '500px', data: { onBoardingId: this.jobIdNew } });
    dialogRef.afterClosed().subscribe((result: any) => {
      
    })
  }

  allOnboardList(){
    this.recruitService.getAllSelectEmp().subscribe((res: any) => {
      this.allOnboard_candidateList = res.data;
      this.rowData = res.data;
      this.toast.success(res.message)
    },
    (err:any)=>{
      if(err.error.code == 404){
        this.toast.warning(err.error.message)
      }
      this.toast.error(err.error.message)
      
    }
    )
  }

}
