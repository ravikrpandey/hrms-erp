import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Subscription, BehaviorSubject } from 'rxjs';
import { AssignCourseActionComponent } from 'src/app/@modules/lms/assign-course/assign-course-action/assign-course-action.component';
import { DialogAllocateCourseComponent } from 'src/app/@modules/lms/assign-course/dialog-allocate-course/dialog-allocate-course.component';
import { LanguageTranslateService } from 'src/app/@shared/services/language_translate/language-translate.service';
import { LmsService } from 'src/app/@shared/services/lms/lms.service';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';
import { CourseApprovalActionComponent } from '../course-approval-action/course-approval-action.component';

@Component({
  selector: 'app-pending',
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.scss']
})
export class PendingComponent {
 baseUrl : any
  errorMessage: any;
  id: any;
  loginUserDetails: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  public gridOptions: any = { rowSelection: 'multiple', };
  rowData: any;
  count: any = 0;
  subscription: Subscription;
  languageFlag: 'en' | 'pt' = 'en';
  columnDefs: any =[]
  private languageSubject = new BehaviorSubject<'en' | 'pt'>('en');
  
  language$ = this.languageSubject.asObservable();
  translations = {
    en: {
      pageTitle: 'Lms Master',
      CourseMaster: 'Course Master',
      CourseMasterTable: 'Course Master Table',
      placeholder: 'Search'
    },
    pt: {
      pageTitle: 'Mestre de Configuração',
      CourseMaster: 'Mestre de País',
      CourseMasterTable: 'Tabela de Mestre de País',
      placeholder: 'Pesquisar'
    }
  };
  constructor(
    private _lmsService: LmsService,
    public dialog: MatDialog, private activetRoute: ActivatedRoute,
    private toaster: ToastrService, private router: Router,
    private language_service: LanguageTranslateService
  ) {
    this.rowClass = 'rowClass'
    this.baseUrl = environment.serverUrl;
    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {


      }
    });
  }

  ngOnInit(): void {
    this.loginUserDetails = localStorage.getItem("loginUserDetails");
    this.loginUserDetails = JSON.parse(this.loginUserDetails)
    this.getCourseData();
    console.log(this.loginUserDetails)
    this.language_service.data$.subscribe((languagetype: any) => {
      this.languageFlag = languagetype || 'pt';
      this.languageSubject.next(this.languageFlag);
    })
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
       headerName: "Category",
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
     
    //  {
    //    headerName: "status",
    //    field: 'req_id',
    //    flex: 1,
    //    minWidth: 150,
    //    cellRenderer: '',
    //    cellRendererParams: {
    //      className: 'mat-blue',
    //      hideRequestButton: true,
    //      hideDetailsButton: false,
    //      hideDownloadIcon: false,
    //      showCustomIcon: false, // Hide attachment icon
    //    },
    //  },
     {
       headerName: "Action",
       field: 'req_id',
       flex: 1,
       minWidth: 150,
       cellRenderer: CourseApprovalActionComponent,
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
    this.gridApi = params.api;
    
  }
 
  View(e:any) {
        const dialogRef = this.dialog.open(DialogAllocateCourseComponent, {
        width: '50%',
        data: { id :e.assign_id},
      });

    dialogRef.afterClosed().subscribe(result => {});
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
    //   "department_id":this.loginUserDetails?.department_id,
    // "designation_id":this.loginUserDetails?.designation_id,
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


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
