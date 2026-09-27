import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmployeSelfService } from 'src/app/@shared/services/employe-self.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { environment } from 'src/app/environments/environment';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { DepartmentDialogComponent } from 'src/app/@modules/itticketing/configurationalmaster/department/department-dialog/department-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AreaDilogComponent } from 'src/app/@modules/itticketing/configurationalmaster/area/area-dilog/area-dilog.component';
import { DesignationDialogComponent } from 'src/app/@modules/itticketing/configurationalmaster/designation/designation-dialog/designation-dialog.component';
import { ContarctTypeDialogComponent } from 'src/app/@modules/itticketing/configurationalmaster/contract-type-master/contract-type-dialog/contract-type-dialog.component';
import { ReasonDialogComponent } from 'src/app/@modules/itticketing/configurationalmaster/reason/reason-dialog/reason-dialog.component';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      // Return an error object to indicate validation failure
      return { leadingSpaces: true };
    }
    // Return null if validation passes
    return null;
  };
}

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
  cost_center_idData: any;
  newAreaList: any;
  newCostList: any;
  rowDataCheck: any;
  entity_id: any;
  jobData: any;
  jobId: any;
  fileBind: any;
  budgetCheck: boolean;
  paramsData: any;
  fileUpload: any;
  loginUser: any;
  finacial_id: any;
  costCenterData: any;
  departments2: any;
  departmentList: any;
  newAreaList2: any;
  designationList2: any;
  designations: any;
  getContractData2: any;
  contracts: any;
  reasons2: any;
  reasons: any;
  getAllReasonData2: any;
  getAllSuperviserData2: any;
  supervisers: any;
  locations2: any;
  locationValues: any;
  newCostList2: any;
  costCenters: any;
  htmlEditorValue2: string;
  isButtonDisabled: boolean = true;

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private configMaster: ConfigurationalmasterService,
    private recruitService: RecruitService,
    private _empService: EmpRegistrationService,
    private emp_self_service: EmployeSelfService,
    private $common: CommonService,
    private prService: PurchaseRequestService,
    private _commonService: CommonService,
    private dialog: MatDialog
  ) {
    this.requestNewPositionForm = this.fb.group({
      job_title: new FormControl(null, [
        Validators.required,
        Validators.maxLength(300),
      ]),
      selectPosition: new FormControl(null, Validators.required),
      leaderPosition: new FormControl(null, Validators.required),
      contract_types_id: new FormControl(null, Validators.required),
      cost_center_name: new FormControl(null),
      recruitmentReason: new FormControl(null, Validators.required),
      expectedStartDate: new FormControl(null, Validators.required),
      expectedEndDate: new FormControl(null, Validators.required),
      hierarchicalSuperior: new FormControl(null, Validators.required),
      department: new FormControl(null, Validators.required),
      location: new FormControl(null, Validators.required),
      area: new FormControl(null, Validators.required),
      area_name: new FormControl(null),
      jobSpecification: new FormControl(null, Validators.required),
      jobDescriptionFiles: new FormControl(null),
      text: new FormControl(null),
      budget: new FormControl(null),
      cost_center_id: new FormControl(null),
      remark: new FormControl(null),
      justification: new FormControl(null),
      file: new FormControl(null),

      // leaderPosition: new FormControl(null, Validators.required),
      // leaderPosition: new FormControl(null, Validators.required),
      // leaderPosition: new FormControl(null, Validators.required),

      // leadershipPosition: new FormControl(null, Validators.required),
      // jdEditor: new FormControl(null,),
    });

    this.requestNewPositionForm
      .get('expectedStartDate')
      .valueChanges.subscribe((value: any) => {
        if (value) {
          this.minEndDate = value;
          const endDate =
            this.requestNewPositionForm.get('expectedEndDate').value;
          if (endDate < this.minEndDate) {
            this.requestNewPositionForm.get('expectedEndDate').setValue(null);
          }
        }
      });
  }
  ngOnInit(): void {
    let idEntity = localStorage.getItem('selectedEntityId');
    this.entity_id = Number(idEntity);
    // console.log(this.entity_id, 'this.entity_id');
    let finacial_id = localStorage.getItem('financial_id');
    this.finacial_id = Number(finacial_id);
    var empData: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(empData);
    const singleEmpData = JSON.parse(empData);
    this.employee_id = singleEmpData?.employee_id;
    this.apiOnLoad();
    this.requestNewPositionForm?.get('jobSpecification')?.setValue('YES');
    this.requestNewPositionForm?.get('budget')?.setValue('YES');
    this.onSelectedBudget();
    // this.onSelectedJobSpecification()

    this.activeroute.queryParams.subscribe((params: any) => {
      this.jobId = params?.id;
      this.paramsData = params?.type;
    });

    this.getContract();
    this.getAllSuperviser();
    this.getAllReason();
  }

  getByIdJob() {
    this._commonService?.showLoader();
    this.emp_self_service.getByJobRequest(this.jobId).subscribe(
      (res: any) => {
        console.log(res, 'resss');
        this.jobData = res?.data;
        this.fileBind = res?.data?.upload_document;
        if (this.jobData?.department_id) {
          this.getAllAreas({ value: this.jobData?.department_id });
        }

        if (this.jobData?.upload_document)
          this.fileUpload = this.jobData?.upload_document;
        this.requestNewPositionForm.patchValue({
          job_title: this.jobData?.job_title,
          selectPosition: this.jobData?.designation_id,
          leaderPosition: this.jobData?.leadership,
          contract_types_id: this.jobData?.contract_types_id,
          recruitmentReason: this.jobData?.reason_id,
          expectedStartDate: this.jobData?.start_date,
          expectedEndDate: this.jobData?.end_date,
          hierarchicalSuperior: this.jobData?.user_id,
          department: this.jobData?.department_id,
          location: this.jobData?.branch_id,
          area: this.jobData?.area_id,
          area_name: this.jobData?.area_name,
          jobSpecification: this.jobData?.job_specification,
          jobDescriptionFiles: this.jobData?.jobDescriptionFiles,
          text: this.jobData?.editor_msg,
          budget: this.jobData?.budget_status,
          cost_center_id: this.jobData?.cost_center_id,
          cost_center_name: this.jobData?.cost_center_name,
          remark: this.jobData?.budget_Justification,
          justification: this.jobData?.justification,
          file: this.jobData?.file,
          financial_id: this.jobData?.financial_id,
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
        this._commonService?.hideLoader();
      },
      (err: any) => {
        this._commonService?.hideLoader();
        this.toast.error(`${err?.error?.message}`);
      }
    );
  }
  generateImageUrl() {
    return environment.servralUrl + '/' + 'uploaded_files' + '/';
  }
  enableButton = () => {
    this.isButtonDisabled = false;
  };
  apiOnLoad() {
    this.getDesignations();
    this.getLocations();
    this.getDepartment();
    this.getArea();
    this.getTYpe();
    this.getAllCostCenter();
    this.getAllMyrequest();
  }

  getTYpe() {
    this.typeData = [{ type: 'Job Request', id: 1 }];
    console.log(this.typeData, 'data');
  }
  getDesignations() {
    this.configMaster.getAllDesignation_active().subscribe((res: any) => {
      this.designationList = res.data;
      this.designationList2 = res.data;
      this.designations = this.designationList.map(
        (value: any) => value.designation_name
      );
    });
  }
  getAllCostCenter() {
    this.emp_self_service.getAllCostCenter().subscribe((res: any) => {
      this.cost_center_idData = res.data;
    });
  }
  getLocations() {
    this.configMaster.branch_get_active().subscribe((params: any) => {
      this.locations = params.data;
      this.locations2 = params.data;
      this.locationValues = this.locations.map(
        (value: any) => value.branch_name
      );
    });
  }
  getDepartment() {
    this.configMaster
      .getAllDepartment_all_active(this.entity_id)
      .subscribe((res: any) => {
        this.departments = res.data;
        this.departments2 = this.departments;
        this.departmentList = this.departments.map(
          (value: any) => value.department_name
        );
      });
  }
  getArea() {
    // this.configMaster.getAllArea_active().subscribe((res: any) => {
    //   this.areaList = res.data;
    // })
  }

  areaSearch(e: any) {
    const aa = e;
    let filteredVariable = this.newAreaList2.filter((item: any) =>
      aa.includes(item.area_name)
    );
    this.newAreaList = filteredVariable;
  }

  costCenterSearch(e: any) {
    const aa = e;
    let filteredVariable = this.newCostList2.filter((item: any) =>
      aa.includes(item.cost_center_name)
    );
    this.newCostList = filteredVariable;
  }

  contractSearch(e: any) {
    const aa = e;
    let filteredVariable = this.getContractData2.filter((item: any) =>
      aa.includes(item.contract_type)
    );
    this.getContractData = filteredVariable;
  }

  positionSearch(e: any) {
    const aa = e;
    let filteredVariable = this.designationList2.filter((item: any) =>
      aa.includes(item.designation_name)
    );
    this.designationList = filteredVariable;
  }

  locationSearch(e: any) {
    const aa = e;
    let filteredVariable = this.locations2.filter((item: any) =>
      aa.includes(item.branch_name)
    );
    this.locations = filteredVariable;
  }

  onChange(e: any) {
    let uploadedFileType = e.target.files[0].type
      .split('/')
      .pop()
      .toLowerCase();
    let isValidExtension = this.$common.checkForValidFile(
      e,
      false,
      true,
      false
    );
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
    this._commonService?.showLoader();
    this.recruitService.documentsUpdate(formData).subscribe(
      (res: any) => {
        this.fileUpload = res?.url;
        this._commonService?.hideLoader();
      },
      (err: any) => {
        this._commonService?.hideLoader();
      }
    );
  }
  // onSubmitForm(value : any) {
  // }
  onSubmitForm(value: any) {}
  cancel() {
    this.route.navigate(['master/ess/manpower-request/my-request-manpower']);
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
    if (x == 'YES') {
      this.requestNewPositionForm?.get('remark')?.setValue(null);
      this.requestNewPositionForm?.get('justification')?.setValue(null);
      // this.requestNewPositionForm?.get('cost_center_id').setValidators([Validators.required]);
      // this.requestNewPositionForm?.get('remark').clearValidators();
    }
    if (x == 'NO') {
      this.requestNewPositionForm?.get('cost_center_id')?.setValue(null);
      // this.requestNewPositionForm?.get('remark').setValidators([Validators.required]);
      // this.requestNewPositionForm?.get('cost_center_id').clearValidators();
    }
  }

  updateValidations2() {
    if (this.requestNewPositionForm?.get('budget')?.value === 'Yes') {
      this.requestNewPositionForm
        ?.get('cost_center_id')
        ?.setValidators(Validators.required);

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

      this.requestNewPositionForm?.get('cost_center_id')?.clearValidators();
      this.requestNewPositionForm
        ?.get('cost_center_id')
        ?.updateValueAndValidity();
    }
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
  getDepartmentName(id: any) {
    let x = '';
    this.departments.forEach((value: any) => {
      if (value.dept_id == id) {
        x = value.department_name;
      }
    });
    return x;
  }

  getReasonForRecruitment(id: any) {
    let x = '';
    this.getAllReasonData.forEach((value: any) => {
      if (value.id == id) {
        x = value.reason_for_recruitment;
      }
    });
    return x;
  }

  createViaAi = () => {
    this.requestNewPositionForm.controls['jobSpecification'].setValue('NO');
    this.selectJob = false;
    let dept_name = this.getDepartmentName(
      this.requestNewPositionForm.controls['department'].value
    );
    let job_position = this.requestNewPositionForm.controls['job_title'].value;
    let recruitment_reason = this.getReasonForRecruitment(
      this.requestNewPositionForm.controls['recruitmentReason'].value
    );
    let s = `Prepare a very detailed html document with css for job description as per following data,job Title: ${job_position},Recruitment Reason:${recruitment_reason}, department: ${dept_name}.Remove any other welcome or trailing text, i want only formatted job description html.type only html doc, nothing else`;
    let data = {
      message: s,
      aiEngine: localStorage.getItem('activeEngine') || 'Gemini',
    };

    this.recruitService.getAIRes(data).subscribe(
      (res: any) => {
        this.toast.success('Job Description through AI Created Successfully..');
        this.jobId = res.data;
        let jd = res.message;
        jd = jd.replace(/\n/g, '').replace(/•/g, '').replace(/`/g, '').trim();
        console.log(jd);
        this.htmlEditorValue2 = `${jd}`;
        this.requestNewPositionForm.controls['text'].setValue(
          this.htmlEditorValue2
        );
        this.isButtonDisabled = true;
      },
      (err) => {
        this.toast.error(err.error.message);
      }
    );
  };
  ngSubmit() {
    try {
      console.log(this.imageToUpload, 'this.imageToUpload');
      let val = this.requestNewPositionForm.value;
      console.log(val, 'val');

      if (this.requestNewPositionForm.invalid) {
        this.toast.error(
          'Form is invalid. Please fill out all required fields.'
        );
        return;
      }

      if (val?.jobSpecification == 'YES') {
        if (this.imageToUpload == undefined && !this.fileUpload) {
          this.toast.warning('Job Description File Is Required');
          return;
        }
      } else if (val?.jobSpecification == 'NO') {
        if (val?.text == null) {
          this.toast.warning('Job Description Is Required');
          return;
        }
      }

      // Old validation start
      // if (val?.budget == "YES") {
      //   if (val?.costCenter == null) {
      //     this.requestNewPositionForm?.get('remark')?.clearValidators();

      //     this.requestNewPositionForm?.get('costCenter').setValidators([Validators.required])
      //     this.toast.error("Form is invalid. Please fill out all required fields.")
      //     return;
      //   }
      // } else if (val?.budget == "NO") {
      //   if (val?.remark == null) {
      //     this.requestNewPositionForm?.get('costCenter')?.clearValidators();

      //     this.requestNewPositionForm?.get('remark').setValidators([Validators.required])

      //     this.toast.error("Form is invalid. Please fill out all required fields.")
      //     return;
      //   }
      // }
      // Old validation end

      let financial_id = localStorage.getItem('financial_id');
      let data: any = {
        entity_id: this.entity_id,
        job_title: val.job_title,
        designation_id: val.selectPosition,
        leadership: val.leaderPosition,
        contract_types_id: val.contract_types_id,
        reason_id: val.recruitmentReason,
        start_date: moment(val.expectedStartDate).format('YYYY-MM-DD'),
        end_date: moment(val.expectedEndDate).format('YYYY-MM-DD'),
        hierarchicalSuperior: val.hierarchicalSuperior,
        department_id: val.department,
        branch_id: val.location,
        area_id: val.area,
        job_specification: val.jobSpecification,
        editor_msg: val.text,

        budget_status: val.budget,
        cost_center_id: val.cost_center_id,
        upload_document: this.fileUpload,
        budget_Justification: val.remark,
        user_id: this.employee_id,
        created_by: this.employee_id,
        financial_id: financial_id,
      };
      if (this.jobId) {
        data.id = this.jobId;
      }

      this._commonService?.showLoader();
      this.emp_self_service.createMyRequest(data).subscribe(
        (res: any) => {
          console.log(res, 'resssss');
          this.route.navigate([
            'master/ess/manpower-request/my-request-manpower',
          ]);
          this.toast.success('Job Request Created Successfully..');
          this._commonService?.hideLoader();
        },
        (err: any) => {
          this._commonService?.hideLoader();
          this.toast.error(`${err.error.message}`);
        }
      );
    } catch (error) {
      console.error(error);
      this._commonService?.hideLoader();
      // Expected output: ReferenceError: nonExistentFunction is not defined
      // (Note: the exact output may be browser-dependent)
    }
  }

  openDepartmentDialog() {
    const dialogRef = this.dialog.open(DepartmentDialogComponent, {
      width: '500px',
      data: { isOpenDialog: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getDepartment();
      }
    });
  }

  openAreaDialog(e: any) {
    const dialogRef = this.dialog.open(AreaDilogComponent, {
      width: '500px',
      data: { isOpenDialog: true },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllAreas(e);
      }
    });
  }

  add_Degsignation: any = 'Add_Designation';
  openDesignationDialog(e?: any) {
    if (e) {
      e.stopPropagation(); // Only stop propagation if event is passed
    }
    const dialogRef = this.dialog.open(DesignationDialogComponent, {
      width: '30%',
      data: { data: this.add_Degsignation },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getDesignations();
      }
    });
  }

  openContractDialog() {
    const dialogRef = this.dialog.open(ContarctTypeDialogComponent, {
      width: '500px',
      data: { isOpenDialog: true },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getContract();
      }
    });
  }

  openReasonDialog() {
    const dialogRef = this.dialog.open(ReasonDialogComponent, {
      width: '500px',
      data: { isOpenDialog: true },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllReason();
      }
    });
  }

  getContract() {
    this.configMaster
      .getContractTypes_active(this.entity_id, this.finacial_id)
      .subscribe((res: any) => {
        this.getContractData = res.data;
        this.getContractData2 = res.data;
        this.contracts = this.getContractData.map(
          (value: any) => value.contract_type
        );
      });
  }

  departmentsSearch(e: any) {
    const aa = e;
    let filteredVariable = this.departments2.filter((item: any) =>
      aa.includes(item.department_name)
    );
    this.departments = filteredVariable;
  }

  reasonSearch(e: any) {
    const aa = e;
    let filteredVariable = this.getAllReasonData2.filter((item: any) =>
      aa.includes(item.reason_for_recruitment)
    );
    this.getAllReasonData = filteredVariable;
  }

  superviserSearch(e: any) {
    const aa = e;
    let filteredVariable = this.getAllSuperviserData2.filter((item: any) =>
      aa.includes(item.first_name + ' ' + item.last_name)
    );
    this.getAllSuperviserData = filteredVariable;
  }

  getAllSuperviser() {
    let entity_id = localStorage.getItem('selectedEntityId');
    this._empService
      .grtEmployeeList(entity_id, this.loginUser?.role)
      .subscribe((res: any) => {
        this.getAllSuperviserData = res.data;
        this.getAllSuperviserData2 = res.data;
        this.supervisers = res.data.map(
          (value: any) => value.first_name + ' ' + value.last_name
        );
        //
        // const userId: any = []
        // for (let i = 0; i < res.data.length; i++) {
        //   userId.push(res.data[i].user_role);
        //   this.userRole = userId;
        // }
      });
  }

  getAllReason() {
    this.configMaster.getAllReason_active(this.entity_id).subscribe(
      (res: any) => {
        this.getAllReasonData = res.data;
        this.getAllReasonData2 = res.data;
        this.reasons = this.getAllReasonData.map(
          (value: any) => value.reason_for_recruitment
        );
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
        if (this.jobId) {
          this.getByIdJob();
        }
        // this.rowData = res.data.filter((item:any)=>item?.status == "ACTIVE")
      },
      (err: any) => {
        // this.toast.error(`${err.error.message}`)
      }
    );
  }
  getAllAreas(e: any) {
    let departmentFound = false;
    console.log(e, 'eeee');

    console.log(this.rowDataCheck, 'this.rowDataCheck');
    this.rowDataCheck?.forEach((item: any) => {
      console.log(item, 'itemitem');
      if (item?.department_id === e?.value) {
        departmentFound = true;
        this.requestNewPositionForm.get('area').reset();
        this.requestNewPositionForm.get('cost_center_id').reset();

        let data = {
          dep_id: e.value,
        };
        this.configMaster.getAllArea_active(data).subscribe(
          (res: any) => {
            console.log(res, 'ressss');
            this.newAreaList = res.data;
            this.newAreaList2 = res.data;
            this.areaList = res.data.map((value: any) => value.area_name);
          },
          (err: any) => {
            this.requestNewPositionForm.get('area').reset();
            this.newAreaList = [];
            this.toast.error(`${err?.error?.message}`);
          }
        );

        let dataSend = {
          entity_id: this.entity_id,
          financial_year_id: this.finacial_id,
        };

        this.prService.getDepartmentCostCenter(e?.value, dataSend).subscribe(
          (res: any) => {
            res.data?.find((cost: any) => {
              if (cost?.status === 'ACTIVE') {
                this.newCostList = res.data;
                this.newCostList2 = res.data;
                this.costCenters = this.newCostList.map(
                  (value: any) => value.cost_center_name
                );
              }
            });
          },
          (err: any) => {
            this.requestNewPositionForm.get('cost_center_id').reset();
            this.newCostList = [];
            this.toast.error(`${err?.error?.message}`);
          }
        );
        return; // Exit the loop if condition is satisfied
      }
    });
    if (!departmentFound) {
      // If department_id doesn't match e.value, reset the form control and show a warning
      this.toast.warning('Workflow is not created for this department');
      this.newCostList = [];
      this.newAreaList = [];
      this.requestNewPositionForm.get('department').reset();
    }
  }

  getDepartmentCost(id: any, entityId: any) {
    let data = {
      entity_id: this.entity_id,
      financial_year_id: this.finacial_id,
    };

    this.prService.getDepartmentCostCenter(id, data).subscribe((res: any) => {
      res.data?.find((cost: any) => {
        if (cost?.status === 'ACTIVE') {
          this.costCenterData = res?.data;
        }
      });
    });
  }
}
