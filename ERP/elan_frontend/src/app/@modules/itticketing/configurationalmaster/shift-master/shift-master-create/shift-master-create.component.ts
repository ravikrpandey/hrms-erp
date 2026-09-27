import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
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
  selector: 'app-shift-master-create',
  templateUrl: './shift-master-create.component.html',
  styleUrls: ['./shift-master-create.component.scss']
})
export class ShiftMasterCreateComponent {
  shiftForm: any;
  shiftMasterForm: any;
  shiftId: any;
  parm: any;
  getData: any;
  propertyManager: any;
  firstLastName: any;
  personalIdData: any;
  wordCount: any;
  loginUser: any;
  @ViewChild("text") text: ElementRef;
  words: any;
  extraWords: boolean = false;
  entity_id: any;
  financial_id: any;
  actionMode: any;
  constructor(private fb: FormBuilder,
    private router: Router,
    private activetedRoute: ActivatedRoute,
    private _configurationalMasterService: ConfigurationalmasterService,
    private toast: ToastrService,
    private _empRegistration: EmpRegistrationService,
    private location: Location
  ) {
    this.entity_id = localStorage.getItem("selectedEntityId");
    this.financial_id =  localStorage.getItem("financial_id");
    // shiftMasterForm
    this.shiftMasterForm = this.fb.group({
      shift_name: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      shift_from_time: new FormControl(null, [Validators.required]),
      shift_to_time: new FormControl(null, [Validators.required]),
      working_hour: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      financial_year_id: new FormControl(this.financial_id),
      entity_id: new FormControl(this.entity_id),
    })
  }

  ngOnInit(): void {
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);
    this.activetedRoute.queryParams.subscribe((params: any) => {
      this.parm = params;
      this.shiftId = params.id;
      this.actionMode = params.action;
    })
    if (this.shiftId) {
      this.getByIdUse();
    }
    this._empRegistration.grtEmployeeList(this.entity_id, this.loginUser?.role).subscribe((res: any) => {

      this.personalIdData = res.data;
      this.propertyManager = Array.from(this.personalIdData, (a: any) => `${a.first_name} ${a.last_name}`)

    })

    this._empRegistration.getByUserId(localStorage.getItem('EmpMainId')).subscribe((res: any) => {

      this.getData = res.data.first_name;
      this.shiftMasterForm?.controls['requester']?.setValue(this.getData);
    })
  }

  goBack() {
    this.location.back();
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

  getByIdUse() {
    this._configurationalMasterService.getByIdShift(this.shiftId).subscribe((res: any) => {
      this.getData = res.data;
      this.basicFormPatch(this.getData)
    })
  }

  basicFormPatch(getData: any) {
    const shiftTime = getData?.shift_time;
    const times = shiftTime.split(" to ");
    const startTime = times[0]; 
    const endTime = times[1]; 
    this.shiftMasterForm.patchValue({
      shift_name: getData?.shift_name,
      shift_from_time: startTime,
      shift_to_time: endTime,
      working_hour: getData?.shift_duration,
      description: getData?.description,
    })
  }

  updateForm(e: any) {
    if (this.shiftMasterForm.invalid) {
      this.toast.error('required fields should not be blank', 'Required fields');
      return
    }
    e.stopPropagation();
    this._configurationalMasterService.updateShift(this.shiftId, this.shiftMasterForm.value).subscribe((res: any) => {
      this.toast.success("Shift Master Updated successfully", "Updated successfully")
      this.router.navigate(['master/configurational-master/shift-master']);


    }, (err) => {

      this.toast.error("Something went wrong please try again", "Error Massage");
    }

    )
  }

  onSubmitForm() {
    let val = this.shiftMasterForm.value;
    if (this.shiftMasterForm.invalid) {
      this.toast.error('required fields should not be blank', 'Required fields');
      return
    }
    this._configurationalMasterService.createShift(val).subscribe((res: any) => {

      this.toast.success("Shift Master created successfully", "Created Successfully");
      this.router.navigate(['master/configurational-master/shift-master']);
    }, (err) => {

      if (err.error.code === 403) {
        this.toast.error(`${err.error.message}`, "Error Massage");
      } else {
        this.toast.error("Something went wrong please try again", "Error Massage");
      }
    }
    )
  }
}
