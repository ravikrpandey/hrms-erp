import { DatePipe, ViewportScroller } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RecruitService } from '../../../../@shared/services/recruitment.service';
import { GridApi } from 'ag-grid-community';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { Location } from '@angular/common';
import { environment } from 'src/app/environments/environment';
import { JobDescriptionService } from 'src/app/@shared/services/service/recruitment/job-description.service';
import { MatStepper } from '@angular/material/stepper';
import { CommonService } from 'src/app/@shared/services/common.service';

@Component({
  selector: 'app-job-description-create',
  templateUrl: './job-description-create.component.html',
  styleUrls: ['./job-description-create.component.scss'],
  providers: [DatePipe],
})
export class JobDescriptionCreateComponent {
  @ViewChild('editer') editer: any;
  propertyManager: any;
  jobDetailsForm: FormGroup;
  jobPostDetailsForm: FormGroup;
  jobAddForm: FormGroup;
  jobSpocForm: FormGroup;
  jobDescriptionForm: FormGroup;
  private gridApi!: GridApi<any>;
  file: any;
  employeBYId: any;
  id: any;
  getData: any;
  employeReport: any;
  submitted = true;
  imagePath: any;
  imageToUpload: any;
  basicData: any;
  dataEmployee: any;
  data: any = '';
  regionData: any;
  gradeData: any;
  imageDefult: any = '../../../../../../assets/icons/icon_DQS/user.png';
  abc: any;
  update: any;
  employeId: any;
  title: any;
  jobTypeId: any;
  jobTitleId: any;
  jobRole: any;
  requisitionStatus: any;
  jobStatus: any;
  requestedBy: any;
  assignedTo: any;
  reportingManager: any;
  lastName: any;
  salaryRange: any;
  title2: any;
  reportData: any = [];
  cellValue: any;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  reposting: any;
  date: any;
  stepId: any;
  jobId: any;
  job_id: any;
  jobTitle: any;
  jobType: any;
  strippedString: any;
  spocData: any;
  jodData: any;
  formCondition: boolean = false;
  formConditionTwo: boolean = false;
  formConditionThree: boolean = false;
  formConditionFour: boolean = false;
  verticalData: any;
  verticalName2: any;
  FakeJobId: any;
  fakeVerticalId: any;
  isLinear = true;
  emp: any;
  FromDate: any;
  toDate: any;
  locationData: any;
  departmentData: any;
  variables: any;
  variable: any;
  asignData: any;
  asignvariables: any;
  asignvariable: any;
  reportmData: any;
  reportvariables: any;
  reportvariable: any;
  description: string;
  entity_id: any;
  departments: any;
  rowDataCheck: any;
  newAreaList: any;
  newCostList: any;
  locations: any;
  getContractData: any;
  designationList: any;
  fileUpload: any;
  getAllSuperviserData: any;
  arrayData: any[] = [];
  arrayDataQuestion: any[] = [];
  checkCondition: boolean = false;
  questionForm: any;
  jdId: any;
  idForUpdate: any;
  actionType: any;
  jobDataBy: any;
  paramsData: any;
  allJobArray: any;
  user_id: any;
  toMinDate: any;
  finacial_id: any;
  ageRangeInvalid: boolean;
  loginUserDetails: any;
  Login_user_id: any = localStorage.getItem('signInUser');
  loginUserId: any = JSON.parse(this.Login_user_id).employee_id;
  loginUserName: any = JSON.parse(this.Login_user_id).first_name;
  last_name: any;
  designationList2: any;
  designations: any;
  getContractData2: any;
  contracts: any;
  departments2: any;
  departmentList: any;
  areas: any;
  newAreaList2: any;
  locations2: any;
  locationList: any;
  getAllSuperviserData2: any;
  supervisers: any;
  getAllSuperviserDataSpoc: any;
  getAllSuperviserDataSpoc2: any;
  supervisersSpoc: any;
  htmlEditorValue = '<p>Shishir Jain </p>';
  htmlEditorValue2 = ``;
  type: any;
  vendors: any = [];
  allJob_Type: any = [];
  allshare_profileType: any = [];
  job_share: any = [];

  constructor(
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private _empRegistration: EmpRegistrationService,
    private toast: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private recruitService: RecruitService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private location: Location,
    private _empService: EmpRegistrationService,
    private $jobDescription: JobDescriptionService,
    public $common: CommonService
  ) // private MiscellaneousService:MiscellaneousService
  {
    this.dataEmployee;
    this.jobDetailsForm = this.fb.group({
      jobTitle: new FormControl(null, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      jobTypeId: new FormControl(null),
      requisitionStatus: new FormControl(null),
      jobRole: new FormControl(null),
      numberOfPosition: new FormControl(null),
      experience: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[0-9]{1,3}$/),
      ]),
      number_of_positions: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[0-9]{1,3}$/),
      ]),
      startDate: new FormControl(null, Validators.required),
      endDate: new FormControl(null, Validators.required),
      leader_position: new FormControl(null, Validators.required),
      job_position: new FormControl(null, Validators.required),
      type_of_contract: new FormControl(null, Validators.required),
      department: new FormControl(null, Validators.required),
      location: new FormControl(null, Validators.required),
      area: new FormControl(null, Validators.required),
      area_name: new FormControl(null),
      created_by: new FormControl(null),
      selectedshare_profile: [[], Validators.required],
      job_Type_id: new FormControl(null, Validators.required),
    });
    this.jobDescriptionForm = this.fb.group({
      description: new FormControl(null, Validators.required),
      file: new FormControl(null),
    });
    this.jobPostDetailsForm = this.fb.group({
      age_range_min: [
        null,
        [Validators.required, Validators.min(18), Validators.max(49)],
      ],
      age_range_max: [
        null,
        [Validators.required, Validators.min(19), Validators.max(50)],
      ],
      monthly_salary: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[0-9]{1,8}$/),
      ]),
      verticalId: new FormControl(null),
      department: new FormControl(null),
      candidateAge: new FormControl(null),
      salaryRange: new FormControl(null),
      qualification: new FormControl(null, [Validators.required]),
      job_status: new FormControl(null, [Validators.required]),
      assign_to: new FormControl(null),
      vendor_id: new FormControl(null),
      spoc_name: new FormControl(null, [Validators.required]),
      level_of_interview: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[0-9]{1,2}$/),
      ]),
      created_on: new FormControl(null, [Validators.required]),
    });

    this.jobAddForm = this.fb.group({
      skill_name: new FormControl(null),
    });
    this.jobSpocForm = this.fb.group({
      SPOCName: new FormControl(null, Validators.required),
      interviewLevel: new FormControl(null, [
        Validators.pattern('^[0-9]{1}$'),
        Validators.required,
      ]),
      createdBy: new FormControl(null, Validators.required),
      createdOn: new FormControl(null, Validators.required),
    });
    this.questionForm = this.fb.group({
      tableRows: new FormArray([
        new FormGroup({
          // description: new FormControl(null, [Validators.required]),
          // document_file: new FormControl(null, [Validators.required]),
        }),
      ]),
      question_name: new FormControl(null),
      question_answer: new FormControl(null),
      percentage: new FormControl(null, Validators.required),
    });
    // Set the formatted description to the form control
  }

  validateAgeRange() {
    const minAge = this.jobPostDetailsForm.get('age_range_min')?.value;
    const maxAge = this.jobPostDetailsForm.get('age_range_max')?.value;

    if (minAge !== null && maxAge !== null && maxAge < minAge) {
      this.jobPostDetailsForm
        .get('age_range_max')
        ?.setErrors({ ageRangeInvalid: true });
    } else {
      this.jobPostDetailsForm.get('age_range_max')?.setErrors(null); // Clear the error if condition is not met
    }
  }

  employee_id: any;
  planModel: any = { start_time: new Date() };

  ngOnInit(): void {
    console.log(this.arrayDataQuestion, 'arrayDataQuestion');
    this.user_id = localStorage.getItem('EmpMainId');

    this.loginUserDetails = localStorage.getItem('signInUser');
    this.loginUserDetails = JSON.parse(this.loginUserDetails);
    if (
      !(
        this.loginUserDetails.last_name == null ||
        this.loginUserDetails.last_name == undefined ||
        this.loginUserDetails.last_name == 'undefined'
      )
    ) {
      this.last_name = this.loginUserDetails.last_name;
    }

    this.entity_id = localStorage.getItem('selectedEntityId');
    let finacial_id = localStorage.getItem('financial_id');
    this.finacial_id = Number(finacial_id);

    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.jdId = params?.id;
      this.idForUpdate = params?.id;
      this.actionType = params?.actionType;
      this.paramsData = params?.view;
      this.job_id = Number(params.job_id);

      if (this.jdId) {
        if (
          this.actionType === 'jd_from_request' ||
          this.paramsData === 'view_from_approved'
        ) {
          this.getID_job_request();
        } else {
          this.getByJD();
        }
      }

      if (this.job_id) {
        this.formCondition = true;
        this.formConditionTwo = true;
        this.formConditionThree = true;
        this.formConditionFour = true;
        // this.isLinear = false;
      }
      this.getByIdUse();
    });

    let loginUser: any = localStorage.getItem('signInUser');
    this.emp = JSON.parse(loginUser);

    this.jobDetailsForm.controls['created_by'].patchValue(
      this.emp?.first_name + ' ' + this.loginUserDetails.last_name
    );

    this.getJobTitle();
    this.getJobType();
    this.getSpocSingle();
    this.getVerticalData();
    // this.getDepartment();
    this.getAssginSingle();
    this.getReportSingle();
    this.getAll_Job_Type();
    this.getAll_Job_Profile_Type();

    this._configurationalMasterService.listLocation().subscribe((res: any) => {
      this.locationData = res.data;
    });

    this.getAllMyrequest();
    this.getDepartmentActive();
    this.getLocations();
    this.getContract();
    this.getDesignations();
    this.getAllSuperviser();
    this.getAll_Vendor_by_Type();
  }

  // get getFormControls() {
  //   const control = this.questionForm.get('tableRows') as FormArray;
  //   return control;
  // };
  // get CF_1(): any { return this.questionForm.controls };

  onKeyPress = (e: any) => {
    this.toMinDate = e.target.value;
  };

  goBack() {
    this.location.back();
  }
  goBackStepper(stepper: MatStepper) {
    stepper.previous();
  }
  getDepartment() {
    this._configurationalMasterService
      .getDepartment(this.entity_id)
      .subscribe((res: any) => {
        this.departmentData = res.data;
      });
  }

  getJobTitle() {
    this.recruitService.getJobTitle().subscribe((res: any) => {
      this.jobTitle = res.data;
    });
  }

  getJobType() {
    this.recruitService.getJobType().subscribe((res: any) => {
      this.jobType = res.data;
    });
  }

  scroll(stepper: MatStepper) {
    if (this.jobDetailsForm.invalid) {
      this.toast.error('Fields Are Required');
      return;
    }
    this.onSubmitForm();
    this.formCondition = true;
    stepper.next();
  }

  scrollTwo(stepper: MatStepper) {
    if (this.jobDescriptionForm.invalid) {
      this.toast.error('Fields Are Required');
      return;
    }
    if (!this.fileUpload) {
      return this.toast.error('Upload Job Description File Fields is Required');
    }
    this.onSubmitDescription();
    stepper.next();
    this.formConditionTwo = true;

    if (this.paramsData != 'view') {
      let date: any = new Date();
      date = moment(date).format('DD/MM/YYYY');
      this.jobPostDetailsForm.controls['created_on']?.setValue(date);
    }
  }

  scrollThree(stepper: MatStepper) {
    if (this.jobPostDetailsForm.invalid) {
      this.toast.error('Fields Are Required');
      return;
    }
    this.onPostSubmitForm();
    stepper.next();
    this.formConditionThree = true;
  }

  scrollFour(stepper: MatStepper) {
    if (!this.arrayData?.length) {
      return this.toast.error('Add at least one skill');
    }
    if (this.jobAddForm.invalid) {
      this.toast.error('Fields Are Required');
      return;
    }
    this.onSubmitAddForm();
    stepper.next();
    this.formConditionFour = true;
  }

  getByIdUse() {
    this.recruitService.getJobById(this.job_id).subscribe((res: any) => {
      this.getData = res.data;
      const jsonData = {
        description: this.getData.description,
      };
      // Format the description as a list
      // this.description = this.formatDescriptionAsList(jsonData.description);

      //   this.jobDescriptionForm.get('description').setValue(this.description);
      this.patchFormValue();
    });
  }

  get f() {
    return this.jobDetailsForm.controls;
  }

  formatDescriptionAsList(description: string): string {
    const lines = description.split('\n');
    const formattedList = lines
      .filter((line) => line.trim() !== '') // Remove empty lines
      .map((line) => `<li>${line}</li>`) // Wrap each line in <li> tags
      .join('');
    return `<ul>${formattedList}</ul>`;
  }

  onChange(e: any) {
    this.fileUpload = null;
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
      this.fileUpload = 'uploaded_files/' + res?.url;
    });
  }
  getDepartmentName(id: any) {
    let x = '';
    this.departments.forEach((value: any) => {
      if (value.dept_id == id) {
        x = value.department_name;
      }
    });
    return x;
  }

  getPositionName(id: any) {
    let x = '';
    this.designationList.forEach((value: any) => {
      if (value.designation_id == id) {
        x = value.designation_name;
      }
    });
    return x;
  }
  isUpdating = false;
  onEditorChange(event: any) {
    if (this.isUpdating) return;
    if (this.htmlEditorValue2 !== event.editor.getData()) {
      this.isUpdating = true;
      this.jobDescriptionForm.controls['description'].setValue(
        event.editor.getData(),
        { emitEvent: false }
      );
      this.htmlEditorValue2 = event.editor.getData(); // Get CKEditor data
      this.isUpdating = false;
      // Sync with form control
    }
  }

  onSubmitForm() {
    this.submitted = true;
    let val = this.jobDetailsForm.value;

    this.date = this.datePipe.transform(new Date(), 'dd-MM-yy');
    let financial_id = localStorage.getItem('financial_id');
    let selectedEntityId = localStorage.getItem('selectedEntityId');
    let dept_name = this.getDepartmentName(val?.department);
    let position_name = this.getPositionName(val?.job_position);
    let job_title = val?.jobTitle;
    let s = `Prepare a very detailed html document with attractive style css applied in html for job description as per following data,job Title: ${job_title},position:${position_name}, department: ${dept_name}.Remove any other welcome or trailing text, i want only formatted job description html.type only html doc, nothing else`;
    let x: any = true;
    if (
      this.actionType == 'jd_from_request' ||
      this.actionType == 'view_from_approved'
    ) {
      x = false;
    }
    const data = {
      branch_id: val?.location,
      selectedshare_profile: val?.selectedshare_profile,
      job_Type_id: val?.job_Type_id,
      job_title: val?.jobTitle,
      designation_id: val?.job_position,
      leadership: val?.leader_position,
      contract_types_id: val?.type_of_contract,
      start_date: moment(val.startDate).format('YYYY-MM-DD'),
      end_date: moment(val.endDate).format('YYYY-MM-DD'),
      department_id: val?.department,
      area_id: val?.area,
      entity_id: selectedEntityId,
      experience: val?.experience,
      tab_type: 'Job Details',
      job_request_id:
        this.actionType === 'jd_from_request' || this.paramsData !== 'update'
          ? null
          : this.jdId,
      number_of_positions: val?.number_of_positions,
      created_by: this.user_id,
      financial_year_id: financial_id,
      id: this.paramsData == 'update' ? this.jdId : null,
      openAiJdString: s,
      aiEngine: localStorage.getItem('activeEngine') || 'Gemini',
      createJd: x,
    };

    this.data = this.jobDetailsForm.value;

    this.recruitService.createJobDetails(data).subscribe(
      (res: any) => {
        this.toast.success(res.message);
        this.jdId = res.data;
        let jd = res.bulletPoints;
        jd = jd.replace(/\n/g, '').replace(/•/g, '').replace(/`/g, '').trim();
        console.log(jd);
        if (
          this.actionType != 'jd_from_request' &&
          this.actionType != 'view_from_approved'
        ) {
          this.htmlEditorValue2 = `${jd}`;
          this.jobDescriptionForm.controls['description'].setValue(
            this.htmlEditorValue2
          );
        }
      },
      (err) => {
        this.toast.error(err.error.message);
      }
    );
  }

  // onSubmitForm() {

  //   this.submitted = true;
  //   let val = this.jobDetailsForm.value;

  //   this.date = this.datePipe.transform(new Date(), 'dd-MM-yy');
  //   let financial_id = localStorage.getItem("financial_id");
  //   let selectedEntityId = localStorage.getItem("selectedEntityId");

  //   const data = {
  //     branch_id: val?.location,
  //     job_title: val?.jobTitle,
  //     designation_id: val?.job_position,
  //     leadership: val?.leader_position,
  //     contract_types_id: val?.type_of_contract,
  //     start_date: moment(val.startDate).format('YYYY-MM-DD'),
  //     end_date: moment(val.endDate).format('YYYY-MM-DD'),
  //     department_id: val?.department,
  //     area_id: val?.area,
  //     entity_id: selectedEntityId,
  //     experience: val?.experience,
  //     tab_type: "Job Details",
  //     job_request_id: this.actionType == 'jd_from_request' ? this.jdId : null,
  //     number_of_positions: val?.number_of_positions,
  //     created_by: this.user_id,
  //     financial_year_id: financial_id,
  //     id: this.actionType == 'jd_from_request' ? null : this.idForUpdate,
  //   };

  //   this.data = this.jobDetailsForm.value;

  //   this.recruitService.createJobDetails(data).subscribe(
  //     (res: any) => {
  //       this.toast.success(res.message);
  //       this.jobId = res.data;
  //     },
  //     (err) => {
  //       this.toast.error(err.error.message);

  //     }
  //   );
  // }

  onPostSubmitForm() {
    this.submitted = true;
    let val = this.jobPostDetailsForm.value;

    this.date = this.datePipe.transform(new Date(), 'dd-MM-yy');
    let dateNew: any = {
      age_range_min: val.age_range_min,
      age_range_max: val.age_range_max,
      monthly_salary: val.monthly_salary,
      level_of_interview: val.level_of_interview,
      job_status: val.job_status,
      created_on: val.created_on,
      qualification_name: val.qualification,
      assign_id: val.assign_to,
      spoc_id: val.spoc_name,
      id: this.jdId,
      tab_type: 'Job requirements',
      vendor_id: val?.vendor_id,
    };

    this.data = this.jobPostDetailsForm.value;
    this.recruitService.createJobDetails(dateNew).subscribe((res: any) => {
      this.toast.success(res?.message);
    });
  }

  onSubmitDescription() {
    let val = this.jobDescriptionForm.value;
    let dateNew: any = {
      upload_document: this.fileUpload,
      descripition: val.description,
      id: this.jdId,
      tab_type: 'Job Description',
    };
    this.recruitService.createJobDetails(dateNew).subscribe((res: any) => {
      this.toast.success(res?.message);
    });
  }

  onSubmitAddForm() {
    this.submitted = true;
    let val = this.jobAddForm.value;
    let dateNew = {
      tab_type: 'Skill',
      id: this.jdId,
      item: this.arrayData,
    };
    this.data = this.jobAddForm.value;
    // console.log(dateNew);
    this.recruitService.createJobDetails(dateNew).subscribe((res: any) => {
      this.toast.success(res?.message);
    });
  }

  onSubmitSpocForm() {
    if (!this.arrayDataQuestion?.length) {
      return this.toast.error('Add at least one question');
    }
    this.submitted = true;
    let val = this.questionForm.value;
    if (!val?.percentage) {
      return this.toast.error('Percentage Fields Are Required');
    }

    let dateNew: any = {
      tab_type: 'Questions',
      id: this.jdId,
      percentage: val.percentage,
      question_item: this.arrayDataQuestion,
      isCompletedJd: 'COMPLETED',
    };

    this.recruitService.createJobDetails(dateNew).subscribe((res: any) => {
      this.jodData = res.data;

      this.route.navigate(['master/recruitment/job-discription-main']);
      this.toast.success(res?.message);
    });
  }

  updateAll() {
    let val = this.jobDetailsForm.value;
    let val1 = this.jobAddForm.value;
    let val2 = this.jobSpocForm.value;
    let val3 = this.jobPostDetailsForm.value;
    let val4 = this.jobDescriptionForm.value;

    let dataUpdate: any = {
      job_title: val.jobTitle || 'ash',
      job_role: val.jobRole,
      FK_job_type_id: val.jobTypeId,
      start_date: moment(val.startDate).format('YYYY-MM-DD'),
      end_date: moment(val.endDate).format('YYYY-MM-DD'),
      requisition_status: val.requisitionStatus,
      experience: val.experience,
      //description

      description: val4.description.replace(/(<([^>]+)>)/gi, ''),
      //post detail;s
      location: val3.location,
      FK_vertical_id: val3.verticalId,
      department: val3.department,
      candidate_age: val3.candidateAge,
      salary_range: val3.salaryRange,
      qualification: val3.qualification,

      status: val1.jobStatus,
      requested_by: val1.requestedBy,
      assigned_to: val1.assignedTo,
      spoc_name: val1.SPOCName,
      interview_level: val2.interviewLevel,
      created_by: this.user_id,
      created_on: moment(val2.createdOn).format('YYYY-MM-DD'),
    };

    this.recruitService
      .updateAll(this.job_id, dataUpdate)
      .subscribe((res: any) => {
        // this.update=res
        this.toast.success('Job Details Updated successfully..');

        this.route.navigate(['master/recruitment/job-list']);
      });
  }

  reportClick(id: any) {}

  getRegionData() {
    this._empRegistration.getRegionList().subscribe((res: any) => {
      this.regionData = res.data;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  getSpocSingle() {
    this.recruitService.getSpocRecruipment().subscribe((res: any) => {
      this.spocData = res.data;
      console.log(this.spocData, 'scope');

      this.variables = this.spocData.map((res: any) => res.first_name);
      this.variable = this.spocData;
    });
  }

  getAssginSingle() {
    this.recruitService.getSpocRecruipment().subscribe((res: any) => {
      this.asignData = res.data;
      this.asignvariables = this.asignData.map((res: any) => res.first_name);
      this.asignvariable = this.asignData;
    });
  }

  getReportSingle() {
    this.recruitService.allHrRoleJobDescription().subscribe((res: any) => {
      this.reportmData = res.data;
      this.reportvariables = this.reportmData.map((res: any) => res.first_name);
      this.reportvariable = this.reportmData;
    });
  }

  getVerticalData() {
    this.recruitService.getVerticalData().subscribe((res: any) => {
      this.verticalData = res.data;
    });
  }
  now = new Date();
  year = this.now.getFullYear();
  month = this.now.getMonth();
  // day = this.now.getDay();
  dates = this.now.getDate();
  maxDate = moment({
    year: this.year + 100,
    month: this.month,
    date: this.dates,
  }).format('YYYY-MM-DD');
  minDate = moment({
    year: this.year - 0,
    month: this.month,
    date: this.dates,
  }).format('YYYY-MM-DD');
  fromDate(e: any) {
    this.FromDate = moment(e.value).format('YYYY-MM-DD');
  }
  ToDate(e: any) {
    this.toDate = moment(e.value).format('YYYY/MM/DD');
  }

  industryFilter(e: any) {
    const aa = e;
    let filteredVariable = this.variable.filter((item: any) =>
      aa.includes(item.first_name)
    );
    this.spocData = filteredVariable;
  }

  asignFilter(e: any) {
    const aa = e;
    let filteredVariable = this.asignvariable.filter((item: any) =>
      aa.includes(item.first_name)
    );
    this.asignData = filteredVariable;
  }

  reportFilter(e: any) {
    const aa = e;
    let filteredVariable = this.reportvariable.filter((item: any) =>
      aa.includes(item.first_name)
    );
    this.reportmData = filteredVariable;
  }

  designationFilter(e: any) {
    const aa = e;
    let filteredVariable = this.designationList2.filter((item: any) =>
      aa.includes(item.designation_name)
    );
    this.designationList = filteredVariable;
  }

  contractFilter(e: any) {
    const aa = e;
    let filteredVariable = this.getContractData2.filter((item: any) =>
      aa.includes(item.contract_type)
    );
    this.getContractData = filteredVariable;
  }

  departmentFilter(e: any) {
    const aa = e;
    let filteredVariable = this.departments2.filter((item: any) =>
      aa.includes(item.department_name)
    );
    this.departments = filteredVariable;
  }

  areaFilter(e: any) {
    const aa = e;
    let filteredVariable = this.newAreaList2.filter((item: any) =>
      aa.includes(item.area_name)
    );
    this.newAreaList = filteredVariable;
  }

  locationFilter(e: any) {
    const aa = e;
    let filteredVariable = this.locations2.filter((item: any) =>
      aa.includes(item.branch_name)
    );
    this.locations = filteredVariable;
  }

  superviserFilter(e: any) {
    const aa = e;
    let filteredVariable = this.getAllSuperviserData2.filter((item: any) =>
      aa.includes(
        item.first_name + ' ' + item.last_name + ' ' + item.employee_code
      )
    );
    this.getAllSuperviserData = filteredVariable;
  }

  superviserSpocFilter(e: any) {
    const aa = e;
    let filteredVariable = this.getAllSuperviserDataSpoc2.filter((item: any) =>
      aa.includes(
        item.first_name + ' ' + item.last_name + ' ' + item.employee_code
      )
    );
    this.getAllSuperviserDataSpoc = filteredVariable;
  }
  // new

  getDepartmentActive() {
    this._configurationalMasterService
      .getAllDepartment_all_active(this.entity_id)
      .subscribe((res: any) => {
        this.departments = res.data;
        this.departments2 = res.data;
        this.departmentList = this.departments.map(
          (value: any) => value.department_name
        );
      });
  }
  getAllMyrequest() {
    this._configurationalMasterService
      .getAllWorkFlowJob(this.entity_id)
      .subscribe(
        (res: any) => {
          this.rowDataCheck = res.data;
          // this.rowData = res.data.filter((item:any)=>item?.status == "ACTIVE")
        },
        (err: any) => {
          // this.toast.error(`${err.error.message}`)
        }
      );
  }

  getAllAreas(e: any) {
    let data = {
      dep_id: e.value,
    };
    this._configurationalMasterService.getAllArea_active(data).subscribe(
      (res: any) => {
        console.log(res, 'ressss');
        this.newAreaList = res.data;
        this.newAreaList2 = res.data;
        this.areas = this.newAreaList.map((value: any) => value.area_name);
      },
      (err: any) => {
        // this.requestNewPositionForm.get('area').reset();
        this.newAreaList = [];
        this.toast.error(`${err?.error?.message}`);
      }
    );
  }

  getLocations() {
    this._configurationalMasterService
      .branch_get_active()
      .subscribe((params: any) => {
        this.locations = params.data;
        this.locations2 = params.data;
        this.locationList = this.locations.map(
          (value: any) => value.branch_name
        );
      });
  }

  getContract() {
    this._configurationalMasterService
      .getContractTypes_active(this.entity_id, this.finacial_id)
      .subscribe((res: any) => {
        this.getContractData = res.data;
        this.getContractData2 = res.data;
        this.contracts = this.getContractData.map(
          (value: any) => value.contract_type
        );
      });
  }

  getDesignations() {
    this._configurationalMasterService
      .getAllDesignation_active()
      .subscribe((res: any) => {
        this.designationList = res.data;
        this.designationList2 = res.data;
        this.designations = this.designationList.map(
          (value: any) => value.designation_name
        );
      });
  }

  getAllSuperviser() {
    let entity_id = localStorage.getItem('selectedEntityId');
    this._empService
      .grtEmployeeList(entity_id, this.emp?.role)
      .subscribe((res: any) => {
        this.getAllSuperviserData = res.data;
        this.getAllSuperviserData2 = res.data;
        this.supervisers = this.getAllSuperviserData.map(
          (value: any) =>
            value.first_name + ' ' + value.last_name + ' ' + value.employee_code
        );
        this.getAllSuperviserDataSpoc = res.data;
        this.getAllSuperviserDataSpoc2 = res.data;
        this.supervisersSpoc = this.getAllSuperviserData.map(
          (value: any) =>
            value.first_name + ' ' + value.last_name + ' ' + value.employee_code
        );
        //
        // const userId: any = []
        // for (let i = 0; i < res.data.length; i++) {
        //   userId.push(res.data[i].user_role);
        //   this.userRole = userId;
        // }
      });
  }

  addTickt() {
    let val = this.jobAddForm.value;
    console.log(val, 'val');
    if (val.skill_name == null) {
      this.toast.warning('Please Add Skill');
      return;
    }
    let data = {
      skill_name: val.skill_name,
    };
    this.arrayData.push(data);
    this.jobAddForm.get('skill_name')?.reset();

    for (let a = 0; a <= this.arrayData.length; a++) {
      this.arrayData[a]['index'] = a + 1;
    }
    this.checkCondition = true;
    // console.log(this.arrayData, 'this.arrayData');
  }

  deletData(item: any): void {
    item.isDeleted = true;
    const newArrayData = this.arrayData.filter((data) => !data.isDeleted);
    this.arrayData = newArrayData;
  }

  editSkill(item: any, i: any) {
    console.log(item);
    this.deletData(item);
    this.jobAddForm.patchValue({
      skill_name: item.skill_name,
    });
  }

  deletDataQuestion(item: any) {
    item.isDeleted = true;
    const newArrayData = this.arrayDataQuestion.filter(
      (data) => !data.isDeleted
    );
    this.arrayDataQuestion = newArrayData;
  }

  editQuestions(item: any, i: any) {}
  addRowQuestion() {
    // new code
    //   if (this.questionForm.controls?.tableRows?.value && this.questionForm.controls?.tableRows?.value.length > 0) {
    //     let canAddNewRow = true;

    //     const tableRows = this.questionForm.get('tableRows') as FormArray;

    //     this.CF_1.tableRows.push(
    //       new FormGroup({
    //         question_name: new FormControl(null),
    //         question_answer: new FormControl(null)
    //      })
    //     )
    //     tableRows.controls.forEach((control: any) => {
    //       // control.get('question_name').disable();
    //       // control.get('question_answer').disable();
    //       // Assuming 'isSend' is a control in your FormGroup
    //     });
    //     // for (let i = 1; i < this.CF_1.tableRows.controls.length; i++) {
    //     //    this.CF_1.tableRows.controls[i + i].isSend = false;
    //     //   //  this.CF_1.tableRows.controls[i + this.curentIndex].showLoader = false;
    //     // };

    //     if (canAddNewRow) {

    //     } else {

    //         this.toast.error('Please add document details first');

    //     }
    // } else {
    // }

    let val = this.questionForm.value;
    if (val.question_name == null) {
      this.toast.warning('Please Add Question');
      return;
    }
    let data = {
      question: val.question_name,
      answer: val.question_answer,
    };
    this.arrayDataQuestion.push(data);
    console.log(this.arrayDataQuestion);
    this.questionForm.get('question_name')?.reset();
    this.questionForm.get('question_answer')?.reset();

    for (let a = 0; a <= this.arrayDataQuestion.length; a++) {
      this.arrayDataQuestion[a]['index'] = a + 1;
    }
    // console.log(this.arrayDataQuestion, 'this.arrayData');
  }

  deleteTableRows() {
    // console.log(i,'iiii');
    // console.log(control,'control');
    // <FormArray>this.CF_1.tableRows.removeAt(i);
  }

  getByJD() {
    let selectedEntityId = localStorage.getItem('selectedEntityId');
    let financial_id = localStorage.getItem('financial_id');

    let data = {
      job_request_id: null,

      created_by: this.user_id,
      entity_id: selectedEntityId,
      financial_year_id: financial_id,
    };
    this.recruitService.getByJobDescription(this.jdId).subscribe((res: any) => {
      this.allJobArray = res;
      this.jobDataBy = res?.data[0];
      this.arrayData = res?.getAllData_skill;
      this.arrayDataQuestion = res?.getAllData_question;
      this.job_share = res?.share_profile_data;
      this.patchFormValue();
    });
  }
  allocationType: string = '';
  patchFormValue() {
    let tempList: any = [];
    this.job_share?.map((item: any) => {
      tempList?.push(item?.job_share_type_id);
    });
    this.getAllAreas({ value: this.jobDataBy?.department_id });
    this.htmlEditorValue2 =
      this.jobDataBy?.descripition ?? this.jobDataBy?.editor_msg;
    this.htmlEditorValue = this.htmlEditorValue2;
    if (this.jobDataBy?.assign_id && this.jobDataBy?.vendor_id) {
      this.allocationType = 'Both';
    } else if (this.jobDataBy?.vendor_id) {
      this.allocationType = 'Vendor';
    } else if (this.jobDataBy?.assign_id) {
      this.allocationType = 'Internal';
    } else {
      this.allocationType = ''; // No selection
    }
    this.type = this.allocationType;
    this.jobDetailsForm.patchValue({
      jobTitle: this.jobDataBy?.job_title,
      job_Type_id: this.jobDataBy?.job_Type_id,
      selectedshare_profile: tempList,
      jobTypeId: this.jobDataBy?.jobTypeId,
      requisitionStatus: this.jobDataBy?.requisitionStatus,
      jobRole: this.jobDataBy?.jobRole,
      numberOfPosition: this.jobDataBy?.numberOfPosition,
      experience: this.jobDataBy?.experience,
      startDate: this.jobDataBy?.start_date,
      endDate: this.jobDataBy?.end_date,
      leader_position: this.jobDataBy?.leadership,
      job_position: this.jobDataBy?.designation_id,
      type_of_contract: this.jobDataBy?.contract_types_id,
      department: this.jobDataBy?.department_id,
      location: this.jobDataBy?.branch_id,
      area: this.jobDataBy?.area_id,
      area_name: this.jobDataBy?.area_name,
      number_of_positions: this.jobDataBy?.number_of_positions,
      description: this.jobDataBy?.descripition ?? this.jobDataBy?.editor_msg,
    }),
      this.jobPostDetailsForm.patchValue({
        age_range_min: this.jobDataBy?.age_range_min,
        age_range_max: this.jobDataBy?.age_range_max,
        monthly_salary: this.jobDataBy?.monthly_salary,
        verticalId: this.jobDataBy?.verticalId,
        department: this.jobDataBy?.department,
        candidateAge: this.jobDataBy?.candidateAge,
        salaryRange: this.jobDataBy?.salaryRange,
        qualification: this.jobDataBy?.qualification_name,
        job_status: this.jobDataBy?.job_status,
        assign_to: this.jobDataBy?.assign_id,
        vendor_id: this.jobDataBy?.vendor_id,
        spoc_name: this.jobDataBy?.spoc_id,
        level_of_interview: this.jobDataBy?.level_of_interview,
        created_by: this.user_id,
        created_on: this.jobDataBy?.created_on,
      }),
      this.jobDescriptionForm.patchValue({
        description: this.jobDataBy?.descripition ?? this.jobDataBy?.editor_msg,
      }),
      this.jobSpocForm.patchValue({
        SPOCName: this.getData?.spoc_name,
        interviewLevel: this.getData?.interview_level,
        createdBy: this.getData?.created_by || this?.emp.first_name,
        createdOn: this.getData?.created_on,
      }),
      console.log(this.getData?.description);

    // this.jobDescriptionForm.patchValue({
    //   description: this.getData.description.replace(/\n/g, '<br>'),
    // });
  }
  generateImageUrl() {
    return environment.servralUrl + '/';
  }

  getID_job_request() {
    this.$jobDescription.getID_job_request(this.jdId).subscribe((res: any) => {
      this.allJobArray = res?.data;
      this.jobDataBy = res?.data;
      this.getAllAreas(this.jobDataBy?.department_id);
      this.patchFormValue();
    });
  }
  statusChange(event: any) {
    this.type = event;
  }
  getAll_Vendor_by_Type() {
    this.recruitService.getAll_Vendor_by_Type().subscribe(
      (res: any) => {
        if (res) {
          this.vendors = res.data;
        }
      },
      (err: any) => {}
    );
  }

  getAll_Job_Type() {
    this.$jobDescription.getAll_Job_Type().subscribe(
      (res: any) => {
        if (res) {
          this.allJob_Type = res.data;
        }
      },
      (err: any) => {}
    );
  }
  getAll_Job_Profile_Type() {
    this.$jobDescription.getAll_Job_Profile_Type().subscribe(
      (res: any) => {
        if (res) {
          this.allshare_profileType = res.data;
        }
      },
      (err: any) => {}
    );
  }
}
