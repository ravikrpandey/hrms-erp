import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { RecruitService } from '../../../../@shared/services/recruitment.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-sheduledialog',
  templateUrl: './sheduledialog.component.html',
  styleUrls: ['./sheduledialog.component.scss'],
})
export class SheduledialogComponent implements OnInit {
  time: any;
  selectedTime: any;
  format: any;
  sheduleForm: FormGroup;
  show_roundLevel: any;
  candidate_ID: any;
  patchData: any;
  btnDisable: boolean = false;
  FromDate: any;
  round_level: any = [];

  interviewerList: any;
  reportvariables: any;
  reportvariable: any;
  reportmData: any;
  variables: any;
  checkData: any;
  variable: any;
  code: any;
  closeTimeVariables: any;
  jobApplied: any;
  interviewer_id: any;

  constructor(
    private route: Router,
    private fb: FormBuilder,
    private toster: ToastrService,
    private recruitService: RecruitService,
    public dialog: MatDialogRef<SheduledialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.sheduleForm = this.fb.group({
      roundOfInterview: new FormControl(null, [Validators.required]),
      modeOfInterview: new FormControl(null, [Validators.required]),
      interviewerName: new FormControl(null, [Validators.required]),
      startDate: new FormControl(null, [Validators.required]),
      time: new FormControl(null, [Validators.required]),
    });

    this.candidate_ID = this.data.id;
    this.getSingleCandidateData(this.data.id);
  }

  ngOnInit(): void {
    this.getAllInterviewr();
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  onSelectClosed() {
    this.variables = null;
    this.checkData = this.variable;
    //  this.sheduleForm.controls['interviewerName'].reset();

    //   console.log("eeee");
    //   this.getAllInterviewr()
  }

  shedule() {
    console.log(this.sheduleForm, 'dd');

    if (this.sheduleForm.status == 'INVALID') {
      this.toster.error(
        'Required fields should not be empty',
        'Required Field'
      );
      return;
    }

    let val = this.sheduleForm.value;
    let userLoginId = localStorage.getItem('EmpMainId');
    const data: any = {
      candidate_id: this.candidate_ID,
      interviewer_name: val.interviewerName,
      mode_of_interview: val.modeOfInterview,
      round_level: val.roundOfInterview,
      schedule_interview_date: val.startDate,
      schedule_interview_time: val.time,
      job_applied: this.jobApplied,
      employee_id: userLoginId,
      interviewer_id: this.interviewer_id,
    };
    const momentDate = moment(val.startDate);

    console.log(momentDate.format('YYYY-MM-DD HH:mm:ss'));

    this.postSeduleData(data);
  }
  round_data: { levelCount: number; level: string };
  roundResult: any[];
  getInterviewrId(data: any) {
    console.log(data);
    if (data) {
      this.interviewer_id = data.employee_id;
    }
  }

  isOptionDisabled(levelCount: number): boolean {
    // Determine if the option should be disabled based on its ID (levelCount)
    // For example, if you want to disable options with IDs greater than 3:
    return levelCount > this.data.round_level;
  }
  getApiData: any;
  getSingleCandidateData(id: any) {
    this.recruitService
      .singleShortlisted_candidate(id)
      .subscribe((res: any) => {
        console.log(res.data, 'ress');
        this.jobApplied = res.data?.job_applied;
        this.getApiData = res?.data;
        let data: any = res.data;
        this.createInterviewLevel(res.data.interview_level);
        this.patchScheduledIntv(
          res.data.round_level,
          res.data.schedule_fixed_interviews
        );

        this.round_level = [];
        for (let i = 0; i < res.data.round_level; i++) {
          this.round_data = { levelCount: i + 1, level: `Round - ${i + 1}` };
          this.round_level.push(this.round_data);
          console.log(this.round_level, 'l;evf');
        }

        console.log(this.round_level);

        let uniqueArray = [];

        let uniqueSet = new Set();

        for (let item of this.round_level) {
          let itemString = JSON.stringify(item);
          if (!uniqueSet.has(itemString)) {
            uniqueSet.add(itemString);
            uniqueArray.push(item);
          }
        }

        this.roundResult = uniqueArray;
        console.log(this.roundResult, 'roun');

        setTimeout(() => {
          this.sheduleForm.patchValue({
            roundOfInterview: data.round_level,
          });
        }, 10);
      });
  }

  createInterviewLevel(roundLevel: any) {
    for (let i = 0; i < roundLevel; i++) {
      this.round_level.push({ levelCount: i + 1, level: `Round - ${i + 1}` });
    }
  }

  patchScheduledIntv(round_level: number, data: any) {
    if (data && data.length > 0) {
      this.patchData = data.find(
        (e: any) => Number(e.round_level) === round_level
      );

      if (this.patchData) {
        if (this.patchData.action === 'Pending') {
          this.show_roundLevel = this.round_level[this.patchData.round_level];
          let exTime = this.patchData.schedule_interview_time
            .split(':')
            .splice(0, 2);
          let setTime = exTime.join(':');
          console.log(this.patchData.schedule_interview_date);
          const momentDate = moment(this.patchData.schedule_interview_date);

          console.log(momentDate.format('YYYY-MM-DD HH:mm:ss'));

          this.sheduleForm.patchValue({
            roundOfInterview: this.patchData.round_level,
            modeOfInterview: this.patchData.mode_of_interview,
            interviewerName: this.patchData.interviewer_name,
            startDate: this.patchData.schedule_interview_date,
            time: setTime,
          });

          console.log(this.sheduleForm, '');
        } else {
          this.btnDisable = true;
          this.toster.warning(
            `Already ${this.patchData?.action} in ${this.patchData?.round_level} round`
          );
        }
      } else {
        this.btnDisable = false;
      }
    }
  }

  postSeduleData(data: any) {
    if (this.patchData && this.patchData.action === 'Pending') {
      this.btnDisable = true;
      this.recruitService
        .editSchedule_iterview(this.patchData.interview_id, data)
        .subscribe(
          (res) => {
            this.btnDisable = false;
            this.toster.success(
              `Re-Schedule ${this.patchData.round_level} round interview successfully`
            );
            this.dialog.close(res.data);
            this.reloadCurrentRoute();
          },
          (err) => {
            this.btnDisable = false;

            this.toster.error(err.error.message);
          }
        );
    } else {
      this.btnDisable = true;
      this.recruitService.schedule_FixedInterview(data).subscribe(
        (res) => {
          this.btnDisable = false;
          this.toster.success('Interview Schedule Successfully');
          this.dialog.close(res.data);
          this.reloadCurrentRoute();
        },
        (err) => {
          this.btnDisable = false;
          this.toster.error(err.error.message);
        }
      );
    }
  }

  getAllInterviewr() {
    this.recruitService.getAllInterviewr().subscribe(
      (res) => {
        this.reportmData = res.data;
        this.variables = this.reportmData.map((res: any) => res.fullName);
        this.closeTimeVariables = this.variables;
        this.code = this.reportmData.map((res: any) => res.employee_code);
        this.checkData = this.reportmData;
        this.variable = this.reportmData;
        console.log(this.reportmData, 'assesmentList');
      },
      (err) => {}
    );
  }
  now = new Date();
  year = this.now.getFullYear();
  month = this.now.getMonth();
  // day = this.now.getDay();
  date = this.now.getDate();
  maxDate = moment({
    year: this.year + 100,
    month: this.month,
    date: this.date,
  }).format('YYYY-MM-DD');
  minDate = moment({
    year: this.year - 0,
    month: this.month,
    date: this.date,
  }).format('YYYY-MM-DD');

  fromDate(e: any) {
    this.FromDate = moment(e.value).format('YYYY-MM-DD');
    console.log(this.FromDate);
    console.log(this.sheduleForm.value.startDate);
  }

  reportFilter(e: any) {
    const aa = e;
    let filteredVariable = this.variable?.filter((item: any) =>
      aa.includes(item?.fullName)
    );
    this.checkData = filteredVariable;
    console.log(this.checkData, 'checkkkk');
  }
}
