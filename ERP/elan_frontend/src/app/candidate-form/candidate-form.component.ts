import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RecruitService } from '../@shared/services/recruitment.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../environments/environment';
import Swal from 'sweetalert2';
import { ConfigurationalmasterService } from '../@shared/services/configurationalmaster.service';
import { CountryISO, PhoneNumberFormat, SearchCountryField} from 'ngx-intl-tel-input';
import { CommonService } from '../@shared/services/common.service';


@Component({
  selector: 'app-candidate-form',
  templateUrl: './candidate-form.component.html',
  styleUrls: ['./candidate-form.component.scss']
})
export class CandidateFormComponent {

  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  selectedCountryISO: CountryISO = CountryISO.India;
  selectedAltCountryISO: CountryISO = CountryISO.India;


  jobDetailsForm: any;
  designationList: any;
  jdId: any;
  imagePath: any;
  imageToUpload: any;
  baseUrl: any;

  tableData = [
    { sno: 1, question: 'What is your name?', answer: 'My name is John.' },
    { sno: 2, question: 'Where do you live?', answer: 'I live in New York City.' },
    // Add more objects as needed
  ];
  allJobArray: any;
  jobDataBy: any;
  idGet: any;
  finalQuestionData: any;
  CvUploaded: any;
  fileUpload: any;
  openUserForm: boolean = false;
  result: any;
  constructor(private toast: ToastrService, private recruitService: RecruitService, private activeroute: ActivatedRoute,
    private _configurationalMasterService: ConfigurationalmasterService,
    private $common: CommonService,
  ) {
    this.myForm = new FormGroup({
      location: new FormControl('', Validators.required),
      job_title: new FormControl('', [Validators.required]),
      position: new FormControl(null),
      end_date: new FormControl(null),
      file: new FormControl(null),
      department: new FormControl(null),
      area: new FormControl(null),
      exp_required: new FormControl(null),
      level_of_interview: new FormControl(null),
      qualification: new FormControl(null),
      first_name: new FormControl(null, [Validators.required]),
      middle_name: new FormControl(null),
      last_name: new FormControl(null, [Validators.required]),
      contact_number: new FormControl(null,),
      email: new FormControl(null, [Validators.required, Validators.email]),
      // noticePeriod: new FormControl(null, [Validators.required]),
      cv_upload: new FormControl(null),
      question_answer_user: new FormControl(null),
      country_code: new FormControl(null),
      contact_detail:new FormControl(null),
    });
  }
  ngOnInit() {
    this.baseUrl = environment?.servralUrl;

    this.activeroute.params.subscribe((params: any) => {
      console.log(params, 'params');

      this.jdId = Number(params?.id);
      this.getByJD()
    })


    //     this.recruitService.currentMessage.subscribe((res:any) =>{
    // console.log(res,'ressss');

    //     })
    this.getAll_Country_codes();
  }
  getByJD() {
    let entity_id = localStorage.getItem("selectedEntityId");
    let financial_id = localStorage.getItem("financial_id");
    let user_id = localStorage.getItem('EmpMainId');

    this.recruitService.getByJobDescription(this.jdId).subscribe((res: any) => {
      console.log(res, 'resss');
      this.allJobArray = res;
      this.jobDataBy = res?.data[0];
      this.patchFormValue()
    })
  }

  patchFormValue() {

    this.myForm.patchValue({
      job_title: this.jobDataBy?.job_title,
      jobTypeId: this.jobDataBy?.jobTypeId,
      // requisitionStatus: this.jobDataBy?.requisitionStatus,
      // jobRole: this.jobDataBy?.jobRole,
      // numberOfPosition: this.jobDataBy?.numberOfPosition,
      // experience: this.jobDataBy?.experience,
      // startDate: this.jobDataBy?.start_date,
      end_date: this.jobDataBy?.end_date,
      qualification: this.jobDataBy?.qualification_name,
      position: this.jobDataBy?.designation_name,
      // type_of_contract: this.jobDataBy?.contract_type_id,
      department: this.jobDataBy?.department_name,
      location: this.jobDataBy?.branch_name,
      area: this.jobDataBy?.area_name,
      level_of_interview: this.jobDataBy?.level_of_interview,
      exp_required: this.jobDataBy?.experience,
      country_code: this.jobDataBy?.country_code

    })


  }
  hasError: null;
  myForm: FormGroup;
  applyNow() {
    // throw new Error('Method not implemented.');
    this.openUserForm = true;
  }
  selectedFileName: string = 'No file chosen';
  downloadJD() {
  }
  onChange(e: any) {


    if (e.target.files && e.target.files[0]) {
      const data: FileList = e.target.files;
      this.imageToUpload = data.item(0) || null;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePath = e.target.result;
      };
      reader.readAsDataURL(this.imageToUpload);
    }
    console.log(this.imageToUpload, 'this.imagePath');
    let formData = new FormData();

    formData.append('file', this.imageToUpload);

    this.recruitService.documentsUpdate(formData).subscribe((res: any) => {
      console.log(res, 'reessss');
      this.fileUpload = res?.url;
    })
  }
  onChangeCv(e: any) {
    let isValidExtension = this.$common.checkForValidFile(e, true, false, false);
    if (!isValidExtension) {
      this.myForm.patchValue({ cv_upload: null });
      return
    }
    if (e.target.files && e.target.files[0]) {
      const data: FileList = e.target.files;
      this.imageToUpload = data.item(0) || null;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePath = e.target.result;
      };
      reader.readAsDataURL(this.imageToUpload);
    }
    console.log(this.imageToUpload, 'this.imagePath');
    let formData = new FormData();
    formData.append('file', this.imageToUpload);
    this.recruitService.documentsUpdate(formData).subscribe((res: any) => {
      console.log(res, 'reessss');
      this.CvUploaded = 'uploaded_files/' + res?.url;
    })
  }

  getAnswer(data: any, event: any) {
    this.allJobArray?.getAllData_question.map((item: any) => {
      if (data?.id == item?.id) {
        item.selection_answer = event?.value;
      }
    })
    this.finalQuestionData = this.allJobArray?.getAllData_question;
  }

  generateImageUrl() {
    return `${this.baseUrl}/`
  }

  submitForm() {
    let selectedEntityId = localStorage.getItem("selectedEntityId");
    let query = {
      entityId: selectedEntityId,
      jd_id: this.jd_id,
    }
    this.recruitService.createUserData(query).subscribe((res: any) => {
      this.toast.success(`${res?.message}`)
    },
      ((err: any) => {
        this.toast.error(`${err?.error?.message}`)
      })
    )
  }

  ngSubmit() {
    this.submitForm()
    if (this.result == 'SELECTED') {
      Swal.fire({
        title: `You are ${this.result}`,
        // text: "You won't be able to revert this!",
        icon: 'success',
        // showCancelButton: true,
        // cancelButtonColor: "#f44336",
        // confirmButtonColor: "#3f51b5",
        // confirmButtonText: 'Yes',
        // cancelButtonText: 'close'
      }).then((result) => {
        if (result) {
          location.reload();
        }
      });
    } else {
      Swal.fire({
        title: `You are ${this.result}`,
        // text: "You won't be able to revert this!",
        iconHtml: '<i class="fas fa-times-circle"></i>',
        // showCancelButton: true,
        // cancelButtonColor: "#f44336",
        // confirmButtonColor: "#3f51b5",
        // confirmButtonText: 'Yes',
        // cancelButtonText: 'close'
      }).then((result) => {
        if (result) {
          location.reload();
        }
      });
    }

  }

  jd_id: any;
  isDisabled: boolean = true;
  saveQuestion() {
    
    if (this.myForm?.invalid) {
      return this.toast.error('Required fields should not be empty', 'Fields Error');
    }
    let value = this.myForm?.value;
    const modify: any = [];
    this.finalQuestionData?.map((item: any) => {
      modify.push({
        question_id: item?.id,
        selection_answer: item?.selection_answer
      })
    })
    if (!this.finalQuestionData?.length) {
      return this.toast.error('Required fields should not be empty', 'Fields Error');
    }
    let data = {
      item: modify,

      contact_detail: JSON.stringify(value?.contact_number),
      country_code: value?.contact_number?.dialCode,
      contact_number: value?.contact_number?.number,

      first_name: value?.first_name,
      middle_name: value?.middle_name,
      last_name: value?.last_name,
      // contact_number: value?.contact_number,
      email: value?.email,
      cv_upload: this.CvUploaded,
      profile_type:'BYLINK'
      // country_code: value.country_code
    }

    this.recruitService.submitUserQuestion(this.jdId, data).subscribe((res: any) => {
      this.result = res?.result;
      this.jd_id = res?.jd_id;
      this.toast.success(`${res?.message}`)
      this.isDisabled = false;
    },
      ((err: any) => {
        this.toast.error(`${err?.error.message}`)
      })
    )
  }
  countryCodeList: any = [];

  getAll_Country_codes() {
    this._configurationalMasterService.getAll_Country_codes().subscribe((res: any) => {
      this.countryCodeList = res.data
    })
  }
}
