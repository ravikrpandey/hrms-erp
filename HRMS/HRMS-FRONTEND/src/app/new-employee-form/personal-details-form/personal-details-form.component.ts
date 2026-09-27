import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-personal-details-form',
  templateUrl: './personal-details-form.component.html',
  styleUrls: ['./personal-details-form.component.scss']
})
export class PersonalDetailsFormComponent {
  personalForm: FormGroup;
  personalFamilyForm: any;
  id: any;
  updateData: any;
  employeGetID: any;
  personalIdData: any;
  prasentData: any;
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

  countryList:any;
  stateList:any;
  cityList:any;
  pincodeList:any;
  checkvalue: any;
  getData: any;

  constructor(
    private fb: FormBuilder,
    // private locatin: Location,
    private toastr: ToastrService,
    private employService: EmpRegistrationService,
    private activetedRoute: ActivatedRoute,
    private route: Router,
    private recruitService: RecruitService,
    private _empRegistration: EmpRegistrationService,

  ) {
    this.personalForm = this.fb.group({
      alternate_number: new FormControl(null, Validators.pattern(/^[0-9]{10}$/)),
      blood_group: new FormControl(null, Validators.required),
      Marital_status: new FormControl(null, Validators.required),
      spouse_name: new FormControl(null),
      Pancard: new FormControl(null, [Validators.pattern('([A-Z]){5}([0-9]){4}([A-Z]){1}$'),]),
      Aadhar_card_number: new FormControl(null,[Validators.required,Validators.pattern(/^[0-9]*$/),Validators.maxLength(12)]),

      family_details: new FormArray([
        new FormGroup({
          family_member_name: new FormControl(null, [Validators.required]),
          date_of_birth: new FormControl(null, [Validators.required]),
          relation: new FormControl(null, [Validators.required]),
          contact_number: new FormControl(
            null,
            Validators.pattern(/^[0-9]{10}$/)
          ),
          remark: new FormControl(null, [Validators.required]),
        }),
      ]),
      country: new FormControl(null, [Validators.required]),
      state: new FormControl(null, [Validators.required]),
      city: new FormControl(null, [Validators.required]),
      current_address: new FormControl(null, Validators.required),
      pin_code:new FormControl(null,   [Validators.pattern(/^\d{3,9}$/),Validators.minLength(3),Validators.maxLength(9)]),   
      permanent_address: new FormControl(null),
      p_country: new FormControl(null),
      p_state: new FormControl(null),
      p_city: new FormControl(null),
      p_pin_code: new FormControl(null),

    });
  }
  employee_ids:any
  ngOnInit(): void {
    // this.activetedRoute.queryParams.subscribe((params: any) => {
    //   this.id = params;
    //   this.id = params.employee_id;
    // });
    this.id = localStorage.getItem('employee_id');
    console.log(this.id);
    
    if (this.id) {
      // this.show_region = true;
  this.employee_ids = this.id
      
      this.getOuterCondidateData(this.id)
    }
    this.getAllCountry();
  };

  get CF_1(): any {
    return this.personalForm.controls;
  };
  singleData: any;
  getOuterCondidateData(employee_id:any){

    this._empRegistration.getOuterEmployeeData(employee_id).subscribe((res:any)=>{
      console.log(res);
      
      this.singleData =res.data;
      console.log(this.singleData);
      
setTimeout(() => {
  this.basicFormPatch(res?.data)
}, 100);
this.personalForm.controls['country'].patchValue(Number(this.singleData?.country))
this.personalForm.controls['state'].patchValue(Number(this.singleData?.state))
this.personalForm.controls['city'].patchValue(Number(this.singleData?.city))
 
  

    })
  

  }
  basicFormPatch(apiData: any){
    console.log(apiData);
    this.getStateByCountry(Number(apiData?.country ||  apiData?.parmanent_address[0].p_country || apiData?.p_country ));
    this.getCityByState((Number(apiData?.state || apiData?.parmanent_address[0].p_state || apiData?.p_state)));
    this.personalForm.patchValue({
      alternate_number: apiData.alternate_mobile,
      blood_group: apiData.blood_group,
      Marital_status: apiData.maritial_status,
      spouse_name: apiData.spouse_name,
      Pancard: apiData.pan_number,
      Aadhar_card_number: apiData.adhar_number,
      country: apiData.country,
      state: apiData.state,
      city: apiData.city,
      current_address: apiData?.current_address[0]?.address || apiData.current_address  , // Assuming there's only one entry in the array
      pin_code: apiData?.current_address[0].pin_code || apiData.pin_code ,
      permanent_address: apiData?.parmanent_address[0].permanent_address || apiData?.permanent_address, // Assuming there's only one entry in the array
      p_country: apiData?.parmanent_address[0].p_country || apiData?.p_country,
      p_state: apiData?.parmanent_address[0].p_state || apiData?.p_state,
      p_city: apiData?.parmanent_address[0].p_city || apiData?.p.city,
      p_pin_code: apiData?.parmanent_address[0]?.p_pin_code || apiData?.p_pin_code,
    });
    const familyDetailsArray = this.personalForm.get('family_details') as FormArray;
    familyDetailsArray.clear(); // Clear existing entries if any
    if (apiData.family_details && apiData.family_details.length > 0) {
      apiData.family_details.forEach((familyMember: any) => {
        familyDetailsArray.push(this.fb.group({
          family_member_name: familyMember.family_member_name,
          date_of_birth: familyMember.date_of_birth,
          relation: familyMember.relation,
          contact_number: familyMember.contact_number,
          remark: familyMember.remark,
        }));
      });
    }
  }
  // onSubmitPersonal() {
  //   if(!this.personalForm.valid){
  //     this.toastr.error('Please Fill All Reqiuerd Field','Getting Is Empty')
  //     return 
  //   }
  //   let val = this.personalForm.value;
  //   this.recruitService.addPersonal(this.id, val).subscribe(  
  //     (res: any) => {
  //       this.updateData = res.data;
  //       this.toastr.success(
  //        res.message
  //       );
  //       this.route.navigate(['new-employee-form/previous-details-form'],      { queryParams: { id: this.id}})
        
  //     },
  //     (err:any) => {
  //       this.toastr.error(
  //         'Something went wrong, please try agian..!',
  //         'Error Massage'
  //       );
  //     }
  //   );


  
  // }

  onSubmitPersonal() {
    const familyDetailsArray = this.personalForm.get('family_details') as FormArray;
    familyDetailsArray.controls.forEach(control => {
      control.markAllAsTouched();
    });

    
    if(this.personalForm.invalid){
     this.toastr.error('Please Fill All Requierd Fields')
     return
    }
   

    let val = this.personalForm.value;
    let personal_data = {
      alternate_mobile:val.alternate_number,
      adhar_number:val.Aadhar_card_number,
      blood_group: val.blood_group,
      maritial_status: val.Marital_status,
      spouse_name:val.spouse_name,
      pan_number:val.Pancard, 
      family_details: val.family_details,
      permanent_address:[{
        permanent_address: val.permanent_address,
        p_country: val.p_country,
        p_state: val.p_state,
        p_city: val.p_city,
        p_pin_code: Number(this.pincodeEditWhileDisabled ? val.pin_code :val.p_pin_code ),
      
        address_check_value: this.pincodeEditWhileDisabled,  
      }],
      current_address:[{
        address: val.current_address,
        country: val.country,
        state: val.state,
        city: val.city,
        pin_code: +val.pin_code,
      }]
    }
    console.log(personal_data);

    this.employService.updateEmploypersonal_2(this.id, personal_data).subscribe(  
      (res: any) => {
       this.toastr.success(res.message)
       this.route.navigate(
        ['new-employee-form/previous-details-form'],
        { queryParams: { employee_id: this.id } }
      );
      },
      (err) => {
        this.toastr.error(
          'Something went wrong, please try agian..!',
          'Error Massage'
        );
      }
    );

  }

  getAllCountry() {
    this.employService.getAllcountry().subscribe(
      (res: any) => {
        this.countryList = res.data;
      })
  };

  addRow() {
      <FormArray>this.CF_1.family_details.push(
        new FormGroup({
          family_member_name: new FormControl(null, [Validators.required]),
          date_of_birth: new FormControl(null, [Validators.required]),
          relation: new FormControl(null, [Validators.required]),
          contact_number: new FormControl(null, [Validators.required,Validators.pattern(/^[0-9]{10}$/)]),
          remark: new FormControl(null, [Validators.required]),
        })
      );
  }


  deletefamily_details(i: number, d: any) {
    if (this.CF_1.family_details.length > 1) {
      <FormArray>this.CF_1.family_details.removeAt(i);
    } else {
      this.toastr.error("Can't Deleted", 'must be one');
    }
  }
  pincodeEditWhileDisabled = false;
  resetFlags() {
    this.pincodeEditWhileDisabled = false; // Resetting the flag for pincode changes
    // Reset other flags if needed
}
  sameAddress(event:any){

    if (event?.checked) {
      // Set permanent address fields
      this.pincodeEditWhileDisabled = true;
      this.personalForm.controls['permanent_address'].setValue(this.personalForm.value.current_address);
      this.personalForm.controls['p_country'].setValue(this.personalForm.value.country);
      this.personalForm.controls['p_state'].setValue(this.personalForm.value.state);
      this.personalForm.controls['p_city'].setValue(this.personalForm.value.city);
      this.personalForm.controls['p_pin_code'].setValue(this.personalForm.value.pin_code);
      this.personalForm.controls['p_pin_code'].disable();
  } else {
      // Clear permanent address fields
      this.personalForm.controls['permanent_address'].setValue(undefined);
      this.personalForm.controls['p_country'].setValue(undefined);
      this.personalForm.controls['p_state'].setValue(undefined);
      this.personalForm.controls['p_city'].setValue(undefined);
      this.personalForm.controls['p_pin_code'].setValue(undefined);

      this.personalForm.controls['p_pin_code'].enable();
      this.resetFlags(); // For example, resetting the flag for pincode changes
  }
}
    
 
  
    
  

  countryChange(e: any) {

    this.getStateByCountry(e.value);
  };

  stateChange(e: any) {

    this.getCityByState(e.value);
  }

  getStateByCountry(id: any) {
    this.employService.getStateByCountry(id).subscribe(
      (res: any) => {
        this.stateList = res.data;
      }
    )
  };

  getCityByState(id: any) {
    this.employService.getCityByState(id).subscribe(
      (res: any) => {
        this.cityList = res.data;
      }
    )
  };
  
}
