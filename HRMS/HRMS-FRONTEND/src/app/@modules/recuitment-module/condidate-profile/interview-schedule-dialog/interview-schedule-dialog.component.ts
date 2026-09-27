import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import moment from 'moment';
import { CondidateProfileService } from 'src/app/@shared/services/service/recruitment/condidate-profile.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-interview-schedule-dialog',
  templateUrl: './interview-schedule-dialog.component.html',
  styleUrls: ['./interview-schedule-dialog.component.scss']
})


export class InterviewScheduleDialogComponent implements OnInit {

  interviewScheduleForm: FormGroup;
  roundList: any = [];
  loginUser: any;
  selectedEmployee = new FormControl('');
  jd_id: any;
  employees: any;
  reporting_manager_list2: any;

  constructor(
    private route: ActivatedRoute,
    private _empService: EmpRegistrationService,
    private recruitService: RecruitService,
    private condidateProfile: CondidateProfileService,
    public _fb: FormBuilder,
    private toast: ToastrService,
    public dialog: MatDialogRef<InterviewScheduleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

    console.log(this.data);
    for (let i = 1; i <= this.data?.data?.level_of_interview; i++) {
      this.roundList.push(`${i}`);
    }

    this.interviewScheduleForm = this._fb.group({
      interview_round: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      selectedEmployee: new FormControl([], [Validators.required]),
      interview_date: new FormControl(new Date(), [Validators.required]),
      interview_time: new FormControl(null, [Validators.required]),
      interviewStatus: new FormControl(null,),
      interview_link: new FormControl(null,),
    })
  }

  ngOnInit(): void {
    let lg: any = localStorage.getItem('signInUser');
    let loginUser = JSON.parse(lg);
    this.loginUser = JSON.parse(lg);

    this.route.queryParams.subscribe((params: any) => {

      this.jd_id = params?.id;
    });

    this.getEmployeData();
  }

  reporting_manager_list: any = [];
  dataEmployee: any;
  reporting: any;
  reporting2: any;

  getEmployeData() {
    let entity_id = localStorage.getItem("selectedEntityId");
    this._empService.grtEmployeeList(entity_id, this.loginUser?.role).subscribe((res: any) => {
      this.dataEmployee = res.data;

      this.reporting_manager_list = res.data;
      this.reporting_manager_list2 = res.data;
      this.employees = this.reporting_manager_list.map((value: any) => value?.title + ' ' + value?.first_name + ' ' + value?.last_name + ' ' + value.employee_code)
      this.reporting = this.dataEmployee.map((res: any) => res?.title + res?.first_name + res?.last_name);
      this.reporting2 = this.dataEmployee;
    });
  }

  reportingManagerSearch(e: any) {
    const aa = e
    let filteredVariable = this.reporting2.filter((item: any) => aa.includes(item?.title + item?.first_name + item?.last_name));
    this.reporting_manager_list = filteredVariable
  }



  employeeFilter(e: any) {
    const aa = e
    let filteredVariable = this.reporting_manager_list2.filter((item: any) => aa.includes(item?.title + ' ' + item?.first_name + ' ' + item?.last_name + ' ' + item?.employee_code));
    this.reporting_manager_list = filteredVariable
  }


  reporting_manager_name: any;
  getReportingData(data: any) {
    return this.reporting_manager_name = data?.title + ' ' + data?.first_name + ' ' + data?.last_name
  }

  // handle submit start
  handleSubmit() {
    try {

      let selectedEmployeeList: any = this.interviewScheduleForm?.value['selectedEmployee']
      console.log(selectedEmployeeList)
      let interviewer_list: any = [];
      if (!selectedEmployeeList?.length) {
        return this.toast.error('Required fields should not be empty', 'Fields Error');
      }
      else {
        selectedEmployeeList?.map((item: any) => {
          interviewer_list?.push({ interviewer_id: item })
        })
      }
      let entity_id = localStorage.getItem("selectedEntityId");
      let value = {
        ...this.interviewScheduleForm?.value,
        interviewer_list: interviewer_list,
        entity_id: entity_id,
        jd_id: this.jd_id,
        candidate_id: this.data?.data?.id,
      };
      value.interview_round = Number(this.interviewScheduleForm?.value?.interview_round);
      this.condidateProfile.create_interview_schedule(value).subscribe((res: any) => {
        if (res) {
          this.toast.success(res?.message);
          this.dialog.close();
        }
      }, err => {
        this.toast.error(err?.error?.message);
      })
    } catch (e) {
      console.log(e); // Logs the error
    }



  }

  selectedTime: string;

  handleTimeChange(event: any) {
    this.selectedTime = event;
  }
  disablePreviousDates = (d: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d ? d >= today : false;
  };

  // handle submit end

}
