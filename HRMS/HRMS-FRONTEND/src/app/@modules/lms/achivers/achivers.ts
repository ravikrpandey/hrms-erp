import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { LmsService } from 'src/app/@shared/services/lms/lms.service';
import { environment } from 'src/app/environments/environment';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
// import { CourseRequestActionComponent } from './course-request-action/course-request-action.component';

@Component({
  selector: 'app-achivers',
  templateUrl: './achivers.html',
  styleUrls: ['./achivers.scss']
})
export class Achivers {
@ViewChild('tabGroup') tabGroup: MatTabGroup;
  baseUrl : any
  id: any;
  loginUserDetails: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  public gridOptions: any = { rowSelection: 'multiple', };
  rowData: any;
  status: String = '0';
  columnDefs: any =[]
 
  constructor(
    private _lmsService: LmsService,
    public dialog: MatDialog,
    private toaster: ToastrService, private router: Router
  ) {
    this.rowClass = 'rowClass'
    this.baseUrl = environment.serverUrl;

  }

  ngOnInit(): void {
    this.loginUserDetails = localStorage.getItem("loginUserDetails");
    this.loginUserDetails = JSON.parse(this.loginUserDetails)
    this.loadGridData()
    
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    
  }
 
  
  tabChange(event: MatTabChangeEvent): void {
    const tabIndex = event.index;
    this.status = String(tabIndex);
  
    if (this.status === '1') {

      this.columnDefs = this.columnDefs.filter((col: any) => col.headerName !== 'action');
    } else {
     
      this.columnDefs = [
        ...this.columnDefs.filter((col: any) => col.headerName !== 'action'),
        // {
        //   headerName: "acffffffftion",
        //   field: '',
        //   flex: 1,
        //   minWidth: 150,
        //   cellRenderer: CourseRequestActionComponent,
        //   cellRendererParams: {
        //     className: 'mat-blue',
        //     hideRequestButton: true,
        //     hideDetailsButton: false,
        //     hideDownloadIcon: false,
        //     showCustomIcon: false, 
        //   },
        // },
      ];
    }
    this.loadGridData();
  }
  


  tabs = [
    { label: 'Course Request' },
    { label: 'Allocated Course From Request' },
  ];

  loadGridData(): void {
    
    if(this.status =="0"){
      this.rowData=[]
      
        
        this._lmsService.getHighlightedList().subscribe((res: any) => {
          this.rowData = res.data;
          this.filterData = [...res.data];
        });
        this.columnDefs= [
     {
       headerName: "S.No" ,
       valueGetter: "node.rowIndex + 1",
       sortable: true,
       resizable: true,
       wrapHeaderText: true,
       autoHeaderHeight: true,
       cellClass: 'grid-cell-centered',
       flex: 1,
       maxWidth:85,
     },
     {
       headerName: "Assessment Name",
       field: 'assessment_name',
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
       headerName: "Assessment Time Minutes",
       field: 'assessment_time_minutes',
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
       headerName: "Max Attempts",
       field: 'max_attempts',
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
       headerName: "Pass Percentage",
       field: 'pass_percentage',
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
       headerName: "Total Marks",
       field: 'total_marks',
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
       headerName: "Obtained Marks",
       field: 'obtained_marks',
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
       headerName: "Name",
       field: 'name',
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
     
    //  {
    //    headerName: "Action",
    //    field: '',
    //    flex: 1,
    //    minWidth: 150,
    //    cellRenderer: CourseRequestActionComponent,
    //    cellRendererParams: {
    //      className: 'mat-blue',
    //      hideRequestButton: true,
    //      hideDetailsButton: false,
    //      hideDownloadIcon: false,
    //      showCustomIcon: false, // Hide attachment icon
 
    //    },
    //  },
   ];
  }
  else if(this.status =="1"){
      this.rowData=[]
     
        
        this._lmsService.getCourseRequestList(this.loginUserDetails?.employee_id).subscribe((res: any) => {
          this.rowData = res.data;
          this.filterData = [...res.data];
        });
        this.columnDefs= [
     {
       headerName: "S.No" ,
       valueGetter: "node.rowIndex + 1",
       sortable: true,
       resizable: true,
       wrapHeaderText: true,
       autoHeaderHeight: true,
       cellClass: 'grid-cell-centered',
       flex: 1,
       maxWidth:85,
     },
     {
       headerName: "Employee Name",
       field: 'first_name',
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
       headerName: "Course Category",
       field: 'category',
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
       headerName: "Course Name",
       field: 'course_name',
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
     
    
   ];
  }
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
    this.payload = {
    "employee_id":this.loginUserDetails?.employee_id
    }
    
    this._lmsService.getPendingRequestCourse(this.payload).subscribe((res: any) => {
      this.rowData = res.data;
      this.filterData = [...res.data];
    });
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url ;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }


}
