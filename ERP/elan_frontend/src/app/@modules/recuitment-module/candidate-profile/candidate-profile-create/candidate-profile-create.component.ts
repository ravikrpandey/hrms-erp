import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { Candidate } from '../candidate-profile-list/candidate-profile-list.component';
import { L } from '@fullcalendar/list/internal-common';

@Component({
  selector: 'app-candidate-profile-create',
  templateUrl: './candidate-profile-create.component.html',
  styleUrls: ['./candidate-profile-create.component.scss'],
  providers: [],
})
export class CandidateProfileCreateComponent {
  profileDetailsForm: FormGroup = new FormGroup({});
  managersList: any = [];
  reportvariables: any;
  reportvariable: any;
  filterControl = new FormControl();
  hiring_manager: string = '';
  errorMsg: string = '';
  resume: any;
  custonDropdown = new FormControl();
  candidate_id?: number;
  candidateData: Candidate = {} as Candidate;
  fileDetails: any;
  loading: boolean = false;
  userNamePatch = "Assigned Hiring Manager";
  nameSearch: any = ''
  asigningManagerName: [];
  jobRole: any;
  jobTitleSearchData: any = [];
  jobTitleSearchData1: any = [];


  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private recruitService: RecruitService
  ) {
    this.profileDetailsForm = this.fb.group({
      name: new FormControl(null, [Validators.required, Validators.maxLength(150)]),
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
      resume: new FormControl(null, Validators.required),
      manager: new FormControl(null, Validators.required),
      job_applied: new FormControl(null),
    });
  }

  ngOnInit(): void {
    this.activeroute.queryParams.subscribe((params) => {
      this.candidate_id = params['candidate_id'];
      console.log(this.candidate_id, 'sdgfklsdlk');

      if (this.candidate_id) {
        this.getCandidateData(this.candidate_id);
      }
    });

    this.getAssignedHiringManagers();

    this.getJobRole();
  }

  getJobRole() {
    this.recruitService.jobRole()
      .subscribe((res: any) => {
        this.jobRole = res.result
        this.jobTitleSearchData = this.jobRole.map((res: any) => res.job_applied);
        this.jobTitleSearchData1 = this.jobRole

        // this.jobRole = Array.from(res.data, (x: any) => x.job_title)


      })
  }

  productFilterData(e: any) {
    const aa = e;
    let filteredVariable = this.jobTitleSearchData1?.filter((item: any) =>
      aa.includes(item.job_applied)
    );
    this.jobRole = filteredVariable;
  }

  getAssignedHiringManagers() {
    this.recruitService.allHrRoleJobDescription().subscribe((res: any) => {
      // let data = res['data'];
      this.managersList = res?.data
      this.reportvariables = this.managersList.map((res: any) => res.first_name)
      this.reportvariable = this.managersList

      console.log(this.managersList, 'dasdjhkas');



    });
  }

  getCandidateData(id: number) {
    this.recruitService.candidateInfoById(id).subscribe((res: any) => {
      this.candidateData = res['data'];
      // 
      console.log(this.candidateData, 'asfjhkhgsd');

      this.patchCandidateData(this.candidateData);
    });
  }

  patchCandidateData(candidate: any) {
    console.log(candidate?.upload_resume, 'sahdfj');

    this.profileDetailsForm.patchValue({
      name: candidate?.condidate_name,
      email: candidate?.email,
      mobile: candidate?.mobile,
      manager: candidate?.assigned_hiring_manager_id,
      // resume: candidate?.upload_resume,
      job_applied: candidate?.job_id
    });


    this.hiring_manager = candidate?.assigned_hiring_manager;
    this.profileDetailsForm.controls['email'].disable();
  }

  // to restrict user from entering strings
  keyPress(event: Event | any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  fileInputChange(event: any) {
    const allowedFileTypes = ['.pdf', '.doc',];
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();

      if (allowedFileTypes.includes(fileExtension)) {


        this.fileDetails = selectedFile
        console.log(this.fileDetails);

      } else {
        this.errorMsg = 'Only PDF and DOC files are allowed.';
      }
    }
  }


  saveDetails(form: FormGroup) {
    console.log(this.profileDetailsForm);

    if (this.profileDetailsForm.status === "INVALID") {
      this.toast.error('Required fields should not be empty', 'Fields Error');
      return;
    }
    const formValues = form.value;

    this.loading = true;
    const data: any = {
      condidate_name: formValues?.name,
      email: formValues?.email,
      mobile: formValues?.mobile,
      assigned_hiring_manager_id: formValues?.manager,
      job_id: formValues?.job_applied
    };
    console.log(formValues);
    console.log(this.fileDetails);

    let managerData: any = this.managersList.find((e: any) => Number(e.employee_id) === Number(formValues.manager));
    let jobId: any = this.jobRole.find((e: any) => Number(e?.job_id) === Number(formValues?.job_applied));
    console.log(jobId);
    data.job_applied = jobId?.job_title_id
    data.assigned_hiring_manager = managerData.first_name;
    console.log(data, 'dsdsj');

    if (!this.candidate_id) {
      this.recruitService
        .createCandidateProfile(data, this.fileDetails)
        .subscribe(
          (res: any) => {
            this.loading = false;
            this.toast.success('Candidate Profile Created successfully..');
            this.route.navigate(['master/recuitment/profile-list']);
          },
          (err) => {

            this.loading = false;
            this.toast.error(err.error.message);

          }
        );
    } else {
      this.loading = true;
      this.recruitService
        .updateCandidateProfile(this.candidate_id, data)
        .subscribe((res: any) => {
          this.loading = false;
          this.toast.success('Candidate Profile Updated successfully..');
          this.route.navigate(['master/recuitment/profile-list']);
        });
    }
  }

  changeeManager(e: any) {


    let managerData: any = this.managersList.find((a: any) => a.employee_id === e.value);

  }
  onPanelClose() {
    this.filterControl.setValue('');
  }
  changeUserName(data: any) {
    // 
    // 
    // this.profileDetailsForm.controls['name']=data.employee_id


    // this.userNamePatch="Assigned Hiring Manager"
    // 
    // this.nameSearch=data.name
    // 
    // 



    // this.userNamePatch = allData.fullName
    // this.userMasterForm.controls.employee_user_name.patchValue(allData.fullName);
    // this.userMasterForm.controls.employee_code.patchValue(empCode);
    // this.userMasterForm.controls.segment.patchValue(allData.segment_suv);
    // this.userMasterForm.controls.roles.patchValue(allData.user_role);
    // this.userMasterForm.controls.position.patchValue(allData.designation);
  }
  reportFilter(e: any) {
    const aa = e
    let filteredVariable = this.reportvariable.filter((item: any) => aa.includes(item.first_name));
    this.managersList = filteredVariable
    console.log(this.managersList, "checkkkk")

  }

  openPfd() {
    if (this.candidate_id) {
      window.open(this.candidateData?.upload_resume, '_blank')
    }
  }
  variables: any = [];
  variable: any = [];
  productFilter(e: any) {
    const aa = e;
    let filteredVariable = this.reportvariable?.filter((item: any) =>
      aa.includes(item.first_name || item.last_name)
    );
    this.managersList = filteredVariable;
  }
}


