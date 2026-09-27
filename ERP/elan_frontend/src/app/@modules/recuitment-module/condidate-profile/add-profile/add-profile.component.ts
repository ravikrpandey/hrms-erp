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
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
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

  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  selectedCountryISO: CountryISO = CountryISO.India;

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
      country_code: new FormControl(null,[Validators.required]),
      contact_number: new FormControl(null,[Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      cv_upload: new FormControl(null, [Validators.required]),
    });
    this.createComplaint.controls['country_code'] = this.createComplaint.value.contact_number?.dialCode;
  }
  ngOnInit() {
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);
    this.baseUrl = environment.servralUrl;


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
    this.getAllJobDescription('All');
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
      country_code: getData?.country_code,
      email: getData?.email,
      cv_upload: getData?.cv_upload,
    });

  }

  onSubmitForm() {
    try {

      console.log('dddd',this.createComplaint);
      if (this.createComplaint.invalid) {
        return this.toast.error('Required fields should not be empty', 'Fields Error');
      }

      let val = this.createComplaint.value;

      val.contact_detail = JSON.stringify(val?.contact_number)
      val.country_code = val?.contact_number?.dialCode
      val.contact_number = val?.contact_number?.number
      const data = {
        ...val,
        jd_id: this.job_id,
        selection_status: 'SELECTED',
        cv_upload: this.cv_upload,
        profile_type:'EMPLOYEE',
        created_by:this.loginUser?.employee_id
      };
console.log(val,"val");


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
  uploadDoc(evemt: any) {
    try {

      let isValidExtension = this.$common.checkForValidFile(evemt);
      if (!isValidExtension) {
        this.createComplaint.patchValue({ cv_upload: null });
        return this.cv_upload = ""
      }
      const formData = new FormData();
      if (evemt.target.files && evemt.target.files[0]) {
        formData.append('file', evemt.target.files[0]);
      }
      this.$miscellaneousService.documents(formData).subscribe((response: any) => {
        if (response) {
          this.cv_upload = `uploaded_files/${response?.url}`;
        }
      }, err => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
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
      this.codes = this.countryCodeList.map((value:any) => value.dialing_code)
      console.log("dsdssdsd", this.countryCodeList)
    })
  }
  profileDetails: any = {};
  getAllJobDescription(selection_status: any) {

    let query = {
      selection_status: selection_status,
      jd_id: this.job_id,
    }
    this.$condidateProfile.getAll_candidate_BY_JD_id(query).subscribe((res: any) => {
      this.profileDetails = res?.data[0];

  })
}
}
