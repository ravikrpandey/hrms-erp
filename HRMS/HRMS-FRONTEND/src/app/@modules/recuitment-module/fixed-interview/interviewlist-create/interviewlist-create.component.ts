import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';

@Component({
  selector: 'app-interviewlist-create',
  templateUrl: './interviewlist-create.component.html',
  styleUrls: ['./interviewlist-create.component.scss']
})
export class InterviewlistCreateComponent {
  profileDetailsForm: FormGroup = new FormGroup({});
  managersList: any;
  hiring_manager: string = '';
  errorMsg: string = '';
  resume: any;
  candidate_id?: number;
  selectedCaindidate: any;
  totalInterviewLevel: any;
  sheduledInterviews: any;

  fileDetails: { filePath: string | any; file: any } = {
    filePath: '',
    file: null,
  };
  loading: boolean = false;
  candidateData: any;
  allData: any;
  show_roundLevel: any;
  round_level: any = [];
  locationData: any;
  round_data: { levelCount: number; level: string; };
  rountresult: any;
  roundResult: any[];
  variables: any;
  checkData: any;
  variable: any;
  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private recruitService: RecruitService,
    private _configurationalMasterService: ConfigurationalmasterService,
  ) {
    this.profileDetailsForm = this.fb.group({
      name: new FormControl(null, Validators.required),
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ]),
      mobile: new FormControl(null, [
        Validators.required,
        Validators.maxLength(10),
        Validators.pattern('^[0-9]*$'),
        Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
      ]),
      job_role: new FormControl(null),
      assigned_hiring_manager: new FormControl(null, Validators.required),
      spoc_name: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      round_level: new FormControl(null, Validators.required),
    });
  }

  ngOnInit(): void {
    this.recruitService.getAllShortListedCandidate().subscribe((res: any) => {
      this.candidateData = res.data;
    
      this.variables = this.candidateData.map((res: any) => res.condidate_name)
      this.checkData = this.candidateData
      this.variable = this.candidateData
      console.log(this.candidateData,"assesmentList");
      
    })
  }

  getSingleCandidateData(id: any) {
    this.round_level= []
    this.candidate_id = id;
    this.recruitService.singleShortlisted_candidate(id).subscribe((res: any) => {
      
      let data: any = res.data
      console.log('vgggg',data);
      

      this.sheduledInterviews = res.data.schedule_fixed_interviews;
      

      this.createInterviewLevel(res?.data?.interview_level);
      this.selectedCaindidate = res.data;
      this.profileDetailsForm.patchValue({
        email: data?.email,
        mobile: data?.mobile,
        job_role: data?.job_role,
        assigned_hiring_manager: data?.assigned_hiring_manager,
        spoc_name: data?.spoc_name,
        address: data?.address,
        // round_level:String(data.round_level),
      })
      this.profileDetailsForm.controls['email'].disable();
      this.profileDetailsForm.controls['mobile'].disable();
      this.profileDetailsForm.controls['job_role'].disable();
      this.profileDetailsForm.controls['assigned_hiring_manager'].disable();
      this.profileDetailsForm.controls['spoc_name'].disable();
      this.profileDetailsForm.controls['address'].disable();



      setTimeout(() => {
        this.profileDetailsForm.patchValue({
          round_level: data?.round_level,
        });
      }, 50)
    })

    this._configurationalMasterService.listLocation().subscribe((res: any) => {
      this.locationData = res.data;

    });
  };

  createInterviewLevel(roundLevel: any) {
    console.log();
    
    console.log('test',roundLevel);

    for (let i = 0; i < roundLevel; i++) {
      this.round_data = { levelCount: i + 1, level: `Round - ${i + 1}` }
      this.round_level.push(this.round_data)
    };

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
 
  
  };

  saveDetails(form: FormGroup) {
    const formValues = form.value;
    if (form.status === 'INVALID') {
      this.toast.error('Required fields should not be empty', 'Fields Error');
      return;
    };
    // 
    const data: any = {
      email: formValues?.email,
      mobile: formValues?.mobile,
      job_role: formValues?.job_role,
      assigned_hiring_manager: formValues?.assigned_hiring_manager,
      spoc_name: formValues?.spoc_name,
      address: formValues?.address,
      round_level: formValues?.round_level,
      schedule_interview_date: null,
      schedule_interview_time: null,
    };

    // check if interview scheduled or not
    if (this.selectedCaindidate.round_level === null && this.selectedCaindidate.schedule_fixed_interviews.length === 0) {
      if (data.round_level === 1) {
        this.fixedInterview(data);
      } else {
        this.toast.warning('please fix 1st round interview of this candidate');
        return;
      };
    } else if (this.selectedCaindidate.round_level !== null && this.selectedCaindidate.schedule_fixed_interviews.length !== 0) {
      let scheduleIntv = this.selectedCaindidate.schedule_fixed_interviews;
      let filterData = scheduleIntv.find((e: any) => Number(e.round_level) === data.round_level);
      // 
      const isExist_2 = scheduleIntv.some((e: any) => e.action === "Rejected");
      if (isExist_2) {
        this.toast.warning('this candidate is rejected', 'Rejected Candidate')
        return;
      };

      if (filterData) {
        if (filterData.action === 'Shortlisted') {
          this.toast.warning('fixed next round interview', 'Already Shortlisted')
          return;
        } else if (filterData.action === 'Pending') {
          this.toast.warning('Status pending of this candidate', 'Status Pending')
          return;
        } else if (filterData.action === 'Rejected') {
          this.toast.warning('this candidate is rejected', 'Rejected Candidate')
          return;
        } else {
          this.toast.warning('interview already fixed please scheduled the interview', 'Already fixed')
          return;
        };
      } else {
        if (this.selectedCaindidate.round_level === data.round_level) {
          this.toast.warning('interview already fixed please scheduled the interview', 'Already fixed');
          return;
        } else {
          let lastInterview: any = this.sheduledInterviews.at(-1);
          if (lastInterview?.final_shortlisted) {
            this.toast.warning('this candidate is ready for background verification process', 'Final Shortlisted');
            return;
          } else {
            let isScheduled = scheduleIntv.find((e: any) => Number(e.round_level) === Number(this.selectedCaindidate.round_level));
            if (scheduleIntv.length !== 0) {
              if (this.selectedCaindidate.round_level + 1 !== data.round_level) {
                this.toast.warning(`Not able to fix ${data.round_level} - round interview`);
                return;
              };
              if (!isScheduled) {
                this.toast.warning(`Already fix ${data.round_level} - round interview`);
              } else {
                if (this.selectedCaindidate.round_level + 1 === data.round_level) {
                  if (isScheduled.action === 'Pending' || isScheduled.action === 'Rejected') {
                    this.toast.warning(`Status is ${isScheduled?.action} in ${isScheduled?.round_level} - round`, "Can't fix Interview");
                    return;
                  } else {
                    this.fixedInterview(data);
                  };
                };
              };
            };
          };
        };
      };
    } else {
      this.toast.warning(`Already fix ${this.selectedCaindidate.round_level} - round interview please schedule`, "Can't fix");
    };
  };
  productFilter(e: any) {
    const aa = e
    let filteredVariable = this.variable.filter((item: any) => aa.includes(item.condidate_name));
    this.checkData = filteredVariable
    console.log(this.checkData, "checkkkk")
  
  }

  fixedInterview(data: any) {
    this.recruitService.editFixedInterview(this.candidate_id, data).subscribe((res: any) => {
      this.loading = true;
      this.toast.success('Fixed interview successfully..');
      this.route.navigate(['master/recuitment/fixed-interview']);
    }, (err) => {
      this.toast.error('Something went wrong please try again', 'Error Message');
      
    });
  };
}
