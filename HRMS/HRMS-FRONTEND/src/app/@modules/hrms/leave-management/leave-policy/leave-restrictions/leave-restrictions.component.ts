import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LeaveManagementService } from 'src/app/@shared/services/leave-managemnet/leave-management.service';

export function leaveRequestValidator(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const maxLeaveRequest = formGroup.get('maxLeaveRequest')?.value;
    const minLeaveRequest = formGroup.get('minLeaveRequest')?.value;

    if (maxLeaveRequest != null && minLeaveRequest != null && maxLeaveRequest <= minLeaveRequest) {
      return { invalidLeaveRequest: true };
    }

    return null;
  };
}

interface QueryParams {
  leaveId?: string;
  mode?: string;
}

@Component({
  selector: 'app-leave-restrictions',
  templateUrl: './leave-restrictions.component.html',
  styleUrls: ['./leave-restrictions.component.scss']
})


export class LeaveRestrictionsComponent implements OnInit {
  form: FormGroup;
  pastCheck: boolean = false;
  futureCheck: boolean = false;
  pdCheck: boolean = false;
  fdCheck: boolean = false;
  leavesEntitlement: any;
  leavesDetails: boolean;
  showUpdate: boolean = false;
  routeLeaveId: any;
  durations: Array<any> = ["FULL DAY", "HALF DAY"];
  pageMode: any;
  financial_id: any;
  entity_id: any;
  employeeId: any;
  isDisabled: boolean;


  constructor(private fb: FormBuilder, private router: Router,
    private route: ActivatedRoute, private toaster: ToastrService,
    private leaveManagementService: LeaveManagementService) { }




  ngOnInit(): void {
    this.leaveManagementService.changeMessage('Policy Restrictions');
    // //  Fetching leaveID from the params
    // this.route.params.subscribe((params: any) => {
    //   this.routeLeaveId = Number(params?.leaveId);

    // })


    //LOCAL STORAGE DATA============

    this.entity_id = localStorage.getItem('selectedEntityId')
    this.financial_id = localStorage.getItem('financial_id')

    let localStorageJSON: any = localStorage.getItem('signInUser')
    // Parse the JSON string into an object
    const jsonObject = JSON.parse(localStorageJSON);
    // Extract the employee_id
    this.employeeId = jsonObject.employee_id;


    // console.log('entity_id :-', this.entity_id);
    // console.log('financial_id :-', this.financial_id);
    // console.log('employee_id :-', this.employeeId);
    //==============================



    this.route.queryParams.subscribe(params => {
      const queryParams: QueryParams = params;
      this.routeLeaveId = queryParams.leaveId;
      this.pageMode = queryParams.mode;

      if (this.pageMode === 'viewMode') {
        this.isDisabled = true;
      }
      // console.log("routeLeaveId===>", this.routeLeaveId);
      // console.log("mode===>", this.pageMode);
    });

    this.form = this.fb.group({
      duration: this.fb.array([], Validators.required),
      maxLeaveRequest: [{ value: null }],
      minLeaveRequest: [{ value: null }],
      PastDates: [{ value: null }],
      pastDateInput: [{ value: 0}],
      futureDays: [{ value: null }],
      futureDaysInput: [{ value: 0 }],
      futuredaysInAdvanceInput: [{ value: 0 }],
    }, { validator: leaveRequestValidator() });
    this.form.get('pastDateInput')?.setValue(0)
    this.form.get('futureDaysInput')?.setValue(0)
    this.form.get('futuredaysInAdvanceInput')?.setValue(0)
    this.form.get('maxLeaveRequest')?.setValidators([Validators.required]);
    this.form.get('minLeaveRequest')?.setValidators([Validators.required]);

    this.form.get('PastDates')?.setValue(false);
    this.form.get('futureDays')?.setValue(false);


    this.getPolicyRestrictions(this.routeLeaveId)   // routeLeaveId



    //  Validation in pastDays
    this.form.get('PastDates')?.valueChanges.subscribe((checked: any) => {
      if (checked) {
        this.form.get('pastDateInput')?.setValue(0)

        this.form.get('pastDateInput')?.setValidators([Validators.required]);
      } else {
        this.form.get('pastDateInput')?.clearValidators();
        this.form.get('pastDateInput')?.reset();
        this.form.get('pastDateInput')?.setValue(0)
      }


    });

    //  Validation in futureDays
    this.form.get('futureDays')?.valueChanges.subscribe((checked: any) => {
      if (checked) {
        this.form.get('futureDaysInput')?.setValue(0)
        this.form.get('futuredaysInAdvanceInput')?.setValue(0)

        this.form.get('futureDaysInput')?.setValidators([Validators.required])
        this.form.get('futuredaysInAdvanceInput')?.setValidators([Validators.required])
      } else {
        this.form.get('futureDaysInput')?.clearValidators()
        this.form.get('futureDaysInput')?.reset();
        this.form.get('pastDaysInput')?.setValue(0)
        this.form.get('futuredaysInAdvanceInput')?.clearValidators()
        this.form.get('futuredaysInAdvanceInput')?.reset();
        this.form.get('futuredaysInAdvanceInput')?.setValue(0);
      }
    });
this.form.get('PastDates')?.valueChanges.subscribe((checked: boolean) => {
  if (checked) {
    // Uncheck futureDays if PastDates is checked
    this.form.get('futureDays')?.setValue(false, { emitEvent: false });

    // Set validators on pastDateInput
    this.form.get('pastDateInput')?.setValidators([Validators.required, Validators.min(1)]);
    this.form.get('pastDateInput')?.updateValueAndValidity();

  } else {
    this.form.get('pastDateInput')?.clearValidators();
    this.form.get('pastDateInput')?.reset();
    this.form.get('pastDateInput')?.updateValueAndValidity();
  }
});

// When futureDays changes
this.form.get('futureDays')?.valueChanges.subscribe((checked: boolean) => {
  if (checked) {
    // Uncheck PastDates if futureDays is checked
    this.form.get('PastDates')?.setValue(false, { emitEvent: false });

    // Set validators on futureDays inputs
    this.form.get('futuredaysInAdvanceInput')?.setValidators([Validators.required, Validators.min(1)]);
    this.form.get('futuredaysInAdvanceInput')?.updateValueAndValidity();

  } else {
    this.form.get('futuredaysInAdvanceInput')?.clearValidators();
    this.form.get('futuredaysInAdvanceInput')?.reset();
    this.form.get('futuredaysInAdvanceInput')?.updateValueAndValidity();
  }
});
  }




  // Convenience getter for easy access to form controls
  get formControls() {
    return this.form.controls;
  }



  onCheckboxChange(event: any) {
    const duration: FormArray = this.form.get('duration') as FormArray;

    if (event.checked) {
      duration.push(this.fb.control(event.source.value));
    } else {
      const index = duration.controls.findIndex((x: any) => x.value === event.source.value);
      duration.removeAt(index);
    }
  }



  // Getter function for accessing form controls dynamically
  getFormControl(controlName: string): AbstractControl | null {
    return this.form.get(controlName);
  }



  // SETTING THE VALUE INTO THE FORM IF RESPONSE IS THERE 
  getPolicyRestrictions(leave_id: any) {
    this.leaveManagementService.GetLeaveRestrictionsById(leave_id, this.financial_id, this.entity_id, this.employeeId).subscribe((res: any) => {
      this.leavesEntitlement = res.data;
      if (this.leavesEntitlement.past_days === !0) {
        this.form.get('PastDates')?.setValue(true);
      }

      if (this.leavesEntitlement.future_next === !0 ||
        this.leavesEntitlement.future_advanceDays === !0
      ) {
        this.form.get('futureDays')?.setValue(true);
      }

      // Check if leavesDetails has the expected properties


      // Update the duration FormArray
      const durationArray = this.form.get('duration') as FormArray;
      durationArray.clear(); // Clear existing values

      this.leavesEntitlement.durations.forEach((ld: any) => {
        durationArray.push(this.fb.control(ld.duration)); // Add each duration to the FormArray
      });


      // this.form.get('duration')?.setValue(this.leavesEntitlement.durations);
      this.form.get('maxLeaveRequest')?.setValue(this.leavesEntitlement.maxRequest);
      this.form.get('minLeaveRequest')?.setValue(this.leavesEntitlement.minRequest);
      this.form.get('PastDates')?.setValue(this.leavesEntitlement.past_days);
      this.form.get('pastDateInput')?.setValue(this.leavesEntitlement.past_days);
      this.form.get('futureDays')?.setValue(this.leavesEntitlement.future_advanceDays);
      this.form.get('futureDaysInput')?.setValue(this.leavesEntitlement.future_next);
      this.form.get('futuredaysInAdvanceInput')?.setValue(this.leavesEntitlement.future_advanceDays);

      this.showUpdate = true;

      // this.toaster.success('Leave restrictions fetched successfully');

    },
      (err: any) => {

        // if (err.error.message === "Leave not available") {
        //   this.router.navigate(['/master/hrms/leave-management/leave-policy']);
        // }

        // this.toaster.error(`${err.error.message}`);
      }
    );
  }


  backToPolicyList() {
    this.router.navigate(['/master/hrms/leave-management/leave-policy']);
  }


  addPolicyRestrictions() {
    Object.keys(this.form.controls).forEach(control => {
      this.form.get(control)?.markAsTouched();
    });
    if ( this.form.invalid || (!this.formControls['duration'].value) ) {
      this.toaster.error("All Form fields should be valid")
      return;
    }
    let body = {}
    if ( this.showUpdate ) {
      body = {
        "leaveId": this.routeLeaveId,
        "financial_id": this.financial_id,
        "entity_id": this.entity_id,
        "employee_id": this.employeeId,
        "allowed_Duration": this.form.value.duration,     // 'FULL_DAY','HALF_DAY'
        "past_days": this.form.value.pastDateInput === null ? 0 : this.form.value.pastDateInput,
        "future_next": this.form.value.futureDaysInput === null ? 0 : this.form.value.futureDaysInput,
        "future_advanceDays": this.form.value.futuredaysInAdvanceInput === null ? 0 : this.form.value.futuredaysInAdvanceInput,
        "maxRequest": this.form.value.maxLeaveRequest === null ? null : this.form.value.maxLeaveRequest,
        "minRequest": this.form.value.minLeaveRequest === null ? null : this.form.value.minLeaveRequest
      }
    }else {
      body = {
        "leaveId": this.routeLeaveId,
        "financial_id": this.financial_id,
        "entity_id": this.entity_id,
        "employee_id": this.employeeId,
        "allowed_Duration": this.form.value.duration,     // 'FULL_DAY','HALF_DAY'
        "past_days": this.form.value.pastDateInput === null ? 0 : this.form.value.pastDateInput,
        "future_next": this.form.value.futureDaysInput === null ? 0 : this.form.value.futureDaysInput,
        "future_advanceDays": this.form.value.futuredaysInAdvanceInput === null ? 0 : this.form.value.futuredaysInAdvanceInput,
        "maxRequest": this.form.value.maxLeaveRequest === null ? null : this.form.value.maxLeaveRequest,
        "minRequest": this.form.value.minLeaveRequest === null ? null : this.form.value.minLeaveRequest
      }
    }

    this.leaveManagementService.AddLeavePolicyRestrictions(body).subscribe((res: any) => {
      this.router.navigate(['/master/hrms/leave-management/leave-policy']);

      if (this.showUpdate === true) {
        return this.toaster.success('Policy restrictions update successfully');
      }

      return this.toaster.success('Policy restrictions added successfully ');
    }, (err: any) => {

      if (err.error.message == 'Leave not available in this financial year or entity') {
        this.router.navigate(['/master/hrms/leave-management/leave-master']);
        return this.toaster.error(`${err.error.message}`);
      }

      this.toaster.error(`${err.error.message}`);
    }
    );



  }







}
