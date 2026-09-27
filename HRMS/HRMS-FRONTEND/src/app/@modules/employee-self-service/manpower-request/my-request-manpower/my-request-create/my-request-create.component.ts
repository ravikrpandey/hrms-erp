import { DatePipe, ViewportScroller } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { HeadService } from 'src/app/@shared/services/head.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { GridApi } from 'ag-grid-community';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { Location } from '@angular/common';
import { EmployeSelfService } from 'src/app/@shared/services/employe-self.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { environment } from 'src/app/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { RemarkJobRequestComponent } from '../remark-job-request/remark-job-request.component';

@Component({
  selector: 'app-my-request-create',
  templateUrl: './my-request-create.component.html',
  styleUrls: ['./my-request-create.component.scss'],
  providers: [DatePipe],
})
export class MyRequestCreateComponent {
  requestNewPositionForm: any;
  public designationList: any;
  public locations: any;
  public departments: any;
  public jdToUpload: any;
  public areaList: any;
  getContractData: any;
  getAllSuperviserData: any;
  selectJob: boolean = true;
  getAllReasonData: any;
  // $common: any;
  createPrForm: any;
  imageToUpload: any;
  imagePath: any;
  employee_id: any;
  branchAllData: any;
  typeData: { type: string; id: number }[];
  now = new Date();
  year = this.now.getFullYear();
  month = this.now.getMonth();
  date = this.now.getDate();
  maxDate = moment({
    year: this.year + 100,
    month: this.month,
    date: this.date,
  }).format('YYYY-MM-DD');
  minDate = moment({
    year: this.year - 0,
    month: this.month,
    date: this.date,
  }).format('YYYY-MM-DD');
  minEndDate: any;
  // cost_center_idData: any;
  newAreaList: any;
  // newCostList: any;
  rowDataCheck: any;
  entity_id: any;
  jobData: any;
  jobId: any;
  fileBind: any;
  budgetCheck: boolean;
  paramsData: any;
  fileUpload: any;
  loginUser: any;

  constructor(
    private datePipe: DatePipe,
    private head: HeadService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private configMaster: ConfigurationalmasterService,
    private recruitService: RecruitService,
    private _empService: EmpRegistrationService,
    private emp_self_service: EmployeSelfService,
    private $common: CommonService,
    public dialog: MatDialog,
    private location: Location
  ) {
    const currentDate = new Date();
    const futureDate = new Date();
    futureDate.setDate(currentDate.getDate() + 30);
    this.requestNewPositionForm = this.fb.group({
      job_title: new FormControl(null, [
        Validators.required,
        Validators.maxLength(300),
      ]),
      selectPosition: new FormControl(null, Validators.required),
      // leaderPosition: new FormControl(null, Validators.required),
      // contract_types_id: new FormControl(2,),
      recruitmentReason: new FormControl(null, Validators.required),
      expectedStartDate: new FormControl(new Date(), Validators.required),
      expectedEndDate: new FormControl(futureDate, Validators.required),
      hierarchicalSuperior: new FormControl(null, Validators.required),
      department: new FormControl(null, Validators.required),
      location: new FormControl(null, Validators.required),
      area: new FormControl(null, Validators.required),
      jobSpecification: new FormControl(null, Validators.required),
      jobDescriptionFiles: new FormControl(null),
      text: new FormControl(null),
      budget: new FormControl(null),
      remark: new FormControl(null),
      justification: new FormControl(null),
      file: new FormControl(null),
      budget_Justification: new FormControl(null),
      skill: new FormControl(null, Validators.required),
      qualification: new FormControl(null, Validators.required),
      experience: new FormControl(null, Validators.required),
      no_of_position: new FormControl(null, Validators.required),
      emplyoment_type_id: new FormControl(null, Validators.required),
      salary: new FormControl(null, Validators.required),
    });
    let idEntity = localStorage.getItem('selectedEntityId');
    this.entity_id = Number(idEntity);
    this.apiOnLoad();
    this.requestNewPositionForm
      .get('expectedStartDate')
      ?.valueChanges.subscribe((value: any) => {
        if (value) {
          const startDate = new Date(value);
          this.minEndDate = new Date(startDate);
          this.minEndDate.setDate(startDate.getDate() + 30);
          const endDate =
            this.requestNewPositionForm.get('expectedEndDate')?.value;
          if (endDate && new Date(endDate) < this.minEndDate) {
            this.requestNewPositionForm.get('expectedEndDate')?.setValue(null);
          }
        }
      });
  }
  ngOnInit(): void {
    var empData: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(empData);
    const singleEmpData = JSON.parse(empData);
    this.employee_id = singleEmpData?.employee_id;
    // this.apiOnLoad()
    this.requestNewPositionForm?.get('jobSpecification')?.setValue('YES');
    this.requestNewPositionForm?.get('budget')?.setValue('YES');
    this.onSelectedBudget();
    // this.onSelectedJobSpecification()
    this.activeroute.queryParams.subscribe((params: any) => {
      this.jobId = params?.id;
      this.paramsData = params?.type;
      if (this.jobId) {
        this.getByIdJob();
      }
    });
    this.getContract();
    this.getAllSuperviser();
    this.getAllReason();
    this.getEmployementType();
  }

  getByIdJob() {
    debugger;
    this.emp_self_service.getByJobRequest(this.jobId).subscribe(
      (res: any) => {
        this.jobData = res?.data;
        this.fileBind = res?.data?.upload_document;
        this.fileUpload = res?.data?.upload_document;

        if (this.jobData?.department_id) {
          this.getAllAreas({ value: this.jobData?.department_id });
        }

        debugger
        let reporting_name = this.jobData?.reporting_first_name + ' ' + this.jobData?.reporting_last_name;
        this.requestNewPositionForm.patchValue({
          job_title: this.jobData?.job_title,
          selectPosition: this.jobData?.designation_id,
          leaderPosition: this.jobData?.leadership,
          // contract_types_id: this.jobData?.contract_types_id,
          recruitmentReason: this.jobData?.reason_id,
          expectedStartDate: this.jobData?.start_date,
          expectedEndDate: this.jobData?.end_date,
          hierarchicalSuperior: this.paramsData == 'view' ? reporting_name : this.jobData?.user_id,
          department: this.jobData?.department_id,
          location: this.jobData?.branch_id,
          area: this.jobData?.area_id,
          jobSpecification: this.jobData?.job_specification,
          jobDescriptionFiles: this.jobData?.jobDescriptionFiles,
          text: this.jobData?.editor_msg,
          budget: this.jobData?.budget_status,
          // cost_center_id: this.jobData?.cost_center_id,
          budget_Justification: this.jobData?.budget_Justification,
          justification: this.jobData?.justification,
          file: this.jobData?.file,
          financial_id: this.jobData?.financial_id,

          skill: this.jobData?.skill,
          qualification: this.jobData?.qualification,
          experience: this.jobData?.experience,
          no_of_position: this.jobData?.number_of_positions,
          emplyoment_type_id: this.jobData?.emplyoment_type_id,
          salary: this.jobData?.salary,
        });
        if (this.jobData?.job_specification == 'YES') {
          this.selectJob = true;
        } else if (this.jobData?.job_specification == 'NO') {
          this.selectJob = false;
        }
        if (this.jobData?.budget_status == 'YES') {
          this.budgetCheck = true;
        } else if (this.jobData?.budget_status == 'NO') {
          this.budgetCheck = false;
        }
      },
      (err: any) => {
        this.toast.error(`${err?.error?.message}`);
      }
    );
  }
  generateImageUrl() {
    return environment.serverUrl + '/';
  }
  apiOnLoad() {
    this.getDesignations();
    this.getLocations();
    this.getDepartment();
    this.getArea();
    this.getTYpe();
    // this.getAllCostCenter();
    this.getAllMyrequest();
  }

  getTYpe() {
    this.typeData = [{ type: 'Job Request', id: 1 }];
  }

  desigantionfilter: any = [];
  getDesignations() {
    this.configMaster.getAllDesignation_active().subscribe((res: any) => {
      this.designationList = res.data;
      this.desigantionfilter = this.designationList;
    });
  }
  // getAllCostCenter() {
  //   this.emp_self_service.getAllCostCenter().subscribe((res: any) => {
  //     this.cost_center_idData = res.data;
  //   })
  // }
  filterbybranchname: any = [];
  getLocations() {
    this.configMaster.branch_get_active().subscribe((params: any) => {
      // this.locations = params.data;
      const data = params.data;
      this.locations = Array.isArray(data) ? data : [data];
      this.filterbybranchname = [...this.locations];
    });
  }
  filterDepartment: any = [];
  getDepartment() {
    this.configMaster
      .getAllDepartment_all_active(this.entity_id)
      .subscribe((res: any) => {
        this.departments = res.data;
        this.filterDepartment = this.departments;
      });
  }
  getArea() {
    // this.configMaster.getAllArea_active().subscribe((res: any) => {
    //   this.areaList = res.data;
    // })
  }
  onChange(e: any) {
    debugger
    let uploadedFileType = e.target.files[0].type
      .split('/')
      .pop()
      .toLowerCase();
    let isValidExtension = this.$common.checkForValidFile(e, false);
    if (!isValidExtension)
      return (
        this.createPrForm.value.file.setValue(null) &&
        this.requestNewPositionForm.value.file.setValue(null)
      );
    if (e.target.files && e.target.files[0]) {
      const data: FileList = e.target.files;
      this.imageToUpload = data.item(0) || null;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePath =
          uploadedFileType == 'pdf'
            ? '/assets/icons/pdfimg.png'
            : e.target.result;
      };
      reader.readAsDataURL(this.imageToUpload);
    }
    let formData = new FormData();

    formData.append('file', this.imageToUpload);

    this.recruitService.documentsUpdate(formData).subscribe((res: any) => {
      console.log(res, 'reessss');
      this.fileUpload = 'uploaded_files/' + res?.url;
    });
  }
  // onSubmitForm(value : any) {
  // }
  onSubmitForm(value: any) { }
  cancel() {
    this.route.navigate(['master/ess/manpower-request/my-request-manpower']);
  }
  onSelectedJobSpecification(e: any) {
    console.log(e, 'eeeeeee');
    if (e.value == 'YES') {
      this.selectJob = true;
    } else if (e.value == 'NO') {
      this.selectJob = false;
    }
    // this.updateValidations()
    // let x = this.requestNewPositionForm?.get('jobSpecification')?.value;
    // if ( x == "Yes" ) {
    //   // ckeditor
    //   this.requestNewPositionForm?.get('jdEditor')?.setValue(null);
    // }
    // if ( x == "No" ) {
    //   // files
    //   this.requestNewPositionForm?.get('jobDescriptionFiles')?.setValue(null);
    //   this.jdToUpload = []
    // }
  }

  updateValidations() {
    if (this.requestNewPositionForm?.get('jobSpecification')?.value === 'Yes') {
      this.requestNewPositionForm
        ?.get('jobDescriptionFiles')
        ?.setValidators(Validators.required);

      this.requestNewPositionForm?.get('jdEditor')?.clearValidators();
      this.requestNewPositionForm?.get('jdEditor')?.updateValueAndValidity();
    }
    if (this.requestNewPositionForm?.get('jobSpecification')?.value === 'No') {
      this.requestNewPositionForm
        ?.get('jdEditor')
        ?.setValidators(Validators.required);
      this.requestNewPositionForm
        ?.get('jobDescriptionFiles')
        ?.clearValidators();
      this.requestNewPositionForm
        ?.get('jobDescriptionFiles')
        ?.updateValueAndValidity();
      this.jdToUpload = [];
    }
  }

  onSelectedBudget() {
    // this.updateValidations2()
    let x = this.requestNewPositionForm?.get('budget')?.value;

    this.requestNewPositionForm?.get('remark')?.setValue(null);
    this.requestNewPositionForm?.get('justification')?.setValue(null);
    // this.requestNewPositionForm?.get('cost_center_id').setValidators([Validators.required]);
    // this.requestNewPositionForm?.get('remark').clearValidators();
  }

  updateValidations2() {
    if (this.requestNewPositionForm?.get('budget')?.value === 'Yes') {
      // this.requestNewPositionForm?.get('cost_center_id')?.setValidators(Validators.required);

      this.requestNewPositionForm?.get('remark')?.clearValidators();
      this.requestNewPositionForm?.get('remark')?.updateValueAndValidity();
      this.requestNewPositionForm?.get('justification')?.clearValidators();
      this.requestNewPositionForm
        ?.get('justification')
        ?.updateValueAndValidity();
    }
    if (this.requestNewPositionForm?.get('budget')?.value === 'No') {
      this.requestNewPositionForm
        ?.get('remark')
        ?.setValidators(Validators.required);
      this.requestNewPositionForm
        ?.get('justification')
        ?.setValidators(Validators.required);

      // this.requestNewPositionForm?.get('cost_center_id')?.clearValidators();
      // this.requestNewPositionForm?.get('cost_center_id')?.updateValueAndValidity();
    }
  }
  ngSubmit() {
    try {
      let val = this.requestNewPositionForm.value;
      if (this.requestNewPositionForm.invalid) {
        this.toast.error('Required fields should not be empty', 'Fields Error');
        return;
      }

      if (val?.jobSpecification == 'YES') {
        // if (this.imageToUpload == undefined) {
        if (!this.fileUpload) {
          this.toast.warning('Job Description File Is Required');
          return;
        }
      } else if (val?.jobSpecification == 'NO') {
        if (val?.text == null) {
          this.toast.warning('Job Description Is Required');
          return;
        }
      }

      let financial_id = localStorage.getItem('financial_id');
      let data = {
        entity_id: this.entity_id,
        job_title: val.job_title,
        designation_id: val.selectPosition,
        // leadership: val.leaderPosition,
        // contract_types_id: val.contract_types_id,
        reason_id: val.recruitmentReason,
        start_date: moment(val.expectedStartDate).format('YYYY-MM-DD'),
        end_date: moment(val.expectedEndDate).format('YYYY-MM-DD'),
        // hierarchicalSuperior: val.hierarchicalSuperior,
        department_id: val.department,
        branch_id: val.location,
        area_id: val.area,
        job_specification: val.jobSpecification,
        editor_msg: val.text,
        budget_status: val.budget,
        upload_document: this.fileUpload,
        budget_Justification: val.budget_Justification,
        user_id: val.hierarchicalSuperior,
        created_by: this.employee_id,
        financial_id: financial_id,

        skill: val?.skill,
        qualification: val?.qualification,
        experience: val?.experience,
        no_of_position: val?.no_of_position,
        emplyoment_type_id: val?.emplyoment_type_id,
        salary: val?.salary,
        job_request_id: this.jobId
      };
      debugger
      this.emp_self_service.createMyRequest(data).subscribe(
        (res: any) => {
          console.log(res, 'resssss');
          this.route.navigate([
            'master/ess/manpower-request/my-request-manpower',
          ]);
          this.toast.success('Job Request Created Successfully..');
        },
        (err: any) => {
          this.toast.error(`${err.error.message}`);
        }
      );
    } catch (error) {
      console.error(error);
      // Expected output: ReferenceError: nonExistentFunction is not defined
      // (Note: the exact output may be browser-dependent)
    }
  }

  getContract() {
    this.configMaster.getContractTypes_active().subscribe((res: any) => {
      this.getContractData = res.data;
    });
  }

  getAllSuperviser() {
    let entity_id = localStorage.getItem('selectedEntityId');
    this._empService
      .grtEmployeeList(entity_id, this.loginUser?.role)
      .subscribe((res: any) => {
        this.getAllSuperviserData = res.data;
        this.filteremployee = this.getAllSuperviserData;
        //
        // const userId: any = []
        // for (let i = 0; i < res.data.length; i++) {
        //   userId.push(res.data[i].user_role);
        //   this.userRole = userId;
        // }
      });
  }

  getAllReason() {
    this.configMaster.getAllReason_active().subscribe(
      (res: any) => {
        this.getAllReasonData = res.data;
      },
      (err: any) => {
        this.toast.error(err.error.message);
      }
    );
  }

  branchData() {
    this.configMaster.branch_get_active().subscribe((res: any) => {
      this.branchAllData = res.data;
    });
  }

  getAllMyrequest() {
    this.configMaster.getAllWorkFlowJob(this.entity_id).subscribe(
      (res: any) => {
        this.rowDataCheck = res.data;
        // this.rowData = res.data.filter((item:any)=>item?.status == "ACTIVE")
      },
      (err: any) => {
        // this.toast.error(`${err.error.message}`)
      }
    );
  }
  filterBysubdepartment: any = [];
  getAllAreas(e: any) {
    let departmentFound = false;
    console.log(e, 'eeee');

    console.log(this.rowDataCheck, 'this.rowDataCheck');

    this.rowDataCheck?.forEach((item: any) => {
      if (item?.department_id === e?.value) {
        departmentFound = true;
        this.requestNewPositionForm.get('area').reset();
        // this.requestNewPositionForm.get('cost_center_id').reset();

        let data = {
          dep_id: e.value,
        };
        this.configMaster.getAllArea_active(data).subscribe(
          (res: any) => {
            console.log(res, 'ressss');
            this.newAreaList = res.data;
            this.filterBysubdepartment = this.newAreaList;
          },
          (err: any) => {
            this.requestNewPositionForm.get('area').reset();
            this.newAreaList = [];
            this.toast.error(`${err?.error?.message}`);
          }
        );

        // this.emp_self_service.getAllCost(e.value).subscribe(
        //   (res: any) => {
        //     console.log(res, 'ressss');
        //     this.newCostList = res.data;
        //   },
        //   (err: any) => {
        //     this.requestNewPositionForm.get('cost_center_id').reset();
        //     this.newCostList = []
        //     this.toast.error(`${err?.error?.message}`);
        //   }
        // );

        return; // Exit the loop if condition is satisfied
      }
    });
    if (
      !departmentFound &&
      this.paramsData !== 'view' &&
      this.paramsData !== 'approval'
    ) {
      this.toast.warning('Workflow is not created for this department');
      // this.newCostList = []
      this.newAreaList = [];
      this.requestNewPositionForm.get('department').reset();
    }
  }

  // Get all employement type start
  employementTypeList: any = [];
  getEmployementType() {
    this.configMaster.getactive_employmentTypeList().subscribe((res: any) => {
      this.employementTypeList = res.data;
    });
  }

  remarkData: any;
  ngSubmitForApproval() {
    let val = this.requestNewPositionForm.value;
    if (this.requestNewPositionForm.invalid) {
      this.toast.error('Required fields should not be empty', 'Fields Error');
      return;
    }
    if (val?.jobSpecification == 'YES') {
      // if (this.imageToUpload == undefined) {
      if (!this.fileUpload) {
        this.toast.warning('Job Description File Is Required');
        return;
      }
    } else if (val?.jobSpecification == 'NO') {
      if (val?.text == null) {
        this.toast.warning('Job Description Is Required');
        return;
      }
    }
    let data = {
      employee_id: this.employee_id,
      approvel_status: 'APPROVED',
      progressStatus: 'CLOSE',
      final_status: 'APPROVED',
    };
    const dialogRef = this.dialog.open(RemarkJobRequestComponent, {
      width: '400px',
      data: { cellData: data, id: this.jobId },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.remarkData = result;
      this.ngSubmit()
    });
  }

  reject() {
    this.route.navigate(['master/ess/manpower-request/pending-for-approval']);
  }

  goBack() {
    this.location.back();
  }

  filteremployee: any = [];
  filterReportingmanger(event: any) {
    this.filteremployee = event.data;
  }

  filterBydepartmentName(event: any) {
    this.filterDepartment = event.data;
  }

  filterBySubdepartment(event: any) {
    this.filterBysubdepartment = event.data;
  }

  filterbydesignation_name(event: any) {
    this.desigantionfilter = event.data;
  }

  filterBylocation(event: any) {
    this.filterbybranchname = event.data;
  }
}
