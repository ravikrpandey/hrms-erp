import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogAllocateCourseComponent } from './dialog-allocate-course/dialog-allocate-course.component';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LmsService } from 'src/app/@shared/services/lms/lms.service';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LanguageTranslateService } from 'src/app/@shared/services/language_translate/language-translate.service';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';
import { AssignCourseActionComponent } from './assign-course-action/assign-course-action.component';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';


@Component({
  selector: 'app-assign-course',
  templateUrl: './assign-course.component.html',
  styleUrls: ['./assign-course.component.scss']
})
export class AssignCourseComponent {

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
  status: String = '0';
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
  //   this.columnDefs= [
  //    {
  //      headerName: "s.no" ,
  //      valueGetter: "node.rowIndex + 1",
  //      sortable: true,
  //      resizable: true,
  //      wrapHeaderText: true,
  //      autoHeaderHeight: true,
  //      cellClass: 'grid-cell-centered',
  //      flex: 1,
  //      maxWidth:85,
  //    },
  //    {
  //      headerName: "Category",
  //      field: 'category',
  //      sortable: true,
  //      resizable: true,
  //      wrapHeaderText: true,
  //      autoHeaderHeight: true,
  //      cellClass: 'grid-cell-centered',
  //      flex: 1,
  //      minWidth:150,
  //      //editable: true,
  //    },
  //    {
  //      headerName: "Course Name",
  //      field: 'course_name',
  //      sortable: true,
  //      resizable: true,
  //      wrapHeaderText: true,
  //      autoHeaderHeight: true,
  //      cellClass: 'grid-cell-centered',
  //      flex: 1,
  //      minWidth:150,
  //      //editable: true,
  //    },
  //    {
  //      headerName: "Unit",
  //      field: 'type',
  //      cellRenderer: '',
  //      cellRendererParams: {
  //        className: 'mat-blue',
  //        hideRequestButton: true,
  //        hideDetailsButton: false,
  //        hideDownloadIcon: false,
  //        showCustomIcon: false,
  //        someProperty: 'value',
  //      },
  //      cellClass: "grid-cell-centered",
  //      minWidth:150,
  //    },
  //    {
  //     headerName: "Start Date",
  //     field: 'allocation_start_date',
  //     flex: 1,
  //     minWidth: 150,
  //     cellRenderer: (params: any) => {
  //       return this.formatDate(params.value);
  //     },
  //   },
  //   {
  //     headerName: "End Date",
  //     field: 'allocation_end_date',
  //     flex: 1,
  //     minWidth: 150,
  //     cellRenderer: (params: any) => {
  //       return this.formatDate(params.value);
  //     },
  //   },
  //    {
  //      headerName: "Status",
  //      field: 'status',
  //      flex: 1,
  //      minWidth: 150,
  //      cellRenderer: '',
  //      cellRendererParams: {
  //        className: 'mat-blue',
  //        hideRequestButton: true,
  //        hideDetailsButton: false,
  //        hideDownloadIcon: false,
  //        showCustomIcon: false, // Hide attachment icon
  //      },
  //    },
  //    {
  //      headerName: "Action",
  //      field: 'assign_id',
  //      flex: 1,
  //      minWidth: 150,
  //      cellRenderer: AssignCourseActionComponent,
  //      cellRendererParams: {
  //        className: 'mat-blue',
  //        hideRequestButton: true,
  //        hideDetailsButton: false,
  //        hideDownloadIcon: false,
  //        showCustomIcon: false, // Hide attachment icon
  //      },
  //    },
  //  ];
  this.loadGridData();
  }

  tabChange(event: MatTabChangeEvent): void {
    const tabIndex = event.index;
    this.status = String(tabIndex);
  
    if (this.status === '1') {

      this.columnDefs = this.columnDefs.filter((col: any) => col.headerName !== 'action');
    } else {
     
      this.columnDefs= [
     {
       headerName: "s.no" ,
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
       headerName: "Category",
       field: 'category',
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
       headerName: "Course Name",
       field: 'course_name',
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
       headerName: "Unit",
       field: 'type',
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
      headerName: "Start Date",
      field: 'allocation_start_date',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        return this.formatDate(params.value);
      },
    },
    {
      headerName: "End Date",
      field: 'allocation_end_date',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        return this.formatDate(params.value);
      },
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
       headerName: "Action",
       field: 'assign_id',
       flex: 1,
       minWidth: 150,
       cellRenderer: AssignCourseActionComponent,
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
    this.loadGridData();
  }
  


  tabs = [
    { label: 'Completed Assessment' },
    { label: 'Pending Assessement' },
  ];

  loadGridData(): void {
    
    if(this.status =="0"){
      this.rowData=[]
      
        
        this._lmsService.assignCourseList().subscribe((res: any) => {
          this.rowData = res?.data.filter((item: any) => item.submit_count > 0);
          this.filterData = [...this.rowData];
        });
        this.columnDefs= [
     {
       headerName: "s.no" ,
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
       headerName: "Category",
       field: 'category',
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
       headerName: "Course Name",
       field: 'course_name',
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
       headerName: "Unit",
       field: 'type',
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
      headerName: "Start Date",
      field: 'allocation_start_date',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        return this.formatDate(params.value);
      },
    },
    {
      headerName: "End Date",
      field: 'allocation_end_date',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        return this.formatDate(params.value);
      },
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
       headerName: "Action",
       field: 'assign_id',
       flex: 1,
       minWidth: 150,
       cellRenderer: AssignCourseActionComponent,
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
  else if(this.status =="1"){
      this.rowData=[]
     
        
        this._lmsService.assignCourseList().subscribe((res: any) => {
          this.rowData = res.data.filter((item: any) => item.submit_count == 0);
          this.filterData = [...this.rowData];
        });
       this.columnDefs= [
     {
       headerName: "s.no" ,
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
       headerName: "Category",
       field: 'category',
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
       headerName: "Course Name",
       field: 'course_name',
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
       headerName: "Unit",
       field: 'type',
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
      headerName: "Start Date",
      field: 'allocation_start_date',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        return this.formatDate(params.value);
      },
    },
    {
      headerName: "End Date",
      field: 'allocation_end_date',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        return this.formatDate(params.value);
      },
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
       headerName: "Action",
       field: 'assign_id',
       flex: 1,
       minWidth: 150,
       cellRenderer: AssignCourseActionComponent,
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
  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date); // Format: DD/MM/YYYY
  }
  private getColumnHeaderTranslations() {
    return {
      en: {
        reviewId: 'S.No.',
        reviewName: 'Review',
        status: 'Status',
        action: 'Action'
      },
      pt: {
        reviewId: 'ID do País',
        reviewName: 'Código do País',
        status: 'Estado',
        action: 'Ação'
      }
    };
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

  edit(e: any) {
    console.log(e);
    if (e.assessmentCount > 0) {
      this.router.navigate(['master/lms/course/add_assesment'],
        { queryParams: { course_id: e.id ,tab :'assessment'} })
    } else if(e.assessmentCount == 0) {
      this.router.navigate(['master/lms/course/add_course'],
        { queryParams: { course_id: e.id ,tab : 'content' } })
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
      "department_id":this.loginUserDetails?.department_id,
    "designation_id":this.loginUserDetails?.designation_id,
    "employee_id":this.loginUserDetails?.employee_id
    }
    
    this._lmsService.assignCourseList().subscribe((res: any) => {
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  translate(key: keyof typeof AssignCourseComponent.prototype.translations['en']): string {
    const language = this.languageSubject.getValue();
    return this.translations[language][key] || key.toString();
  }

allocateCourse(){
  const dialogRef = this.dialog.open(DialogAllocateCourseComponent, {
width:'50%',
height:'400px',
maxHeight:'100vh',
maxWidth: '100vw',
  })
}



}