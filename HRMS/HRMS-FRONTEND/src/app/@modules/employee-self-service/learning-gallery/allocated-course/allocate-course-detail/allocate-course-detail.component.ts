import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { LmsService } from 'src/app/@shared/services/lms/lms.service';
import { environment } from 'src/app/environments/environment';
import { CommonCourseDialogComponent } from '../../common-course/common-course-dialog/common-course-dialog.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-allocate-course-detail',
  templateUrl: './allocate-course-detail.component.html',
  styleUrls: ['./allocate-course-detail.component.scss']
})
export class AllocateCourseDetailComponent {
  categoryList: any = []
  dialogRef: MatDialog | any;
  now = new Date();
  baseUrl :any
  year = this.now.getFullYear();
  month = this.now.getMonth();
  date = this.now.getDate();
  loginUserDetails : any
  max = moment().format('YYYY-MM-DD');
  min = moment().format('YYYY-MM-DD');

  assign_id: string | null = null;
  request_id: string | null = null;
  Type: any;
  filteredList5: any;
  contentData: any = []
  dynamicText: string;
  dynamicbutton: string;
  paramsVal: any;
  action_type: any
  courseData :any
  assessmentData :any
  left_attempts : any

  constructor(
 
    private route: Router,
    private lmsSercice: LmsService,
    private toaster: ToastrService,
    private router: ActivatedRoute,
    public dialog: MatDialog,
  ) {
    this.loginUserDetails = localStorage.getItem("loginUserDetails");
    this.loginUserDetails = JSON.parse(this.loginUserDetails)
    this.router.queryParams.subscribe((params) => {
      this.assign_id = params['assign_id'];
      this.request_id = params['request_id'];
      this.action_type = params['action_type'];
      this.left_attempts = params['left'];
      this.dynamicText = this.assign_id ? 'Edit' : 'New';
      this.dynamicbutton = this.assign_id ? 'Update' : 'Save';
      this.dynamicText = this.request_id ? 'Edit' : 'New';
      this.dynamicbutton = this.request_id ? 'Update' : 'Save';
    });
    this.baseUrl = environment.serverUrl;
   
    if(this.assign_id){
      this.getAssignCourseById()
    }
    if(this.request_id){
      this.getAssignCourseRequestById()
    }
    
  }
 
  ngOnInit(): void {
  }
  
  


  openContent(e:any){
    const dialogRef = this.dialog.open(CommonCourseDialogComponent, {
      // width: '60%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      // height: '300px',
      data: { tableData: e, id: 1 }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.contentData[e.id] = result;
      }
    });
  }

  openlink(e:any){
    window.open( e, '_blank');
  }

  startAssessment(e: any) {

    Swal.fire({
      title: `You have ${e} attempts remaining. Would you like to begin the assessment now?`,
      // text: "You won't be able to revert this!",
      icon: 'info',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#5DB996",
      confirmButtonText: 'Start',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
      const left_attempt = e
      if(left_attempt > 0){
        if(this.assign_id){
          this.route.navigate(['master/ess/learning-gallery/allocated-course/assessment'], { queryParams: { assessment_id: this.assessmentData?.id, assign_id: this.assign_id,left :this.courseData?.left_attempts } })
        }
        if(this.request_id){
          this.route.navigate(['master/ess/learning-gallery/allocated-course/assessment'], { queryParams: { assessment_id: this.assessmentData?.id, request_id: this.request_id,left :this.courseData?.left_attempts } })
        }
      }else{
        Swal.fire({
          title :`You have no attempts left.`,
          icon : 'error',
          cancelButtonText : 'OKAY'
        })
      }
      };
    });
  }
  getStatusClass() {
    switch (this.courseData?.lastSubmissionStatus) {
      case 'PASS':
        return 'green';
      case 'FAIL':
        return 'red';
      case 'PENDING':
        return 'orange';
      default:
        return '';
    }
  }
  data: any
  getAssignCourseById() {
    let query ={
      "assign_id": this.assign_id,
      "employee_id":this.loginUserDetails?.employee_id
    }
    this.lmsSercice.getAssignCourseDetails(query).subscribe(
      (response: any) => {
        if (response?.data) {
          this.data = response
          this.courseData = response.data;
          this.assessmentData = response.data?.courseDetaile?.assesments[0];
          this.courseData.lastSubmissionStatus = (this.courseData?.lastSubmissionStatus) ? this.courseData?.lastSubmissionStatus : 'PENDING';
           }
      },
      error => {
        console.error('Error fetching course details:', error);
      }
    );
  }
  getAssignCourseRequestById() {
    let query ={
      "request_id": this.request_id,
      "employee_id":this.loginUserDetails?.employee_id
    }
    this.lmsSercice.getAssignCourseRequestDetails(query).subscribe(
      (response: any) => {
        if (response?.data) {
          this.data = response
          this.courseData = response.data;
          this.assessmentData = response.data?.courseDetaile?.assesments[0];
          this.courseData.lastSubmissionStatus = (this.courseData?.lastSubmissionStatus) ? this.courseData?.lastSubmissionStatus : 'PENDING';
           }
      },
      error => {
        console.error('Error fetching course details:', error);
      }
    );
  }
}
