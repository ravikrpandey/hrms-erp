import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { GridApi } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LanguageTranslateService } from 'src/app/@shared/services/language_translate/language-translate.service';
import { LmsService } from 'src/app/@shared/services/lms/lms.service';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-common-course',
  templateUrl: './common-course.component.html',
  styleUrls: ['./common-course.component.scss']
})
export class CommonCourseComponent {
  baseUrl : any
  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;
  subscription: Subscription;
  languageFlag: 'en' | 'pt' = 'en';
  columnDefs: any
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
    this.getCourseData();
    this.language_service.data$.subscribe((languagetype: any) => {
      this.languageFlag = languagetype || 'pt';
      this.languageSubject.next(this.languageFlag);
    })
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
  View(e:any) {
    // if (e.assessmentCount > 0) {
    //   this.router.navigate(['master/lms/course/add_assesment'],
    //     { queryParams: { course_id: e.id ,tab :'assessment',action_type: 'view'} })
    // } else if(e.assessmentCount == 0) {
    //   this.router.navigate(['master/lms/course/add_course'],
    //     { queryParams: { course_id: e.id ,tab : 'content',action_type: 'view' } })
    // }
    this.router.navigate(['master/ess/learning-gallery/common-course/course-detail'], { queryParams: { course_id: e.id, action_type: 'view' } })
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
  getCourseData() {
    this._lmsService.getCommonCourses().subscribe((res: any) => {
      this.rowData = res.data;
      this.filterData = [...res.data];
    });
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  delete(course_id:any) {
    // e.stopPropagation();

    Swal.fire({
      title: 'Are you sure to delete this Course ?',
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
        this._lmsService.deleteSingleCourse(course_id, data).subscribe(
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

  translate(key: keyof typeof CommonCourseComponent.prototype.translations['en']): string {
    const language = this.languageSubject.getValue();
    return this.translations[language][key] || key.toString();
  }
}
