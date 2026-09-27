import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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
  selector: 'app-vehicle-registration-create',
  templateUrl: './vehicle-registration-create.component.html',
  styleUrls: ['./vehicle-registration-create.component.scss']
})
export class VehicleRegistrationCreateComponent {

  vehicleRegistrationForm: any;
  id: any;
  mode:any;
  parm: any;
  getData: any;
  @ViewChild("text") text: ElementRef;
  asignData: any;
  asignvariables: any;
  asignvariable: any;
  nameSearch: any = '';
  maxDate: Date;
  constructor(private fb: FormBuilder,
    private router: Router,
    private activetedRoute: ActivatedRoute,
    private emp_master: EmpMasterService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private toast: ToastrService,
    private locatin: Location,
    private _empRegistration: EmpRegistrationService,
    private recruitService: RecruitService,
    private location: Location
  ) {
    // vehicleRegistrationForm
    this.maxDate = new Date();
    this.vehicleRegistrationForm = this.fb.group({
      registration_number: new FormControl(null, [Validators.required,noLeadingSpaces()]),
      vehicle_name: new FormControl(null, [Validators.required,noLeadingSpaces()]),
      model_year: new FormControl(null, [Validators.required]),
      tuv_validity: new FormControl(null, [Validators.required,noLeadingSpaces()]),
      model: new FormControl(null, [Validators.required,noLeadingSpaces()]),
      purchase_date: new FormControl(null, [Validators.required]),
      registration_date: new FormControl(null, [Validators.required]),
      chassis_number: new FormControl(null, [Validators.required,noLeadingSpaces()]),
      cs_number: new FormControl(null, [Validators.required,noLeadingSpaces()]),
      fuel_type: new FormControl(null, [Validators.required,noLeadingSpaces()]),
    })
  }

  ngOnInit(): void {
    this.activetedRoute.queryParams.subscribe((params: any) => {
      this.parm = params;
      this.id = params.id;
      this.mode = params.mode;
    })
    this.getAllVehicleRegistration();
    this.getAssginSingle();
    if (this.id) {
      this.getByIdUse();
    }
  }
  getAllVehicleRegistration(){
    // this._configurationalMasterService.getAllVehicleRegistration().subscribe((res: any) => {
    //   const aa = res.data;
    // })
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
  back() {
    history.back()
  }
  getByIdUse() {
    this._configurationalMasterService.getByIdVehicleRegistration(this.id).subscribe((res: any) => {
      this.getData = res.data;
      this.basicFormPatch(this.getData)
    })
  }
  
  basicFormPatch(getData: any) {
    this.vehicleRegistrationForm.patchValue({
        registration_number: getData.registration_number,
        vehicle_name: getData.vehicle_name,
        model_year: getData.model_year,
        tuv_validity: getData.tuv_validity,
        model: getData.model,
        purchase_date: getData.purchase_date,
        registration_date: getData.registration_date,
        chassis_number: getData.chassis_number,
        cs_number: getData.cs_number,
        fuel_type: getData.fuel_type,
    })
  }
  updateForm(e: any) {
    e.stopPropagation();
    if (this.vehicleRegistrationForm.invalid) {
      this.toast.error('required fields should not be blank', 'Required fields');
      return
    }
    let data = this.vehicleRegistrationForm.value;
    data.id = data.vehicle_registration_id;
    this._configurationalMasterService.updateVehicleRegistration(this.id, data).subscribe((res: any) => {
      this.toast.success("Vehicle Registration Updated successfully", "Updated successfully")
      this.router.navigate(['master/configurational-master/vehicle-registration']);
    }, (err) => {
      this.toast.error(`${err.error.message}`, "Error Massage");
    }
    )
  }
  onSubmitForm() {
    let val = this.vehicleRegistrationForm.value;
    if (this.vehicleRegistrationForm.invalid) {
      this.toast.error('required fields should not be blank', 'Required fields');
      return
    }
    this._configurationalMasterService.CreateVehicleRegistration(val).subscribe((res: any) => {

      this.toast.success("Vehicle Registration created successfully", "Created Successfully");
      this.router.navigate(['master/configurational-master/vehicle-registration']);
    }, (err) => {

      if (err.error.code === 403) {
        this.toast.error(`${err.error.message}`, "Error Massage");
      } else {
        this.toast.error(`${err.error.message}`, "Error Massage");
      }
    }
    )
  }
}


