import { Component } from '@angular/core';
import 'ag-grid-enterprise';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ScheduledInterviewService } from 'src/app/@shared/services/service/recruitment/scheduled-interview.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';

@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.scss']
})
export class InterviewComponent {

  candidate_id: any;
  interview_round: any;
  final_remarks: any;
  userDetails: any;
  entity_id: any;
  user_id: any;
  status: any;

  ratingList: any = [
    {
      id: 1,
      descr: 'Bad'
    },
    {
      id: 2,
      descr: 'Not Satisfied'
    },
    {
      id: 3,
      descr: 'Satisfied'
    },
    {
      id: 4,
      descr: 'Good'
    },
    {
      id: 5,
      descr: 'Excellent'
    },
  ]

  public gridOptions: any = { rowSelection: 'multiple', };
  rowDataJob: any;
  constructor(
    private route: ActivatedRoute,
    private $scheduleInterview: ScheduledInterviewService,
    private toast: ToastrService,
    private location: Location,
  ) {
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.user_id = localStorage.getItem('EmpMainId');
    let lg: any = localStorage.getItem('signInUser');
    this.userDetails = JSON.parse(lg);
    localStorage.removeItem("jobId")

    this.route.queryParams.subscribe((params: any) => {
      this.candidate_id = params?.id;
      this.interview_round = params?.interview_round;
      this.status = params?.status;
      if (this.candidate_id && this.interview_round) {
        if (this.status == 'completed') {
          this.get_interview_round_details();
        } else {
          this.get_candidate_interview_details_by_id();
        }
      }
    });
  }


  //  Get start 
  basicDetails: any = {};
  skill_list: any = [];
  get_candidate_interview_details_by_id() {
   
    let query = {
      candidate_id: this.candidate_id,
      interview_round: this.interview_round
    }
    this.$scheduleInterview.get_candidate_interview_details_by_id(query).subscribe((res: any) => {
      console.log(res);
      this.basicDetails = res?.data[0];
      this.skill_list = this.basicDetails?.skill_list;
    })
  }

  // view get start
  get_interview_round_details() {
   
    let query = {
      candidate_id: this.candidate_id,
      interview_round: this.interview_round,
      interviewer_id: this.user_id,
    }
    this.$scheduleInterview.get_interview_round_details(query).subscribe((res: any) => {
      console.log(res);
      this.basicDetails = res?.data[0];
      this.skill_list = this.basicDetails?.skill_list;
      this.final_remarks = this.basicDetails?.final_remarks;
    })
  }

  // Submit start
  handleSubmit() {
   
    if (this.skill_list?.length) {
      this.skill_list?.map((item: any) => {
        if (!item?.skill_rating_point) {
          return this.toast.error('Rating fields should not be empty', 'Fields Error');
        }
        else {
          this.ratingList?.map((subItem: any) => {
            if (item?.skill_rating_point == subItem?.id) {
              item.skill_rating = subItem?.descr;
            }
          });
        }
      })
    }
    else {
      return this.toast.error('Rating fields should not be empty', 'Fields Error');
    }
    let body = {
      candidate_id: this.candidate_id,
      jd_id: this.basicDetails?.job_descripition_id,
      final_remarks: this.final_remarks,
      interview_round: Number(this.interview_round),
      interviewer_id: this.user_id,
      skill_details: this.skill_list?.length ? this.skill_list : null,
    }
  
    this.$scheduleInterview.update_candidate_interview_status(body).subscribe((res: any) => {
      console.log(res);
      if (res) {
        this.toast.success(res?.message);
        this.goBack();
      }
    })
  }
  // Submit end
  allSkillsRated() {
    return this.skill_list.every((item: any) => item?.skill_rating_point);
  }

  tabChange(event: MatTabChangeEvent): void {
  
    let label = event?.tab?.textLabel;
    if (label == "Received Profile") this.rowDataJob = this.basicDetails?.recieved_profile;
    else if (label == "Approved Profile") this.rowDataJob = this.basicDetails?.approved_profile;
    else if (label == "Rejected Profile") this.rowDataJob = this.basicDetails?.rejected_profile;
    else this.rowDataJob = [];
  }

  tabs: any[] = [
    { label: 'Received Profile' },
    { label: 'Approved Profile' },
    { label: 'Rejected Profile' },
    { label: 'Hold' },
  ];

  goBack() {
    this.location.back();
  }

}