import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Subscription, BehaviorSubject } from 'rxjs';
import { LanguageTranslateService } from 'src/app/@shared/services/language_translate/language-translate.service';
import { LmsService } from 'src/app/@shared/services/lms/lms.service';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';
import { AssignCourseActionComponent } from '../assign-course-action/assign-course-action.component';
import { DialogAllocateCourseComponent } from '../dialog-allocate-course/dialog-allocate-course.component';
import { AssignAssessmentActionComponent } from './assign-assessment-action/assign-assessment-action.component';

@Component({
  selector: 'app-assign-course-detail',
  templateUrl: './assign-course-detail.component.html',
  styleUrls: ['./assign-course-detail.component.scss']
})
export class AssignCourseDetailComponent {

  baseUrl : any
  errorMessage: any;
  assign_id: any;
  loginUserDetails: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  public gridOptions: any = { rowSelection: 'multiple', };
  rowData: any;
  courseDetail: any;
  count: any = 0;
  // subscription: Subscription;
  languageFlag: 'en' | 'pt' = 'en';
  columnDefs: any =[]
  ALL: string = 'ALL';
  
  constructor(
    private _lmsService: LmsService,
    public dialog: MatDialog,
    private toaster: ToastrService, private router: Router,
    private activateroute: ActivatedRoute,
  ) {
    this.rowClass = 'rowClass'
    this.baseUrl = environment.serverUrl;
  }

  ngOnInit(): void {
    this.loginUserDetails = localStorage.getItem("loginUserDetails");
    this.loginUserDetails = JSON.parse(this.loginUserDetails)
    this.activateroute.queryParams.subscribe((params: any) => {
      this.assign_id = params.assign_id;
      
      
    });
    this.getCourseData();
this.employeeListOfManager()
    this.columnDefs= [
     {
       headerName: "Department" ,
       field: "department_name",
       sortable: true,
       resizable: true,
       wrapHeaderText: true,
       autoHeaderHeight: true,
       cellClass: 'grid-cell-centered',
       flex: 1,
       maxWidth:150,
     },
     {
       headerName: "Designation",
       field: 'designation_name',
       sortable: true,
       resizable: true,
       wrapHeaderText: true,
       autoHeaderHeight: true,
       cellClass: 'grid-cell-centered',
       flex: 1,
       minWidth:150,
       //editable: true,
     },
     {
       headerName: "Employee Name",
       field: 'employee_name',
       sortable: true,
       resizable: true,
       wrapHeaderText: true,
       autoHeaderHeight: true,
       cellClass: 'grid-cell-centered',
       flex: 1,
       minWidth:150,
       //editable: true,
     },
     {
       headerName: "Employee Code",
       field: 'employee_code',
       cellRenderer: '',
       cellRendererParams: {
         className: 'mat-blue',
         hideRequestButton: true,
         hideDetailsButton: false,
         hideDownloadIcon: false,
         showCustomIcon: false,
         someProperty: 'value',
       },
       cellClass: "grid-cell-centered",
       minWidth:150,
     },
     {
       headerName: "Status",
       field: 'status',
       flex: 1,
       minWidth: 150,
       cellRenderer: '',
       cellRendererParams: {
         className: 'mat-blue',
         hideRequestButton: true,
         hideDetailsButton: false,
         hideDownloadIcon: false,
         showCustomIcon: false, // Hide attachment icon
       },
      },
     {
       headerName: "Perform Date",
       field: 'attempt_date',
       flex: 1,
       minWidth: 150,
       cellRenderer: (params: any) => {
        return this.formatDate(params.value);
      },
       cellRendererParams: {
         className: 'mat-blue',
         hideRequestButton: true,
         hideDetailsButton: false,
         hideDownloadIcon: false,
         showCustomIcon: false, // Hide attachment icon
       },},
     {
       headerName: "No. of Attempts",
       field: 'no_of_attempts',
       flex: 1,
       minWidth: 150,
       cellRenderer: '',
       cellRendererParams: {
         className: 'mat-blue',
         hideRequestButton: true,
         hideDetailsButton: false,
         hideDownloadIcon: false,
         showCustomIcon: false, // Hide attachment icon
       },
     },
     {
       headerName: "Marks %",
       field: 'marks',
       flex: 1,
       minWidth: 150,
       cellRendererParams: {
         className: 'mat-blue',
         hideRequestButton: true,
         hideDetailsButton: false,
         hideDownloadIcon: false,
         showCustomIcon: false, // Hide attachment icon
       },
     },
     {
      headerName: "Status",
      field: 'marks',
      flex: 1,
      minWidth: 150,
      cellRenderer: AssignAssessmentActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },
   ];
  }

  
  onGridReady(params: GridReadyEvent) {
    console.log('Grid is ready', params);

    this.gridApi = params.api;
    
  }
 
  

  
 
  filterData: any = []
  filterSupplier(event: Event): void {
    const input = event.target as HTMLInputElement;
    const searchValue = input.value.trim().toLowerCase();
    if (searchValue) {
      this.rowData = this.filterData.filter((course: any) =>
        course.course_name.toLowerCase().includes(searchValue)
      );
    } else {
      this.rowData = [...this.filterData];
    }
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
  payload:any
  getCourseData() {
    this._lmsService.assignSubmissionDetail(this.assign_id).subscribe({
      next: (res: any) => {
        if (res.data) {
          this.rowData = res.data;
          this.courseDetail = res.assignedCourse;
          this.filterData = [...res.data];
        } else {
         
          this.toaster.warning('No submissions found for the given assign_id');
          this.router.navigate(['/master/lms/assign-course']); // Adjust route as needed
        }
      },
      error: (error: any) => {
        if (error.status === 404) {
          
          this.toaster.error(error.error.message || 'No submissions found for the given assign_id');
          this.router.navigate(['/master/lms/assign-course']); // Adjust route as needed
        } else {
          
          this.toaster.error('Failed to process the request. Please try again later.');
        }
      },
    });
  }
  
  

  reloadCurrentRoute() {
    let currentUrl = this.router.url ;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  delete(assign_id:any) {
    

    Swal.fire({
      title: 'Are you sure to remove assign course ?',
      text: "You won't be able to revert this!",
      icon: 'question',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        const data = {
          status: "INACTIVE"
        }
        this._lmsService.deleteAssignCourse(assign_id, data).subscribe(
          (res: any) => {

            this.toaster.success('Deleted Successfully')
            this.reloadCurrentRoute();
          }, (err) => {

            this.toaster.success('Something went wrong please try again', 'Error Message')
          }
        )
      };
    });
  }

  // ngOnDestroy(): void {
  //   this.subscription.unsubscribe();
  // }
  // employeeListOfManager(){
  //   let payload ={
  //     "employee_id":this.loginUserDetails?.employee_id
  //   }
  //   this._lmsService.employelist(payload).subscribe({
  //     next: (res: any) => {
  //       this.employees = res.data;
  //     }
  //   })
  // }
  selectedEmployee: any
  newcolumnDefs = []
  newRowData: any
  employees: any[] = [];
  filteredEmployees: any[] = [];

  employeeListOfManager() {
    const payload = {
      employee_id: this.loginUserDetails?.employee_id
    };
    this._lmsService.employelist(payload).subscribe({
      next: (res: any) => {
        this.employees = res.data;
        this.filteredEmployees = [...this.employees]; // Copy initially
      }
    });
  }

  onEmployeeFilter(filteredData: any[]) {
    this.filteredEmployees = filteredData;
  }

  onEmployeeSelect(event: any) {
    const selectedValue = event.value;
    let payload ={
      "employee_id":selectedValue
    }

    if (selectedValue === this.ALL) {
      this.rowData =[]
      this.getCourseData()
    } else {
      this.rowData =[]
      this._lmsService.employeeSubmissionDetail(this.assign_id,payload).subscribe(
        (res: any) => {
          this.rowData = res.data;
        }
      )
     
    }
  }

allocateCourse(){
  const dialogRef = this.dialog.open(DialogAllocateCourseComponent, {
width:'50%',
height:'400px',
maxHeight:'100vh',
maxWidth: '100vw',
  })
}
formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date); // Format: DD/MM/YYYY
}

}
