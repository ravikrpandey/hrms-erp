import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { GridApi } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LmsService } from 'src/app/@shared/services/lms/lms.service';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-allocated-course',
  templateUrl: './allocated-course.component.html',
  styleUrls: ['./allocated-course.component.scss']
})
export class AllocatedCourseComponent {
  baseUrl: any
  errorMessage: any;
  id: any;
  loginUserDetails: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  count: any = 0;
  subscription: Subscription;
  languageFlag: 'en' | 'pt' = 'en';
  columnDefs: any
  entity_id: any = localStorage.getItem("selectedEntityId");

  constructor(
    private _lmsService: LmsService,
    public dialog: MatDialog, private activetRoute: ActivatedRoute,
    private toaster: ToastrService, private router: Router,
  ) {
    this.rowClass = 'rowClass'
    this.baseUrl = environment.servralUrl;
  }

  ngOnInit(): void {
    this.loginUserDetails = localStorage.getItem("signInUser");
    this.loginUserDetails = JSON.parse(this.loginUserDetails)
    this.getCourseData();
  }


  View(e: any) {
    this.router.navigate(['master/ess/learning-gallery/allocated-course/allocate-course-detail'], { queryParams: { assign_id: e.assign_id, action_type: 'view' } })
  }

  edit(e: any) {
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
  payload: any
  getCourseData() {
    this.payload = {
      "department_id": this.loginUserDetails?.department_id,
      "designation_id": this.loginUserDetails?.designation_id,
      "employee_id": this.loginUserDetails?.employee_id,
      "entity_id": this.entity_id
    }
    console.log(this.payload);

    this._lmsService.getAllocateCourse(this.payload).subscribe((res: any) => {
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
}
