import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { GridApi } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { LmsService } from 'src/app/@shared/services/lms/lms.service';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-common-course',
  templateUrl: './common-course.component.html',
  styleUrls: ['./common-course.component.scss']
})
export class CommonCourseComponent {
  baseUrl: any
  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;
  subscription: Subscription;
  columnDefs: any
  entity_id: any = localStorage.getItem("selectedEntityId");
  constructor(
    private _lmsService: LmsService,
    public dialog: MatDialog, private activetRoute: ActivatedRoute,
    private toaster: ToastrService, private router: Router,
  ) {
    this.rowClass = 'rowClass'
    this.baseUrl = environment.servralUrl;
    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {


      }
    });
  }

  ngOnInit(): void {
    this.getCourseData();
  }

  View(e: any) {
    this.router.navigate(['master/ess/learning-gallery/common-course/course-detail'], { queryParams: { course_id: e.id, action_type: 'view' } })
  }

  edit(e: any) {
    console.log(e);
    if (e.assessmentCount > 0) {
      this.router.navigate(['master/lms/course/add_assesment'],
        { queryParams: { course_id: e.id, tab: 'assessment' } })
    } else if (e.assessmentCount == 0) {
      this.router.navigate(['master/lms/course/add_course'],
        { queryParams: { course_id: e.id, tab: 'content' } })
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
    this._lmsService.getCommonCourses(this.entity_id).subscribe((res: any) => {
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

  delete(course_id: any) {
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
}
