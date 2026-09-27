import { JsonPipe, Location } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../format-datepicker';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
// import { log } from 'console';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { EntityMasterService } from 'src/app/@shared/services/entity-master/entity-master.service';
import { HeadService } from 'src/app/@shared/services/head.service';
import { LeadService } from 'src/app/@shared/services/lead.service';
import { PayrollService } from 'src/app/@shared/services/payroll.service';
import { ShiftServiceService } from 'src/app/@shared/services/service/hrmServices/shift-service.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { environment } from 'src/app/environments/environment';
// import { DatepipePipe } from '../../../../../@shared/pipe/datepipe.pipe';
import Swal from 'sweetalert2';
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
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
  ],
})
export class BasicDetailsComponent {
  @ViewChild('productselect') productselect: MatSelect;
  mode: any;
  primaryBranchList: any = [];
  isAllSelect: boolean = false;
  basicForm: FormGroup;
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
  variables: any = [];
  variable: any = [];
  imageDefult: any = '../../../../../../assets/icons/icon_zyno/user.png';
  abc: any;
  update: any;
  employeId: any;
  title: any;
  reportingManager: any;
  lastName: any;
  title2: any;
  reportData: any = [];
  cellValue: any;
  reposting: any;
  loading: boolean = false;
  empId: any;
  allRoleMaster: any[];
  isBranchDisabled: boolean = false;
  // dropdowns
  employmentlist: any;
  getAllBandtype: any;
  getAllBrand: any;
  getAllDepartment: any;
  getAllDesignation: any;
  gradelist: any;
  officeLocationall: any;
  regionlist: any;
  physicalLocation: any;

  reqiredValidator: any = Validators.required;
  mainId: any;
  formVal: any;
  data1: any;
  selected_entity_id: any;
  branchdata: any = [];
  countryList: any = [];
  filteredCountryList = ([] = this.countryList);
  stateList: any = [];
  cityList: any = [];
  reporting_manager_list: any = [];
  reporting_manager_id: any;
  reporting_manager_name: any;
  segmentList: any;
  regionSList: any;
  emp_type: any;
  checkData: any;
  allSelectedProduct: any;
  show_region: boolean;
  phoneCode: any;
  newPhoneCode: string;
  onBoardingId: any;
  employee_ids: any;
  singleData: any;
  stateVar: any = [];
  stateVar2: any = [];
  cityVar: any = [];
  cityVar2: any = [];
  reporting: any = [];
  reporting2: any = [];
  loginUser: any;
  plantList: any;
  entityList: any = [];
  selectedEntity = new FormControl('');
  baseUrl: any;
  action_type: any;
  isEntityRequired: boolean = false;
  entity_id: string | null;
  primaryEntityId: number | null = null;
  presentSteteData: any;
  presentSteteData1: any;
  presentCityList1: any;
  approval_manager_list: any;
  approval1: any;
  approval2: any;
  approval_manager_name: any;
  get_all_grade: any;
  division_list: any;
  branchList: any;
  branchArray1: any;
  branchArray2: any;
  departmentArray1: any = [];
  departmentArray2: any = [];
  subDepartmentArray1: any = [];
  subDepartmentArray2: any = [];
  assignDesignationArr1: any = [];
  assignDesignationArr2: any = [];
  entityArr1: any = [];
  entityArr2: any = [];

  constructor(
    private head: HeadService,
    private locatin: Location,
    private fb: FormBuilder,
    private _empRegistration: EmpRegistrationService,
    private toast: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private _configurationalMasterService: ConfigurationalmasterService,
    private entityService: EntityMasterService,
    private $common: CommonService,
    private $miscellaneousService: MiscellaneousService,
    private payrollService: PayrollService,
    private leade: LeadService,
    private activatedRoute: ActivatedRoute,
    private service: ShiftServiceService // private datePipe: DatepipePipe
  ) {
    this.baseUrl = environment.serverUrl;
    this.dataEmployee;
    this.basicForm = this.fb.group({
      title: new FormControl(null, Validators.required),
      employee_code: new FormControl(null),
      first_name: new FormControl(null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30),
      ]),
      middle_name: new FormControl(''),
      last_name: new FormControl(null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30),
      ]),
      gender: new FormControl(null, Validators.required),
      date_of_birth: new FormControl(null, [Validators.required]),
      emp_personal_email: ['', [Validators.email, Validators.required]],
      employee_official_email: ['', [Validators.email]],
      country_code: new FormControl(null, [Validators.required]),
      official_country_code: new FormControl(null),
      contact_number: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[0-9]{5,15}$/),
      ]),
      official_contact_number: new FormControl(null, [
        Validators.pattern(/^[0-9]{5,15}$/),
      ]),
      reporting_manager_id: new FormControl(null, [Validators.required]),
      location_ids: [null, [Validators.required]],
      department_id: new FormControl(null, [Validators.required]),
      // designation_id: new FormControl(null, [Validators.required]),
      area_id: new FormControl(null),
      emplyoment_type_id: new FormControl(null, [Validators.required]),
      // municipality_id: new FormControl(null, [Validators.required]),
      role_master_id: new FormControl(null, [Validators.required]),
      employee_photo: new FormControl(null),
      selectedEntity: [[], Validators.required],
      primaryEntityId: [null],
      employee_country_id: new FormControl(null, Validators.required),
      employee_state_id: new FormControl(null, Validators.required),
      employee_city_id: new FormControl(null, Validators.required),
      approval_manager_id: new FormControl(null, Validators.required),
      status: new FormControl('ACTIVE', Validators.required),
      // division_id: new FormControl(null, [Validators.required]),
      grade_id: new FormControl(null, Validators.required),
      emp_join_date: new FormControl(null, [Validators.required]),
      pf_account_number: new FormControl(null),
      UAN_number: new FormControl(null),
      ESIC_number: new FormControl(null),
      primary_branch_id: [null, Validators.required],
      emp_probation_date: new FormControl(null, [Validators.required]),
      // isOverTimeApplicable: [false],
      isHandiCap: [false],
    });
  }
  employee_id: any;
  currentRouter = this.route.url;
  conditionToDisable: boolean = true;
  emp_code: any;
  ngOnInit(): void {
    this.mainId = localStorage.getItem('EmpMainId');
    let lg: any = localStorage.getItem('signInUser');
    this.entity_id = localStorage.getItem('selectedEntityId');
    let MyEmpIdLocalstorage = localStorage.getItem('MyEmpIdLocalstorage');
    let loginUser = JSON.parse(lg);
    this.loginUser = JSON.parse(lg);
    this.employee_ids = loginUser.employee_id;
    this.getAllSegment();
    this.getAllCountry();
    this.getEntityList();
    this.getBranchList();
    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.onBoardingId = params.onBoardingId;
      this.employeId = this.id.employee_id;
      this.employee_id = this.id.employee_id;
      this.action_type = this.id.action_type;
      if (this.employee_id || MyEmpIdLocalstorage) {
        if (MyEmpIdLocalstorage) {
          this.employeId = MyEmpIdLocalstorage;
          this.employee_id = MyEmpIdLocalstorage;
        }
        this.basicForm.get('employee_photo')?.clearValidators();
        this.basicForm.get('employee_photo')?.updateValueAndValidity();
        this.getByIdUse(Number(this.employeId));
      }
    });
    this._empRegistration.setEmpTitle('BASIC-DETAILS');
    this.getEmployeData();
    this.getAllRoleMaster();

    // dropdown
    this.gradelist_dropDown();
    this.getAllDepartment_dropDown();
    this.getAllDesignation_dropDown();
    this.get_all_active_grade();
    this.get_all_active_division();
    this.regionlist_dropDown();
    this.employmentlist_dropDown();
    this.getAllPlantMaster();
    this.getEmployementType();
    this.getAllCountry();
    // this.getMunicipality();
    this.getAll_Country_codes();
    this.basicForm?.patchValue({ selectedEntity: [Number(this.entity_id)] });
    this.onEntitySelectionChange(this.basicForm.value.selectedEntity);
    this.getAutoFetchBranchName();
    this.getAllRegisteruser();
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.mode = params.mode;
    });
  }

  getEntityList = () => {
    this.entityService.getAll_active_Entity().subscribe((res: any) => {
      console.log(res.data);
      this.entityList = res.data;
      this.entityArr1 = this.entityList.map((res: any) => res.entity_name);
      this.entityArr2 = this.entityList;
    });
  };

  getByIdUse(id: any) {
    this._empRegistration.getByUserId(id).subscribe((res: any) => {
      this.getData = res.data;
      this.primaryEntityId = this.getData?.primary_entity_id;
      this.reposting = res.data?.reporting_manager_id;
      let tempEntityList: any = [];
      this.getData.entityList?.map((item: any) => {
        tempEntityList?.push(item?.entity_id);
      });

      this.selectedEntity = new FormControl(tempEntityList);
      this.branchSelection({ value: this.getData?.location_ids });
      this.getGradeListByBranch({ value: this.getData?.primary_branch_id });
      this.basicFormPatch(this.getData);
    });
  }
  get_all_active_division() {
    this._empRegistration
      .get_all_active_division(this.entity_id)
      .subscribe((res: any) => {
        this.division_list = res.data;
      });
  }

  handlePersonalAddressChanges(data: any) {
    this.presentCountryMethod1(data?.employee_country_id);
    this.presentGetCityByState1(data?.employee_state_id);
  }

  formatDateToDDMMYYYY(date: string): string | null {
    return date ? moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY') : null;
  }

  openDatePicker(datepicker: any) {
    if (this.action_type !== 'view') {
      datepicker.open();
    }
  }

  emp_join_date: any;
  basicFormPatch(getData: any) {
    if (getData?.emp_join_date) {
      this.emp_join_date = moment(getData.emp_join_date, 'YYYY-MM-DD').format(
        'DD/MM/YYYY'
      );
    }
    this.handlePersonalAddressChanges(getData);
    let tempEntityList: any = [];
    this.getData.entityList?.map((item: any) => {
      tempEntityList?.push(item?.entity_id);
    });

    this.getAllArea(
      { value: getData?.department_id },
      getData?.area_id,
      this.action_type === 'view' // show only selected in view mode
    );

    this.employee_photo = getData?.employee_photo;
    this.basicForm.patchValue({
      title: getData?.title,
      approval_manager_id: getData?.approval_manager_id,
      // division_id: getData?.division_id,
      grade_id: getData?.grade_id || null,
      emp_join_date: this.emp_join_date,
      official_contact_number: getData?.official_contact_number,
      pf_account_number: getData?.pf_account_number,
      UAN_number: getData?.UAN_number,
      ESIC_number: getData?.ESIC_number,
      employee_country_id: getData?.employee_country_id,
      employee_state_id: getData?.employee_state_id,
      employee_city_id: getData?.employee_city_id,
      first_name: getData?.first_name,
      employee_code: getData?.employee_code,
      middle_name: getData?.middle_name,
      last_name: getData?.last_name,
      gender: getData?.gender,
      date_of_birth: getData?.date_of_birth,
      emp_personal_email: getData?.emp_personal_email,
      country_code: getData?.country_code,
      official_country_code: getData?.official_country_code,
      contact_number: getData?.contact_number,
      reporting_manager_id: getData?.reporting_manager_id,
      location_ids: getData?.location_ids,
      department_id: getData?.department_id,
      // designation_id: getData?.designation_id,
      area_id: getData?.area_id,
      emplyoment_type_id: getData?.emplyoment_type_id,
      // municipality_id: getData?.municipality_id,
      employee_official_email: getData?.employee_official_email,
      role_master_id: getData?.role_master_id,
      selectedEntity: tempEntityList,
      primary_branch_id: getData?.primary_branch_id,
      // isOverTimeApplicable: getData?.isOverTimeApplicable,
      isHandiCap: getData?.isHandiCap,
      emp_probation_date: getData?.emp_probation_date,

      employee_photo: getData?.employee_photo,
    });
    // }, 500);
    this.checkIfAllSelected();
  }

  // onEntitySelectionChange(selectedEntities: number[]): void {

  //   if (selectedEntities.length > 0) {
  //     // If the primaryEntityId is not in the selected entities, update it to the first selected entity
  //     if (!selectedEntities.includes(this.primaryEntityId!)) {
  //       this.primaryEntityId = selectedEntities[0];
  //       this.basicForm.patchValue({ primaryEntityId: this.primaryEntityId });
  //     }
  //   } else {
  //     // If all are unchecked, reset the primaryEntityId
  //     this.primaryEntityId = null;
  //     this.basicForm.patchValue({ primaryEntityId: null });
  //   }
  // }

  onEntitySelectionChange(selectedEntities: number[]): void {
    console.log({ selectedEntities });
    if (!this.primaryEntityId) {
      if (selectedEntities.length > 0) {
        // If the primaryEntityId is not in the selected entities, update it to the first selected entity
        if (!selectedEntities.includes(this.primaryEntityId!)) {
          this.primaryEntityId = selectedEntities[0];
          this.basicForm.patchValue({ primaryEntityId: this.primaryEntityId });
        }
      } else {
        // If all are unchecked, reset the primaryEntityId
        this.primaryEntityId = null;
        this.basicForm.patchValue({ primaryEntityId: null });
      }
    }
  }
  get f() {
    return this.basicForm.controls;
  }
  now = new Date();
  year = this.now.getFullYear();
  month = this.now.getMonth();
  date = this.now.getDate();
  // min = moment({ year: this.year +18, month: this.month, date: this.date }).format('YYYY-MM-DD');
  max = moment({
    year: this.year - 18,
    month: this.month,
    date: this.date,
  }).format('YYYY-MM-DD');

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
  }

  fileError: boolean = false;
  validateFile(event: any) {
    const file = event.target.files[0];
    if (file) {
      const fileName = file.name;
      const extension = fileName.split('.').pop()?.toLowerCase();
      if (extension !== 'jpg' && extension !== 'jpeg' && extension !== 'png') {
        // Show error message or handle invalid file type here
        this.fileError = true;
        // Reset the file input to clear the invalid selection
        event.target.value = '';
      } else {
        // Proceed with handling the selected file
        this.fileError = false;
        this.onChange(event);
      }
    }
  }

  getReportingData(data: any) {
    return (this.reporting_manager_name =
      data.title + ' ' + data.first_name + ' ' + data.last_name);
  }
  getapprovalData(data: any) {
    console.log(data.first_name + ' ' + data.last_name, 'log', data);
    return (this.approval_manager_name =
      data.first_name + ' ' + data.last_name);
  }

  genrateBoolean: boolean = false;
  enableEmployeeCode: boolean = false;
  typeChange(e: any) {
    // this.basicForm.controls['employee_code'].enable()
    this.emp_type = e.value;

    this.getAutoGenerateById(this.emp_type);
    if (this.emp_type) {
      let emoployeeBodyData = {
        status: this.emp_type ? !this.genrateBoolean : this.genrateBoolean,
        emplyoment_type: this.emp_type,
      };

      this._empRegistration
        .getAutoGenerateById(emoployeeBodyData)
        .subscribe((res: any) => {
          this.enableEmployeeCode = true;

          // Patch the value to the form control
          this.basicForm.patchValue({
            employee_code: res?.data, // Replace 'YourValueHere' with the value you want to patch
          });
        });
    }
  }
  getAllSegment() {
    this._configurationalMasterService.getAllSegment().subscribe((res: any) => {
      this.segmentList = res.data;
    });
  }

  emp_join_dateformat() {
    let empJoinDate = this.basicForm.get('emp_join_date')?.value;
    if (empJoinDate instanceof Date) {
      const day = empJoinDate.getDate().toString().padStart(2, '0');
      const month = (empJoinDate.getMonth() + 1).toString().padStart(2, '0');
      const year = empJoinDate.getFullYear().toString();
      const formattedDate = `${day}/${month}/${year}`;
      this.basicForm.get('emp_join_date')?.setValue(formattedDate);
      console.log('Formatted Date:', formattedDate);
    } else if (typeof empJoinDate === 'string') {
      const dateParts = empJoinDate.split('/');
      if (dateParts.length === 3) {
        const day = dateParts[0];
        const month = dateParts[1];
        const year = dateParts[2];
        if (day && month && year) {
          const formattedDate = `${year}-${month.padStart(
            2,
            '0'
          )}-${day.padStart(2, '0')}`;
          this.basicForm.get('emp_join_date')?.setValue(formattedDate);
        } else {
          console.error('Invalid date format:', empJoinDate);
          return '';
        }
      } else {
        console.error('Invalid date format:', empJoinDate);
        return '';
      }
    } else {
      console.error('empJoinDate is not a valid string or Date:', empJoinDate);
      return '';
    }
  }
  recordExists = false;
  onSubmitForm() {
    let sval: any = this.basicForm.value;
    let selectedEntity = this.basicForm?.value?.selectedEntity;
    const personalEmail = this.basicForm?.value?.emp_personal_email;
    const officialEmail = this.basicForm?.value?.employee_official_email;
    if (this.enableEmployeeCode) {
      this.basicForm.get('employee_code')?.enable();
    }
    this.submitted = false;
    if (this.basicForm.invalid) {
      Object.keys(this.basicForm.controls).forEach((controlName) => {
        const control = this.basicForm.get(controlName);
        if (control && control.invalid) {
          console.log('Invalid control name:', controlName);
        }
      });
      return this.toast.error(
        'Required fields should not be empty',
        'Fields Error'
      );
    }
    this.emp_join_dateformat();
    // if (this.mode == 'editMode' || this.mode === 'viewMode') {
    //   this.emp_join_dateformat();
    // }
    // if (this.employee_photo) {
    //   return this.toast.error('Image is required', 'Fields Error');
    // }
    let area_id = this.basicForm.get('area_id')?.value;
    if (
      area_id !== null &&
      area_id !== '' &&
      area_id !== 'null' &&
      !isNaN(area_id)
    ) {
      const areaIdNumber = Number(area_id);
      this.basicForm.get('area_id')?.setValue(areaIdNumber);
    } else {
      this.basicForm.get('area_id')?.setValue(null);
    }

    this.submitted = true;
    let selectedEntityList: any = [];
    let tempSelectedEntity: any = this.basicForm?.value?.['selectedEntity'];
    this.entityList?.map((item: any) => {
      tempSelectedEntity?.map((subItem: any) => {
        if (item?.entity_id == subItem) {
          let obj = {
            entity_id: item?.entity_id,
            entity_name: item?.entity_name,
          };
          selectedEntityList?.push(obj);
        }
      });
    });
    let val: any = this.basicForm.value;
    let roleName: any = this.allRoleMaster.find(
      (e: any) => e.role_master_id === val.role_master_id
    );
    this.loading = true;
    val.entityList = selectedEntityList;
    let req = {
      ...val,
      tab_type: 'Basic',
      employee_photo: this.employee_photo ? this.employee_photo : null,
      primary_entity_id: this.primaryEntityId,
    };
    // req.isHandiCap = req.isHandiCap ? '1' : '0';
    let roleObj = this.allRoleMaster?.find(
      (elem: any) => elem?.role_master_id == req.role_master_id
    );
    req.role_master_name = roleObj?.role_master_name;
    let reportingMobj = this.reporting_manager_list?.find(
      (elem: any) => elem?.employee_id == req.reporting_manager_id
    );
    req.reporting_manager =
      (reportingMobj?.title ? reportingMobj?.title + ' ' : '') +
      (reportingMobj?.first_name ? reportingMobj?.first_name + ' ' : '') +
      (reportingMobj?.last_name ? reportingMobj?.last_name + ' ' : '');
    req.approval_manager = this.approval_manager_name;
    if (this.employee_id) {
      req.employee_id = this.employee_id;
    }

    req.designation_id = req.role_master_id;
    this._empRegistration.basicSignUp(req).subscribe(
      (res: any) => {
        this.loading = false;
        this.basicData = res;
        this.employee_id = res.user_id;
        this.head.EmpReg.next(this.basicData.user_id);
        localStorage.setItem('MyEmpId', this.basicData.user_id);
        localStorage.setItem('MyEmpIdLocalstorage', this.basicData.user_id);
        this.leade.setSidebarData(this.basicData.user_id);
        this.toast.success('Basic Details Created successfully..');
        this.route.navigate(
          [
            'master/hrms/employee-master/employ/employee-create/personal-details',
          ],
          { queryParams: { employee_id: this.employee_id } }
        );
        const latlang = { id: this.employee_id };
      },
      (err) => {
        this.loading = false;
        if (err.status === 400) {
          this.toast.error('Failed! Email is already in use!');
          this.recordExists = true;
        } else if (err.status == 500) {
          this.toast.error('bad request ');
        } else if (err.status == 404) {
          this.toast.error(
            'Somthing went wrong.. Please try agin',
            'Error Massage'
          );
        } else if (err.status == 403) {
          this.toast.error(err?.error?.message, 'Error Massage');
        } else {
          this.toast.error('Login failed');
        }
      }
    );
  }

  getAllRegisteruser() {
    this._empRegistration.getAllRegisterUser().subscribe((res: any) => {
      this.reporting_manager_list = res.data;
      this.approval_manager_list = res.data;
      this.reporting = this.dataEmployee.map(
        (res: any) => res.title + res.first_name + res.last_name
      );
      this.approval1 = this.dataEmployee.map(
        (res: any) => res.title + res.first_name + res.last_name
      );
      this.reporting2 = this.dataEmployee;
      this.approval2 = this.dataEmployee;
    });
  }

  getEmployeData() {
    let entity_id = localStorage.getItem('selectedEntityId');
    this._empRegistration
      .grtEmployeeList(entity_id, this.loginUser?.role)
      .subscribe((res: any) => {
        this.dataEmployee = res.data;
        // this.reporting_manager_list = res.data;
        // this.approval_manager_list = res.data;

        // this.reporting = this.dataEmployee.map(
        //   (res: any) => res.title + res.first_name + res.last_name
        // );
        // this.approval1 = this.dataEmployee.map(
        //   (res: any) => res.title + res.first_name + res.last_name
        // );

        // this.reporting2 = this.dataEmployee;
        // this.approval2 = this.dataEmployee;
      });
  }

  reportClick(id: any) {
    let entity_id = localStorage.getItem('selectedEntityId');
    this._empRegistration
      .grtEmployeeList(entity_id, this.loginUser?.role)
      .subscribe((res: any) => {
        this.dataEmployee = res.data;
        this.reporting_manager_list = res.data;

        this.reporting = this.dataEmployee.map(
          (res: any) => res.title + res.first_name + res.last_name
        );

        this.reporting2 = this.dataEmployee;
      });
  }

  getAutoGenerateById(data: any) {}

  getRegionData() {
    this._empRegistration.getRegionList().subscribe((res: any) => {
      this.regionData = res;
    });
  }

  getGradeData() {
    this._empRegistration.getGradeList().subscribe((res: any) => {
      this.gradeData = res.data;
    });
  }

  getAllRoleMaster() {
    this._empRegistration
      .getAllRoleMaster(this.loginUser.role)
      .subscribe((res: any) => {
        this.allRoleMaster = res.data;
        this.assignDesignationArr1 = this.allRoleMaster.map(
          (res: any) => res.role_master_name
        );
        this.assignDesignationArr2 = this.allRoleMaster;
      });
  }

  seePreview(path: string, imagePath: any) {
    if (!this.imagePath) {
      if (path) {
        Swal.fire({
          imageUrl: path,
          imageHeight: 250,
          imageAlt: 'Profile Image',
          confirmButtonColor: '#5d6c7c',
          confirmButtonText: 'Ok',
        });
      }
    } else {
      Swal.fire({
        imageUrl: imagePath,
        imageHeight: 250,
        imageAlt: 'Profile Image',
        confirmButtonColor: '#5d6c7c',
        confirmButtonText: 'Ok',
      });
    }
  }

  employmentlist_dropDown() {
    this._empRegistration.employmentlist_dropDown().subscribe((res) => {
      this.employmentlist = res.data.filter(
        (res: any) => res.status == 'ACTIVE'
      );
    });
  }

  getAllBandtype_dropDown() {
    this._empRegistration.getAllBandtype_dropDown().subscribe((res) => {
      this.getAllBandtype = res.data;
    });
  }

  getAllPlantMaster() {
    this._configurationalMasterService
      .getPlantMasterList()
      .subscribe((res: any) => {
        this.plantList = res.data.filter((res: any) => res.status === 'ACTIVE');
      });
  }

  // getAllBrand_dropDown() {
  //   this._empRegistration.getAllBrand_dropDown().subscribe(
  //     (res) => {
  //
  //       this.getAllBandtype = res.data;
  //     }
  //   );
  // };

  getAllDepartment_dropDown() {
    let entity_id = localStorage.getItem('selectedEntityId');
    this._empRegistration
      .getAllDepartment_dropDown(entity_id)
      .subscribe((res) => {
        this.getAllDepartment = res.data.filter(
          (res: any) => res.status === 'ACTIVE'
        );
        this.departmentArray1 = this.getAllDepartment.map(
          (item: any) => item.department_name
        );
        this.departmentArray2 = this.getAllDepartment;
      });
  }

  getAllDesignation_dropDown() {
    this._empRegistration.getAllDesignation_dropDown().subscribe((res) => {
      this.getAllDesignation = res.data.filter(
        (res: any) => res.status === 'ACTIVE'
      );
    });
  }

  get_all_active_grade() {
    this._empRegistration
      .get_all_active_grade(this.entity_id)
      .subscribe((res) => {
        this.get_all_grade = res.data;
      });
  }

  gradelist_dropDown() {
    this._empRegistration.gradelist_dropDown().subscribe((res) => {
      this.gradelist = res.data;
    });
  }

  officeLocationall_dropDown() {
    this._empRegistration.officeLocationall_dropDown().subscribe((res) => {
      this.officeLocationall = res.data;
    });
  }

  physicalLocation_dropDown() {
    this._empRegistration.physicalLocationall_dropDown().subscribe((res) => {
      this.physicalLocation = res.userDetails;
    });
  }

  regionlist_dropDown() {
    this._empRegistration.regionlist_dropDown().subscribe((res) => {
      this.regionlist = res.data;
    });
  }

  getAllCountry() {
    this._empRegistration.getAllcountry().subscribe((res: any) => {
      this.countryList = res.data;
      this.filteredCountryList = this.countryList.slice();
      this.variables = this.countryList?.map((res: any) => res.countryss_name);
      this.checkData = this.countryList;
      this.variable = this.countryList;
    });
  }

  getStateByCountry(id: any) {
    this._empRegistration.getStateByCountry(id).subscribe((res: any) => {
      this.stateList = res.data;
      this.stateVar = this.stateList.map((res: any) => res.states_name);
      this.stateVar2 = this.stateList;

      if (this.getData) {
        this.basicForm.controls['state'].patchValue(
          Number(this.getData?.state)
        );
      }
    });
  }

  getCityByState(id: any) {
    this._empRegistration.getCityByState(id).subscribe((res: any) => {
      this.cityList = res.data;
      this.cityVar = res.data;
      // this.cityVar = this.cityList.map((res: any) => res.city_name);
      this.cityVar2 = this.cityList;
      if (this.getData) {
        this.basicForm.controls['city'].patchValue(Number(this.getData?.city));
      }
    });
  }

  segment_id: any;
  getRegion(e: any) {
    const segment_value = e.value;
    this.segmentList.filter((item: any) => {
      if (item?.segment_name == segment_value) {
        this.segment_id = item?.segment_id;
      }
    });
    this._empRegistration
      .getRegionByID(this.segment_id)
      .subscribe((res: any) => {
        this.regionSList = res.data.new_regions;
      });
  }

  countryChange(e: any) {
    this.getStateByCountry(e.value);
  }

  stateChange(e: any) {
    this.getCityByState(e.value);
  }

  back() {
    this.locatin.back();
  }

  redirectToList() {
    this.route.navigate(['master/hrms/employee-master/employ']);
  }

  toggleAllCodeSelect() {
    if (this.allSelectedProduct) {
      this.productselect.options.forEach((item: MatOption) => item.select());
    } else {
      this.productselect.options.forEach((item: MatOption) => item.deselect());
    }
  }

  productFilter(e: any) {
    const aa = e;
    let filteredVariable = this.variable.filter((item: any) =>
      aa.includes(item.countryss_name)
    );
    this.checkData = filteredVariable;
  }

  entityFilter(e: any) {
    const filteredVariable = this.entityArr2?.filter((item: any) =>
      e.includes(item.entity_name)
    );
    const selectedEntityIds = this.basicForm?.value.selectedEntity || [];
    const selectedEntities = this.entityArr2?.filter((item: any) =>
      selectedEntityIds.includes(item.entity_id)
    );
    const mergedEntities = [...filteredVariable, ...selectedEntities];
    this.entityList = Array.from(
      new Map(mergedEntities.map((item) => [item?.entity_id, item])).values()
    );
  }

  brachFilter(e: any) {
    let filteredVariable = this.branchArray2.filter((item: any) =>
      e.includes(item.branch_name)
    );
    this.branchList = filteredVariable;
  }
  departmentFilter(e: any) {
    let filteredVariable = this.departmentArray2.filter((item: any) =>
      e.includes(item.department_name)
    );
    this.getAllDepartment = filteredVariable;
  }
  subDepartmentFilter(e: any) {
    let filteredVariable = this.subDepartmentArray2.filter((item: any) =>
      e.includes(item.area_name)
    );
    this.areaList = filteredVariable;
  }
  assignDesignationSearch(e: any) {
    let filteredVariable = this.assignDesignationArr2.filter((item: any) =>
      e.includes(item.role_master_name)
    );
    this.allRoleMaster = filteredVariable;
  }

  reportingManagerSearch(e: any) {
    if (e.length === 0) {
      this.reporting_manager_list = this.reporting2;
      return;
    }
    const aa = e;
    let filteredVariable = this.reporting2.filter((item: any) =>
      aa.includes(item.title + item.first_name + item.last_name)
    );
    this.reporting_manager_list = filteredVariable;
  }

  approvalManagerSearch(e: any) {
    if (e.length === 0) {
      this.approval_manager_list = this.approval2;
      return;
    }
    const aa = e;
    let filteredVariable = this.approval2.filter((item: any) =>
      aa.includes(item.title + item.first_name + item.last_name)
    );
    this.approval_manager_list = filteredVariable;
  }

  getBranchList() {
    this.payrollService.getAllBranch().subscribe(
      (res: any) => {
        if (res && res.data) {
          this.branchList = res.data;
          this.branchArray1 = this.branchList.map(
            (res: any) => res.branch_name
          );
          this.branchArray2 = this.branchList;
        }
      },
      (err) => {
        // this.toast.error(err.error.message);
      }
    );
  }

  // Get all area start
  areaList: any = [];
  getAllArea(
    event: any,
    selectedAreaId: any = null,
    showOnlySelected: boolean = false
  ) {
    this.areaList = [];
    const req = { dep_id: event?.value };

    this._configurationalMasterService
      .getAllArea_active(req)
      .subscribe((res: any) => {
        let fullAreaList = res.data;

        // Filter to show only the selected one if flag is true
        if (showOnlySelected && selectedAreaId) {
          this.areaList = fullAreaList.filter(
            (area: any) => area.id === selectedAreaId
          );
        } else {
          this.areaList = fullAreaList;
        }

        this.subDepartmentArray1 = this.areaList.map(
          (res: any) => res.area_name
        );
        this.subDepartmentArray2 = this.areaList;

        // Auto-select area
        if (selectedAreaId) {
          this.basicForm.patchValue({ area_id: selectedAreaId });
        }
      });
  }
  // Get all employement type start
  employementTypeList: any = [];
  getEmployementType() {
    this._configurationalMasterService
      .getactive_employmentTypeList()
      .subscribe((res: any) => {
        // this.employementTypeList = res.data.filter((res: any) => res.status === "ACTIVE");
        this.employementTypeList = res.data;
      });
  }

  // // Get all employement type start
  // municipalityList: any = [];
  // getMunicipality() {
  //   this._configurationalMasterService.get_active_municipality(this.entity_id).subscribe((res: any) => {
  //     // this.municipalityList = res.data.filter((res: any) => res.status === "ACTIVE");

  //     this.municipalityList = res.data
  //   })
  // }

  // File upload start
  employee_photo: any;
  uploadDoc(event: any) {
    try {
      let isValidExtension = this.$common.checkForValidFile(event);
      if (!isValidExtension) {
        this.basicForm.patchValue({ employee_photo: null });
        return (this.employee_photo = '');
      }
      const formData = new FormData();
      if (event.target.files && event.target.files[0]) {
        formData.append('file', event.target.files[0]);
      }
      this.$miscellaneousService.documents(formData).subscribe(
        (response: any) => {
          if (response) {
            const uploadedPath = `uploaded_files/${response?.url}`;
            this.employee_photo = uploadedPath;
            const userDetails = JSON.parse(
              localStorage.getItem('loginUserDetails') || '{}'
            );
            userDetails.employee_photo = uploadedPath;
            localStorage.setItem(
              'loginUserDetails',
              JSON.stringify(userDetails)
            );
          }
        },
        (err) => {
          console.log(err);
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  viewImg() {
    window.open(this.baseUrl + '/' + this.employee_photo, '_blank');
  }
  // File upload end

  // Get country code start
  countryCodeList: any = [];
  getAll_Country_codes() {
    this._configurationalMasterService
      .getAll_Country_codes()
      .subscribe((res: any) => {
        this.countryCodeList = res.data;
        this.filteredCountryCodeList1 = [...this.countryCodeList];
        this.filteredCountryCodeList2 = [...this.countryCodeList];
      });
  }

  presentCountryChange(e: any) {
    this.presentCountryMethod(e?.value);
  }

  presentCountryMethod(id: any) {
    this._empRegistration.getStateByCountry(id).subscribe((res: any) => {
      if (res && res?.data) {
        this.presentSteteData = res?.data;
      }
    });
  }

  presentCountryChange1(e: any) {
    this.presentCountryMethod1(e?.value);
  }
  presentCountryMethod1(id: any) {
    this._empRegistration.getStateByCountry(id).subscribe((res: any) => {
      if (res && res?.data) {
        this.presentSteteData1 = res?.data;

        this.stateVar = this.presentSteteData1.map(
          (res: any) => res.states_name
        );
        this.stateVar2 = this.presentSteteData1;
      }
    });
  }
  presentStateChange1(e: any) {
    this.presentGetCityByState1(e?.value);
  }
  presentGetCityByState1(id: any) {
    this._empRegistration.getCityByState(id).subscribe((res: any) => {
      if (res && res?.data) {
        this.presentCityList1 = res?.data;
        this.cityVar = this.presentCityList1.map((res: any) => res.city_name);
        this.cityVar2 = this.presentCityList1;
      }
    });
  }

  getAutoFetchBranchName() {
    const entity_id = parseInt(localStorage.getItem('selectedEntityId') || '0');
    this._empRegistration
      .getAutoFetchBranchName(entity_id)
      .subscribe((res: any) => {
        this.branchdata = res.data;
        if (this.branchdata && this.branchdata.length > 0) {
          this.selected_entity_id = this.branchdata[0].branch_id;
          this.basicForm.patchValue({
            location_ids: [this.selected_entity_id],
            primary_branch_id: this.selected_entity_id,
          });
          this.branchSelection({ value: [this.selected_entity_id] });
          this.getGradeListByBranch({ value: this.selected_entity_id });
        }
      });
  }

  branchSelection(event: any) {
    this.primaryBranchList = [];
    this.branchList?.map((item: any) => {
      event?.value?.map((subItem: any) => {
        if (item?.id == subItem) {
          this.primaryBranchList?.push(item);
        }
      });
    });
  }

  getGradeListByBranch(event: any) {
    this.isBranchDisabled = true;
    let financial_id = localStorage.getItem('financial_id');
    let req = {
      branch_id: event?.value,
      entity_id: this.entity_id,
      financial_id: financial_id,
    };
    this._empRegistration.getGradeListByBranch(req).subscribe((res: any) => {
      this.get_all_grade = res.data;
    });
  }

  selectAllEntities(event: any): void {
    let checked = event?.target?.checked;
    this.isAllSelect = !this.isAllSelect;
    let allEntity: any = [];
    this.entityList?.map((item: any) => {
      allEntity?.push(Number(item?.entity_id));
    });
    this.basicForm.controls['selectedEntity'].setValue(
      this.isAllSelect ? allEntity : [Number(this.primaryEntityId)]
    );
  }

  filteredCountryCodeList1: any[] = []; // for first select
  filteredCountryCodeList2: any[] = []; // for second select
  filterCountryCode1(event: any) {
    const searchValue = event?.target?.value?.toLowerCase() || '';
    if (!searchValue) {
      this.filteredCountryCodeList1 = [...this.countryCodeList];
      return;
    }
    this.filteredCountryCodeList1 = this.countryCodeList.filter((item: any) =>
      item.dialing_code?.toLowerCase().includes(searchValue)
    );
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

  checkIfAllSelected() {
    const selectedEmployees = this.basicForm.get('selectedEntity')?.value || [];
    this.isAllSelect = selectedEmployees.length === this.entityList.length;
  }
}
