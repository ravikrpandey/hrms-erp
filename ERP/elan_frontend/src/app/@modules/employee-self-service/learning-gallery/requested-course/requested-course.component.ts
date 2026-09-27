import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogRequestedCourseComponent } from './dialog-requested-course/dialog-requested-course.component';
import { GridApi } from 'ag-grid-community';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LmsService } from 'src/app/@shared/services/lms/lms.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-requested-course',
  templateUrl: './requested-course.component.html',
  styleUrls: ['./requested-course.component.scss']
})
export class RequestedCourseComponent {

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
  loginUserDetails: any;

  constructor(
    private _lmsService: LmsService,
    public dialog: MatDialog,
    private toaster: ToastrService, private router: Router,
  ) {
    this.loginUserDetails = localStorage.getItem("signInUser");
    this.loginUserDetails = JSON.parse(this.loginUserDetails)
    this.rowClass = 'rowClass'
    this.baseUrl = environment.servralUrl;
    this.subscription = router.events.subscribe((event) => {
    });
  }

  ngOnInit(): void {
    this.getCourseData();
  }

  View(e: any) {
    this.router.navigate(['master/lms/course/add_assesment'],
      { queryParams: { course_id: e.course_id, tab: 'assessment', action_type: 'view' } })
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
  query: any
  getCourseData() {
    this.query = {
      "employee_id": this.loginUserDetails?.employee_id
    }
    this._lmsService.getAllRequestedCourses(this.query).subscribe((res: any) => {
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

  openDialog() {
    const dialogRef = this.dialog.open(DialogRequestedCourseComponent, {
      width: '50%',
    })
  }

}
