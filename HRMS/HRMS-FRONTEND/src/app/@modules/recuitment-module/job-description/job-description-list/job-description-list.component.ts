import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  GridApi,
  GridReadyEvent
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionComponent } from '../../../../@shared/action/action.component';
import { MatDialog } from '@angular/material/dialog';
import { AppListDialogComponent } from 'src/app/@shared/app-list-dialog/app-list-dialog.component';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import moment from 'moment';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-job-description-list',
  templateUrl: './job-description-list.component.html',
  styleUrls: ['./job-description-list.component.scss']
})
export class JobDescriptionListComponent implements OnInit, AfterViewInit {
  errorMessage: any;
  products: any = [];
  id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  isLoading = true;
  jobIdNew: any;
  assignAction:any;
  // dateFormatter: any;
  constructor(private postServive: EmpMasterService,
    private router: Router,
    private route: ActivatedRoute,
    private _empService: EmpRegistrationService,
    private dialog: MatDialog,
    private _rbackService:RbacMasterService,
    private recruitService: RecruitService) {
    this.rowClass = 'rowClass'

  }

  ngOnInit(): void {
    localStorage.removeItem("jobId")
    
    this.getRecruitListData()
  }
  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.assignAction = this._rbackService.accessAssignAction();
    },0);
  }
  getRecruitListData(){
    this.recruitService.getRecruitList().subscribe((res: any) => {
      let data: any = [];
      for (let val of res.data) {
        let format: any = {
          id: val.id,
          job_title: val.job_title,
          description: val.description,
          FK_vertical_id: val.FK_vertical_id,
          job_role: val.job_role,
          vertical_name: val.vertical?.vertical_name,
          department: val.department,
          createdAt: val.createdAt,
          job_type: val.job_type?.job_type,
          experience: val.experience,
          number_of_positions: val.number_of_positions,
          location: val.location,
          requisition_status: val.requisition_status,
          spoc_name: val.spoc_name,
          status: val.status,
          end_date:val.end_date,
        }
        data.push(format);
        // 
        console.log(data, 'data');
        
      }
      this.rowData = data;
      // 
    })
  }
  public columnDefs = [
    {
      headerName: 'JD. Id',
      field: 'id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:130,
    },
    {
      headerName: 'Job Title',
      field: 'job_title',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:130,
    },
    {
      headerName: 'Job Description',
      field: 'description', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:130,
    },
    {
      headerName: 'Job Designation',
      field: 'job_role', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:130,
    },
    {
      headerName: 'Vertical',
      field: 'vertical_name', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:130,
    },
    {
      headerName: 'Department',
      field: 'department', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:130,
    },
    {
      headerName: 'Validity Date',
      field: 'end_date',
      valueFormatter: function(params: any) {
        return moment(params.value).format('DD/MM/YYYY');
      },
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      minWidth:130,
    },
    {
      headerName: 'Experience',
      field: 'experience', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:130,
    },
    // {
    //   headerName: 'No. of Position',
    //   field: 'number_of_positions', sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: "grid-cell-centered"
    // },
    {
      headerName: 'Location',
      field: 'location', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:130,
    },
    {
      headerName: 'Requisition Status',
      field: 'requisition_status', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:130,
    },
    {
      headerName: 'SPOC Name',
      field: 'spoc_name', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:130,
    },
    {
      headerName: 'Status',
      field: 'status', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:130,
    },

    {
      headerName: 'Action',
      field: 'id',
      flex:1,
      minWidth:150,
      cellRenderer: ActionComponent,
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
    this.jobIdNew = e.data.id;
    
    localStorage.setItem("jobId", this.jobIdNew);
    // this.router.navigate(['hrms/recruitment-module/job-description/job-description-list/action.component'], { queryParams: { job_id: this.jobIdNew } })
    const dialogRef = this.dialog.open(AppListDialogComponent, { width: '500px', data: { jobId: this.jobIdNew } });
    dialogRef.afterClosed().subscribe((result: any) => {
      
    })
  }

}