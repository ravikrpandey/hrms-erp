import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}
@Component({
  selector: 'app-plant-master-create',
  templateUrl: './plant-master-create.component.html',
  styleUrls: ['./plant-master-create.component.scss']
})
export class PlantMasterCreateComponent {
  plantMasterForm: any;
  plantMasterId: any;
  parm: any;
  getData: any;
  propertyManager: any;
  firstLastName: any;
  personalIdData: any;
  wordCount: any;

  @ViewChild("text") text: ElementRef;
  words: any;
  extraWords: boolean = false;

  asignData: any;
  asignvariables: any;
  asignvariable: any;
  uniqueId: any;
  uniquedata: any;
  variables: any = [];
  variable: any = [];
  countryList: any;
  phoneCode: any;
  newPhoneCode: string;
  stateList: any;
  stateVar: any = [];
  stateVar2: any = [];
  checkData: any;


  constructor(private fb: FormBuilder,
    private router: Router,
    private activetedRoute: ActivatedRoute,
    private emp_master: EmpMasterService,
    private toast: ToastrService,
    private locatin: Location,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _empRegistration: EmpRegistrationService,
    private recruitService: RecruitService,
    private location: Location
  ) {

    this.plantMasterForm = this.fb.group({
      plant_name: new FormControl(null, [Validators.required, noLeadingSpaces(), Validators.maxLength(150)]),
      country_id: new FormControl(null, [Validators.required]),
      state_id: new FormControl(null, [Validators.required]),
      plant_location: new FormControl(null, [Validators.required, noLeadingSpaces(), Validators.maxLength(150)]),
      plant_pincode: new FormControl(null, [Validators.required, noLeadingSpaces(), Validators.pattern(/^[0-9]*$/), Validators.maxLength(6)]),
      plant_address: new FormControl(null, [Validators.required, noLeadingSpaces(), Validators.maxLength(150)]),
      plant_contactno: new FormControl(null, [Validators.required,Validators.pattern(/^[0-9]{10}$/)]),
      plant_altcontactno: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
      plant_emailid: new FormControl(null, [Validators.required, Validators.email]),
      plant_headname: new FormControl(null, [Validators.required, noLeadingSpaces(), Validators.maxLength(150)]),
      plant_headcontactno: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
    })
  }

  ngOnInit(): void {
    this.activetedRoute.queryParams.subscribe((params: any) => {
      this.parm = params;
      this.plantMasterId = params.id;

    })
    this.getAssginSingle();
    this.getAllActiveCountry();
    if (this.plantMasterId) {
      this.getByIdPlantMaster();
      // this.getByUniqueNumber()

    }
  }
  getAllActiveCountry() {
    this._empRegistration.getAllActivecountry().subscribe(
      (res: any) => {
        this.countryList = res.data;
        this.variables = this.countryList.map((res: any) => res.countryss_name)
        this.checkData = this.countryList
        this.variable = this.countryList

      })
  };

  optionEaCode(event: any) {

    for (let item of this.countryList) {
      if (item.countryss_id == event?.value) {
        this.phoneCode = item?.phone_code;

      }
    }

    this.newPhoneCode = "+" + this.phoneCode;
    const code = this.newPhoneCode.toString();

    // this.basicForm.patchValue({
    //   mobile_code: this.newPhoneCode
    // })
    //   let newStatus = true;
    //   this.productselect.options.forEach((item: MatOption) => {
    //     if (!item.selected) {
    //       newStatus = false;
    //     }
    //   });
    //   this.allSelectedProduct = newStatus;

    this.getStateByCountry(event.value);
  }

  getStateByCountry(id: any) {

    this._empRegistration.getStateByCountry(id).subscribe(
      (res: any) => {
        this.stateList = res.data;
        this.stateVar = this.stateList.map((res: any) => res.states_name);
        this.stateVar2 = this.stateList;

        if (this.getData) {
          this.plantMasterForm.controls['state_id'].patchValue(Number(this.getData?.state_id))
        }
      }
    )
  };

  countryFilter(e: any) {

    const aa = e
    let filteredVariable = this.variable.filter((item: any) => aa.includes(item.countryss_name));
    this.checkData = filteredVariable
  }

  stateFilter(e: any) {
    const aa = e
    let filteredVariable = this.stateVar2.filter((item: any) => aa.includes(item.states_name));
    this.stateList = filteredVariable
  }

  goBack() {
    this.location.back();
  }
  getAssginSingle() {
    this.recruitService.getSpocRecruipment().subscribe((res: any) => {
      this.asignData = res.data;
      this.asignvariables = this.asignData.map((res: any) => res.first_name)
      this.asignvariable = this.asignData

    });
  }

  wordCounter() {
    //alert(this.text.nativeElement.value)
    this.wordCount = this.text ? this.text.nativeElement.value.split(/\s+/) : 0;
    this.words = this.wordCount ? this.wordCount.length : 0;
  }

  changedText() {
    if (this.words >= 50) {
      this.extraWords = true;
      this.toast.warning('Please enter within the text limit..', 'Warning Message');
      return
    } else if (this.words < 50) {
      this.extraWords = false;
    }
  }

  back() {
    history.back()
  }

  getByIdPlantMaster() {
    this._configurationalMasterService.getByIdPlantMaster(this.plantMasterId).subscribe((res: any) => {
      this.getData = res.data;
      // console.log(this.asignData);


      // console.log(this.getData);
      // this.getAssginSingle()
      this.basicFormPatch(this.getData)
      this.getStateByCountry(this.getData.country_id)
    })
  }

  AutoGenerateRequestNo() {
    this.emp_master.AutoGenerateRequestNo().subscribe((response: any) => {

      const apiRequestNo = response.data;
      // this.plantMasterForm.patchValue({
      //   request_no: apiRequestNo
      // });
      // this.plantMasterForm.controls['request_no'].disable();
    },
      (error) => {
        // Handle error
      }
    )
  }

  // getByUniqueNumber() {
  //   this.emp_master.getByUniqueNumber(this.plantMasterId).subscribe((res: any) => {
  //     console.log(res, 'res');
  //     this.uniqueId = res?.data;
  //     this.plantMasterForm.patchValue({
  //       request_no: this.uniqueId
  //     });
  //     this.plantMasterForm.controls['request_no'].disable();
  //   })
  // }

  basicFormPatch(getData: any) {

    this.plantMasterForm.patchValue({
      plant_name: getData?.plant_name,
      country_id: getData?.country_id,
      state_id: getData?.state_id,
      plant_location: getData?.plant_location,
      plant_pincode: getData?.plant_pincode,
      plant_address: getData?.plant_address,
      plant_contactno: getData?.plant_contactno,
      plant_altcontactno: getData?.plant_altcontactno,
      plant_emailid: getData?.plant_emailid,
      plant_headname: getData?.plant_headname,
      plant_headcontactno: getData?.plant_headcontactno,
    })
  }

  updateForm(e: any) {
    if (this.plantMasterForm.invalid) {
      this.toast.error('required fields should not be blank', 'Required fields');
      return
    }
    e.stopPropagation();
    this._configurationalMasterService.updatePlantMaster(this.plantMasterId, this.plantMasterForm.value).subscribe((res: any) => {
      this.toast.success("Plant Master Details Updated successfully", "Updated successfully")
      this.router.navigate(['master/configurational-master/plant-master']);


    }, (err) => {

      this.toast.error("Something went wrong please try again", "Error Massage");
    }

    )
  }

  onSubmitForm() {
    let val = this.plantMasterForm.value;
    if (this.plantMasterForm.invalid) {
      this.toast.error('required fields should not be blank', 'Required fields');
      return
    }
    this._configurationalMasterService.createPlantMaster(val).subscribe((res: any) => {

      this.toast.success("Plant Master created successfully", "Created Successfully");
      this.router.navigate(['master/configurational-master/plant-master']);
    }, (err) => {

      if (err.error.code === 403) {
        this.toast.error(`${err.error.message}`, "Error Massage");
      } else {
        this.toast.error("Something went wrong please try again", "Error Massage");
      }
    }
    )
  }

  // getuniqueNumber() {
  //   this.emp_master.getUniqueNumber().subscribe((res: any) => {
  //     console.log(res, 'res');
  //     this.uniquedata = res.data;

  //     this.plantMasterForm.patchValue({
  //       request_no: this.uniquedata
  //     });
  //     this.plantMasterForm.controls['request_no'].disable();
  //   })
  // }
}
