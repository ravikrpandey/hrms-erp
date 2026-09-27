import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { calendarFormat } from 'moment';
import { ToastrService } from 'ngx-toastr';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-interview-update',
  templateUrl: './interview-update.component.html',
  styleUrls: ['./interview-update.component.scss']
})
export class InterviewUpdateComponent {
  interviewStatusForm: FormGroup;
  jobType: any;
  candidateArray: any;
  interviewGetId: any;
  candidateId: any;
  id: any;
  interview_id: any;
  constructor(private fb: FormBuilder, private route: Router, private recruitService: RecruitService, private activeroute: ActivatedRoute, private toaster: ToastrService,private location: Location) {
    this.interviewStatusForm = this.fb.group({
      jobTitle: new FormControl(null,[Validators.required]),
      jobRole: new FormControl(null,[Validators.required]),
      appDate: new FormControl(null,[Validators.required]),
      department: new FormControl(null,[Validators.required]),
      jobType: new FormControl(null,[Validators.required]),
      candidateName: new FormControl(null,[Validators.required]),
      email: new FormControl(null,[Validators.required]),
      mobile: new FormControl(null,[Validators.required]),
      experience: new FormControl(null,[Validators.required]),
      req_status: new FormControl(null,[Validators.required]),
      address: new FormControl(null,[Validators.required])
    })
  }

  ngOnInit() {
    this.recruitService.getAllCandidate().subscribe((res: any) => {
      
      this.candidateArray = res.result;
    });
    this.activeroute.queryParams.subscribe((params:any) => {
      this.id = params;
      
      this.interview_id = this.id.interview_id;
      this.candidateId = params.interview_id;
      
      this.recruitService.interViewGetIdBy(this.interview_id).subscribe((res: any) => {
        this.interviewGetId = res.data;
        this.patchFormvalue();
      })
    });
  }
  goBack() {
    this.location.back();
  }

  candidateClick(e: any) {
    
    this.candidateId = e;
    this.recruitService.interViewGetIdBy(e).subscribe((res: any) => {
      this.interviewGetId = res.data;
      
      this.patchFormvalue();
    })
  };

  patchFormvalue() {
    this.interviewStatusForm.patchValue({
      email: this.interviewGetId.email,
      candidateName: this.interviewGetId.candidate_id,
      mobile: this.interviewGetId.mobile,
      jobRole: this.interviewGetId.job_role,
      jobTitle: this.interviewGetId.job_applied,
      appDate: new Date(this.interviewGetId.createdAt),
      department: this.interviewGetId.department,
      jobType: this.interviewGetId.job_type,
      experience: this.interviewGetId.exprience,
      req_status: this.interviewGetId.requisition_status,
      address: this.interviewGetId.address
    })
  };

  submitForm() {
    if(this.interviewStatusForm.invalid){
      this.toaster.error('Required fields should not be empty', 'Required fields')
      return
    }
    let val = this.interviewStatusForm.value;
    
    const data = {
      // condidate_name: val.candidateName,
      email: val.email,
      mobile: val.mobile,
      job_title: val.jobTitle,
      job_role: val.jobRole,
      application_date: val.appDate,
      department: val.department,
      job_type: val.jobType,
      exprience: val.experience,
      requisition_status: val.req_status,
      address: val.address
    };
    

    this.recruitService.updateCandidateProfile(this.candidateId, data).subscribe(
      (res: any) => {
        
        this.toaster.success('Requisition Status Updated Successfully')
        this.route.navigate(["master/recuitment/interview-status-list"])
      }, (err: any) => {
        this.toaster.error('Something went wrong please try again', 'Error Message')
        
      }
    )

  }

}
