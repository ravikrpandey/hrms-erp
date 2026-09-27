import { JsonPipe, Location } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
// import { log } from 'console';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { HeadService } from 'src/app/@shared/services/head.service';
import Swal from 'sweetalert2';
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DatePipe } from "@angular/common";

const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@Component({
  selector: 'app-employee-datails',
  templateUrl: './employee-datails.component.html',
  styleUrls: ['./employee-datails.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
    DatePipe
  ]
})

export class EmployeeDatailsComponent {
  @ViewChild('productselect') productselect: MatSelect;
  @ViewChild('stateselect') stateselect: MatSelect;
  propertyManager: any;
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

  countryList: any;
  stateList: any;
  cityList: any;
  reporting_manager_list: any;
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
  stateVaribles: any = [];
  state_data: any = [];
  datas: any;
  cityVaribles: any;
  dataCity: any;
  city_data: any;
  dataOfJoining: any;
  loader: boolean = false
  loginUser: any;
  constructor(
    private head: HeadService,
    private locatin: Location,
    private fb: FormBuilder,
    private _empRegistration: EmpRegistrationService,
    private toast: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private configService: ConfigurationalmasterService,
  ) {
    this.dataEmployee;
    this.basicForm = this.fb.group({
      title: new FormControl(null, Validators.required),
      first_name: new FormControl(null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30),
        Validators.pattern('[a-zA-Z]+'),
      ]),
      middle_name: new FormControl(null),
      last_name: new FormControl(null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30),
        Validators.pattern('[a-zA-Z]+'),
      ]),
      gender: new FormControl(null, Validators.required),
      segment_suv: new FormControl(null, Validators.required),
      designation: new FormControl(null),
      date_of_birth: new FormControl(null, [Validators.required]),
      country: new FormControl(null, [Validators.required]),
      state: new FormControl(null, [Validators.required]),
      city: new FormControl(null, [Validators.required]),
      region: new FormControl(null),
      mobile_code: new FormControl(null),
      mobile_number: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
      // personal_email: new FormControl(null),
      employee_official_email: new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]),
      status: new FormControl(null),
      employee_photo: new FormControl(null),
      date_of_joining: new FormControl(null, [Validators.required])
    });
  }
  employee_id: any;
  currentRouter = this.route.url;
  decodedTimeAndDate: string;
  urlDateTime: string;
  linkisValid: boolean = false
  linkisNotvalid: any = false
  ngOnInit(): void {
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);
    this.activeroute.queryParams.subscribe(params => {
      console.log(params['condidateId']);
      if (params['condidateId']) {
        this.trackOuterForm(params['condidateId']);
        localStorage.setItem('condidateId', params['condidateId']);
      }
      if (params['datetime']) {
        this.urlDateTime = atob(params['datetime']); // Decode the URL's date and time
        console.log(this.urlDateTime);

        const urlDate = new Date(this.urlDateTime);
        const currentDate = new Date();

        const timeDifferenceInMilliseconds = currentDate.getTime() - urlDate.getTime();
        console.log(timeDifferenceInMilliseconds);

        const timeDifferenceInMinutes = Math.abs(timeDifferenceInMilliseconds / (1000 * 60));
        console.log(timeDifferenceInMilliseconds, urlDate);
        console.log(timeDifferenceInMinutes, 24 * 60);

        if (timeDifferenceInMinutes <= 24 * 60) {
          console.log('URL date and time are valid within 24 hours');
          this.linkisValid = true;
          // Proceed with your logic or navigate to a valid page
        } else {
          console.log('URL date and time are not valid');
          this.linkisNotvalid = true;
          this.openPopupforSession();
          // Show an error message or redirect to an invalid page
        }
      }
    });

    let employeeId = localStorage.getItem('employee_id');
    this.getAllCountry();
    if (employeeId) {
      // this.show_region = true;


      this.employee_ids = employeeId;
      this.getOuterCondidateData(employeeId)
    }

    this._empRegistration.setEmpTitle('BASIC-DETAILS');
    this.getEmployeData();
    this.getRegionData();
    this.getGradeData();
    this.getAllRoleMaster();
    this.getAllSegment();

    // dropdown
    this.gradelist_dropDown();
    this.getAllDepartment_dropDown();
    this.getAllDesignation_dropDown();
    this.regionlist_dropDown();
    // this.getAllBrand_dropDown();
    this.employmentlist_dropDown();
    this.getAllBandtype_dropDown();
    this.officeLocationall_dropDown();
    this.physicalLocation_dropDown();

    this.getById();
    //-------------------------------------------------------//
    // if (this.employeId) {
    //   this.basicForm.controls['employee_photo'].removeValidators(this.reqiredValidator);
    // } else {
    //   this.basicForm.controls['employee_photo'].addValidators(this.reqiredValidator);
    // }
  }
  getAllCountry() {
    this._empRegistration.getAllcountry().subscribe(
      (res: any) => {
        this.countryList = res?.data;
        this.variables = this.countryList.map((res: any) => res.countryss_name)
        this.checkData = this.countryList
        this.variable = this.countryList

      })
  };


  trackOuterForm(id: any) {
    console.log(id);
    this._empRegistration.TrackOuterform(id).subscribe((res: any) => {
      console.log(res, 'res');
      let apiResponse = res?.data
      this.dataOfJoining = res.data?.date_of_joining;
      console.log(this.dataOfJoining, 'this.dataOfJoining');

      this.basicForm.patchValue({
        date_of_joining: apiResponse.date_of_joining
      })
      console.log(this.basicForm);
      console.log(this.linkisValid, this.linkisNotvalid);
      if (this.linkisValid) {

        this.openPopupForSuccess(apiResponse.status1);
      } else {

      }
      // this.basicForm.controls['date_of_joining'].disable()
      // this.basicFormPatch(this.getData, this.propertyManager);
    });

  }
  getByIdUse(id: any) {
    this._empRegistration.getByUserId(id).subscribe((res: any) => {
      this.getData = res.data;
      this.reposting = res.data?.reporting_manager;
      console.log('this.getData photo', this.getData)
      // this.basicFormPatch(this.getData, this.propertyManager);
    });
  }

  getById() {
    // this._empRegistration.getById(this.onBoardingId, this.employee_ids).subscribe((res:any)=>{
    //   console.log(res);

    //    this.singleData =res.data;
    //   if(this.onBoardingId){
    //     this.basicFormPatch(res.data, '')
    //       this.basicForm.controls['state'].patchValue(Number(this.singleData?.current_addres[0]?.state))
    //       this.basicForm.controls['city'].patchValue(Number(this.singleData?.current_addres[0]?.city))
    //   }

    // })
  }

  getOuterCondidateData(employee_id: any) {

    this._empRegistration.getOuterEmployeeData(employee_id).subscribe((res: any) => {
      console.log(res);

      this.singleData = res.data;
      console.log(this.singleData);

      setTimeout(() => {
        this.basicFormPatch(res?.data, '')
      }, 50);
      this.basicForm.controls['state'].patchValue(Number(this.singleData?.state))
      this.basicForm.controls['city'].patchValue(Number(this.singleData?.city))
      // if(this.onBoardingId){
      // }

    })


  }
  openPopupforSession() {
    //  this.openPopupForSuccess("false")
    Swal.fire({
      title: 'Thank You!',
      text: "Your session has been expired",
      icon: 'error',
      showCancelButton: false,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      showConfirmButton: false,
      cancelButtonText: 'No',
      allowOutsideClick: false,

    })
  }
  openPopupForSuccess(status1: any) {
    console.log("status1", status1);

    if (status1 == "True") {
      Swal.fire({
        title: 'Thank You!',
        text: "Your Form is Already Submitted !",
        icon: 'success',
        showCancelButton: false,
        cancelButtonColor: "#f44336",
        confirmButtonColor: "#3f51b5",
        showConfirmButton: false,
        cancelButtonText: 'No',
        allowOutsideClick: false,
      });
    } else {

      Swal.close();
    }
  }
  basicFormPatch(getData: any, propertyManager: any) {
    console.log(getData?.region);
    console.log(this.segmentList);


    this.getStateByCountry(Number(getData?.country));
    this.getCityByState((Number(getData?.state)));
    console.log(this.segmentList);

    this.segmentList.filter((item: any) => {
      if (item?.segment_name == getData?.segment_suv) {
        this.segment_id = item?.segment_id
        console.log(this.segment_id);

      }
    })
    this._empRegistration.getRegionByID(this.segment_id).subscribe((res: any) => {
      console.log(res);

      this.regionSList = res.data.new_regions;
      console.log(this.regionSList, 'asdgh');

    });
    for (let item of this.countryList) {
      if (item.countryss_id == getData.country) {
        this.phoneCode = item?.phone_code;
      }
    }
    console.log('phone code -->', this.phoneCode)
    this.newPhoneCode = "+" + this.phoneCode;
    const code = this.newPhoneCode.toString();
    console.log(this.phoneCode);
    this.basicForm.patchValue({
      mobile_code: this.newPhoneCode
    })
    this.basicForm.patchValue({
      title: getData?.title || getData?.prefix,
      employee_official_email: getData?.employee_official_email || getData.personal_email,
      employee_code: getData?.employee_code,
      first_name: getData?.first_name,
      middle_name: getData?.middle_name || getData?.Middle_name,
      last_name: getData?.last_name || getData?.Last_name,
      gender: getData?.gender || getData?.Gender,
      emplyoment_type: getData?.emplyoment_type,
      segment_suv: getData?.segment_suv,
      designation: getData?.designation,
      date_of_birth: getData?.date_of_birth || moment(getData?.DOB).format(),
      date_of_joining: getData?.date_of_joining || moment(getData.DOJ).format(),
      country: Number(getData?.country || getData?.current_addres[0]?.country),
      region: getData?.region,
      department: getData?.department,
      reporting_manager_id: getData?.reporting_manager_id,
      reporting_manager: getData?.reporting_manager,
      reporting_office_location: getData?.reporting_office_location,
      working_physical_location: getData?.working_physical_location,
      band: getData?.band,
      grade: getData?.grade,
      mobile_number: getData?.mobile_number || getData.Mobile_number,
      personal_email: getData?.personal_email || getData.personal_email,
      probation: getData?.probation,
      status: getData?.status,
      probation_status: getData?.probation_status,
      abc: getData?.abc,
      // employee_photo: getData?.employee_photo,
      user_role: getData?.role_master_id,
    });

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
  typeChange(e: any) {
    console.log('e', e.value)
    this.emp_type = e.value;
    if (e.value == 'Part Time') {
      delete this.basicForm.value.date_of_joining;
      this.formVal = this.basicForm.value;
      this.basicForm.controls['designation'].removeValidators(this.reqiredValidator);
      this.basicForm.patchValue({
        user_role: "User"
      })
    }
    if (e.value == 'Part time Auditors') {
      delete this.basicForm.value.date_of_joining;
      this.formVal = this.basicForm.value;
      this.basicForm.controls['designation'].removeValidators(this.reqiredValidator);
      this.basicForm.patchValue({
        user_role: "Auditor"
      })
    }
  }
  getAllSegment() {
    this.configService.getAllSegment().subscribe((res: any) => {
      this.segmentList = res.data;
    });
  }

  onSubmitForm() {
    let val2 = this.basicForm.value;
    console.log(val2, 'val2')
    this.submitted = false;

    if (this.basicForm.invalid) {
      this.toast.error('Required fields should not be empty', 'Fields Error');

      return;
    }
    this.loader = true
    this.submitted = true;
    let val = this.basicForm.value;
    this.data1 = {
      title: val.title,
      personal_email: val.employee_official_email,
      first_name: val.first_name,
      middle_name: val.middle_name,
      last_name: val.last_name,
      gender: val.gender,
      segment_suv: val.segment_suv,
      designation: val.designation,
      date_of_birth: moment(val.date_of_birth).format('YYYY-MM-DD'),
      country: String(val.country),
      state: String(val.state),
      city: String(val.city),
      region: val.region,
      country_code: val.mobile_code,
      mobile_number: val.mobile_number,
      employee_official_email: val.employee_official_email,
      role_master_id: 2,
      status: 'INACTIVE',
      employee_id: this.employee_ids ? this.employee_ids : null,
      date_of_joining: this.dataOfJoining || val.date_of_joining

    };

    console.log(this.data1, 'data1data1');

    this._empRegistration.outerFormCondidate(this.data1, this.imageToUpload).subscribe((res: any) => {
      console.log(res);
      this.loader = false
      console.log(res, 'asmbndfjkasbn', res?.data.employee_id);
      if (res?.data?.employee_id) {
        localStorage.setItem('employee_id', res?.data?.employee_id)
      }
      this.toast.success(res.message)
      this.route.navigate(['new-employee-form/personal-details-form'], { queryParams: { employee_id: res.data.employee_id } });
    }, (err) => {
      this.toast.error(err.error.message)
    })

    console.log('data', this.data1);


  }

  getEmployeData() {
    let entity_id = localStorage.getItem("selectedEntityId");
    this._empRegistration.grtEmployeeList(entity_id, this.loginUser?.role).subscribe((res: any) => {

      this.dataEmployee = res.data;
      this.reporting_manager_list = res.data;
    });
  }

  reportClick(id: any) {

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

        this.employmentlist = res.data;
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

  getAllDepartment_dropDown() {
    this._empRegistration.getAllDepartment_dropDown().subscribe(
      (res) => {

        this.getAllDepartment = res.data;
      }
    );
  };

  getAllDesignation_dropDown() {
    this._empRegistration.getAllDesignation_dropDown().subscribe(
      (res) => {

        this.getAllDesignation = res.data;
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


  getStateByCountry(id: any) {
    this._empRegistration.getStateByCountry(id).subscribe(
      (res: any) => {
        this.stateList = res.data;
        this.stateVaribles = this.stateList.map((res: any) => res.states_name)
        this.datas = this.stateList
        this.state_data = this.stateList
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
        this.cityVaribles = this.cityList.map((res: any) => res.city_name)
        this.dataCity = this.cityList
        this.city_data = this.cityList
        if (this.getData) {
          this.basicForm.controls['city'].patchValue(Number(this.getData?.city))
        }
      }
    )
  };
  segment_id: any;
  getRegion(e: any) {
    console.log(e);

    const segment_value = e.value;
    console.log(segment_value);

    this.segmentList.filter((item: any) => {
      if (item?.segment_name == segment_value) {
        this.segment_id = item?.segment_id
      }
    })
    this._empRegistration.getRegionByID(this.segment_id).subscribe((res: any) => {
      this.regionSList = res.data.new_regions;
      console.log(this.regionSList, 'asdgh');

    });
  }
  countryChange(e: any) {

    this.getStateByCountry(e.value);
  };

  stateChange(e: any) {

    this.getCityByState(e.value);
  }

  back() {
    this.basicForm.reset()
  };

  reportingManagerChange(e: any) {


    let fitlerMn = this.reporting_manager_list.find((a: any) => Number(a.employee_id) === Number(e.value))

    this.reporting_manager_id = fitlerMn.employee_id
    this.reporting_manager_name = `${fitlerMn.title} ${fitlerMn.first_name} ${fitlerMn.last_name}`


  }
  optionEaCode(event: any) {
    for (let item of this.countryList) {
      if (item.countryss_id == event?.value) {
        this.phoneCode = item?.phone_code;
      }
    }
    console.log('phone code -->', this.phoneCode)
    this.newPhoneCode = "+" + this.phoneCode;
    const code = this.newPhoneCode.toString();
    console.log(this.phoneCode);
    this.basicForm.patchValue({
      mobile_code: this.newPhoneCode
    })
    let newStatus = true;
    this.productselect.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelectedProduct = newStatus;

    this.getStateByCountry(event.value);
  }

  toggleAllCodeSelect() {
    if (this.allSelectedProduct) {
      this.productselect.options.forEach((item: MatOption) => item.select());
    } else {
      this.productselect.options.forEach((item: MatOption) => item.deselect());
    }
  }
  productFilter(e: any) {
    console.log('e', e)
    const aa = e
    let filteredVariable = this.variable.filter((item: any) => aa.includes(item.countryss_name));
    this.checkData = filteredVariable
  }

  stateFilter(e: any) {
    console.log('e', e)
    const aa = e
    let filteredState = this.state_data.filter((item: any) => aa.includes(item.states_name));
    this.datas = filteredState
  }

  cityFilter(e: any) {
    console.log('e', e)
    const aa = e
    let filteredCity = this.city_data.filter((item: any) => aa.includes(item.city_name));
    this.dataCity = filteredCity
  }
}
