import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { GridApi } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { LmsService } from 'src/app/@shared/services/lms/lms.service';

@Component({
  selector: 'app-assign-assessment-dialog',
  templateUrl: './assign-assessment-dialog.component.html',
  styleUrls: ['./assign-assessment-dialog.component.scss']
})
export class AssignAssessmentDialogComponent {

  assign_id: any;
  course_id: any
  loginUserDetails: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  public gridOptions: any = { rowSelection: 'multiple', };
  rowData: any;
  courseDetail: any;
  count: any = 0;
  // subscription: Subscription;
  languageFlag: 'en' | 'pt' = 'en';
  columnDefs: any = []

  constructor(
    public dialog: MatDialogRef<AssignAssessmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _lmsService: LmsService,
    private toaster: ToastrService, private router: Router,
    private activateroute: ActivatedRoute,
  ) {
    this.rowClass = 'rowClass'
console.log(data)
  }

  ngOnInit(): void {
    this.loginUserDetails = localStorage.getItem("loginUserDetails");
    this.loginUserDetails = JSON.parse(this.loginUserDetails)
    this.activateroute.queryParams.subscribe((params: any) => {
      this.assign_id = params.assign_id;
      this.course_id = params.course_id;
    });
    this.getData()
  }
  payload: any
  getData(): void {
    this.payload = {
      "assign_id": this.data?.assign_id,
      "employee_id": this.data?.employee_id,
      "course_id": this.data?.course_id,
    }
    this._lmsService.getAssignCourseSubmitAssessmentDetail(this.payload).subscribe((response: any) => {
      this.data = response.data
    })
  }
}
