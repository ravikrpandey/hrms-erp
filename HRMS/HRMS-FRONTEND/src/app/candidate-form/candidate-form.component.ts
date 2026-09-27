import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RecruitService } from '../@shared/services/recruitment.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../environments/environment';
import Swal from 'sweetalert2';
import { ConfigurationalmasterService } from '../@shared/services/configurationalmaster.service';
import { CommonService } from '../@shared/services/common.service';
import moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { ViewDocumentDialogComponent } from './view-document-dialog/view-document-dialog.component';



@Component({
  selector: 'app-candidate-form',
  templateUrl: './candidate-form.component.html',
  styleUrls: ['./candidate-form.component.scss']
})
export class CandidateFormComponent {
  jobDetailsForm: any;
  designationList: any;
  jdId: any;
  imagePath: any;
  imageToUpload: any;
  baseUrl: any;
  startDate: any;
  endDate: any;
  check: any;

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
  constructor(private toast: ToastrService,public dialog: MatDialog,
     private recruitService: RecruitService, private activeroute: ActivatedRoute,
    private _configurationalMasterService: ConfigurationalmasterService,
    private $common: CommonService,
  ) {
    this.myForm = new FormGroup({
      location: new FormControl(''),
      job_title: new FormControl(''),
      position: new FormControl(null),
      end_date: new FormControl(null),
      file: new FormControl(null),
      department: new FormControl(null),
      area: new FormControl(null),
      exp_required: new FormControl(null),
      level_of_interview: new FormControl(null),
      qualification: new FormControl(null),
      skill: new FormControl(null),
      first_name: new FormControl(null, [Validators.required]),
      middle_name: new FormControl(null),
      last_name: new FormControl(null, [Validators.required]),
      contact_number: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]{5,15}$/)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      cv_upload: new FormControl(null),
      question_answer_user: new FormControl(null),
      country_code: new FormControl(null, [Validators.required]),
    });
  }

  expirationDate: Date;
  currentDate: Date = new Date();
  linkExpired: boolean = false;

  ngOnInit() {
    this.baseUrl = environment?.serverUrl;
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
      this.allJobArray = res;
      debugger
      this.jobDataBy = res?.data[0];
      this.patchFormValue()
      this.dateExpire()
      this.checkDateRange()
    })
  }

  patchFormValue() {

    this.myForm.patchValue({
      job_title: this.jobDataBy?.job_title,
      jobTypeId: this.jobDataBy?.jobTypeId,
      end_date: this.jobDataBy?.end_date,
      qualification: this.jobDataBy?.qualification,
      skill: this.jobDataBy?.skill,
      position: this.jobDataBy?.designation_name,
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
    console.log(data, 'dataaaa');
    console.log(event, 'event');

    this.allJobArray?.getAllData_question.map((item: any) => {
      if (data?.id == item?.id) {
        item.selection_answer = event?.value;

      }
    })
    console.log(this.allJobArray, 'this.allJobArray?');
    this.finalQuestionData = this.allJobArray?.getAllData_question;
  }

  dateExpire() {
    this.startDate = new Date(this.jobDataBy?.start_date);
    this.endDate = new Date(this.jobDataBy?.end_date);
    this.currentDate = new Date();

    this.endDate.setHours(23, 59, 59, 999);
    let startTimestamp = this.startDate.getTime();
    let endTimestamp = this.endDate.getTime();
    let currentTimestamp = this.currentDate.getTime();

    this.check = currentTimestamp >= startTimestamp && currentTimestamp <= endTimestamp;
    return this.check;
  }

  checkDateRange() {

    if (this.check == false) {
      Swal.fire({
        title: `Your Job Description link Open Only from Date : ${moment(this.startDate).format("DD-MM-YYYY")} To ${moment(this.endDate).format("DD-MM-YYYY")}`,
        icon: 'warning',
        showConfirmButton: false,
        allowOutsideClick: false
      }).then((result) => {

      });
    }

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
      console.log(res, 'resss');
      this.toast.success(`Submitted Successfully`)
    },
      ((err: any) => {
        console.log(`${err?.error?.message}`);
        this.toast.error(`Please Try Again`)
      })
    )
  }

  ngSubmit() {
    this.submitForm()
    if (this.result == 'SELECTED') {
      Swal.fire({
        title: `Submission successful! HR will contact you for the next round.`,
        // text: "You won't be able to revert this!",
        icon: 'success',
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

      first_name: value?.first_name,
      middle_name: value?.middle_name,
      last_name: value?.last_name,
      contact_number: value?.contact_number,
      email: value?.email,
      cv_upload: this.CvUploaded,
      country_code: value.country_code
    }

    this.recruitService.submitUserQuestion(this.jdId, data).subscribe((res: any) => {
      console.log(res, 'resssss');
      this.result = res?.result;
      this.jd_id = res?.jd_id;
      this.toast.success(`Questions Submitted Successfully`)
      this.isDisabled = false;
    },
      ((err: any) => {
        this.toast.error(`You have already submitted the answers.`)
        console.log(err?.error.message)
      })
    )
  }
  countryCodeList: any = [];

  filteredCountryCodeList1: any = [];
  filteredCountryCodeList2: any = [];
  getAll_Country_codes() {

    this._configurationalMasterService.getAll_Country_codes().subscribe((res: any) => {
      this.countryCodeList = res.data;
      this.filteredCountryCodeList1 = [...this.countryCodeList];
      this.filteredCountryCodeList2 = [...this.countryCodeList];
    })
  }

  filterCountryCode2(event: any) {
    const searchValue = event?.target?.value?.toLowerCase() || '';
    if (!searchValue) {
      this.filteredCountryCodeList2 = [...this.countryCodeList];
      return;
    }
    this.filteredCountryCodeList2 = this.countryCodeList.filter((item: any) =>
      item.dialing_code?.toLowerCase().includes(searchValue)
    );
  }

    openDialog() {
      const dialogRef = this.dialog.open(ViewDocumentDialogComponent, {
        data: { descripition: this.jobDataBy?.descripition },
  
        width: '80%',
      });
  
      dialogRef.afterClosed().subscribe((result) => {});
    }
  
}
