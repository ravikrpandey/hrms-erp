import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { VirtualTimeScheduler } from 'rxjs';
import { Location } from '@angular/common';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import Swal from 'sweetalert2';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../format-datepicker';
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
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
  ],
})
export class PersonalDetailsComponent {
  personalForm: FormGroup;
  personalFamilyForm: any;
  id: any;
  updateData: any;
  employeGetID: any;
  personalIdData: any;
  presentData: any;
  resultNew: any[] = [];
  familydata: any;
  resultTwo: any[] = [];
  remarks: any[] = [];
  relations: any[] = [];
  dateBirth: any[] = [];
  contactDet: any[] = [];
  famDetails: any[] = [];
  inboxData: any[] = [];
  inboxData1: any[] = [];
  resultPrivius: any;
  companyName: any[] = [];
  position: any[] = [];
  fromdate: any[] = [];
  todate: any[] = [];
  lastdrawnsalary: any[] = [];
  location: any[] = [];
  resonofleaving: any[] = [];
  employee_id: number[] = [];
  empId: any;
  addFamilyDisable: boolean = false;
  allFamilyData: any;
  allEmployeerData: any;
  deletedFamilyData: any = [];
  presentCityList3: any;
  countryList: any;
  countryListSec: any;
  countryListThird: any;
  countryListfourth: any;
  stateList: any;
  permanentStateData: any;
  presentSteteData: any;
  presentCityList: any;
  permanentCityList: any;
  peronsonal_state_id: any;
  pincodeList: any;
  employee_ids: any;
  onBoardingId: any;
  singleData: any;
  empSingleData: any;
  checkData: any;
  variables: any = [];
  variable: any = [];
  stateVar: any = [];
  stateVar2: any = [];
  cityVar: any = [];
  cityVar2: any = [];
  cityList: any;
  disablePermanentAddress: any = false;
  minExpDateValue: any;
  action_type: any;
  readonlyp: boolean = false;
  dateValidator: any = [{ fromDate: null }];
  employerTominDate: any = [];
  bloodGrupList: any = [
    'O -',
    'O +',
    'A -',
    'A +',
    'B -',
    'B +',
    'AB -',
    'AB +',
    'Not Sure',
  ];
  minToDate: Date;
  relationList: any = [
    [
      'Son',
      'Daughter',
      'Father',
      'Mother',
      'Husband',
      'Wife',
      'Brother',
      'Sister',
      'Cousin',
    ],
  ];
  relations2: any = [
    [
      'Son',
      'Daughter',
      'Father',
      'Mother',
      'Husband',
      'Wife',
      'Brother',
      'Sister',
      'Cousin',
    ],
  ];
  today: Date = new Date();
  presentCityList1: any;
  presentSteteData1: any;
  presentSteteData2: any;
  presentCityList2: any;
  constructor(
    private fb: FormBuilder,
    private locatin: Location,
    private toastr: ToastrService,
    private activetedRoute: ActivatedRoute,
    private route: Router,
    private _empRegistration: EmpRegistrationService,
    private _configurationalMasterService: ConfigurationalmasterService
  ) {
    this.personalForm = this.fb.group({
      present_country_id: new FormControl(null, Validators.required),
      present_state_id: new FormControl(null, Validators.required),
      present_city_id: new FormControl(null, Validators.required),
      present_address: new FormControl(null, Validators.required),

      //  Permanent Address Same as Present Address
      permanent_country_id: new FormControl(null, Validators.required),
      permanent_state_id: new FormControl(null, Validators.required),
      permanent_city_id: new FormControl(null, Validators.required),
      parmanent_address: new FormControl(
        { value: null, disabled: this.readonlyp },
        Validators.required
      ),

      //personal detail
      personal_country_id: new FormControl(null, [Validators.required]),
      personal_state_id: new FormControl([], [Validators.required]),
      personal_city_id: new FormControl(null, [Validators.required]),
      // DIRE_number: new FormControl(null, [Validators.required]),
      driving_license_number: new FormControl(null),
      blood_group: new FormControl(null),
      id_number: new FormControl(null),
      issued_date: new FormControl(null),
      exp_date: new FormControl(null),
      emp_pan_card: new FormControl(
        null,
        Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/)
      ),
      emp_adhar_card_number: new FormControl(
        null,
        Validators.pattern(/^\d{12}$/)
      ),
      emp_medical_condition: new FormControl(null),
      visa_number: new FormControl(null),
      visa_number_exp_date: new FormControl(null),
      emirates_id_number: new FormControl(null),
      labour_card_number: new FormControl(null),
      labour_card_number_exp_date: new FormControl(null),
      passport_number: new FormControl(null),
      marital_status: new FormControl(null, [Validators.required]),
      spouse_name: new FormControl(null, [Validators.required]),
      eid: new FormControl(null),
      eid_exp_date: new FormControl(null),

      //family Details
      family_details: new FormArray([]),

      // PRIVIUS EMPOYER DETAILS
      prev_employer_details: new FormArray([]),
      work_from_country: ['', Validators.required],
    });
    console.log('-------------data', this.personalForm);
    this.personalForm.get('marital_status')?.valueChanges.subscribe((value) => {
      if (value === 'Unmarried') {
        // If marital status is 'Unmarried', remove validators for spouse name
        this.personalForm.get('spouse_name')?.clearValidators();
        this.personalForm.get('spouse_name')?.updateValueAndValidity();
      } else {
        // For other marital statuses, add validators for spouse name
        this.personalForm
          .get('spouse_name')
          ?.setValidators([Validators.required, noLeadingSpaces()]);
        this.personalForm.get('spouse_name')?.updateValueAndValidity();
      }
    });
  }

  ngOnInit(): void {
    let lg: any = localStorage.getItem('signInUser');
    let loginUser = JSON.parse(lg);
    this.employee_ids = loginUser.employee_id;
    this.activetedRoute.queryParams.subscribe((params: any) => {
      if (params) {
        this.employeGetID = params.employee_id;
        this.action_type = params.action_type;
      } else {
        let outerAndInnerEmpId = localStorage.getItem('outerAndInnerEmpId');
        this.employeGetID = outerAndInnerEmpId;
      }
      this.id = params;
      this.employeGetID = params.employee_id;
    });
    this._empRegistration.setEmpTitle('PERSONAL DETAILS');
    this.getAllCountry();
    this.getById();
    this.getAll_Country_codes();
  }

  // Date start
  FromDate: any;
  toDate: any;
  now = new Date();
  year = this.now.getFullYear();
  month = this.now.getMonth();
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
  toDateFilter = (d: Date | null): boolean => {
    return d ? d >= this.minToDate && d <= this.today : false;
  };

  fromDate(e: any, i: number) {
    const formArray = this.personalForm.get(
      'prev_employer_details'
    ) as FormArray;
    const formGroup = formArray.at(i) as FormGroup;
    const selectedFromDate = e.value;
    if (selectedFromDate) {
      // Set the minimum date for TO DATE to the day after the FROM DATE
      this.minToDate = moment(selectedFromDate).add(1, 'days').toDate();
      // Clear the TO DATE field if it's before the new minimum date
      const toDateControl = formGroup.get('to_date');
      if (
        toDateControl &&
        toDateControl.value &&
        toDateControl.value < this.minToDate
      ) {
        toDateControl.setValue(null);
      }
    }
  }

  getStartDate(index: number): Date {
    const company_details = this.personalForm.get(
      'prev_employer_details'
    ) as FormArray;
    return company_details.at(index)?.get('from_date')?.value;
  }

  ToDate(e: any) {
    this.toDate = moment(e.value).format('YYYY/MM/DD');
  }

  calculateMinToDate(i: any) {
    const formArray = this.personalForm.get(
      'prev_employer_details'
    ) as FormArray;
    const formGroup = formArray.at(i) as FormGroup;
    let temp = moment(formGroup.get('from_date')?.value).format('YYYY-MM-DD');
    temp = moment(formGroup.get('from_date')?.value)
      .add(1, 'day')
      .format('YYYY-MM-DD');

    if (temp) {
      return temp;
    } else {
      return this.minDate;
    }
  }
  // Date end

  get CF_1(): any {
    return this.personalForm.controls;
  }

  onKeyPress(event: KeyboardEvent) {
    const regex = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!regex.test(inputChar)) {
      event.preventDefault();
    }
  }

  //second
  presentCountryChange(e: any) {
    this.presentCountryMethod(e?.value);
  }

  presentCountryMethod(id: any) {
    this._empRegistration.getStateByCountry(id).subscribe((res: any) => {
      if (res && res?.data) {
        this.presentSteteData = res?.data;
        // this.presentSteteData2 = res?.data;
        this.stateVar = this.presentSteteData.map(
          (res: any) => res.states_name
        );
        this.stateVar2 = this.presentSteteData;
      }
    });
  }

  onStateSelected(stateId: any) {
    this._empRegistration.getCityByState(stateId).subscribe((res: any) => {
      if (res && res.data) {
        this.presentCityList = res.data;
        this.cityVar = this.presentCityList.map((item: any) => item.city_name);
        this.cityVar2 = this.presentCityList;
      }
    });
  }

  stateFilter(event: any) {
    const searchValue = event?.target?.value?.toLowerCase().trim() || '';
    if (!searchValue) {
      this.presentSteteData = [...this.stateVar2];
    } else {
      this.presentSteteData = this.stateVar2.filter((item: any) =>
        item?.states_name?.toLowerCase().includes(searchValue)
      );
    }
  }

  cityFilter(e: any) {
    const aa = e;
    let filteredVariable = this.cityVar2.filter((item: any) =>
      aa.includes(item.city_name)
    );
    this.presentCityList = filteredVariable;
  }

  countryFilter(e: any) {
    const aa = e;
    let filteredVariable = this.checkData.filter((item: any) =>
      aa.includes(item.countryss_name)
    );
    this.countryList = filteredVariable;
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

  //cw
  presentCountryChange2(e: any) {
    this.presentCountryMethod2(e?.value);
  }

  presentCountryMethod2(id: any) {
    this._empRegistration.getStateByCountry(id).subscribe((res: any) => {
      if (res && res?.data) {
        this.presentSteteData2 = res?.data;
        this.stateVar = this.presentSteteData2.map(
          (res: any) => res.states_name
        );
        this.stateVar2 = this.presentSteteData2;
      }
    });
  }

  countryFilter4(e: any) {
    const aa = e;
    let filteredVariable = this.checkData.filter((item: any) =>
      aa.includes(item.countryss_name)
    );
    this.countryListfourth = filteredVariable;
  }

  countryfilter4(event: any) {
    const searchValue = event?.target?.value?.toLowerCase().trim() || '';
    if (!searchValue) {
      this.filterworkfromcountry = [...this.countryListfourth];
    } else {
      this.filterworkfromcountry = this.countryListfourth.filter((item: any) =>
        item?.countryss_name?.toLowerCase().includes(searchValue)
      );
    }
  }

  presentStateChange2(e: any) {
    const id = localStorage.getItem('peronsonal_state_id');
    this.presentGetCityByState2(e?.value ? e?.value : id);
    console.log('-------------call function');
    this.permanentCityList(e?.value);
  }

  personalStateFilter(event: any) {
    const searchValue = event?.target?.value?.toLowerCase().trim() || '';
    if (!searchValue) {
      this.presentSteteData2 = [...this.stateVar2];
    } else {
      this.presentSteteData2 = this.stateVar2.filter((item: any) =>
        item?.states_name?.toLowerCase().includes(searchValue)
      );
    }
  }

  personalCityFilter(event: any) {
    const searchValue = event?.target?.value?.toLowerCase().trim() || '';
    if (!searchValue) {
      this.presentCityList3 = [...this.cityVar2];
    } else {
      this.presentCityList3 = this.cityVar2.filter((item: any) =>
        item?.city_name?.toLowerCase().includes(searchValue)
      );
    }
  }

  presentGetCityByState2(id: any) {
    this._empRegistration.getCityByState(id).subscribe((res: any) => {
      if (res && res?.data) {
        this.presentCityList2 = res?.data;
        this.presentCityList3 = res?.data;
        this.cityVar = this.presentCityList2.map((res: any) => res.city_name);
        this.cityVar2 = this.presentCityList2;
      }
    });
  }

  permanentCountryChange(e: any) {
    this.permanentCountrymethod(e?.value);
  }

  permanentCountrymethod(id: any) {
    if (id) {
      this._empRegistration.getStateByCountry(id).subscribe((res: any) => {
        if (res && res.data) {
          this.permanentStateData = res?.data;
          this.filterpermanetstatedata = [...this.permanentStateData];
          console.log(
            '---------------find the data',
            this.filterpermanetstatedata
          );
        }
      });
    }
  }

  permanentState(e: any) {
    this.permanentGetCityByState(e?.value);
  }

  filterpermanetstatedata: any;
  filterpermanentcitydata: any;
  permanentGetCityByState(id: any) {
    if (id) {
      this._empRegistration.getCityByState(id).subscribe((res: any) => {
        if (res && res.data) {
          this.permanentCityList = res.data;
          this.filterpermanentcitydata = [...this.permanentCityList];
          this.cityVar2 = this.presentCityList;
        }
      });
    }
  }

  filterpermanentcity(event: any) {
    const searchValue = event?.target?.value?.toLowerCase().trim() || '';
    if (!searchValue) {
      this.filterpermanentcitydata = [...this.permanentCityList];
    } else {
      this.filterpermanentcitydata = this.permanentCityList.filter(
        (item: any) => item?.city_name?.toLowerCase().includes(searchValue)
      );
    }
  }

  filterpermanent_state(event: any) {
    const searchValue = event?.target?.value?.toLowerCase().trim() || '';
    if (!searchValue) {
      this.filterpermanetstatedata = [...this.permanentStateData];
    } else {
      this.filterpermanetstatedata = this.permanentStateData.filter(
        (item: any) => item?.states_name?.toLowerCase().includes(searchValue)
      );
    }
  }

  presentStateChange(e: any) {
    this.presentGetCityByState(e?.value);
  }

  presentGetCityByState(id: any) {
    this._empRegistration.getCityByState(id).subscribe((res: any) => {
      if (res && res?.data) {
        this.presentCityList = res?.data;
        this.cityVar = this.presentCityList.map((res: any) => res.city_name);
        this.cityVar2 = this.presentCityList;
      }
    });
  }

  onSubmitPersonal() {
    this.personalForm.markAllAsTouched();
    console.log(this.personalForm, '<<<<<<<<<<<');
    if (this.personalForm.invalid) {
      return this.toastr.error(
        'Required fields should not be empty',
        'Fields Error'
      );
    }
    let val: any = this.personalForm.value;
    let req = {
      ...val,
      tab_type: 'Personal',
      address_check_value: this.address_check_value ? 1 : 0,
    };
    req?.family_details?.map((item: any) => {
      if (item.emergency_contact) {
        item.emergency_contact = 'YES';
      } else {
        item.emergency_contact = 'NO';
      }
    });
    if (this.employeGetID) {
      req.employee_id = this.employeGetID;
    }
    if (!req?.visa_number_exp_date) req.visa_number_exp_date = null;
    if (!req?.labour_card_number_exp_date)
      req.labour_card_number_exp_date = null;
    if (!req?.eid) req.eid = null;
    if (!req?.eid_exp_date) req.eid_exp_date = null;
    this._empRegistration.basicSignUp(req).subscribe(
      (res: any) => {
        this.personalForm?.patchValue(res);
        this.employee_id = res.employee_id;
        this.toastr.success('Updated Successfully..');

        this.route.navigate(
          ['master/hrms/employee-master/employ/employee-create/salary-details'],
          { queryParams: { employee_id: this.employeGetID } }
        );
        const latlang = { id: this.employee_id };
      },
      (err) => {
        if (err.status === 400) {
          this.toastr.error('Failed! Email is already in use!');
        } else if (err.status == 500) {
          this.toastr.error('bad request ');
        } else if (err.status == 404) {
          this.toastr.error(
            'Somthing went wrong.. Please try agin',
            'Error Massage'
          );
        } else {
          this.toastr.error('Login failed');
        }
      }
    );
  }

  calculateMinExpDate() {
    if (this.personalForm?.get('issuedDate')?.value) {
      const issuedDateValue = new Date(
        this.personalForm?.get('issuedDate')?.value
      );
      const minExpDate = new Date(
        issuedDateValue.setDate(issuedDateValue.getDate() + 1)
      );
      return minExpDate;
    }
    return null;
  }

  onIssuedDateChange(e: any) {
    const issuedDateValue = new Date(
      this.personalForm.get('issued_date')?.value
    );
    const minExpDate = new Date(
      issuedDateValue.setDate(issuedDateValue.getDate() + 1)
    );
    this.minExpDateValue = minExpDate;
  }
  relationSearch(e: any, i: any) {
    const aa = e;
    let filteredVariable = this.relations2[i].filter((item: any) =>
      aa.includes(item)
    );
    this.relations[i] = filteredVariable;
  }
  addRow() {
    const family_details = this.personalForm.get('family_details') as FormArray;
    let i = family_details['controls'].length;
    this.relations[i] = [
      'Son',
      'Daughter',
      'Father',
      'Mother',
      'Husband',
      'Wife',
      'Brother',
      'Sister',
      'Cousin',
    ];
    this.relations2[i] = [
      'Son',
      'Daughter',
      'Father',
      'Mother',
      'Husband',
      'Wife',
      'Brother',
      'Sister',
      'Cousin',
    ];
    this.relationList[i] = [
      'Son',
      'Daughter',
      'Father',
      'Mother',
      'Husband',
      'Wife',
      'Brother',
      'Sister',
      'Cousin',
    ];
    if (family_details.value) {
      let canAddNewRow = true;
      for (const obj of family_details?.value) {
        if (!obj.member_name) {
          canAddNewRow = false;
          break;
        }
      }
      if (canAddNewRow) {
        // Logic to add a new row

        const family_details = this.personalForm.get(
          'family_details'
        ) as FormArray;
        this.CF_1.family_details.push(
          new FormGroup({
            member_name: new FormControl(null, [Validators.required]),
            date_of_birth: new FormControl(null, [Validators.required]),
            relation: new FormControl(null, [Validators.required]),
            contact_number: new FormControl(null, [Validators.required]),
            remarks: new FormControl(null, []),
            emergency_contact: new FormControl(null),
          })
        );

        // ... Add new row logic here
      } else {
        // Show error because some existing rows have empty document files
        this.toastr.error('Please add Family Details first');
        // Display an error message for the user
      }
    } else {
    }
  }
  disableFutureDates = (d: Date | null): boolean => {
    const today = new Date();
    // Disable today's date and any future date
    return d ? d < today : false;
  };

  addRowEmploy() {
    const prev_employer_details = this.personalForm.get(
      'prev_employer_details'
    ) as FormArray;

    if (prev_employer_details.value) {
      let canAddNewRow = true;

      for (const obj of prev_employer_details?.value) {
        if (!obj.company_name) {
          canAddNewRow = false;
          break;
        }
      }
      if (canAddNewRow) {
        // Logic to add a new row

        const prev_employer_details = this.personalForm.get(
          'prev_employer_details'
        ) as FormArray;
        this.CF_1.prev_employer_details.push(
          new FormGroup({
            company_name: new FormControl(null, [Validators.required]),
            from_date: new FormControl(null, [Validators.required]),
            to_date: new FormControl(null, [Validators.required]),
            last_salary: new FormControl(null, [
              Validators.min(0),
              Validators.required,
            ]),
            reason_of_leaving: new FormControl(null, [Validators.required]),
            position: new FormControl(null, [Validators.required]),
            location: new FormControl(null, [Validators.required]),
          })
        );

        // ... Add new row logic here
      } else {
        // Show error because some existing rows have empty document files
        this.toastr.error('Please Previous employer details first');
        // Display an error message for the user
      }
    } else {
    }
  }

  countryFilter2(e: any) {
    const aa = e;
    let filteredVariable = this.checkData.filter((item: any) =>
      aa.includes(item.countryss_name)
    );
    this.countryListSec = filteredVariable;
  }

  countryFilter3(e: any) {
    const aa = e;
    let filteredVariable = this.checkData.filter((item: any) =>
      aa.includes(item.countryss_name)
    );
    this.countryListThird = filteredVariable;
  }

  deletefamily_details(i: number, d: any) {
    if (this.CF_1.family_details.length >= 1) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You want be delete !',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#be0000',
        cancelButtonColor: '#5d6c7c',
        confirmButtonText: 'Delete',
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.CF_1.family_details.length >= 1) {
            this.CF_1.family_details.removeAt(i);
          } else {
            this.toastr.error('must be one', "Can't Deleted!");
          }
        }
      });
    } else {
      this.toastr.error("Can't Deleted", 'must be one');
    }
  }

  pincodeEditWhileDisabled = false;
  address_check_value = false;

  // showPermanent(event: any) {
  //   if (event?.checked || event == true) {
  //     this.pincodeEditWhileDisabled = true;
  //     this.address_check_value = true;
  //     this.disablePermanentAddress = true;
  //     this.personalForm.controls['permanent_country_id'].setValue(
  //       this.personalForm.value?.present_country_id
  //     );
  //     this.personalForm.controls['permanent_state_id'].setValue(
  //       this.personalForm.value?.present_state_id
  //     );
  //     this.personalForm.controls['permanent_city_id'].setValue(
  //       this.personalForm.value?.present_city_id
  //     );
  //     this.personalForm.controls['parmanent_address'].setValue(
  //       this.personalForm.value?.present_address
  //     );

  //     this.personalForm.controls['work_from_country'].setValue(
  //       this.personalForm.value?.present_country_id
  //     );
  //     this.personalForm.controls['personal_state_id'].setValue(
  //       this.personalForm.value?.present_state_id
  //     );

  //     this.personalForm.controls['personal_city_id'].setValue(
  //       this.personalForm.value?.present_city_id
  //     );

  //     this.permanentGetCityByState(this.personalForm.value?.present_state_id);
  //     this.permanentCountrymethod(this.personalForm.value?.present_country_id);
  //     this.presentCountryMethod2(this.personalForm.value?.present_country_id);
  //     this.presentGetCityByState2(this.personalForm.value?.present_state_id);
  //     this.readonlyp = true;
  //   } else {
  //     this.disablePermanentAddress = false;

  //     this.personalForm.controls['permanent_country_id'].setValue(undefined);
  //     this.personalForm.controls['permanent_state_id'].setValue(undefined);
  //     this.personalForm.controls['permanent_city_id'].setValue(undefined);
  //     this.personalForm.controls['parmanent_address'].setValue(undefined);
  //     this.personalForm.controls['work_from_country'].setValue(undefined);
  //     this.personalForm.controls['personal_state_id'].setValue(undefined);
  //     this.personalForm.controls['personal_city_id'].setValue(undefined);

  //     this.readonlyp = false;
  //     this.resetFlags(); // For example, resetting the flag for pincode changes
  //   }

  //   // Reset flag or perform any other actions specific to this functionality
  // }
  showPermanent(event: any) {
    if (event?.checked || event == true) {
      this.pincodeEditWhileDisabled = true;
      this.address_check_value = true;
      this.disablePermanentAddress = true;

      this.personalForm.controls['permanent_country_id'].setValue(
        this.personalForm.value?.present_country_id
      );
      this.personalForm.controls['permanent_state_id'].setValue(
        this.personalForm.value?.present_state_id
      );
      this.personalForm.controls['permanent_city_id'].setValue(
        this.personalForm.value?.present_city_id
      );
      this.personalForm.controls['parmanent_address'].setValue(
        this.personalForm.value?.present_address
      );
      this.personalForm.controls['work_from_country'].setValue(
        this.personalForm.value?.present_country_id
      );
      this.personalForm.controls['personal_state_id'].setValue(
        this.personalForm.value?.present_state_id
      );
      this.personalForm.controls['personal_city_id'].setValue(
        this.personalForm.value?.present_city_id
      );
      this.permanentGetCityByState(this.personalForm.value?.present_state_id);
      this.permanentCountrymethod(this.personalForm.value?.present_country_id);
      this.presentCountryMethod2(this.personalForm.value?.present_country_id);
      this.presentGetCityByState2(this.personalForm.value?.present_state_id);
      this.readonlyp = true;
    } else {
      this.address_check_value = false;
      this.disablePermanentAddress = false;
      this.personalForm.controls['permanent_country_id'].reset();
      this.personalForm.controls['permanent_state_id'].reset();
      this.personalForm.controls['permanent_city_id'].reset();
      this.personalForm.controls['parmanent_address'].reset();
      this.personalForm.controls['work_from_country'].reset();
      this.personalForm.controls['personal_state_id'].reset();
      this.personalForm.controls['personal_city_id'].reset();
      this.filterpermanetstatedata = [];
      this.filterpermanentcitydata =[]
      this.presentSteteData2=[]
      this.presentCityList3 =[]
      this.readonlyp = false;
      this.resetFlags();
    }
  }

  checkIfAllAddressesAreSame(presentData: any): boolean {
    if (!presentData) {
      this.address_check_value = false;
      return false;
    }
    const requiredKeys = [
      'present_country_id',
      'permanent_country_id',
      'work_from_country',
      'present_state_id',
      'permanent_state_id',
      'personal_state_id',
      'present_city_id',
      'permanent_city_id',
      'personal_city_id',
      'present_address',
      'parmanent_address',
    ];
    const hasAllValues = requiredKeys.every(
      (key) =>
        presentData[key] !== undefined &&
        presentData[key] !== null &&
        presentData[key] !== ''
    );

    if (!hasAllValues) {
      this.address_check_value = false;
      return false;
    }
    const allSame =
      presentData.present_country_id == presentData.permanent_country_id &&
      presentData.present_country_id == presentData.work_from_country &&
      presentData.present_state_id == presentData.permanent_state_id &&
      presentData.present_state_id == presentData.personal_state_id &&
      presentData.present_city_id == presentData.permanent_city_id &&
      presentData.present_city_id == presentData.personal_city_id &&
      presentData.present_address == presentData.parmanent_address;

    this.address_check_value = allSame;
    return allSame;
  }

  persnalDataPatch(presentData: any) {
    this.handlePresentAddressChanges(presentData);
    this.handlePermanentAddressChanges(presentData);
    this.handlePersonalAddressChanges(presentData);
    this.presentCountryMethod(presentData.present_country_id);
    this.onStateSelected(presentData.present_state_id);
    const id = presentData?.work_from_country;
    if (!presentData) return;
    if (
      presentData?.work_from_country &&
      presentData?.work_from_country !== ''
    ) {
      this.personalForm.patchValue({
        work_from_country: +presentData?.work_from_country,
      });
      this.presentCountryMethod2(presentData?.work_from_country);
    }
    setTimeout(() => {
      this._empRegistration
        .getStateByCountry(presentData?.work_from_country)
        .subscribe((stateRes: any) => {
          if (stateRes && stateRes?.data) {
            this.presentSteteData2 = stateRes?.data;
            this.stateVar = this.presentSteteData2.map(
              (res: any) => res.states_name
            );
            this.stateVar2 = this.presentSteteData2;
            this.personalForm.patchValue({
              present_state_id: presentData?.present_state_id,
            });
            if (presentData?.present_state_id) {
              this._empRegistration
                .getCityByState(presentData?.present_state_id)
                .subscribe((cityRes: any) => {
                  if (cityRes && cityRes?.data) {
                    this.presentCityList1 = cityRes?.data;
                    this.presentCityList2 = cityRes?.data;
                    this.cityVar = this.presentCityList1.map(
                      (res: any) => res.city_name
                    );
                    this.cityVar2 = this.presentCityList1;
                    this.personalForm.patchValue({
                      present_city_id: presentData?.present_city_id,
                    });
                  }
                });
            }
          }
        });
    }, 200);

    this.personalForm.patchValue({
      present_country_id: presentData?.present_country_id,
      // work_from_country: +id,
      present_state_id: presentData?.present_state_id,
      present_city_id: presentData?.present_city_id,
      present_address: presentData?.present_address,
      permanent_country_id: presentData?.permanent_country_id,
      permanent_state_id: presentData?.permanent_state_id,
      permanent_city_id: presentData?.permanent_city_id,
      parmanent_address: presentData?.parmanent_address,
      personal_country_id: presentData?.personal_country_id,
      personal_state_id: presentData?.personal_state_id ?? null,
      personal_city_id: presentData?.personal_city_id ?? null,
      driving_license_number: presentData?.driving_license_number,
      blood_group: presentData?.blood_group,
      id_number: presentData?.id_number,
      issued_date: presentData?.issued_date,
      exp_date: presentData?.exp_date,
      tax_number: presentData?.tax_number,
      passport_number: presentData?.passport_number,
      marital_status: presentData?.marital_status,
      spouse_name: presentData?.spouse_name,
      emp_pan_card: presentData?.emp_pan_card,
      emp_adhar_card_number: presentData?.emp_adhar_card_number,
      emp_medical_condition: presentData?.emp_medical_condition,
      visa_number: presentData?.visa_number,
      visa_number_exp_date: presentData?.visa_number_exp_date,
      emirates_id_number: presentData?.emirates_id_number,
      labour_card_number: presentData?.labour_card_number,
      labour_card_number_exp_date: presentData?.labour_card_number_exp_date,
      eid: presentData?.eid,
      eid_exp_date: presentData?.eid_exp_date,
    });
    if (presentData?.personal_state_id) {
      this.peronsonal_state_id = presentData?.personal_state_id;
      localStorage.setItem('peronsonal_state_id', this.peronsonal_state_id);
      setTimeout(() => {
        const id = localStorage.getItem('peronsonal_state_id');
        if (id) {
          this.presentStateChange2(id);
        }
      }, 200);
    }
    if (presentData?.family_details?.length) {
      presentData?.family_details?.map((item: any) => {
        if (item?.emergency_contact == 'YES') {
          item.emergency_contact = true;
        } else {
          item.emergency_contact = false;
        }
      });
      presentData?.family_details?.forEach((item: any, index: number) => {
        this.relations[index] = [
          'Son',
          'Daughter',
          'Father',
          'Mother',
          'Husband',
          'Wife',
        ];
        this.relations2[index] = [
          'Son',
          'Daughter',
          'Father',
          'Mother',
          'Husband',
          'Wife',
        ];
        this.relationList[index] = [
          'Son',
          'Daughter',
          'Father',
          'Mother',
          'Husband',
          'Wife',
        ];
        const formGroup = this.familyDetailsFormArray?.at(index) as FormGroup;
        if (formGroup) {
          formGroup.patchValue({
            member_name: item.member_name,
            date_of_birth: item.date_of_birth,
            relation: item.relation,
            country_code: item.country_code,
            contact_number: item.contact_number,
            remarks: item.remarks,
            emergency_contact: item?.emergency_contact,
          });
        } else {
          this.familyDetailsFormArray.push(
            this.fb.group({
              member_name: item.member_name,
              date_of_birth: item.date_of_birth,
              relation: item.relation,
              country_code: item.country_code,
              contact_number: item.contact_number,
              remarks: item.remarks,
              emergency_contact: item?.emergency_contact,
            })
          );
        }
      });
      // this.CF_1.family_details = this.patchData(presentData?.family_details);
    }
    if (presentData?.prev_employer_details?.length) {
      presentData?.prev_employer_details?.forEach(
        (item: any, index: number) => {
          const formGroup = this.prevEmployerFormArray?.at(index) as FormGroup;
          if (formGroup) {
            formGroup.patchValue({
              company_name: item.company_name,
              from_date: item.from_date,
              to_date: item.to_date,
              last_salary: item.last_salary,
              reason_of_leaving: item.reason_of_leaving,
              position: item.position,
              location: item.location,
            });
          } else {
            this.prevEmployerFormArray.push(
              this.fb.group({
                company_name: item.company_name,
                from_date: item.from_date,
                to_date: item.to_date,
                last_salary: item.last_salary,
                reason_of_leaving: item.reason_of_leaving,
                position: item.position,
                location: item.location,
              })
            );
          }
        }
      );
    }
    this.checkIfAllAddressesAreSame(this.personalForm.value);
  }

  getTodayDate(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  resetFlags() {
    this.pincodeEditWhileDisabled = false; // Resetting the flag for pincode changes
    // Reset other flags if needed
  }
  deleteEmployerRow(i: number, d: any) {
    if (this.CF_1.prev_employer_details.length >= 1) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#be0000',
        cancelButtonColor: '#5d6c7c',
        confirmButtonText: 'Delete',
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.CF_1.prev_employer_details.length >= 1) {
            this.CF_1.prev_employer_details.removeAt(i);
          } else {
            this.toastr.error('must be one', "Can't Deleted!");
          }
        }
      });
    } else {
      this.toastr.error("Can't Deleted", 'must be one');
    }
  }

  getById() {
    this._empRegistration
      .getByUserId(this.employeGetID)
      .subscribe((res: any) => {
        this.singleData = res.data;
        if (this.singleData?.address_check_value) {
          this.address_check_value = true;
          this.showPermanent(this.address_check_value);
        }
        this.persnalDataPatch(this.singleData);
      });
  }

  filterworkfromcountry: any;
  getAllCountry() {
    this._empRegistration.getAllcountry().subscribe((res: any) => {
      this.countryList = res.data;
      this.countryListSec = res.data;
      this.countryListThird = res.data;
      this.countryListfourth = res.data;
      this.filterworkfromcountry = [...this.countryListfourth];
      this.variables = this.countryList.map((res: any) => res.countryss_name);
      this.checkData = this.countryList;
      this.variable = this.countryList;
    });
  }

  getPinCodeByCity(id: any) {
    this._empRegistration.getPincodeByCity(id).subscribe((res: any) => {
      this.pincodeList = res.data;
      this.cityVar = this.cityList.map((res: any) => res.city_name);
      this.cityVar2 = this.cityList;
    });
  }

  Skip() {
    this.route.navigate(
      ['master/hrms/employee-master/employ/employee-create/salary-details'],
      { queryParams: { employee_id: this.employeGetID } }
    );
  }

  handlePresentAddressChanges(data: any) {
    this.presentCountryMethod(data?.permanent_country_id);
    // this.presentStateChange(data?.state);
    this.presentGetCityByState(data?.permanent_state_id);
  }
  handlePersonalAddressChanges(data: any) {
    this.presentCountryMethod1(data?.personal_country_id);
    // this.presentStateChange(data?.state);
    this.presentGetCityByState1(data?.personal_state_id);
  }

  get familyDetailsFormArray() {
    return this.personalForm.get('family_details') as FormArray;
  }
  get prevEmployerFormArray() {
    return this.personalForm.get('prev_employer_details') as FormArray;
  }

  // Function to handle changes for permanent address
  handlePermanentAddressChanges(data: any) {
    this.permanentCountrymethod(data?.permanent_country_id);
    this.permanentGetCityByState(data?.permanent_state_id);
  }

  prevTab = () => {
    this.route.navigate(
      ['master/hrms/employee-master/employ/employee-create/basic-details'],
      { queryParams: { employee_id: this.employeGetID } }
    );
  };

  // Get country code start
  countryCodeList: any = [];
  getAll_Country_codes() {
    this._configurationalMasterService
      .getAll_Country_codes()
      .subscribe((res: any) => {
        this.countryCodeList = res.data;
      });
  }
}
