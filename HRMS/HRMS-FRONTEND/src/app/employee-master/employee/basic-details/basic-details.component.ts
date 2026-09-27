import { JsonPipe, Location } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
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
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { OnboardingService } from 'src/app/@shared/services/service/recruitment/onboarding.service';
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
  file: any;
  employeBYId: any;
  id: any;
  getData: any;
  employeReport: any;
  isDisabled: boolean = true;
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
  candidate_id: any;
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

  countryList: any = [];
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
  entity_id: any;

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
    private $onboarding: OnboardingService,
  ) {
    this.baseUrl = environment.serverUrl;
    this.dataEmployee;
    this.basicForm = this.fb.group({
      title: new FormControl(null, Validators.required),
      // employee_code: new FormControl(null),
      first_name: new FormControl(null, [
        Validators.required,
      ]),
      middle_name: new FormControl('', Validators.pattern('[a-zA-Z]+')),
      last_name: new FormControl(null, [Validators.required,]),
      gender: new FormControl(null, Validators.required),
      date_of_birth: new FormControl(null, [Validators.required]),
      emp_personal_email: new FormControl(null, [Validators.required, Validators.email]),
      country_code: new FormControl(null),
      contact_number: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]{5,15}$/)]),
      reporting_manager_id: new FormControl(null, [Validators.required]),
      reporting_manager_name: new FormControl(null),
      location_id: new FormControl({ value: null, disabled: true }, [Validators.required]),
      department_id: new FormControl(null),
      department_name: new FormControl(null),
      designation_id: new FormControl(null),
      designation_name: new FormControl(null),
      emplyoment_type_id: new FormControl({ value: null, disabled: true },),
      employee_photo: new FormControl(null),
      entity_name: new FormControl(null),
      entity_id: new FormControl(null),
      pf_account_number: new FormControl(null,),
      UAN_number: new FormControl(null,),
      ESIC_number: new FormControl(null,),
      exp_joining_date: new FormControl(null)
    });
  }
  employee_id: any;
  currentRouter = this.route.url;
  conditionToDisable: boolean = true;
  emp_code: any
  ngOnInit(): void {
    this.getAll_Country_codes();
    this.getBranchList();
    this.getemployment_typeList();
    this.getAllSegment();
    this.getAllCountry();
    this.getEntityList();
    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.onBoardingId = params.onBoardingId;
      this.employeId = this.id?.employee_id;
      this.candidate_id = this.id?.candidate_id;

      localStorage.setItem("candidate_id", this.candidate_id);
      this.employee_id = this.id?.employee_id;
      this.action_type = this.id.action_type;

      if (this.employee_id) {
        this.basicForm.get('employee_photo')?.clearValidators();
        this.basicForm.get('employee_photo')?.updateValueAndValidity();
        this.getByIdUse(Number(this.employeId));
      }
      if (this.candidate_id) {
        this.getCandidate_detailsByID(this.candidate_id);
      }
    });
    this._empRegistration.setEmpTitle('BASIC-DETAILS');
    this.getEmployeData();
    // this.getAllRoleMaster();

    // dropdown
    this.gradelist_dropDown();
    this.getAllDepartment_dropDown();
    this.getAllDesignation_dropDown();
    this.regionlist_dropDown();
    this.employmentlist_dropDown();
    this.getAllPlantMaster();
    this.getEmployementType();
    this.getMunicipality();
  }

  getEntityList = () => {
    this.entityService.getEntityList().subscribe((res: any) => {
      console.log(res.data)
      this.entityList = res.data;
    })
  }

  getByIdUse(id: any) {

    this._empRegistration.getByUserId(id).subscribe((res: any) => {
      this.getData = res.data[0];
      this.reposting = res.data[0]?.reporting_manager_id;
      this.basicFormPatch(this.getData);
    });
  }

  getCandidate_detailsByID(id: any) {

    this.$onboarding.getCandidate_detailsByID(id).subscribe((res: any) => {
      this.getData = res.data[0];
      this.reposting = res.data[0]?.reporting_manager_id;
      this.basicFormPatch(this.getData);
    });
  }

  basicFormPatch(getData: any) {

    this.getAllArea(getData?.area_id);
    this.employee_photo = getData?.employee_photo;
    this.basicForm.patchValue({
      title: getData?.title,
      first_name: getData?.first_name,
      // employee_code: getData?.employee_code,
      middle_name: getData?.middle_name,
      last_name: getData?.last_name,
      gender: getData?.gender,
      date_of_birth: getData?.date_of_birth,
      emp_personal_email: getData?.email,
      country_code: getData?.country_code,
      contact_number: getData?.contact_number,
      reporting_manager_id: getData?.reporting_manager_id,
      reporting_manager_name: getData?.reportingM_fname + ' ' + getData?.reportingM_lname,
      location_id: getData?.location_id,
      department_id: getData?.department_id,
      department_name: getData?.department_name,
      designation_id: getData?.designation_id,
      designation_name: getData?.designation_name,
      area_id: getData?.area_id,
      emplyoment_type_id: getData?.emplyoment_type_id,
      // municipality_id: getData?.municipality_id,
      // employee_official_email: getData?.email,
      role_master_id: getData?.role_master_id,
      employee_photo: getData?.employee_photo,
      entity_id: getData?.entity_id,
      entity_name: getData?.entity_name,
      pf_account_number: getData?.pf_account_number,
      UAN_number: getData?.UAN_number,
      ESIC_number: getData?.ESIC_number,
      exp_joining_date: getData?.exp_joining_date
    });
    // }, 500);
  }

  get f() {
    return this.basicForm.controls;
  }
  now = new Date();
  year = this.now.getFullYear();
  month = this.now.getMonth();
  date = this.now.getDate();
  // min = moment({ year: this.year +18, month: this.month, date: this.date }).format('YYYY-MM-DD');
  max = moment({ year: this.year - 18, month: this.month, date: this.date }).format('YYYY-MM-DD');


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
    return this.reporting_manager_name = data.title + ' ' + data.first_name + ' ' + data.last_name
  }


  genrateBoolean: boolean = false
  enableEmployeeCode: boolean = false;
  typeChange(e: any) {
    // this.basicForm.controls['employee_code'].enable()
    this.emp_type = e.value;

    this.getAutoGenerateById(this.emp_type)
    if (this.emp_type) {
      let emoployeeBodyData = {
        "status": this.emp_type ? !this.genrateBoolean : this.genrateBoolean,
        "emplyoment_type": this.emp_type
      }

      this._empRegistration.getAutoGenerateById(emoployeeBodyData).subscribe((res: any) => {

        this.enableEmployeeCode = true;

        // Patch the value to the form control
        this.basicForm.patchValue({
          // employee_code: res?.data // Replace 'YourValueHere' with the value you want to patch
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


    if (!this.employee_photo) {
      return this.toast.error('Image is required', 'Fields Error');
    }

    this.submitted = false;
    if (this.basicForm.invalid) {
      Object.keys(this.basicForm.controls).forEach(controlName => {
        const control = this.basicForm.get(controlName);
        // Check if the control is invalid
        if (control && control.invalid) {
          console.log('Invalid control name:', controlName);
        }
      });
      this.toast.error('Required fields should not be empty', 'Fields Error');
      return;
    }
    this.submitted = true;

    let val: any = this.basicForm.value;
    // let roleName: any = this.allRoleMaster.find((e: any) => e.role_master_id === val.role_master_id);
    this.loading = true;

    let req = {
      ...val,
      tab_type: "Basic",
      employee_photo: this.employee_photo ? this.employee_photo : null,
      candidate_id: this.candidate_id,
      emplyoment_type_id:this.getData?.emplyoment_type_id,
      location_id:this.getData?.location_id
    }
    // let roleObj = this.allRoleMaster?.find((elem: any) => elem?.role_master_id == req.role_master_id)
    // req.role_master_name = roleObj?.role_master_name;

    let reportingMobj = this.reporting_manager_list?.find((elem: any) => elem?.employee_id == req.reporting_manager_id)
    req.reporting_manager = (reportingMobj?.title ? reportingMobj?.title + ' ' : '') +
      (reportingMobj?.first_name ? reportingMobj?.first_name + ' ' : '') +
      (reportingMobj?.last_name ? reportingMobj?.last_name + ' ' : '');

    if (this.employee_id) {
      req.employee_id = this.employee_id;
      // delete req.employee_official_email;
    }
    req.role_master_id = req.designation_id;

    this.$onboarding.register_onboarded_employee(req).subscribe(
      (res: any) => {
        this.loading = false;
        this.basicData = res;
        this.employee_id = res.user_id;

        this.head.EmpReg.next(this.basicData.user_id);
        localStorage.setItem('MyEmpId', this.basicData.user_id);
        this.toast.success('Basic Details Created successfully..');


        this.route.navigate(
          ['/create-employee-module/employ/employee-create/personal-details'],
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
        } else {
          this.toast.error('Login failed');
        }
      }
    );
  }

  getEmployeData() {
    let entity_id = localStorage.getItem("selectedEntityId");
    this._empRegistration.grtEmployeeList(entity_id, this.loginUser?.role).subscribe((res: any) => {

      this.dataEmployee = res.data;
      this.reporting_manager_list = res.data;


      this.reporting = this.dataEmployee.map((res: any) => res.title + res.first_name + res.last_name);


      this.reporting2 = this.dataEmployee;
    });
  }

  reportClick(id: any) {
    let entity_id = localStorage.getItem("selectedEntityId");
    this._empRegistration.grtEmployeeList(entity_id, this.loginUser?.role).subscribe((res: any) => {

      this.dataEmployee = res.data;
      this.reporting_manager_list = res.data;


      this.reporting = this.dataEmployee.map((res: any) => res.title + res.first_name + res.last_name);


      this.reporting2 = this.dataEmployee;
    });
  }

  getAutoGenerateById(data: any) {

  }

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
    this._empRegistration.getAllRoleMaster(this.loginUser.role).subscribe((res: any) => {
      this.allRoleMaster = res.data;


    });
  }

  seePreview(path: string, imagePath: any) {


    if (!this.imagePath) {
      if (path) {
        Swal.fire({
          imageUrl: path,
          imageHeight: 250,
          imageAlt: 'Profile Image',
          confirmButtonColor: "#5d6c7c",
          confirmButtonText: 'Ok',
        })
      }
    } else {
      Swal.fire({
        imageUrl: imagePath,
        imageHeight: 250,
        imageAlt: 'Profile Image',
        confirmButtonColor: "#5d6c7c",
        confirmButtonText: 'Ok',
      })
    }
  };

  employmentlist_dropDown() {
    this._empRegistration.employmentlist_dropDown().subscribe(
      (res) => {

        this.employmentlist = res.data.filter((res: any) => res.status == "ACTIVE");
      }
    );
  };

  getAllBandtype_dropDown() {
    this._empRegistration.getAllBandtype_dropDown().subscribe(
      (res) => {

        this.getAllBandtype = res.data;
      }
    );
  };

  getAllPlantMaster() {
    this._configurationalMasterService.getPlantMasterList().subscribe((res: any) => {
      this.plantList = res.data.filter((res: any) => res.status === "ACTIVE");
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
    let entity_id = localStorage.getItem("selectedEntityId");
    this._empRegistration.getAllDepartment_dropDown(entity_id).subscribe(
      (res) => {
        this.getAllDepartment = res.data.filter((res: any) => res.status === "ACTIVE");


      }
    );
  };

  getAllDesignation_dropDown() {
    this._empRegistration.getAllDesignation_dropDown().subscribe(
      (res) => {
        this.getAllDesignation = res.data.filter((res: any) => res.status === "ACTIVE");

      }
    );
  };

  gradelist_dropDown() {
    this._empRegistration.gradelist_dropDown().subscribe(
      (res) => {

        this.gradelist = res.data;
      }
    );
  };

  officeLocationall_dropDown() {
    this._empRegistration.officeLocationall_dropDown().subscribe(
      (res) => {

        this.officeLocationall = res.data;
      }
    );
  };

  physicalLocation_dropDown() {
    this._empRegistration.physicalLocationall_dropDown().subscribe(
      (res) => {

        this.physicalLocation = res.userDetails;
      }
    );
  };

  regionlist_dropDown() {
    this._empRegistration.regionlist_dropDown().subscribe(
      (res) => {

        this.regionlist = res.data;
      }
    );
  };

  getAllCountry() {
    this._empRegistration.getAllcountry().subscribe(
      (res: any) => {
        this.countryList = res.data;
        this.variables = this.countryList?.map((res: any) => res.countryss_name)
        this.checkData = this.countryList
        this.variable = this.countryList

      })
  };

  getStateByCountry(id: any) {
    this._empRegistration.getStateByCountry(id).subscribe(
      (res: any) => {
        this.stateList = res.data;
        this.stateVar = this.stateList.map((res: any) => res.states_name);
        this.stateVar2 = this.stateList;

        if (this.getData) {


          this.basicForm.controls['state'].patchValue(Number(this.getData?.state))
        }
      }
    )
  };

  getCityByState(id: any) {
    this._empRegistration.getCityByState(id).subscribe(
      (res: any) => {
        this.cityList = res.data;
        this.cityVar = this.cityList.map((res: any) => res.city_name);
        this.cityVar2 = this.cityList;
        if (this.getData) {
          this.basicForm.controls['city'].patchValue(Number(this.getData?.city))
        }
      }
    )
  };

  segment_id: any;
  getRegion(e: any) {
    const segment_value = e.value;
    this.segmentList.filter((item: any) => {
      if (item?.segment_name == segment_value) {
        this.segment_id = item?.segment_id
      }
    })
    this._empRegistration.getRegionByID(this.segment_id).subscribe((res: any) => {
      this.regionSList = res.data.new_regions;
    });
  }

  countryChange(e: any) {
    this.getStateByCountry(e.value);
  };

  stateChange(e: any) {
    this.getCityByState(e.value);
  }

  back() {
    this.locatin.back();
  };

  redirectToList() {
    this.route.navigate(['master/hrms/employee-master/employ'])
  }

  toggleAllCodeSelect() {
    if (this.allSelectedProduct) {
      this.productselect.options.forEach((item: MatOption) => item.select());
    } else {
      this.productselect.options.forEach((item: MatOption) => item.deselect());
    }
  }

  productFilter(e: any) {
    const aa = e
    let filteredVariable = this.variable.filter((item: any) => aa.includes(item.countryss_name));
    this.checkData = filteredVariable
  }

  stateFilter(e: any) {
    const aa = e
    let filteredVariable = this.stateVar2.filter((item: any) => aa.includes(item.states_name));
    this.stateList = filteredVariable
  }
  cityFilter(e: any) {
    const aa = e
    let filteredVariable = this.cityVar2.filter((item: any) => aa.includes(item.city_name));
    this.cityList = filteredVariable
  }

  reportingManagerSearch(e: any) {
    const aa = e
    let filteredVariable = this.reporting2.filter((item: any) => aa.includes(item.title + item.first_name + item.last_name));
    this.reporting_manager_list = filteredVariable
  }

  // Get all branch start
  branchList: any = [];
  getBranchList() {
    this._configurationalMasterService.getListActiveBranchSetup().subscribe((res: any) => {
      // this.branchList = res.data.filter((res: any) => res.status === "ACTIVE");
      this.branchList = res.data
    })
  }

  emp_typeList: any = [];
  getemployment_typeList() {
    this._configurationalMasterService.getactive_employmentTypeList().subscribe((res: any) => {
      this.emp_typeList = res.data
    })
  }

  // Get all area start
  areaList: any = [];
  getAllArea(evemt: any) {
    this.areaList = [];
    let req = {
      dep_id: evemt?.value,
    }
    this._configurationalMasterService.getAllArea_active(req).subscribe((res: any) => {
      this.areaList = res.data
    })
  }

  // Get all employement type start
  employementTypeList: any = [];
  getEmployementType() {
    this._configurationalMasterService.listEmployement().subscribe((res: any) => {
      // this.employementTypeList = res.data.filter((res: any) => res.status === "ACTIVE");
      this.employementTypeList = res.data
    })
  }

  // Get all employement type start
  municipalityList: any = [];
  getMunicipality() {
    this._configurationalMasterService.get_Municipality(this.entity_id).subscribe((res: any) => {
      this.municipalityList = res.data
    })
  }

  // File upload start
  employee_photo: any;
  uploadDoc(event: any) {
    try {
      // let isValidExtension = this.$common.checkForValidFile(event);
      // if (!isValidExtension) {
      //   this.basicForm.patchValue({ employee_photo: null });
      //   return this.employee_photo = ""
      // }
      const formData = new FormData();
      if (event.target.files && event.target.files[0]) {
        formData.append('file', event.target.files[0]);
      }
      this.$miscellaneousService.documents(formData).subscribe((response: any) => {
        if (response) {
          this.employee_photo = `uploaded_files/${response?.url}`;
        }
      }, err => {
        console.log(err);
      })
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
    this._configurationalMasterService.getAll_Country_codes().subscribe((res: any) => {
      this.countryCodeList = res.data
      console.log("dsdssdsd", this.countryCodeList)
    })
  }


}

