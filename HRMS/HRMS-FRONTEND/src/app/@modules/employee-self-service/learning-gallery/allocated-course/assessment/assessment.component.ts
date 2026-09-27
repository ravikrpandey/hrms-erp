import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { LmsService } from 'src/app/@shared/services/lms/lms.service';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.scss']
})
export class AssessmentComponent implements OnInit {
  assessmentForm: FormGroup;
  assessmentData: any;
  timeLeft: string = '';
  assessment_id: string | null = null;
  assign_id: string | null = null;
  request_id: string | null = null;
  baseUrl: any;
  loginUserDetails :any
  left_attempts: any
  private countdownInterval: any;
  constructor(
    private fb: FormBuilder,
    private route: Router,
    private lmsService: LmsService,
    private toastr: ToastrService,
    private router: ActivatedRoute
  ) {
    this.loginUserDetails = localStorage.getItem("loginUserDetails");
    this.loginUserDetails = JSON.parse(this.loginUserDetails)
    this.router.queryParams.subscribe((params) => {
      this.assessment_id = params['assessment_id'];
      this.left_attempts = params['left'];
      this.assign_id = params['assign_id'];
      this.request_id = params['request_id'];
    });

    this.baseUrl = environment.serverUrl;
    this.assessmentForm = this.fb.group({
      employee_id: [this.loginUserDetails?.employee_id, Validators.required], 
      assessment_id: [null, Validators.required],
      assign_id: [this.assign_id],
      request_id: [this.request_id],
      answers: this.fb.array([]) 
    });
  }

  ngOnInit(): void {
 
    if (this.assessment_id) {
      this.getAssessmentCourseDetails();
    }
    this.assessmentForm.patchValue({
      assessment_id: this.assessment_id
    });
    this.submitAssessment();
  }
  get answers(): FormArray {
    return this.assessmentForm.get('answers') as FormArray;
  }

  populateQuestions(): void {
    this.assessmentData.questions.forEach((question: any) => {
      this.answers.push(
        this.fb.group({
          question_id: [question.id, Validators.required],
          selected_option: ['', Validators.required]
        })
      );
    });
  }

  getAssessmentCourseDetails() {
    let query ={
      "assessment_id": this.assessment_id,
   "employee_id":this.loginUserDetails?.employee_id
    }
    this.lmsService.getAssessmentCourseDetails(query).subscribe(
      (response: any) => {
        if (response?.data) {
          this.assessmentData = response.data;

         
          this.assessmentForm.patchValue({
            assessment_id: this.assessment_id
          });

          
          this.populateQuestions();

         
          this.startCountdown(this.assessmentData.assessment_time_minutes);
        }
      },
      (error) => {
        console.error('Error fetching course details:', error);
      }
    );
  }

  submitAssessment(): void {
    // if (this.assessmentForm.invalid) {
    //   this.toastr.error('Please answer all the questions before submitting.');
    //   return;
    // }

    const requestBody = this.assessmentForm.value;

    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }

    this.lmsService.submitAssessment(requestBody).subscribe(
      (response: any) => {
        // this.toastr.success('Assessment submitted successfully!');
      },
      (error) => {
        console.error('Error submitting assessment:', error);
        this.toastr.error('Error submitting assessment.');
      }
    );
  }
  submitAssessmentUpdate(): void {
    if (this.assessmentForm.invalid) {
      this.toastr.error('Please answer all the questions before submitting.');
      return;
    }

    const requestBody = this.assessmentForm.value;

    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }

    this.lmsService.submitAssessmentUpdate(requestBody).subscribe(
      (response: any) => {
        this.toastr.success('Assessment submitted successfully!');
        if(this.assign_id){
          this.route.navigate(['/master/ess/learning-gallery/allocated-course']);
        }
        if(this.request_id){
          this.route.navigate(['/master/ess/learning-gallery/requested-course']);
        }
      },
      (error) => {
        console.error('Error submitting assessment:', error);
        this.toastr.error('Error submitting assessment.');
      }
    );
  }

  startCountdown(minutes: number): void {
    let totalSeconds = minutes * 60;

    this.countdownInterval = setInterval(() => {
      const minutesLeft = Math.floor(totalSeconds / 60);
      const secondsLeft = totalSeconds % 60;

      this.timeLeft = `${minutesLeft}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;

      if (totalSeconds === 0) {
        clearInterval(this.countdownInterval); 
        this.toastr.error('Time\'s up!');
        if(this.assign_id){
          this.route.navigate(['/master/ess/learning-gallery/allocated-course']);
        }
        if(this.request_id){
          this.route.navigate(['/master/ess/learning-gallery/requested-course']);
        }
        this.submitAssessmentUpdate();
        return;
      }

      totalSeconds--;
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}