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
import moment from 'moment';
import { OnboardingService } from 'src/app/@shared/services/service/recruitment/onboarding.service';

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
  bloodGrupList: any = ['O -', 'O +', 'A -', 'A +', 'B -', 'B +', 'AB -', 'AB +','Not Sure']
  presentSteteData1: any;
  presentCityList1: any;

  constructor(
    private fb: FormBuilder,
    private locatin: Location,
    private toastr: ToastrService,
    private activetedRoute: ActivatedRoute,
    private route: Router,
    private _empRegistration: EmpRegistrationService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private $onboarding: OnboardingService,
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
      parmanent_address: new FormControl({ value: null, disabled: this.readonlyp }, Validators.required),

      //personal detail
      personal_country_id: new FormControl(null, [Validators.required]),
      personal_state_id: new FormControl(null, [Validators.required]),
      personal_city_id: new FormControl(null, [Validators.required]),
      // DIRE_number: new FormControl(null, [Validators.required]),
      driving_license_number: new FormControl(null),
      blood_group: new FormControl(null),
      issued_date: new FormControl(null),
      exp_date: new FormControl(null),
      emp_pan_card: new FormControl(null,Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/)),
      emp_adhar_card_number: new FormControl(null,Validators.pattern(/^\d{12}$/)),
      emp_medical_condition: new FormControl(null,),
      visa_number: new FormControl(null,),
      // emirates_id_number: new FormControl(null,),
      labour_card_number: new FormControl(null,),
      passport_number: new FormControl(null,),
      marital_status: new FormControl(null, [Validators.required]),
      spouse_name: new FormControl(null),

      //family Details
      family_details: new FormArray([
        new FormGroup({
          member_name: new FormControl(),
          date_of_birth: new FormControl(),
          relation: new FormControl(),
          country_code: new FormControl(),
          contact_number: new FormControl(null, ),
          remarks: new FormControl(null),
          emergency_contact: new FormControl(null)
        }),
      ]),

      // PRIVIUS EMPOYER DETAILS
      prev_employer_details: new FormArray([
        new FormGroup({
          company_name: new FormControl(null),
          from_date: new FormControl(null),
          position: new FormControl(null,),
          to_date: new FormControl(null),
          last_salary: new FormControl(null),
          reason_of_leaving: new FormControl(null),
          location: new FormControl(null),
        }),
      ]),
    });
    this.personalForm.get('marital_status')?.valueChanges.subscribe((value) => {
      if (value === 'Unmarried') {
        // If marital status is 'Unmarried', remove validators for spouse name
        // this.personalForm.get('spouse_name')?.clearValidators();
        this.personalForm.get('spouse_name')?.updateValueAndValidity();
      } else {
        // For other marital statuses, add validators for spouse name
        // this.personalForm.get('spouse_name')?.setValidators([Validators.required, noLeadingSpaces()]);
        this.personalForm.get('spouse_name')?.updateValueAndValidity();
      }
    });


  }

  ngOnInit(): void {

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
    this.getById();
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

  fromDate(e: any, i: any) {
    const formArray = this.personalForm.get('prev_employer_details') as FormArray;
    const formGroup = formArray.at(i) as FormGroup;
    formGroup.get('to_date')?.setValue(null)
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


        }
      }
    );
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
        }
      }
    );
  }

  presentCountryChange1(e: any) {
    this.presentCountryMethod1(e?.value);
  }
  presentCountryMethod1(id: any) {
    this._empRegistration.getStateByCountry(id).subscribe(
      (res: any) => {
        
        if (res && res?.data) {
          this.presentSteteData1 = res?.data;


        }
      }
    );
  }

  presentStateChange1(e: any) {
    this.presentGetCityByState1(e?.value);
  }
  presentGetCityByState1(id: any) {
    
    this._empRegistration.getCityByState(id).subscribe(
      (res: any) => {
        if (res && res?.data) {
          this.presentCityList1 = res?.data;
        }
      }
    );
  }

  onSubmitPersonal() {
    if (this.personalForm.invalid) {
      
      return this.toastr.error('Required fields should not be empty', 'Fields Error');
    }

    let val: any = this.personalForm.value;

    let req = {
      ...val,
      tab_type: "Personal",
      address_check_value: this.address_check_value ? 1 : 0,
    }
    ;
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
    this.$onboarding.register_onboarded_employee(req).subscribe(
      (res: any) => {
        this.personalForm?.patchValue(res);
        this.employee_id = res.employee_id;
        this.toastr.success('Updated Successfully..');

        this.route.navigate(
          ['create-employee-module/employ/employee-create/payment-details'],
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

  addRow() {
    const family_details = this.personalForm.get('family_details') as FormArray;
    if (family_details.value && family_details?.value.length > 0) {
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
            member_name: new FormControl(null,),
            date_of_birth: new FormControl(null,),
            relation: new FormControl(null,),
            contact_number: new FormControl(null),
            remark: new FormControl(null,),
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

  addRowEmploy() {

    const prev_employer_details = this.personalForm.get('prev_employer_details') as FormArray;


    if (prev_employer_details.value && prev_employer_details?.value.length > 0) {
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
            company_name: new FormControl(null,),
            position: new FormControl(null,),
            from_date: new FormControl(null,),
            to_date: new FormControl(null,),
            last_salary: new FormControl(null, [Validators.min(0)]),
            reason_of_leaving: new FormControl(null,),
            location: new FormControl(null,),
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
    ;
    if (this.CF_1.family_details.length >= 0) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You want be delete !",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#be0000',
        cancelButtonColor: '#5d6c7c',
        confirmButtonText: 'Delete'
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.CF_1.family_details.length >= 0) {
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
  countryFilter(e: any) {
    const aa = e
    let filteredVariable = this.checkData.filter((item: any) => aa.includes(item.countryss_name));
    this.countryList = filteredVariable
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
  deleteEmployerRow(i: number, d: any) {
    if (this.CF_1.prev_employer_details.length >= 0) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#be0000',
        cancelButtonColor: '#5d6c7c',
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
      if (this.singleData?.address_check_value) {
        this.address_check_value = true;
        this.showPermanent(this.address_check_value)
      }
      this.persnalDataPatch(this.singleData);
    })
  }

  getAllCountry() {
    this._empRegistration.getAllcountry().subscribe(
      (res: any) => {
        this.countryList = res.data;
        this.variables = this.countryList.map((res: any) => res.countryss_name)
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
      ['create-employee-module/employ/employee-create/payment-details'],
      { queryParams: { employee_id: this.employeGetID } }
    );
  }
  // Function to handle changes for present address
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
      // DIRE_number: presentData?.DIRE_number,
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
      // emirates_id_number: presentData?.emirates_id_number,
      // labour_card_number: presentData?.labour_card_number,
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
              emergency_contact: item?.emergency_contact
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
            position: item.position,
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
              position: item.position,
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
      ['/create-employee-module/employ/employee-create/basic-details'],
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
  countryCodeList: any = [];
  getAll_Country_codes() {
    this._configurationalMasterService.getAll_Country_codes().subscribe((res: any) => {
      this.countryCodeList = res.data
      console.log("dsdssdsd", this.countryCodeList)
    })
  }


}
