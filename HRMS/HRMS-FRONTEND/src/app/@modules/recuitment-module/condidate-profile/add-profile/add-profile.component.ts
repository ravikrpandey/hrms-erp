import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { Location } from '@angular/common';
import { CommonService } from 'src/app/@shared/services/common.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { environment } from 'src/app/environments/environment';
import { CondidateProfileService } from 'src/app/@shared/services/service/recruitment/condidate-profile.service';
@Component({
  selector: 'app-add-profile',
  templateUrl: './add-profile.component.html',
  styleUrls: ['./add-profile.component.scss'],
  providers: [DatePipe],
})
export class AddProfileComponent {
  createComplaint: FormGroup;
  complaintId: any;
  id: any;
  mainId: any;
  allComplaint: any;
  reportingManager: any;
  employeId: any;
  getData: any;
  parm: any;
  firstLastName: any;
  propertyManager: any = [];
  personalIdData: any;
  nameAchieve: any;
  reportingManagerList: any = [];
  loginUser: any;
  baseUrl: any;
  job_id: any;
  countryCodeList2: any;
  codes: any;

  constructor(
    private emp_master: EmpMasterService,
    private _empRegistration: EmpRegistrationService,
    private recruitService: RecruitService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private router: Router,
    private route: Router,
    private activeroute: ActivatedRoute,
    private location: Location,
    private $common: CommonService,
    private $miscellaneousService: MiscellaneousService,
    private $condidateProfile: CondidateProfileService,
  ) {
    this.createComplaint = this.fb.group({
      first_name: new FormControl(null, [Validators.required]),
      middle_name: new FormControl(null),
      last_name: new FormControl(null, [Validators.required]),
      country_code: new FormControl(null, [Validators.required]),
      contact_number: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]{5,15}$/)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      linkedin_profile: new FormControl(null),
      current_employer: new FormControl(null),
      years_of_experience: new FormControl(null),
      skills_and_tools: new FormControl(null),
      cv_upload: new FormControl(null, [Validators.required]),
    });
  }
  ngOnInit() {
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);
    this.baseUrl = environment.serverUrl;

    this.activeroute.queryParams.subscribe((params) => {
      this.id = params;
      this.job_id = this.id.job_id;
    });

    let entity_id = localStorage.getItem("selectedEntityId");
    this._empRegistration.grtEmployeeList(entity_id, this.loginUser?.role).subscribe((res: any) => {
      this.personalIdData = res.data;
      this.propertyManager = Array.from(
        this.personalIdData,
        (a: any) => `${a.title} ${a.first_name} ${a.last_name}`
      );
      this.firstLastName = Array.from(
        this.personalIdData,
        (a: any) => `${a.first_name} ${a.last_name}`
      );

    });
    this.getByIdUse();
    this.getAll_Country_codes();
  }

  goBack() {
    this.location.back();
  }

  codeSearch(e: any) {
    const aa = e
    let filteredVariable = this.countryCodeList2.filter((item: any) => aa.includes(item.dialing_code));
    this.countryCodeList = filteredVariable
  }

  getByIdUse() {
    this.emp_master.complaintAddById(this.complaintId).subscribe((res: any) => {
      this.getData = res.data;

      this.basicFormPatch(this.getData);
    });
  }

  basicFormPatch(getData: any) {
    this.createComplaint.patchValue({
      first_name: getData?.first_name,
      last_name: getData?.last_name,
      middle_name: getData?.middle_name,
      contact_number: getData?.contact_number,
      email: getData?.email,
      cv_upload: getData?.cv_upload,
    });
  }

  onSubmitForm() {
    try {

      if (this.createComplaint.invalid) {
        return this.toast.error('Required fields should not be empty', 'Fields Error');
      }

      let val = this.createComplaint.value;
      const data = {
        ...val,
        jd_id: this.job_id,
        selection_status: 'SELECTED',
        cv_upload: this.cv_upload,
      };
      this.$condidateProfile.create_new_candidate(data).subscribe(
        (res: any) => {
          this.toast.success(res.message);
          this.goBack();
        },
        (err) => {
          if (err.status == 400) {
            this.toast.error('Something went Wrong!');
          }
          else if (err.status == 403) {
            this.toast.error(err?.error?.message);
          } else {
            this.toast.error('Error in submission!');
          }
        }
      );
    } catch (err) {
      console.log(err)
    }
  }


  // File upload start
  cv_upload: any;

  uploadDoc(event: any) {
    try {

      const file = event.target.files[0];

      if (!file) {
        return;
      }

      const isValidExtension = this.$common.checkForValidFile(event);

      if (!isValidExtension) {
        this.createComplaint.patchValue({
          cv_upload: null
        });
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      this.$miscellaneousService.parseResume(formData).subscribe({

        next: (response: any) => {

          console.log(response);

          const personal =
            response?.parsed_data?.personal_experience;

          const professional =
            response?.parsed_data?.professional_experience;

          // agar pdf path bhi save karna hai
          this.cv_upload = response?.storage_info?.pdf_path;

       this.createComplaint.patchValue({
  first_name: this.getFirstName(personal?.full_name),
  middle_name: this.getMiddleName(personal?.full_name),
  last_name: this.getLastName(personal?.full_name),
  email: personal?.email_address,
  contact_number: this.extractMobile(personal?.phone_number),
  country_code: this.extractCountryCode(personal?.phone_number),
  linkedin_profile: personal?.linkedin_profile,
  current_employer: professional?.current_employer,
  years_of_experience: professional?.years_of_experience,
  skills_and_tools: response?.parsed_data?.skills_and_tools?.join(', '),
  cv_upload: file.name   // ab sirf ek plain string hai, DOM se bind nahi -> koi exception nahi
});

this.cv_upload = response?.storage_info?.pdf_path; // actual path/file alag se already store ho raha hai

        },

        error: (err) => {
          console.log(err);
          this.toast.error("Resume parsing failed");
        }

      });

    } catch (error) {
      console.log(error);
    }
  }

  getFirstName(fullName: string): string {

    if (!fullName) {
      return '';
    }

    return fullName.split(' ')[0];
  }
  getMiddleName(fullName: string): string {
    if (!fullName) return '';

    const parts = fullName.trim().split(/\s+/);

    if (parts.length <= 2) {
      return '';
    }

    return parts.slice(1, parts.length - 1).join(' ');
  }
  getLastName(fullName: string): string {

    if (!fullName) {
      return '';
    }

    const arr = fullName.trim().split(' ');

    arr.shift();

    return arr.join(' ');
  }
  extractCountryCode(phone: string): string {
    if (!phone) {
      return '';
    }

    const match = phone.match(/^\+(\d{1,4})/);

    return match ? match[1] : '';
  }
  extractMobile(phone: string): string {

    if (!phone) {
      return '';
    }

    return phone.replace(/^(\+\d{1,4})[- ]?/, '');
  }

  viewImg() {

    window.open(this.baseUrl + '/' + this.cv_upload, '_blank');
  }
  // File upload end
  countryCodeList: any = [];

  getAll_Country_codes() {

    this.$condidateProfile.getAll_Country_codes().subscribe((res: any) => {
      this.countryCodeList = res.data
      this.countryCodeList2 = res.data;
      this.codes = this.countryCodeList.map((value: any) => value.dialing_code)
      console.log("dsdssdsd", this.countryCodeList)
    })
  }

}
