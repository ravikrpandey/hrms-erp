import { DatePipe, ViewportScroller } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { GridApi } from 'ag-grid-community';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { JobDescriptionService } from 'src/app/@shared/services/service/recruitment/job-description.service';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-view-job-description',
  templateUrl: './view-job-description.component.html',
  styleUrls: ['./view-job-description.component.scss'],
})
export class ViewJobDescriptionComponent {
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
  
  constructor(
    private scroller: ViewportScroller,
    private fb: FormBuilder,
    private _empRegistration: EmpRegistrationService,
    private toast: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private recruitService: RecruitService,
    private _configurationalMasterService: ConfigurationalmasterService,
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
      contract_type: new FormControl(null),
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
      type_of_contract: new FormControl(null),
      department: new FormControl(null, Validators.required),
      location: new FormControl(null, Validators.required),
      area: new FormControl(null, Validators.required),
      area_name: new FormControl(null),
      created_by: new FormControl(null),
      selectedshare_profile: [[], Validators.required],
      job_Type_id: new FormControl(null, Validators.required),
    });
    this.jobDescriptionForm = this.fb.group({
      description: new FormControl(null),
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

  employee_id: any;
  planModel: any = { start_time: new Date() };

  ngOnInit(): void {
    this.loginUserDetails = localStorage.getItem('signInUser');
    this.loginUserDetails = JSON.parse(this.loginUserDetails);
    this.entity_id = this.loginUserDetails?.entity_id;

    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.jdId = params?.id;
      this.idForUpdate = params?.id;
      this.actionType = params?.actionType;
      this.paramsData = params?.view;
      this.job_id = Number(params.job_id);

      if (this.jdId) {
        this.getByJD();
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
    this.getJobTitle();
    this.getJobType();
    this.getSpocSingle();
    this.getVerticalData();
    this.getAll_Job_Type();
    this.getAll_Job_Profile_Type();

    this._configurationalMasterService.listLocation().subscribe((res: any) => {
      this.locationData = res.data;
    });

    this.getDepartmentActive();
    this.getLocations();
    this.getDesignations();
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
    // this.location.back();
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
  job_share: any = [];
  getByJD() {
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
    this.htmlEditorValue2 = this.jobDataBy?.descripition;
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
      contract_type: this.jobDataBy?.contract_type,
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
      description: this.jobDataBy?.descripition,
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
        assign_to: this.jobDataBy?.emp_first + '' + this.jobDataBy?.emp_last,
        vendor_id: this.jobDataBy?.vendor_id,
        spoc_name: this.jobDataBy?.first_name + '' + this.jobDataBy?.last_name,
        level_of_interview: this.jobDataBy?.level_of_interview,
        created_by: this.user_id,
        created_on: this.jobDataBy?.created_on,
      }),
      this.jobDescriptionForm.patchValue({
        description: this.jobDataBy?.descripition,
      }),
      this.jobSpocForm.patchValue({
        SPOCName: this.getData.spoc_name,
        interviewLevel: this.getData.interview_level,
        createdBy: this.getData.created_by || this.emp.first_name,
        createdOn: this.getData.created_on,
      }),
      console.log(this.getData.description);

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
