import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-candidate-short-create.component',
  templateUrl: './candidate-short-create.component.html',
  styleUrls: ['./candidate-short-create.component.scss']
})
export class CandidateShortCreateComponent implements OnInit {
  updateCandidateForm: FormGroup;
  candidateForm: any
  candiateList: any;
  interViewCount: any;
  showRemarksBar: boolean = false;
  showFinishedMsg: boolean = false;
  wantToFinalShortlist: boolean = false;
  TotlaInterviewLevel: any;
  lastInterviewData: any;
  countryList: any[] = [];
  condidateList2: any = [];
  condidateList1: any = [];

  constructor(private fb: FormBuilder, private toaster: ToastrService, private _recrutmentService: RecruitService, private route: Router) {


    this.updateCandidateForm = this.fb.group({
      candidateName: new FormControl(null, Validators.required),
      jobTitle: new FormControl(null, Validators.required),
      jobRole: new FormControl(null, Validators.required),
      applicationDate: new FormControl(null, Validators.required),
      department: new FormControl(null, Validators.required),
      jobType: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      mobileNumber: new FormControl(null, Validators.required),
      experience: new FormControl(null, Validators.required),
      requisitionStatus: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required)

    })


    this.candidateForm = this.fb.group({
      candidateRow: new FormArray([
        new FormGroup({
          mode_of_interview: new FormControl(null),
          interviewer_name: new FormControl(null),
          interview_date: new FormControl(null),
          remark: new FormControl(null, [Validators.required, Validators.maxLength(150)]
          ),
        })
      ]),
    })
  }
  ngOnInit(): void {
    this.getAllCondidate();
    this.disableFields();
  }
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  get CF_1(): any { return this.candidateForm.controls };
  get CFU_1(): any { return this.updateCandidateForm.controls };

  initiateForm(): FormGroup {
    return this.fb.group({
      mode_interview: [''],
      interview_name: [''],
      interview_date: [''],
      remark: ['', Validators.required],
    });
  };

  get getFormControls() {
    const control = this.candidateForm.get('candidateRow') as FormArray;
    return control;
  };


  getAllCondidate() {
    this._recrutmentService.getAllShortListedCandidate().subscribe(
      (res) => {

        this.candiateList = res.data;
        // this.countryList = res.data;
        this.condidateList1 = this.candiateList.map((res: any) => res.condidate_name);
        this.condidateList2 = this.candiateList;
      }, (err) => {

      }
    )
  };

  productFilter(e: any) {
    const aa = e;
    let filteredVariable = this.condidateList2?.filter((item: any) =>
      aa.includes(item.condidate_name)
    );
    this.candiateList = filteredVariable;


  }


  selectCandidate(e: any) {

    this.singleShortlisted_candidate(e.value);
  };

  singleShortlisted_candidate(id: any) {
    this._recrutmentService.singleShortlisted_candidate(id).subscribe(
      (res) => {

        // this.enableFields();
        this.TotlaInterviewLevel = res.data.interview_level
        this.patchCandidateData(res.data);
        let interArr: any = res.data.schedule_fixed_interviews;
        const isExist = interArr.some((e: any) => e?.final_shortlisted === true && e.action === "Shortlisted");
        const isExist_2 = interArr.some((e: any) => e.action === "Rejected");
        if (isExist || isExist_2) {
          this.showFinishedMsg = true;
        } else {
          this.showFinishedMsg = false;
        };
      }, (err) => {

      }
    )
  };

  patchCandidateData(data: any) {
    this.updateCandidateForm.patchValue({
      jobTitle: data.job_applied,  // this field was job title
      jobRole: data.job_role,
      applicationDate: moment(data.createdAt).format('YYYY-MM-DD'),
      department: data.department,
      jobType: data.job_type,
      email: data.email,
      mobileNumber: data.mobile,
      experience: data.exprience,
      requisitionStatus: data.requisition_status,
      address: data.address
    })
    // remarks box part & convert sheduled data for patch
    let interViewRound = data.schedule_fixed_interviews;
    let sheduledInterviewCont = [];
    for (let i = 0; i < interViewRound.length; i++) {
      let interviewdata: any = {
        action: interViewRound[i].action,
        candidate_id: interViewRound[i].candidate_id,
        interview_id: interViewRound[i].interview_id,
        interviewer_name: interViewRound[i].interviewer_name,
        mode_of_interview: interViewRound[i].mode_of_interview,
        remark: interViewRound[i].remark,
        round_level: interViewRound[i].round_level,
        interview_date: interViewRound[i].schedule_interview_date,
        interview_time: interViewRound[i].schedule_interview_time,
        final_shortlisted: interViewRound[i].final_shortlisted,
      };

      // change shortlist and reject button conditionlly
      let shortlistKey: string = 'Shortlisted';
      let rejectKey: string = 'Rejected';
      let pendingKey: string = 'Pending';
      if (interViewRound[i].action.toUpperCase() === shortlistKey.toUpperCase()) {
        interviewdata.isShortListed = true;
        interviewdata.isRejected = false;
      } else if (interViewRound[i].action.toUpperCase() === rejectKey.toUpperCase()) {
        interviewdata.isShortListed = false;
        interviewdata.isRejected = true;
      } else if (interViewRound[i].action.toUpperCase() === pendingKey.toUpperCase()) {
        interviewdata.isShortListed = false;
        interviewdata.isRejected = false;
      }
      sheduledInterviewCont.push(interviewdata);
    }

    let lastInterview = sheduledInterviewCont[sheduledInterviewCont.length - 1];
    this.lastInterviewData = lastInterview

    if (lastInterview?.isShortListed) {
      this.wantToFinalShortlist = true;
    } else {
      this.wantToFinalShortlist = false;
    }
    if (lastInterview?.isShortListed && lastInterview?.final_shortlisted) {
      this.wantToFinalShortlist = false;
    }

    // disable and enable controls conditionlly
    if (interViewRound && interViewRound.length >= 1) {
      this.showRemarksBar = true;
      this.CF_1.candidateRow = this.patchCandidateRow(sheduledInterviewCont);
      for (let i = 0; i < this.CF_1.candidateRow.controls.length; i++) {
        this.CF_1.candidateRow.controls[i].controls.mode_of_interview.disable();
        this.CF_1.candidateRow.controls[i].controls.interviewer_name.disable();
        this.CF_1.candidateRow.controls[i].controls.interview_date.disable();


        if (this.CF_1.candidateRow.controls[i].controls.isShortListed.value || this.CF_1.candidateRow.controls[i].controls.isRejected.value) {
          this.CF_1.candidateRow.controls[i].controls.remark.disable();
        } else {
          this.CF_1.candidateRow.controls[i].controls.remark.enable();
        }
      };
    } else {
      this.toaster.warning('please schedule the interview of this candidate');
      this.showRemarksBar = false;
      for (let i = 0; i < this.CF_1.candidateRow.controls.length; i++) {
        this.CF_1.candidateRow.controls[i].enable();
        this.CF_1.candidateRow.controls[i].reset();
      };
      this.CF_1.candidateRow.controls.length = 1;
    };
  };

  patchCandidateRow(e: any): FormArray {
    return new FormArray(
      e.map((x: any) => {
        const obj = new FormGroup({});
        Object.keys(x).forEach(k => {
          obj.addControl(k, new FormControl(x[k]));
        });
        return obj;
      })
    );
  }


  shortSubmit(control: any, i: any) {

    if (control.remark === null || control.remark.trim() === "") {
      this.toaster.error('Remark should not be blank', 'Required field');
      return
    };

    let shortlistKey: string = 'Shortlisted';

    Swal.fire({
      title: 'Are you sure to Shortlist this candidate',
      text: "You won't be able to revert this!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#067847',
      cancelButtonColor: '#f44336',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Not Now'
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.CF_1.candidateRow.length !== this.TotlaInterviewLevel) {
          this.shortlist_reject_Schedule_FixedInterview(control, shortlistKey, i);
        } else {
          this.shortlist_reject_Schedule_FixedInterview(control, shortlistKey, i);
          this.toaster.warning('Finished interview processe');
        }
      };
    })
  }

  rejected(control: any, i: any) {
    let rejectKey: string = 'Rejected';
    Swal.fire({
      title: 'Are you sure to reject this candidate',
      text: "You won't be able to revert this!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#be0000',
      cancelButtonColor: '#858586',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Not Now'
    }).then((result) => {
      if (result.isConfirmed) {
        this.shortlist_reject_Schedule_FixedInterview(control, rejectKey, i)
      };
    })
  }

  shortlist_reject_Schedule_FixedInterview(control: any, action: any, i: any) {
    const Data = {
      candidate_id: control.candidate_id,
      remark: control.remark,
      action: action,
    };

    this._recrutmentService.editSchedule_FixedInterview(control.interview_id, Data).subscribe(
      (res: any) => {

        if (action === 'Shortlisted') {
          this.lastInterviewData = control;
          control.isShortListed = true;
          control.isRejected = false;
          this.wantToFinalShortlist = true;
          this.CF_1.candidateRow.controls[i].controls.isShortListed.value = true;
          this.CF_1.candidateRow.controls[i].controls.isRejected.value = false;
          this.toaster.success(`${control.round_level} round clear`, 'Candidate Shortlisted');
          this.CF_1.candidateRow.controls[i].controls.remark.disable();
          // if(Number(control.round_level) === 3){
          //   this.showFinishedMsg = true;
          // }else{
          //   this.showFinishedMsg = false;
          // }

        } else if (action === 'Rejected') {
          control.isShortListed = false;
          control.isRejected = true;
          this.CF_1.candidateRow.controls[i].controls.isShortListed.value = false;
          this.CF_1.candidateRow.controls[i].controls.isRejected.value = true;
          this.toaster.error(`candidate rejected from ${control.round_level} round`, 'Candidate Rejected')
          this.CF_1.candidateRow.controls[i].controls.remark.disable();
          this.showFinishedMsg = true;
        }

      }, (err: any) => {

        control.isShortListed = false;
        control.isRejected = false;
        this.CF_1.candidateRow.controls[i].controls.isShortListed.value = false;
        this.CF_1.candidateRow.controls[i].controls.isRejected.value = false;
        this.toaster.error(err.error.message)
      }
    )
  }

  finalShortList() {
    const Data = {
      candidate_id: this.lastInterviewData.candidate_id,
      final_shortlisted: true
    };

    Swal.fire({
      title: 'Are you sure to final shortlist ?',
      text: "You won't be able to revert this!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#858586',
      cancelButtonColor: '#be0000',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Not Now'
    }).then((result) => {
      if (result.isConfirmed) {
        this._recrutmentService.editSchedule_FixedInterview(this.lastInterviewData.interview_id, Data).subscribe(
          (res: any) => {

            this.lastInterviewData.final_shortlisted = true;
            this.showFinishedMsg = true;
            this.wantToFinalShortlist = false;
            this.toaster.success('Final ShortListed')
          }, (err: any) => {
            this.toaster.error(err.error.message)
          }
        )
      };
    })

  }

  update_candidate(id: any, data: any) {
    this._recrutmentService.update_candidate(id, data).subscribe(
      (res) => {

        this.toaster.success('Updated Successfully');
      }, (err) => {

        this.toaster.error(err.error.message)
      }
    )
  };

  disableFields() {
    this.CFU_1.jobTitle.disable();
    this.CFU_1.jobRole.disable();
    this.CFU_1.applicationDate.disable();
    this.CFU_1.department.disable();
    this.CFU_1.jobType.disable();
    this.CFU_1.email.disable();
    this.CFU_1.mobileNumber.disable();
    this.CFU_1.experience.disable();
    this.CFU_1.requisitionStatus.disable();
    this.CFU_1.address.disable();
  };

  enableFields() {
    this.CFU_1.jobTitle.enable();
    this.CFU_1.jobRole.enable();
    this.CFU_1.applicationDate.enable();
    this.CFU_1.department.enable();
    this.CFU_1.jobType.enable();
    this.CFU_1.email.enable();
    this.CFU_1.mobileNumber.enable();
    this.CFU_1.experience.enable();
    this.CFU_1.requisitionStatus.enable();
    this.CFU_1.address.enable();
  };
  countryfilter(e: any) {
    const aa = e
    let filteredVariable = this.condidateList2.filter((item: any) => aa.includes(item.condidate_name));
    this.candiateList = filteredVariable
    console.log(this.candiateList, 'this.countryList')
  }
}
