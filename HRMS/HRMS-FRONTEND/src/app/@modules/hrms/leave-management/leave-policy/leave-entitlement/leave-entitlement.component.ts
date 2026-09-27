import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { LeaveManagementService } from 'src/app/@shared/services/leave-managemnet/leave-management.service';
import { ToastrService } from 'ngx-toastr';


interface QueryParams {
  leaveId?: string;
  mode?: string;
}


@Component({
  selector: 'app-leave-entitlement',
  templateUrl: './leave-entitlement.component.html',
  styleUrls: ['./leave-entitlement.component.scss']
})


export class LeaveEntitlementComponent implements OnInit {
  leaveForm: FormGroup;
  mode: boolean = false; // Assuming this is for readonly mode

  now = new Date();
  year = this.now.getFullYear();
  month = this.now.getMonth();
  date = this.now.getDate();
  max = moment({ year: this.year - 18, month: this.month, date: this.date }).format('YYYY-MM-DD');
  carryForward: boolean = false;
  // encashCheck: boolean = false;
  leavesMaster: any;
  entitlementDetails: any;
  routeLeaveId: any;
  pageMode: any;
  showUpdate: boolean;
  formData: any;
  entity_id: any;
  financial_id: any;
  employeeId: any;
  modeReadOnly: any = 0;


  constructor(private fb: FormBuilder, private router: Router,
    private leaveManagementService: LeaveManagementService, private activeroute: ActivatedRoute, private toastr: ToastrService,) {

    this.leaveForm = this.fb.group({
      effective_after: ['', Validators.required],
      period: ['', Validators.required],
      fromType: ['', Validators.required],
      carryForward: [false],
      carryForwardValue: [''],
      carryForwardType: [''],
      carryForwardMaxValue: [''],
      is_encash: [false],
      encash_val: [''],
      encash_type: [''],
      encash_max_val: [''],
      // carryForwardMaxmonth: [''],
      // encashValue: [''],
      // encashType: [''],
      // encashMaxValue: ['']
    });


  }

  ngOnInit() {

    this.leaveManagementService.changeMessage('Policy Entitlement');
    // //  Fetching leaveID from the params
    // this.activeroute.params.subscribe((params: any) => {
    //   this.routeLeaveId = Number(params?.leaveId);

    //   this.getPolicyEntitlement(this.routeLeaveId);

    // })

    //LOCAL STORAGE DATA============

    this.entity_id = localStorage.getItem('selectedEntityId')
    this.financial_id = localStorage.getItem('financial_id')

    let localStorageJSON: any = localStorage.getItem('signInUser')
    // Parse the JSON string into an object
    const jsonObject = JSON.parse(localStorageJSON);
    // Extract the employee_id
    this.employeeId = jsonObject.employee_id;

    this.activeroute.queryParams.subscribe(params => {
      const queryParams: QueryParams = params;
      this.routeLeaveId = queryParams.leaveId;
      if (this.routeLeaveId) {
        this.getPolicyEntitlement(this.routeLeaveId)
      }
      this.pageMode = queryParams.mode;

      if (this.pageMode === 'viewMode') {
        // this.leaveForm.disable();
      }
      // console.log("routeLeaveId===>", this.routeLeaveId);
      // console.log("mode===>", this.pageMode);
    });


    //  VALIDATIONS AND CHECKS FOR FORM
    // ----carryForward

    // CarryForwardType - Dynamic validator for maxValue field
    this.leaveForm.get('carryForwardType')?.valueChanges.subscribe((type) => {
      const carryForwardEnabled = this.leaveForm.get('carryForward')?.value;
      const maxValueControl = this.leaveForm.get('carryForwardMaxValue');

      if (carryForwardEnabled && type === 'PERCENT') {
        maxValueControl?.setValidators([Validators.required]);
      } else {
        maxValueControl?.clearValidators();
        maxValueControl?.setValue(null); // Optional: clear value if not needed
      }

      maxValueControl?.updateValueAndValidity();
    });


    this.leaveForm.get('carryForward')?.valueChanges.subscribe((checked: any) => {
      if (checked) {
        this.leaveForm.get('carryForwardValue')?.setValidators([Validators.required]);
        this.leaveForm.get('carryForwardType')?.setValidators([Validators.required]);

        const type = this.leaveForm.get('carryForwardType')?.value;
        const maxValueControl = this.leaveForm.get('carryForwardMaxValue');

        if (type === 'PERCENT') {
          maxValueControl?.setValidators([Validators.required]);
        } else {
          maxValueControl?.clearValidators();
        }
      } else {
        this.leaveForm.get('carryForwardValue')?.clearValidators();
        this.leaveForm.get('carryForwardType')?.clearValidators();
        this.leaveForm.get('carryForwardMaxValue')?.clearValidators();

        this.leaveForm.get('carryForwardValue')?.reset();
        this.leaveForm.get('carryForwardType')?.reset();
        this.leaveForm.get('carryForwardMaxValue')?.reset();
      }

      this.leaveForm.get('carryForwardValue')?.updateValueAndValidity();
      this.leaveForm.get('carryForwardType')?.updateValueAndValidity();
      this.leaveForm.get('carryForwardMaxValue')?.updateValueAndValidity();


    });

    ///////////////////////////////////
     this.leaveForm.get('encash_type')?.valueChanges.subscribe((type) => {
      const temp = this.leaveForm.get('is_encash')?.value;
      const maxValueControl = this.leaveForm.get('encash_max_val');

      if (temp && type === 'PERCENT') {
        maxValueControl?.setValidators([Validators.required]);
      } else {
        maxValueControl?.clearValidators();
        maxValueControl?.setValue(null); // Optional: clear value if not needed
      }

      maxValueControl?.updateValueAndValidity();
    });


    this.leaveForm.get('is_encash')?.valueChanges.subscribe((checked: any) => {
      if (checked) {
        this.leaveForm.get('encash_val')?.setValidators([Validators.required]);
        this.leaveForm.get('encash_type')?.setValidators([Validators.required]);

        const type = this.leaveForm.get('encash_type')?.value;
        const maxValueControl = this.leaveForm.get('encash_max_val');

        if (type === 'PERCENT') {
          maxValueControl?.setValidators([Validators.required]);
        } else {
          maxValueControl?.clearValidators();
        }
      } else {
        this.leaveForm.get('encash_val')?.clearValidators();
        this.leaveForm.get('encash_type')?.clearValidators();
        this.leaveForm.get('encash_max_val')?.clearValidators();

        this.leaveForm.get('encash_val')?.reset();
        this.leaveForm.get('encash_type')?.reset();
        this.leaveForm.get('encash_max_val')?.reset();
      }

      this.leaveForm.get('encash_val')?.updateValueAndValidity();
      this.leaveForm.get('encash_type')?.updateValueAndValidity();
      this.leaveForm.get('encash_max_val')?.updateValueAndValidity();


    });


    // ----encash
    // this.leaveForm.get('encash')?.valueChanges.subscribe((checked: any) => {
    //   if (checked) {
    //     // this.leaveForm.get('encashValue')?.setValidators([Validators.required]);
    //     // this.leaveForm.get('encashType')?.setValidators([Validators.required]);
    //     // this.leaveForm.get('encashMaxValue')?.setValidators([Validators.required]);
    //     // this.leaveForm.get('encashValue')?.reset();
    //     // this.leaveForm.get('encashType')?.reset();
    //     // this.leaveForm.get('encashMaxValue')?.reset();
    //   } else {
    //     // this.leaveForm.get('encashValue')?.clearValidators();
    //     // this.leaveForm.get('encashType')?.clearValidators();
    //     // this.leaveForm.get('encashMaxValue')?.clearValidators();
    //     // this.leaveForm.get('encashValue')?.reset();
    //     // this.leaveForm.get('encashType')?.reset();
    //     // this.leaveForm.get('encashMaxValue')?.reset();
    //   }
    //   // this.leaveForm.get('encashValue')?.updateValueAndValidity();
    //   // this.leaveForm.get('encashType')?.updateValueAndValidity();
    //   // this.leaveForm.get('encashMaxValue')?.updateValueAndValidity();
    // });


  }




  // SETTING THE VALUE INTO THE FORM IF RESPONSE IS THERE 
  getPolicyEntitlement(leave_id: any) {

    this.leaveManagementService.GetLeaveEntitlementById(leave_id, this.financial_id, this.entity_id, this.employeeId).subscribe((res: any) => {

      this.formData = res.data;
      this.setFormValues(this.formData)

      // Check if leavesDetails has the expected properties
      // if (this.entitlementDetails && Object.keys(this.entitlementDetails).length > 0) {
      //   this.showUpdate = true;
      // }

    },
      (err: any) => {
        // if (err.error.message === "Leave not available") {
        //   this.router.navigate(['/master/hrms/leave-management/leave-policy']);
        // }
        console.log(err);
        // this.toastr.error(`${err.error.message}`);
      }
    );
  }




  // Method to set form values
  setFormValues(data: any) {

    // Check if encash fields are not null
    // const isEncashAvailable = data.encashValue !== null || data.encashType !== null || data.encashMaxValue !== null;
    // const isCarryAvailable = data.carryForwardValue !== null || data.carryForwardType !== null || data.carryForwardMaxValue !== null;

    // const isEncashAvailable = data.encash_leaves !== null && data.encash_mode !== null && data.encash_limit !== null;
    const isCarryAvailable = data.carry_unused_leaves !== null && data.unused_leaves_mode !== null;
    const isEncashAvailable = data.encash_val !== null && data.encash_type !== null;

    if (isEncashAvailable) {
      this.leaveForm.get('is_encash')?.setValue([null]);
    }

    if (isCarryAvailable) {
      this.leaveForm.get('carryForward')?.setValue([null]);
    }

    this.leaveForm.patchValue({
      effective_after: data.effective_value,
      period: data.effective_period,
      fromType: data.from,
      carryForwardValue: data.carry_unused_leaves,
      carryForwardType: data.unused_leaves_mode,
      carryForwardMaxValue: data.carry_unused_limit,
      encash_val: data.encash_val,
      encash_type: data.encash_type,
      encash_max_val: data.encash_max_val,
      // carryForwardMaxmonth: data.max_month_carry_forward,
      // encashValue: data.encash_leaves,
      // encashType: data.encash_mode,
      // encashMaxValue: data.encash_limit
    });

    this.showUpdate = true;

  }



  onSubmitForm() {
    // if (this.leaveForm.valid) {
    if (this.leaveForm.invalid) {
      this.leaveForm.markAllAsTouched();
      this.toastr.error('Please fill all required fields correctly.');
      return;
    }

    const formValues = this.leaveForm.value;
    // Convert empty strings to null
    for (const key in formValues) {
      if (formValues.hasOwnProperty(key) && formValues[key] === '') {
        formValues[key] = null;
      }
    }

    // Convert booleans to "1" or "0" for API payload
    formValues.carryForward = formValues.carryForward ? "1" : "0";
    // formValues.is_encash = formValues.is_encash ? "1" : "0";

    let leaveEntitlement = {
      "leaveId": this.routeLeaveId,
      "effective_value": formValues.effective_after, // YEAR or MONTHS or DAYS 
      "effective_period": formValues.period,  // DOJ or DOC
      "from": formValues.fromType,  // DOJ or DOC
      "carry_forward_leave": formValues.carryForwardValue,
      "carry_forward_mode": formValues.carryForwardType,  // UNIT or PERECENT 
      "max_carry_forward": formValues.carryForwardMaxValue,
      "encash_val": formValues.encash_val,
      "is_encash": formValues.is_encash ? "1" : "0",
      "encash_type": formValues.encash_type,  // UNIT or PERECENT 
      "encash_max_val": formValues.encash_max_val,
      // "max_month_carry_forward": formValues.carryForwardMaxmonth,
      // "encash_leave": formValues.encashValue,
      // "encash_mode": formValues.encashType,   // UNIT or PERCENT 
      // "max_encash": formValues.encashMaxValue,
      "financial_id": this.financial_id,
      "entity_id": this.entity_id,
      "employee_id": this.employeeId,
    };

    this.leaveManagementService.AddLeavePolicyEntitlement(leaveEntitlement).subscribe(
      (res: any) => {
        if (this.showUpdate === true) {
          this.router.navigate(['master/hrms/leave-management/leave-policy/policy-information/leave-applicability'],
            { queryParams: { leaveId: this.routeLeaveId, mode: this.pageMode } })
          return this.toastr.success('Policy entitlement updated successfully ');
        }


        this.router.navigate(['master/hrms/leave-management/leave-policy/policy-information/leave-applicability'],
          { queryParams: { leaveId: this.routeLeaveId, mode: this.pageMode } })
        return this.toastr.success('Policy entitlement added successfully ');
      },
      (err: any) => {

        if (err.error.message === 'Leave not available in this financial year or entity') {
          this.router.navigate(['/master/hrms/leave-management/leave-master']);
          return this.toastr.error(err.error.message);
        }


        return this.toastr.error(err.error.message);
      }
    );








    // } else {
    //   console.log("Form is invalid");
    // }
  }

  // Getter function for accessing form controls dynamically
  getFormControl(controlName: string): AbstractControl | null {
    return this.leaveForm.get(controlName);
  }
}
