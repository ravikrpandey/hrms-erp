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
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
// import { log } from 'console';
import * as moment from 'moment';
import {
  CountryISO,
  PhoneNumberFormat,
  SearchCountryField,
} from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { EntityMasterService } from 'src/app/@shared/services/entity-master/entity-master.service';
import { holidayServiceService } from 'src/app/@shared/services/service/hrmServices/holiday-service.service ';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { environment } from 'src/app/environments/environment';
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
})
export class BasicDetailsComponent {
  @ViewChild('productselect') productselect: MatSelect;
  basicForm: FormGroup;

  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  // preferredCountries: CountryISO[] = [CountryISO.India, CountryISO.UnitedKingdom];
  // phoneForm = new FormGroup({
  // 	phone: new FormControl(null, [Validators.required])
  // });

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
  gradeData: any[] = [];
  holidayData: any[] = [];
  variables: any = [];
  variable: any = [];
  imageDefult: any = '../../../../../../assets/icons/icon_DQS/user.png';
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
  allRoleMaster2: any[];
  roles: any = [];

  // dropdowns
  employmentlist: any;
  getAllBandtype: any;
  getAllBrand: any;
  getAllDepartment: any;
  getAllDepartment2: any = [];
  departments: any = [];
  getAllDesignation: any;
  getAllDesignation2: any = [];
  designations: any = [];
  gradelist: any;
  officeLocationall: any;
  regionlist: any;
  physicalLocation: any;

  reqiredValidator: any = Validators.required;
  mainId: any;
  formVal: any;
  data1: any;

  countryList: any = [];
  stateList: any = [];
  cityList: any = [];
  reporting_manager_list: any = [];
  branchList2: any = [];
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
  branches: any = [];
  areas: any = [];
  areaList2: any = [];
  employementTypeList2: any = [];
  empTypes: any = [];
  municipalityList2: any = [];
  muncipalities: any = [];
  entityList2: any;
  entities: any;
  countryCodeList2: any;
  codes: any;
  custom: string;
  selectedCountryISO: CountryISO = CountryISO.India;
  isReadonly = false;

  constructor(
    private locatin: Location,
    private fb: FormBuilder,
    private _empRegistration: EmpRegistrationService,
    private toast: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private _configurationalMasterService: ConfigurationalmasterService,
    private entityService: EntityMasterService,
    private holidayService: holidayServiceService,
    private $common: CommonService,
    private $miscellaneousService: MiscellaneousService
  ) {
    this.baseUrl = environment.servralUrl;
    this.dataEmployee;
    this.basicForm = this.fb.group({
      phone: new FormControl(null),
      title: new FormControl(null, Validators.required),
      employee_code: new FormControl(null, Validators.required),
      first_name: new FormControl(null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30),
        Validators.pattern('[a-zA-Z]+'),
      ]),
      middle_name: new FormControl('', Validators.pattern('[a-zA-Z]+')),
      last_name: new FormControl(null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30),
        Validators.pattern('[a-zA-Z]+'),
      ]),
      gender: new FormControl(null, Validators.required),
      date_of_birth: new FormControl(null, [Validators.required]),
      emp_personal_email: ['', [Validators.email]],
      employee_official_email: ['', [Validators.required, Validators.email]],
      // country_code: new FormControl(null, [Validators.required]),
      // contact_number: new FormControl(null, [
      //   Validators.required,
      //   Validators.pattern(/^[0-9]{5,15}$/),
      // ]),
      reporting_manager_id: new FormControl(null, [Validators.required]),
      location_id: new FormControl(null),
      plant_id: new FormControl(null),
      department_id: new FormControl(null, [Validators.required]),
      designation_id: new FormControl(null, [Validators.required]),
      area_id: new FormControl(null),
      emplyoment_type_id: new FormControl(null, [Validators.required]),
      municipality_id: new FormControl(null),
      role_master_id: new FormControl(null, [Validators.required]),
      grade_id: new FormControl(null, [Validators.required]),
      shift_id: new FormControl(null, [Validators.required]),
      holiday_category_id: new FormControl(null, [Validators.required]),
      employee_photo: new FormControl(null),
      selectedEntity: [[], Validators.required],
      primaryEntityId: [null],
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
    let loginUser = JSON.parse(lg);
    this.loginUser = JSON.parse(lg);
    this.employee_ids = loginUser.employee_id;
    this.getAllSegment();
    this.getAllCountry();
    this.getEntityList();
    this.getAllShiftMaster();
    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.onBoardingId = params.onBoardingId;
      this.employeId = this.id.employee_id;
      this.employee_id = this.id.employee_id;
      this.action_type = this.id.action_type;

      if (this.employee_id) {
        this.isReadonly = true;
        this.basicForm.get('employee_photo')?.clearValidators();
        this.basicForm.get('employee_photo')?.updateValueAndValidity();
        this.getByIdUse(Number(this.employeId));
      }
    });
    this._empRegistration.setEmpTitle('BASIC-DETAILS');
    this.getEmployeData();
    this.getAllRoleMaster();
    this.getEmpCode();
    // dropdown
    this.getAllDepartment_dropDown();
    this.getAllDesignation_dropDown();
    this.regionlist_dropDown();
    this.employmentlist_dropDown();
    this.getAllPlantMaster();
    this.getBranchList();
    this.getEmployementType();
    //this.getMunicipality();
    this.getAll_Country_codes();
    this.getAllActivePlant();
    this.getGradeData();
    this.getHolidayCategory();
    this.basicForm?.patchValue({ selectedEntity: [Number(this.entity_id)] });

    if (!this.employee_id) {
      let entity_id: any = localStorage.getItem('selectedEntityId');
      if (entity_id) this.primaryEntityId = entity_id;
    }
  }

  getEmpCode = () => {
    this._empRegistration.getEmpCode().subscribe((res: any) => {
      let code = res.data;

      if (!this.id.employee_id) {
        this.basicForm.patchValue({
          //employee_code: code,
        });
      }
    });
  };

  getEntityList = () => {
    this.entityService.getAll_active_Entity().subscribe((res: any) => {
      console.log(res.data);
      this.entityList = res.data;
      this.entityList2 = res.data;
      this.entities = this.entityList.map((res: any) => res.entity_name);
    });
  };

  shiftData: any;

  getAllShiftMaster() {
    this._configurationalMasterService.getShiftList().subscribe(
      (res: any) => {
        this.shiftData = res.data;
        console.log(
          'GET HERE COMPLETE SHIFT DATA ***********************',
          this.shiftData
        );
      },
      (err: any) => {
        this.shiftData = [];
      }
    );
  }

  isEmailReadOnly = false;
  getByIdUse(id: any) {
    this._empRegistration.getByUserId(id).subscribe((res: any) => {
      this.getData = res.data;

      if (
        this.getData?.employee_official_email &&
        this.getData?.employee_official_email.trim() !== ''
      ) {
        this.isEmailReadOnly = true;
      }

      if (this.employee_id == this.mainId) {
        this.primaryEntityId = this.getData?.primary_entity_id;
      } else {
        let entity_id: any = localStorage.getItem('selectedEntityId');
        this.primaryEntityId = entity_id;
      }

      this.reposting = res.data?.reporting_manager_id;
      let tempEntityList: any = [];
      this.getData.entityList?.map((item: any) => {
        tempEntityList?.push(item?.entity_id);
      });
      this.selectedEntity = new FormControl(tempEntityList);
      this.basicFormPatch(this.getData);
    });
  }

  basicFormPatch(getData: any) {
    let tempEntityList: any = [];
    this.getData.entityList?.map((item: any) => {
      tempEntityList?.push(item?.entity_id);
    });

    let number = getData?.contact_number.startsWith('0')
      ? getData?.contact_number.substring(1)
      : getData?.contact_number;
    let contact_detail: any = null;

    try {
      contact_detail = this.getData?.contact_detail
        ? JSON.parse(this.getData.contact_detail)
        : null;
    } catch (error) {
      console.error('Error parsing contact_detail:', error);
    }

    if (contact_detail?.countryCode) {
      this.selectedCountryISO = contact_detail.countryCode;
    }
    //this.getAllArea(getData?.area_id);
    this.employee_photo = getData?.employee_photo;
    this.basicForm.patchValue({
      title: getData?.title,
      first_name: getData?.first_name,
      employee_code: getData?.employee_code,
      middle_name: getData?.middle_name,
      last_name: getData?.last_name,
      gender: getData?.gender,
      date_of_birth: getData?.date_of_birth,
      emp_personal_email: getData?.emp_personal_email,
      country_code: getData?.country_code,
      contact_number: getData?.contact_number,
      reporting_manager_id: getData?.reporting_manager_id,
      location_id: getData?.location_id,
      department_id: getData?.department_id,
      designation_id: getData?.designation_id,
      area_id: getData?.area_id,
      emplyoment_type_id: getData?.emplyoment_type_id,
      municipality_id: getData?.municipality_id,
      employee_official_email: getData?.employee_official_email,
      role_master_id: getData?.role_master_id,
      plant_id: getData?.plant_id,
      phone: `${number}`,
      selectedEntity: tempEntityList,
      grade_id: getData?.grade_id,
      shift_id: getData?.shift_id,
      holiday_category_id: getData?.holiday_category_id,
      // employee_photo: getData?.employee_photo,
    });
    // }, 500);
  }

  onEntitySelectionChange(selectedEntities: number[]): void {
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

  genrateBoolean: boolean = false;
  enableEmployeeCode: boolean = false;
  typeChange(e: any) {
    // this.basicForm.controls['employee_code'].enable()
    this.emp_type = e.value;

    if (this.employeId) return;

    this.getAutoGenerateById(this.emp_type);
    if (this.emp_type) {
      let emoployeeBodyData = {
        status: this.emp_type ? !this.genrateBoolean : this.genrateBoolean,
        title: this.emp_type,
      };

      this._empRegistration
        .getAutoGenerateById(emoployeeBodyData)
        .subscribe((res: any) => {
          this.enableEmployeeCode = true;

          // Patch the value to the form control
          this.basicForm.patchValue({
           // employee_code: res?.data, // Replace 'YourValueHere' with the value you want to patch
          });
        });
    }
  }
  getAllSegment() {
    this._configurationalMasterService.getAllSegment().subscribe((res: any) => {
      this.segmentList = res.data;
    });
  }

  onSubmitForm() {
    let selectedEntity = this.basicForm?.value?.selectedEntity;
    // let selectedEntityList: any = [];
    // if (!this.selectedEntity?.value?.length) {
    //   this.isEntityRequired = true;
    //   return this.toast.error('Entity fields should not be empty', 'Fields Error');
    // }
    // else {
    //   let tempSelectedEntity: any = this.selectedEntity?.value;
    //   this.entityList?.map((item: any) => {
    //     tempSelectedEntity?.map((subItem: any) => {
    //       if (item?.entity_id == subItem) {
    //         let obj = {
    //           entity_id: item?.entity_id,
    //           entity_name: item?.entity_name,
    //         }
    //         selectedEntityList?.push(obj);
    //       }
    //     })
    //   })
    //   this.isEntityRequired = false;
    // }
    // if (!this.employee_photo) {
    //   return this.toast.error('Image is required', 'Fields Error');
    // }

    if (this.enableEmployeeCode) {
      // Enable the employee_code field before submitting
      this.basicForm.get('employee_code')?.enable();
    }

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
    val.entityList = selectedEntityList;
    val.country_code = val?.phone?.dialCode;
    val.contact_number = val?.phone?.number;
    val.contact_detail = JSON.stringify(val?.phone);
    this.submitted = false;
    if (val.contact_number == null || undefined) {
      return this.toast.error(
        'Required contact number field should not be empty',
        'Fields Error'
      );
    }
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
    // if (this.basicForm?.value?.employee_official_email == this.basicForm?.value?.emp_personal_email) return this.toast.error('Personal and Officail Email cannnot be same ', 'Fields Error')

    this.submitted = true;

    let roleName: any = this.allRoleMaster.find(
      (e: any) => e.role_master_id === val.role_master_id
    );
    this.loading = true;

    let req = {
      ...val,
      tab_type: 'Basic',
      employee_photo: this.employee_photo ? this.employee_photo : null,
      primary_entity_id: this.primaryEntityId,
      serverUrl: window.location.origin,
    };
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

    if (this.employee_id) {
      req.employee_id = this.employee_id;
      // delete req.employee_official_email;
    }

    this._empRegistration.basicSignUp(req).subscribe(
      (res: any) => {
        this.loading = false;
        this.basicData = res;
        this.employee_id = res.user_id;
        localStorage.setItem('MyEmpId', this.basicData.user_id);
        this.toast.success(res.message);

        this.route.navigate(
          [
            //'master/hrms/employee-master/employ/employee-create/personal-details',
            'master/hrms/employee-master/employ'
          ],
          { queryParams: { employee_id: this.employee_id } }
        );
        const latlang = { id: this.employee_id };
      },
      (err) => {
        this.loading = false;
        if (err.status === 400) {
          // this.errorMessage = err.error.message
          // alert(err.error.message)
          this.toast.error('Failed! Email is already in use!');
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

  getEmployeData() {
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

  getAllRoleMaster() {
    this._empRegistration
      .getAllRoleMaster(this.loginUser.role)
      .subscribe((res: any) => {
        this.allRoleMaster = res.data;
        this.allRoleMaster2 = res.data;
        this.roles = this.allRoleMaster2.map(
          (res: any) => res.role_master_name
        );
      });
  }

  seePreview(path: string, imagePath: any) {
    if (!this.imagePath) {
      if (path) {
        Swal.fire({
          imageUrl: path,
          imageHeight: 250,
          imageAlt: 'Profile Image',
          confirmButtonColor: '#858586',
          confirmButtonText: 'Ok',
        });
      }
    } else {
      Swal.fire({
        imageUrl: imagePath,
        imageHeight: 250,
        imageAlt: 'Profile Image',
        confirmButtonColor: '#858586',
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
      .getPlantMasterList(this.entity_id)
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
        this.getAllDepartment2 = this.getAllDepartment;
        this.departments = this.getAllDepartment2.map(
          (res: any) => res.department_name
        );
      });
  }

  getAllDesignation_dropDown() {
    this._empRegistration.getAllDesignation_dropDown().subscribe((res) => {
      this.getAllDesignation = res.data.filter(
        (res: any) => res.status === 'ACTIVE'
      );
      this.getAllDesignation2 = this.getAllDesignation;
      this.designations = this.getAllDesignation2.map(
        (res: any) => res.designation_name
      );
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
      this.cityVar = this.cityList.map((res: any) => res.city_name);
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

  stateFilter(e: any) {
    const aa = e;
    let filteredVariable = this.stateVar2.filter((item: any) =>
      aa.includes(item.states_name)
    );
    this.stateList = filteredVariable;
  }
  cityFilter(e: any) {
    const aa = e;
    let filteredVariable = this.cityVar2.filter((item: any) =>
      aa.includes(item.city_name)
    );
    this.cityList = filteredVariable;
  }

  reportingManagerSearch(e: any) {
    const aa = e;
    let filteredVariable = this.reporting2.filter((item: any) =>
      aa.includes(item.title + item.first_name + item.last_name)
    );
    this.reporting_manager_list = filteredVariable;
  }

  locationSearch(e: any) {
    const aa = e;
    let filteredVariable = this.branchList2.filter((item: any) =>
      aa.includes(item.branch_name)
    );
    this.branchList = filteredVariable;
  }

  departmentSearch(e: any) {
    const aa = e;
    let filteredVariable = this.getAllDepartment2.filter((item: any) =>
      aa.includes(item.department_name)
    );
    this.getAllDepartment = filteredVariable;
  }

  areaSearch(e: any) {
    const aa = e;
    let filteredVariable = this.areaList2.filter((item: any) =>
      aa.includes(item.area_name)
    );
    this.areaList = filteredVariable;
  }

  positionSearch(e: any) {
    const aa = e;
    let filteredVariable = this.getAllDesignation2.filter((item: any) =>
      aa.includes(item.designation_name)
    );
    this.getAllDesignation = filteredVariable;
  }

  empTypesSearch(e: any) {
    const aa = e;
    let filteredVariable = this.employementTypeList2.filter((item: any) =>
      aa.includes(item.emptype_name)
    );
    this.employementTypeList = filteredVariable;
  }

  muncipalitySearch(e: any) {
    const aa = e;
    let filteredVariable = this.municipalityList2.filter((item: any) =>
      aa.includes(item.name_of_municipality)
    );
    this.municipalityList = filteredVariable;
  }

  rolesSearch(e: any) {
    const aa = e;
    let filteredVariable = this.allRoleMaster2.filter((item: any) =>
      aa.includes(item.role_master_name)
    );
    this.allRoleMaster = filteredVariable;
  }

  entitySearch(e: any) {
    const aa = e;
    let filteredVariable = this.entityList2.filter((item: any) =>
      aa.includes(item.entity_name)
    );
    this.entityList = filteredVariable;
  }
  plantSearch(e: any) {
    const aa = e;
    let filteredVariable = this.plantList1.filter((item: any) =>
      aa.includes(item.plant_name)
    );
    this.entityList = filteredVariable;
  }

  codesSearch(e: any) {
    const aa = e;
    let filteredVariable = this.countryCodeList2.filter((item: any) =>
      aa.includes(item.dialing_code)
    );
    this.countryCodeList = filteredVariable;
  }

  // Get all branch start
  branchList: any = [];
  getBranchList() {
    this._configurationalMasterService
      .getListActiveBranchSetup()
      .subscribe((res: any) => {
        this.branches = res.data.map((res: any) => res.branch_name);
        this.branchList = res.data;
        this.branchList2 = res.data;
      });
  }

  // Get all area start
  areaList: any = [];
  getAllArea(evemt: any) {
    this.areaList = [];
    let req = {
      dep_id: evemt?.value,
    };
    this._configurationalMasterService
      .getAllArea_active(req)
      .subscribe((res: any) => {
        this.areaList = res.data;
        this.areaList2 = res.data;
        this.areas = res.data.map((item: any) => item.area_name);
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
        this.employementTypeList2 = res.data;
        this.empTypes = res.data.map((res: any) => res.emptype_name);
      });
  }

  // Get all employement type start
  municipalityList: any = [];
  getMunicipality() {
    this._configurationalMasterService
      .get_active_municipality(this.entity_id)
      .subscribe((res: any) => {
        // this.municipalityList = res.data.filter((res: any) => res.status === "ACTIVE");

        this.municipalityList = res.data;
        this.municipalityList2 = res.data;
        this.muncipalities = res.data.map(
          (res: any) => res.name_of_municipality
        );
      });
  }

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
            this.employee_photo = `uploaded_files/${response?.url}`;
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
        this.countryCodeList2 = res.data;
        this.codes = this.countryCodeList.map(
          (value: any) => value.dialing_code
        );
        let country_code = this.countryCodeList?.find(
          (elem: any) => elem?.country_code == 'MZ'
        );
        this.basicForm.patchValue({ country_code: country_code?.dialing_code });
        console.log('dsdssdsd', this.countryCodeList);
      });
  }
  plant: any = [];
  plantList1: any = [];
  getAllActivePlant() {
    this._configurationalMasterService
      .getAllActivePlant(this.entity_id)
      .subscribe(
        (res: any) => {
          if (res) {
            this.plant = res.data;
            this.plantList1 = res.data;
          }
        },
        (err: any) => {}
      );
  }

  getGradeData() {
    this._configurationalMasterService
      .getAllTravelType('grade')
      .subscribe((data: any) => {
        this.gradeData = data.data;
      });
  }

  getHolidayCategory() {
    this.holidayService.getAllHolidayCategories().subscribe((data: any) => {
      this.holidayData = data.data;
    });
  }

  onImageError(event: any) {
    event.target.src = '../../../../../../assets/profile-icon.png';
  }
}
