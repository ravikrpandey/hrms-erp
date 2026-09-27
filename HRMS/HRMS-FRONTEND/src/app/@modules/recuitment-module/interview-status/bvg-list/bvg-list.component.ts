import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import moment from 'moment';
import { calendarFormat } from 'moment';
import { ToastrService } from 'ngx-toastr';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';

@Component({
  selector: 'app-bvg-list',
  templateUrl: './bvg-list.component.html',
  styleUrls: ['./bvg-list.component.scss']
})
export class BvgListComponent {
  interviewStatusForm: FormGroup;
  jobType: any;
  candidateArray: any;
  interviewGetId: any;
  candidateId: any;
  id: any;
  interview_id: any;
  shorListedCandidate: any = [];
  candidateListSearch: any = []
  candidateListSearch1: any = []

  now = new Date();
  year = this.now.getFullYear();
  month = this.now.getMonth();

  dates = this.now.getDate();
  maxDate = moment({ year: this.year + 100, month: this.month, date: this.dates }).format('YYYY-MM-DD');
  minDate = moment({ year: this.year - 0, month: this.month, date: this.dates }).format('YYYY-MM-DD');
  constructor(private fb: FormBuilder, private toster: ToastrService, private route: Router, private recruitService: RecruitService, private activeroute: ActivatedRoute) {
    this.interviewStatusForm = this.fb.group({
      candidateName: new FormControl(null),
      email: new FormControl(null, [Validators.required]),
      mobile: new FormControl(null, [Validators.required]),
      jobRole: new FormControl(null, [Validators.required]),
      assignedManager: new FormControl(null, [Validators.required]),
      spocName: new FormControl(null, [Validators.required]),
      location: new FormControl(null, [Validators.required]),
      roundLevel: new FormControl(null, [Validators.required]),
      jobTitle: new FormControl(null, [Validators.required]),
      status: new FormControl(null, [Validators.required]),
      date_of_joining: new FormControl(null, [Validators.required])

    })
  }

  ngOnInit() {
    this.recruitService.getAllCandidate().subscribe((res: any) => {

      this.candidateArray = res.result;
    });
    this.activeroute.queryParams.subscribe(params => {
      this.id = params;

      this.interview_id = this.id.interview_id;

    });
    this.getFixedInterviewData();
  }

  get IF(): any { return this.interviewStatusForm.controls };

  candidateClick(id: any) {

    this.candidateId = id;
    this.recruitService.singleShortlisted_candidate(id).subscribe((res: any) => {
      this.interviewGetId = res.data;


      this.interviewStatusForm.patchValue({
        email: this.interviewGetId?.email,
        mobile: this.interviewGetId?.mobile,
        assignedManager: this.interviewGetId?.assigned_hiring_manager,
        location: this.interviewGetId?.address,
        spocName: this.interviewGetId?.spoc_name,
        jobRole: this.interviewGetId?.job_role,
        roundLevel: this.interviewGetId?.round_level,
        jobTitle: this.interviewGetId?.job_applied,
        status: this.interviewGetId?.final_interview_status,
        date_of_joining: this.interviewGetId?.date_of_joining
      })
      this.disableFields();
    })
  }

  submitForm() {
    if (this.interviewStatusForm.invalid) {
      this.toster.error("Required fields should not be empty", "Required fields")
      return
    }
    let val = this.interviewStatusForm.value;
    console.log(val);

    const formattedDate = moment(val.date_of_joining).format('YYYY-MM-DD');
    // const data = {
    //   email: val.email,
    //   mobile: val.mobile,
    //   assignedManager: val.assignedManager,
    //   spocName: val.spocName,
    //   jobRole: val.jobRole,
    //   roundLevel: val.roundLevel,
    //   location: val.location,
    //   status: val.status
    // }
    const data = {
      final_interview_status: val.status,
      date_of_joining: formattedDate
    };
    console.log(data);

    this.upadateFinalStatus(data);
  }

  upadateFinalStatus(data: any) {
    this.recruitService.updateFinalInterviewStatus(this.candidateId, data).subscribe((res: any) => {

      this.toster.success("Final interview status updated successfully", "updated successfully")
      this.route.navigate(['master/hrms/recuitment-module/interview-status-list']);
    }, (err: any) => {

      this.toster.error(err.error.message)
    }
    )
  }

  getFixedInterviewData() {
    let interViewArr: any = []
    this.recruitService.candidate_Final_Shortlisted().subscribe(
      (res: any) => {

        let c_Arr = res.result;


        // for (let i = 0; i < c_Arr.length; i++) {
        //   let sche_intv = c_Arr[i].schedule_fixed_interviews;
        //   if (sche_intv && sche_intv.length !== 0) {
        //     interViewArr.push(c_Arr[i]);
        //   };
        // };

        // for (let j = 0; j < interViewArr.length; j++) {
        //   let sche_intvArr = interViewArr[j].schedule_fixed_interviews;

        //   for (let k = 0; k < sche_intvArr.length; k++) {
        //     if (Number(sche_intvArr[k].round_level) === 3 && sche_intvArr[k].action === "Shortlisted" && interViewArr[j].final_interview_status === "Pending") {
        //       this.shorListedCandidate.push({
        //         candidate_id: interViewArr[j].candidate_id,
        //         condidate_name: interViewArr[j].condidate_name,
        //       });
        //     };
        //   };
        // };

        this.shorListedCandidate = res.result;
        this.candidateListSearch = this.shorListedCandidate.map((res: any) => res.condidate_name);
        this.candidateListSearch1 = this.shorListedCandidate

      }, (err: any) => {

      }
    )
  }
  productFilter(e: any) {
    const aa = e;
    let filteredVariable = this.candidateListSearch1?.filter((item: any) =>
      aa.includes(item.condidate_name)
    );
    this.shorListedCandidate = filteredVariable;


  }



  disableFields() {
    this.IF.email.disable();
    this.IF.mobile.disable();
    this.IF.jobRole.disable();
    this.IF.assignedManager.disable();
    this.IF.spocName.disable();
    this.IF.location.disable();
    this.IF.roundLevel.disable();
    this.IF.jobTitle.disable();
  }
  enableFields() {
    this.IF.email.disable();
    this.IF.mobile.disable();
    this.IF.jobRole.disable();
    this.IF.assignedManager.disable();
    this.IF.spocName.disable();
    this.IF.location.disable();
    this.IF.roundLevel.disable();
    this.IF.jobTitle.disable();
  }
}
