import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl
} from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { VirtualTimeScheduler } from 'rxjs';
import { Location } from '@angular/common';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import Swal from 'sweetalert2';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import * as moment from 'moment';

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

  countryList: any;
  stateList: any;
  permanentStateData: any
  presentSteteData: any
  presentCityList: any;
  permanentCityList: any;
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
  readonlyp: boolean = false
  dateValidator: any = [{ fromDate: null }];
  employerTominDate: any = [];
  bloodGrupList: any = ['O -', 'O +', 'A -', 'A +', 'B -', 'B +', 'AB -', 'AB +']
  minToDate: Date;
  today: Date = new Date();
  presentSteteData2: any;
  states1: any;
  countryList2: any;
  countries1: any;
  cities1: any;
  presentCityList2: any;
  permanentStateData2: any;
  states2: any;
  permanentCityList2: any;
  cities2: any;
  permanentcountryList: any;
  permanentcountryList2: any;
  permanentcountries: any;
  countries2: any;
  presentCountryList: any;
  presentCountryList2: any;
  countries3: any;
  states3: any;
  cities3: any;
  presentStateList1: any;
  presentStateList2: any;
  presentCityList12: any;
  relationList: any = [['Son', 'Daughter', 'Father', 'Mother', 'Husband', 'Wife']]
  relations: any = [['Son', 'Daughter', 'Father', 'Mother', 'Husband', 'Wife']];
  relations2: any = [['Son', 'Daughter', 'Father', 'Mother', 'Husband', 'Wife']];
  constructor(
    private fb: FormBuilder,
    private locatin: Location,
    private toastr: ToastrService,
    private activetedRoute: ActivatedRoute,
    private route: Router,
    private _empRegistration: EmpRegistrationService,
    private _configurationalMasterService: ConfigurationalmasterService,
  ) {
    this.personalForm = this.fb.group({
      present_country_id: new FormControl(null),
      present_state_id: new FormControl(null),
      present_city_id: new FormControl(null),
      present_address: new FormControl(null),

      //  Permanent Address Same as Present Address
      permanent_country_id: new FormControl(null),
      permanent_state_id: new FormControl(null),
      permanent_city_id: new FormControl(null),
      parmanent_address: new FormControl(null),

      //personal detail
      personal_country_id: new FormControl(null),
      personal_state_id: new FormControl(null),
      personal_city_id: new FormControl(null),
      driving_license_number: new FormControl(null),
      blood_group: new FormControl(null),
      id_number: new FormControl(null),
      issued_date: new FormControl(null),
      exp_date: new FormControl(null),
      tax_number: new FormControl(null),
      passport_number: new FormControl(null),
      marital_status: new FormControl(null),
      spouse_name: new FormControl(null),

      //family Details
      family_details: new FormArray([]),

      // PRIVIUS EMPOYER DETAILS
      prev_employer_details: new FormArray([]),
    });
    this.personalForm.get('marital_status')?.valueChanges.subscribe((value) => {
      if (value === 'Unmarried') {
        // If marital status is 'Unmarried', remove validators for spouse name
        this.personalForm.get('spouse_name')?.clearValidators();
        this.personalForm.get('spouse_name')?.updateValueAndValidity();
      } else {
        // For other marital statuses, add validators for spouse name
        this.personalForm.get('spouse_name')?.setValidators([]);
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
        let outerAndInnerEmpId = localStorage.getItem('outerAndInnerEmpId')

        this.employeGetID = outerAndInnerEmpId
      }
      this.id = params;
      this.employeGetID = params.employee_id;
    });
    this._empRegistration.setEmpTitle('PERSONAL DETAILS');
    this.getAllCountry();
    this.getAll_Country_codes();
  };

  // Date start
  FromDate: any;
  toDate: any;
  now = new Date();
  year = this.now.getFullYear();
  month = this.now.getMonth();
  dates = this.now.getDate();
  maxDate = moment({ year: this.year + 100, month: this.month, date: this.dates }).format('YYYY-MM-DD');
  minDate = moment({ year: this.year - 0, month: this.month, date: this.dates }).format('YYYY-MM-DD');




  toDateFilter = (d: Date | null): boolean => {
    return d ? d >= this.minToDate && d <= this.today : false;
  };


  fromDate(e: any, i: number) {
    const formArray = this.personalForm.get('prev_employer_details') as FormArray;
    const formGroup = formArray.at(i) as FormGroup;
    const selectedFromDate = e.value;

    if (selectedFromDate) {
      // Set the minimum date for TO DATE to the day after the FROM DATE
      this.minToDate = moment(selectedFromDate).add(1, 'days').toDate();
      // Clear the TO DATE field if it's before the new minimum date
      const toDateControl = formGroup.get('to_date');
      if (toDateControl && toDateControl.value && toDateControl.value < this.minToDate) {
        toDateControl.setValue(null);
      }
    }
  }
  getStartDate(index: number): Date {
    const company_details = this.personalForm.get('prev_employer_details') as FormArray;
    return company_details.at(index)?.get('from_date')?.value;
  }

  ToDate(e: any) {
    this.toDate = moment(e.value).format('YYYY/MM/DD');
  }

  calculateMinToDate(i: any) {
    const formArray = this.personalForm.get('prev_employer_details') as FormArray;
    const formGroup = formArray.at(i) as FormGroup;
    let temp = moment(formGroup.get('from_date')?.value).format('YYYY-MM-DD');
    temp = moment(formGroup.get('from_date')?.value).add(1, 'day').format('YYYY-MM-DD');

    if (temp) {
      return temp;
    } else {
      return this.minDate;
    }
  }
  // Date end

  get CF_1(): any {
    return this.personalForm.controls;
  };

  onKeyPress(event: KeyboardEvent) {
    const regex = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!regex.test(inputChar)) {
      event.preventDefault();
    }
  }

  presentCountryChange(e: any) {
    this.presentCountryMethod(e?.value);
  }
  presentCountryMethod(id: any) {
    this._empRegistration.getStateByCountry(id).subscribe(
      (res: any) => {
        if (res && res?.data) {
          this.presentSteteData = res?.data;
          this.presentSteteData2 = res?.data;
          this.states1 = this.presentSteteData2.map((item: any) => item.states_name)
        }
      }
    );
  }

  stateSearch1(e: any) {
    const aa = e
    let filteredVariable = this.presentSteteData2.filter((item: any) => aa.includes(item.states_name));
    this.presentSteteData = filteredVariable
  }

  countrySearch1(e: any) {
    const aa = e
    let filteredVariable = this.countryList2.filter((item: any) => aa.includes(item.countryss_name));
    this.countryList = filteredVariable
  }

  citySearch1(e: any) {
    const aa = e
    let filteredVariable = this.presentCityList12.filter((item: any) => aa.includes(item.city_name));
    this.presentCityList = filteredVariable
  }

  permanentCountryChange(e: any) {
    this.permanentCountrymethod(e?.value);
  }
  permanentCountrymethod(id: any) {
    if (id) {
      this._empRegistration.getStateByCountry(id).subscribe(
        (res: any) => {
          if (res && res.data) {
            this.permanentStateData = res?.data;
            this.permanentStateData2 = res?.data;
            this.states2 = this.permanentStateData2.map((item: any) => item.states_name)
          }
        }
      );
    }
  }



  permanentState(e: any) {
    this.permanentGetCityByState(e?.value);
  }
  permanentGetCityByState(id: any) {
    if (id) {
      this._empRegistration.getCityByState(id).subscribe(
        (res: any) => {
          if (res && res.data) {
            this.permanentCityList = res.data;
            this.permanentCityList2 = res.data;
            this.cities2 = this.permanentCityList2.map((item: any) => item.city_name)
          }
        }
      );
    }

  }

  presentStateChange(e: any) {
    this.presentGetCityByState(e?.value);
  }
  presentGetCityByState(id: any) {
    this._empRegistration.getCityByState(id).subscribe(
      (res: any) => {
        if (res && res?.data) {
          this.presentCityList = res?.data;
          this.presentCityList12 = res?.data;
          this.cities1 = this.presentCityList.map((item: any) => item.city_name)
        }
      }
    );
  }

  permanentStateSearch1(e: any) {
    const aa = e
    let filteredVariable = this.permanentStateData2.filter((item: any) => aa.includes(item.states_name));
    this.permanentStateData = filteredVariable
  }

  permanentCountrySearch1(e: any) {
    const aa = e
    let filteredVariable = this.permanentcountryList2.filter((item: any) => aa.includes(item.countryss_name));
    this.permanentcountryList = filteredVariable
  }

  permanentCitySearch1(e: any) {
    const aa = e
    let filteredVariable = this.permanentCityList2.filter((item: any) => aa.includes(item.city_name));
    this.permanentCityList = filteredVariable
  }

  presentStateSearch1(e: any) {
    const aa = e
    let filteredVariable = this.presentStateList2.filter((item: any) => aa.includes(item.states_name));
    this.presentStateList1 = filteredVariable
  }

  presentCountrySearch1(e: any) {
    const aa = e
    let filteredVariable = this.presentCountryList2.filter((item: any) => aa.includes(item.countryss_name));
    this.presentCountryList = filteredVariable
  }

  presentCitySearch1(e: any) {
    const aa = e
    let filteredVariable = this.presentCityList2.filter((item: any) => aa.includes(item.city_name));
    this.presentCityList1 = filteredVariable
  }

  onSubmitPersonal() {

    if (this.personalForm.invalid) {
    this.personalForm.markAllAsTouched();
      return this.toastr.error('Required fields should not be empty', 'Fields Error');
    }

    let val: any = this.personalForm.value;

    let req = {
      ...val,
      tab_type: "Personal",
      address_check_value: this.address_check_value,
    }
    req?.family_details?.map((item: any) => {
      if (item.emergency_contact) {
        item.emergency_contact = 'YES'
      }
      else {
        item.emergency_contact = 'NO'
      }
    })

    if (this.employeGetID) {
      req.employee_id = this.employeGetID;
    }
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
      const issuedDateValue = new Date(this.personalForm?.get('issuedDate')?.value);
      const minExpDate = new Date(issuedDateValue.setDate(issuedDateValue.getDate() + 1));
      return minExpDate;
    }
    return null;
  }

  onIssuedDateChange(e: any) {
    const issuedDateValue = new Date(this.personalForm.get('issued_date')?.value);
    const minExpDate = new Date(issuedDateValue.setDate(issuedDateValue.getDate() + 1));
    this.minExpDateValue = minExpDate;
  }

  relationSearch(e: any, i: any) {
    const aa = e
    let filteredVariable = this.relations2[i].filter((item: any) => aa.includes(item));
    this.relations[i] = filteredVariable
  }

  codeSearch(e: any, i: any) {
    const aa = e
    let filteredVariable = this.countryCodeList2[i].filter((item: any) => aa.includes(item.dialing_code));
    this.countryCodeList[i] = filteredVariable
  }



  addRow() {
    const family_details = this.personalForm.get('family_details') as FormArray;
    let i = family_details['controls'].length;
    this.relations[i] = ['Son', 'Daughter', 'Father', 'Mother', 'Husband', 'Wife']
    this.relations2[i] = ['Son', 'Daughter', 'Father', 'Mother', 'Husband', 'Wife']
    this.relationList[i] = ['Son', 'Daughter', 'Father', 'Mother', 'Husband', 'Wife']


    this._configurationalMasterService.getAll_Country_codes().subscribe((res: any) => {
      this.countryCodeList[i] = res.data
      this.countryCodeList2[i] = res.data
      this.codes[i] = this.countryCodeList[i].map((value: any) => value.dialing_code)
      console.log("dsdssdsd", this.countryCodeList)
    })


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

        const family_details = this.personalForm.get('family_details') as FormArray;
        this.CF_1.family_details.push(
          new FormGroup({
            member_name: new FormControl(null, [Validators.required]),
            date_of_birth: new FormControl(null, [Validators.required]),
            relation: new FormControl(null, [Validators.required]),
            country_code: new FormControl("258"),
            contact_number: new FormControl(null, [Validators.required]),
            remarks: new FormControl(null),
            emergency_contact: new FormControl(null,)
          })
        )


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

    const prev_employer_details = this.personalForm.get('prev_employer_details') as FormArray;


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

        const prev_employer_details = this.personalForm.get('prev_employer_details') as FormArray;
        this.CF_1.prev_employer_details.push(
          new FormGroup({
            company_name: new FormControl(null, [Validators.required]),
            // position: new FormControl(null, [Validators.required]),
            from_date: new FormControl(null, [Validators.required]),
            to_date: new FormControl(null, [Validators.required]),
            last_salary: new FormControl(null, [Validators.min(0)]),
            reason_of_leaving: new FormControl(null),
            location: new FormControl(null),
          })
        )


        // ... Add new row logic here
      } else {
        // Show error because some existing rows have empty document files
        this.toastr.error('Please Previous employer details first');
        // Display an error message for the user
      }
    } else {

    }

  }

  deletefamily_details(i: number, d: any) {
    if (this.CF_1.family_details.length >= 1) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You want be delete !",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#be0000',
        cancelButtonColor: '#858586',
        confirmButtonText: 'Delete'
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.CF_1.family_details.length >= 1) {
            this.CF_1.family_details.removeAt(i);
          } else {
            this.toastr.error('must be one', "Can't Deleted!");
          }
        };
      })
    } else {
      this.toastr.error("Can't Deleted", 'must be one');
    }
  }

  pincodeEditWhileDisabled = false;
  address_check_value = false;
  showPermanent(event: any) {
    if (event?.checked || event == true) {
      // Set permanent address fields

      this.pincodeEditWhileDisabled = true;
      this.address_check_value = true;
      this.disablePermanentAddress = true;
      this.personalForm.controls['permanent_country_id'].setValue(this.personalForm.value?.present_country_id);
      this.personalForm.controls['permanent_state_id'].setValue(this.personalForm.value?.present_state_id);
      this.personalForm.controls['permanent_city_id'].setValue(this.personalForm.value?.present_city_id);
      this.personalForm.controls['parmanent_address'].setValue(this.personalForm.value?.present_address);
      this.permanentGetCityByState(this.personalForm.value?.present_state_id)
      this.permanentCountrymethod(this.personalForm.value?.present_country_id)
      this.readonlyp = true
    } else {
      this.disablePermanentAddress = false;
      // Clear permanent address fields
      this.personalForm.controls['permanent_country_id'].setValue(undefined);
      this.personalForm.controls['permanent_state_id'].setValue(undefined);
      this.personalForm.controls['permanent_city_id'].setValue(undefined);
      this.personalForm.controls['parmanent_address'].setValue(undefined);
      this.readonlyp = false
      this.resetFlags(); // For example, resetting the flag for pincode changes
    }



    // Reset flag or perform any other actions specific to this functionality

  }

  getTodayDate(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set hours to 0 to compare date only
    return today;
  }


  resetFlags() {
    this.pincodeEditWhileDisabled = false; // Resetting the flag for pincode changes
    // Reset other flags if needed
  }

  onKeyDown(event: KeyboardEvent): boolean {
    return (
      event.key === 'Backspace' ||
      event.key === 'Delete' ||
      event.key.startsWith('Arrow') ||
      /^[0-9]$/.test(event.key)
    );
  }

  deleteEmployerRow(i: number, d: any) {
    if (this.CF_1.prev_employer_details.length >= 1) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#be0000',
        cancelButtonColor: '#858586',
        confirmButtonText: 'Delete'
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.CF_1.prev_employer_details.length >= 1) {
            this.CF_1.prev_employer_details.removeAt(i);
          } else {
            this.toastr.error('must be one', "Can't Deleted!");
          }
        };
      })

    } else {
      this.toastr.error("Can't Deleted", 'must be one');
    }
  }

  getById() {
    this._empRegistration.getByUserId(this.employeGetID).subscribe((res: any) => {
      this.singleData = res.data;
      if (this.singleData?.address_check_value === "1") {
        this.address_check_value = true;
        this.showPermanent(this.address_check_value)

      } else {
        this.address_check_value = false;
      }

      this.persnalDataPatch(this.singleData);
    })
  }

  getAllCountry() {
    this._empRegistration.getAllActivecountry().subscribe(
      (res: any) => {
        this.countryList = res.data;
        this.variables = this.countryList.map((res: any) => res.countryss_name)
        this.countryList2 = res?.data;
        this.countries1 = this.countryList.map((item: any) => item.countryss_name)
        this.permanentcountryList = res?.data;
        this.permanentcountryList2 = res?.data;
        this.presentCountryList = res?.data;
        this.presentCountryList2 = res?.data;
        this.countries2 = this.countryList.map((item: any) => item.countryss_name)
        this.countries3 = this.countryList.map((item: any) => item.countryss_name)
        this.checkData = this.countryList
        this.variable = this.countryList
      })
  };

  // getStateByCountry(id: any) {
  //   console.log(id, 'ddd');

  //   this._empRegistration.getStateByCountry(id).subscribe(
  //     (res: any) => {
  //       this.permanentStateData = res.data;


  //     }
  //   )
  // };





  getPinCodeByCity(id: any) {
    this._empRegistration.getPincodeByCity(id).subscribe(
      (res: any) => {
        this.pincodeList = res.data;
        this.cityVar = this.cityList.map((res: any) => res.city_name);
        this.cityVar2 = this.cityList;

        // if(this.presentData){
        //   this.personalForm.controls['pincode'].patchValue(this.presentData.pincode || this.empSingleData?.current_pin_code);
        //   this.personalForm.controls['permanent_pincode'].patchValue(this.presentData.permanent_pincode || this.empSingleData?.parmanent_pin_code,);
        // }
      }
    )
  };



  Skip() {
    this.route.navigate(
      ['master/hrms/employee-master/employ/employee-create/salary-details'],
      { queryParams: { employee_id: this.employeGetID } }
    );
  }
  // Function to handle changes for present address
  handlePresentAddressChanges(data: any) {
    this.presentCountryMethod(data?.present_country_id);
    // this.presentStateChange(data?.state);
    this.presentGetCityByState(data?.present_state_id);
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
  persnalDataPatch(presentData: any) {
    
    this.handlePresentAddressChanges(presentData);
    this.handlePermanentAddressChanges(presentData);
    this.handlePersonalAddressChanges(presentData);

    // Patching data for present address
    this.personalForm.patchValue({
      present_country_id: presentData?.present_country_id,
      present_state_id: presentData?.present_state_id,
      present_city_id: presentData?.present_city_id,
      present_address: presentData?.present_address,
      permanent_country_id: presentData?.permanent_country_id,
      permanent_state_id: presentData?.permanent_state_id,
      permanent_city_id: presentData?.permanent_city_id,
      parmanent_address: presentData?.parmanent_address,
      personal_country_id: presentData?.personal_country_id,
      personal_state_id: presentData?.personal_state_id,
      personal_city_id: presentData?.personal_city_id,
      driving_license_number: presentData?.driving_license_number,
      blood_group: presentData?.blood_group,
      id_number: presentData?.id_number,
      issued_date: presentData?.issued_date,
      exp_date: presentData?.exp_date,
      tax_number: presentData?.tax_number,
      passport_number: presentData?.passport_number,
      marital_status: presentData?.marital_status,
      spouse_name: presentData?.spouse_name,
    });

    if (presentData?.family_details?.length) {
      presentData?.family_details?.map((item: any) => {
        if (item?.emergency_contact == 'YES') {
          item.emergency_contact = true;
        }
        else {
          item.emergency_contact = false;
        }
      })
      presentData?.family_details?.forEach((item: any, index: number) => {

        this.countryCodeList[index] = this.countryCodeList[0]
        this.countryCodeList2[index] = this.countryCodeList[0]
        this.codes[index] = this.countryCodeList[0].map((value: any) => value.dialing_code)

        this.relations[index] = ['Son', 'Daughter', 'Father', 'Mother', 'Husband', 'Wife']
        this.relations2[index] = ['Son', 'Daughter', 'Father', 'Mother', 'Husband', 'Wife']
        this.relationList[index] = ['Son', 'Daughter', 'Father', 'Mother', 'Husband', 'Wife']

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
        }
        else {
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
      })
      // this.CF_1.family_details = this.patchData(presentData?.family_details);
    }
    if (presentData?.prev_employer_details?.length) {
      presentData?.prev_employer_details?.forEach((item: any, index: number) => {
        const formGroup = this.prevEmployerFormArray?.at(index) as FormGroup;
        if (formGroup) {
          formGroup.patchValue({
            company_name: item.company_name,
            from_date: item.from_date,
            to_date: item.to_date,
            last_salary: item.last_salary,
            reason_of_leaving: item.reason_of_leaving,
            location: item.location
          });
        }
        else {
          this.prevEmployerFormArray.push(
            this.fb.group({
              company_name: item.company_name,
              from_date: item.from_date,
              to_date: item.to_date,
              last_salary: item.last_salary,
              reason_of_leaving: item.reason_of_leaving,
              location: item.location
            })
          );
        }
      })
      // this.CF_1.prev_employer_details = this.patchData(presentData?.prev_employer_details);
    }
  }

  prevTab = () => {
    this.route.navigate(
      ['master/hrms/employee-master/employ/employee-create/basic-details'],
      { queryParams: { employee_id: this.employeGetID } }
    );
  }


  // patchData(e: any): FormArray {
  //   return new FormArray(
  //     e.map((x: any) => {
  //       const obj = new FormGroup({});
  //       Object.keys(x).forEach((k) => {
  //         obj.addControl(k, new FormControl(x[k]));
  //       });
  //       return obj;
  //     })
  //   );
  // };

  // Get country code start


  countryCodeList: any = [[]];
  countryCodeList2: any = [[]];
  codes: any = [[]];
  getAll_Country_codes() {

    this._configurationalMasterService.getAll_Country_codes().subscribe((res: any) => {
      this.countryCodeList[0] = res.data
      this.countryCodeList2[0] = res.data
      this.codes[0] = this.countryCodeList[0].map((value: any) => value.dialing_code)
      console.log("dsdssdsd", this.countryCodeList)
      this.getById()
    })
  }

  presentCountryChange1(e: any) {
    this.presentCountryMethod1(e?.value);
  }
  presentSteteData1: any
  presentCountryMethod1(id: any) {
    this._empRegistration.getStateByCountry(id).subscribe(
      (res: any) => {
        if (res && res?.data) {
          this.presentStateList1 = res?.data;
          this.presentStateList2 = res?.data;
          this.states3 = this.presentStateList2.map((item: any) => item.states_name)
        }
      }
    );
  }

  presentStateChange1(e: any) {
    this.presentGetCityByState1(e?.value);
  }
  presentCityList1: any
  presentGetCityByState1(id: any) {
    this._empRegistration.getCityByState(id).subscribe(
      (res: any) => {
        if (res && res?.data) {
          this.presentCityList1 = res?.data;
          this.presentCityList2 = res?.data;
          this.cities3 = this.presentCityList1.map((item: any) => item.city_name)
        }
      }
    );
  }

  // Relation
  isOptionSelected(option: string): boolean {
    const allowanace_details = this.personalForm.get('family_details') as FormArray;
    return allowanace_details.controls.some(control => control.value.relation === option);
  }


}
