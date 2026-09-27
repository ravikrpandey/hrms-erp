import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { L } from '@fullcalendar/list/internal-common';
import { ToastrService } from 'ngx-toastr';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';

@Component({
  selector: 'app-post-opening-create',
  templateUrl: './post-opening-create.component.html',
  styleUrls: ['./post-opening-create.component.scss']
})
export class PostOpeningCreateComponent {
  @ViewChild('editer') editer: any

  postOpeningForm: any;
  jobDescriptionForm: any;
  PostDetailsForm: any;
  jobDescriptionCreate: any;
  jobDescriptionDetailsForm: any
  jobTypeData: any;
  jobTitleData: any;
  getIdTitle: any;
  TitleId: any;
  idJobTitle: any;
  jobTitleSearch: any = [];
  jobTitleSearch1: any = []
  // idJob: void;
  constructor(private fb: FormBuilder, private _recruitmentService: RecruitService, private toast: ToastrService, private route: Router) {
    this.jobDescriptionDetailsForm = this.fb.group({
      job_title: new FormControl(null, Validators.required),
      job_role: new FormControl(null),
      job_type: new FormControl(null),
      department: new FormControl(null),
      number_of_position: new FormControl(null, [Validators.pattern('^[0-9]{1,5}$'), Validators.required]),
      candidate_age: new FormControl(null),

    })
  }

  ngOnInit(): void {

    this.getJobType();
    this.getJobTitle();
    // this.titleID()
    let department: any = document.getElementById('department');
    let candidate_age: any = document.getElementById('candidate_age');

    // department.setAttribute('readonly',true);
    // candidate_age.setAttribute('readonly',true);
  }

  scroll(el: HTMLElement) {
    if (this.jobDescriptionDetailsForm.invalid) {
      this.toast.error(" All Fields is Required")
      return
    }
    this.jobDetailSubmit();
    this.toast.success("Job Description Details Created")
    el.scrollIntoView();
  }

  scrollTwo(el: HTMLElement) {
    this.jobDescriptionSubmit();
    el.scrollIntoView();
  }

  jobDetailSubmit() {
    let val = this.jobDescriptionDetailsForm.value;
    console.log(val,)
    if (this.jobDescriptionDetailsForm.invalid) {
      this.toast.error("All Fields Required")
      return
    }
    console.log(this.getIdTitle, 'asjdjj');

    let detailData = {
      job_title_id: val.job_title,
      job_title: val.job_title,
      description: val.job_description,
      Interview_level: this.getIdTitle?.interview_level,
      job_role: val.job_role,
      job_type: val.FK_job_type_id,
      department: val.department,
      number_of_position: val.number_of_position,
      candidate_age: val.candidate_age,
      experiance: val.experiance,
      location: val.location
    }
    console.log(detailData, 'sdsjkh');

    this._recruitmentService.createPostVaccancy(detailData).subscribe((res: any) => {
      this.jobDescriptionCreate = res;

      this.toast.success("Post Vaccancy Opening Created")
      this.route.navigate(['master/recruitment/post-opening-list'])
    },
      (err => {
        console.log(err, 'rr');

        this.toast.error(err.error.message)

      })
    )
  }

  jobDescriptionSubmit() {
    let val2 = this.jobDescriptionForm.value;

    let descriptionData = {
      job_description: val2.job_description
    }
    this._recruitmentService.createPostVaccancy(descriptionData).subscribe((res: any) => {

      this.toast.success("Description Created")

    })
  }

  postDetailsSubmit() {
    let val3 = this.PostDetailsForm.value;
    if (this.PostDetailsForm.invalid) {
      this.toast.error(" All Fields is Required")
      return
    }

    this._recruitmentService.createPostVaccancy(val3).subscribe((res: any) => {

      this.toast.success("Job Post Details Created")
      this.route.navigate(['master/hrms/recruitment/post-opening-list'])
    })
  }

  getJobType() {
    this._recruitmentService.getJobTypeVaccancy().subscribe((res: any) => {
      this.jobTypeData = res.data;

    })
  }

  getJobTitle() {
    this._recruitmentService.getJobTitleData().subscribe((res: any) => {
      this.jobTitleData = res.data;
      this.jobTitleSearch = this.jobTitleData.map(
        (res: any) => res.job_title
      );
      this.jobTitleSearch1 = this.jobTitleData;
    })
  }

  jobTitleSearchData(e: any) {
    const aa = e;
    let filteredVariable = this.jobTitleSearch1?.filter((item: any) =>
      aa.includes(item.job_title)
    );
    this.jobTitleData = filteredVariable;
  }


  titleID(e: any) {

    let data = {
      "titleId": e
    }
    let dataTwo = JSON.stringify(data)

    this._recruitmentService.getJobTitleId(e).subscribe((res: any) => {
      console.log(res, 'res');

      this.getIdTitle = res.data;

      // this.disableControls();
      // let department: any = document.getElementById('department');
      // let candidate_age: any = document.getElementById('candidate_age');

      // if (res.data.department) {
      //   department?.setAttribute('readonly',true);
      // } else {
      //   department?.removeAttribute('readonly',false);
      // }
      // if (res.data.candidate_age) {
      //   candidate_age?.setAttribute('readonly',true);
      // } else {
      //   candidate_age?.removeAttribute('readonly',false);
      // }

      this.jobDescriptionDetailsForm.patchValue({
        job_role: this.getIdTitle.job_role,
        candidate_age: this.getIdTitle.candidate_age,
        job_type: this.getIdTitle.FK_job_type_id,
        department: this.getIdTitle.department,
        // age_range:item.candidate_age
      })
    })

  }

  disableControls() {
    this.jobDescriptionDetailsForm.controls['job_role'].disable();
    this.jobDescriptionDetailsForm.controls['job_type'].disable();
    this.jobDescriptionDetailsForm.controls['department'].disable();
    this.jobDescriptionDetailsForm.controls['candidate_age'].disable();
  }
}
