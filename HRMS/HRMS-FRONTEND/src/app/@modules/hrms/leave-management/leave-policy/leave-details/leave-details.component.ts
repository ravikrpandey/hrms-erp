import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { LeaveManagementService } from 'src/app/@shared/services/leave-managemnet/leave-management.service';
import Swal from 'sweetalert2';

interface QueryParams {
  leaveId?: string;
  mode?: string;
}

@Component({
  selector: 'app-leave-details',
  templateUrl: './leave-details.component.html',
  styleUrls: ['./leave-details.component.scss'],
})
export class LeaveDetailsComponent implements OnInit {
  leaveForm: FormGroup;
  mode: boolean = false;
  selectedLeave: any;
  leavesMaster: any = [];
  leaveTypes: any = ['PAID', 'NON PAID', 'HALF PAID'];
  responseData: any;
  rowData: any;
  routeLeaveId: any;
  endDateValue: null;
  policyDetailId: any;
  policy_id: any;
  isEndDateTouched: boolean = false; // Add this flag
  formData: any;
  inputOnly: any = true;
  showUpdateButton: boolean;
  checkBox: boolean;
  now = new Date();
  min = moment().format('YYYY-MM-DD');
  selectedLeaveName: any;
  updateId: boolean = true;
  entity_id: string | null;
  financial_id: string | null;
  employeeId: any;
  pageMode: string | undefined;
  leavesMaster2: any;
  leaves: any;

  constructor(
    private leaveManagementService: LeaveManagementService,
    private fb: FormBuilder,
    private router: Router,
    private toaster: ToastrService,
    private route: ActivatedRoute,
    private activeroute: ActivatedRoute
  ) {
    this.leaveForm = this.fb.group({
      leaveName: ['', Validators.required],
      leaveInputName: [''],
      leaveType: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [],
      onceInServiceLeave: [false],
      isQuotaAllotedMonthly: [false],
      includeWeekendHoliday: [false],
      isApplAftrProb: [false],
      policyValidity: [false],
    });

    // Update minEndDate whenever startDate changes
    this.leaveForm
      .get('startDate')
      ?.valueChanges.subscribe((startDate: Date | null) => {
        console.log('function racher here');
        if (startDate) {
          console.log('functof sdn');
          const minDate = new Date(startDate);
          minDate.setUTCDate(minDate.getUTCDate() + 1);
          this.min = moment(minDate).format('YYYY-MM-DD');
          console.log('Minimum Date:', this.min); // Debug log
        } else {
          this.min = moment().format('YYYY-MM-DD');
        }
      });
      

    //LOCAL STORAGE DATA============

    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_id = localStorage.getItem('financial_id');

    let localStorageJSON: any = localStorage.getItem('signInUser');
    // Parse the JSON string into an object
    const jsonObject = JSON.parse(localStorageJSON);
    // Extract the employee_id
    this.employeeId = jsonObject.employee_id;

    // console.log('entity_id :-', this.entity_id);
    // console.log('financial_id :-', this.financial_id);
    // console.log('employee_id :-', this.employeeId);

    //==============================
  }

  ngOnInit() {
    this.leaveManagementService.changeMessage('Policy Detail');
    // // Fetching leaveID from the params
    // this.activeroute.params.subscribe((params: any) => {
    //   this.routeLeaveId = Number(params?.leaveId);
    //   // console.log(this.routeLeaveId);

    //   if (Number.isNaN(this.routeLeaveId) || this.routeLeaveId === undefined || this.routeLeaveId === null) {
    //     this.updateId = false;
    //   }
    // });

    //LOCAL STORAGE DATA============

    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_id = localStorage.getItem('financial_id');

    let localStorageJSON: any = localStorage.getItem('signInUser');
    // Parse the JSON string into an object
    const jsonObject = JSON.parse(localStorageJSON);
    // Extract the employee_id
    this.employeeId = jsonObject.employee_id;

    // console.log('entity_id :-', this.entity_id);
    // console.log('financial_id :-', this.financial_id);
    // console.log('employee_id :-', this.employeeId);
    //==============================

    this.activeroute.queryParams.subscribe((params) => {
      const queryParams: QueryParams = params;
      this.routeLeaveId = queryParams.leaveId;
      this.pageMode = queryParams.mode;
    });

    this.getData();

    this.getPolicyDetail(
      this.routeLeaveId,
      this.financial_id,
      this.entity_id,
      this.employeeId
    );

    // Subscribe to changes in the leaveName control
    this.leaveForm.get('leaveName')?.valueChanges.subscribe((value: any) => {
      if (value) {
        this.routeLeaveId = value;
      }
    });

    // Subscribe to changes in the policyValidity control
    this.leaveForm
      .get('policyValidity')
      ?.valueChanges.subscribe((value: any) => {
        if (value) {
          this.leaveForm.get('endDate')?.setValue('');
          this.isEndDateTouched = true; // Ensure that the endDate field is considered touched

          this.onPolicyValidityChange(value);
        }
      });

    // Subscribe to changes in the startDate and endDate controls
    this.leaveForm.get('startDate')?.valueChanges.subscribe((value) => {
      // this.checkDateValidity();
    });

    // Subscribe to changes in the endDate control
    this.leaveForm.get('endDate')?.valueChanges.subscribe((value: any) => {
      console.log('VALUE =', value);

      this.isEndDateTouched = true;
      // this.checkDateValidity();
    });

    this.leaveForm.get('endDate')?.markAsUntouched(); // Initialize as untouched
    this.leaveForm.get('startDate')?.markAsUntouched();
    // Set form values if formData is available
    if (this.formData && Object.keys(this.formData).length > 0) {
      this.setFormValues(this.formData);
    }
  }

  onDateChange = (event: any) => {
    const selectedDate = event.value; // The selected date value
    if (selectedDate) {
      const date = new Date(selectedDate);
      const year = date.getFullYear();
      const month = date.getMonth(); // Month is 0-based
      const day = date.getDate();
      const dateAtMidnight = new Date(Date.UTC(year, month, day));
      this.leaveForm.controls['startDate'].setValue(dateAtMidnight);
      if (dateAtMidnight) {
        console.log('functof sdn');
        const minDate = new Date(dateAtMidnight);
        minDate.setUTCDate(minDate.getUTCDate() + 1);
        this.min = moment(minDate).format('YYYY-MM-DD');
        console.log('Minimum Date:', this.min); // Debug log
      } else {
        this.min = moment().format('YYYY-MM-DD');
      }
    }

    this.leaveForm.get('endDate')?.setValue(null);
  };
  onDateChange2 = (event: any) => {
    const selectedDate = event.value; // The selected date value
    if (selectedDate) {
      const date = new Date(selectedDate);
      const year = date.getFullYear();
      const month = date.getMonth(); // Month is 0-based
      const day = date.getDate();
      const dateAtMidnight = new Date(Date.UTC(year, month, day));
      this.leaveForm.controls['endDate'].setValue(dateAtMidnight);
    }
  };

  // Method to check date validity
  checkDateValidity(): void {
    const startDateStr = this.leaveForm.get('startDate')?.value;
    const endDateStr = this.leaveForm.get('endDate')?.value;

    console.log('StartDate (raw) = ', startDateStr);
    console.log('EndDate (raw) = ', endDateStr);

    // Helper function to convert ISO string to YYYY-MM-DD format
    const formatToYYYYMMDD = (isoDateStr: string) => {
      return new Date(isoDateStr).toISOString().split('T')[0];
    };

    // Convert dates to YYYY-MM-DD format if in ISO format
    const formattedStartDate = startDateStr
      ? formatToYYYYMMDD(startDateStr)
      : '';
    const formattedEndDate = endDateStr ? formatToYYYYMMDD(endDateStr) : '';

    console.log('StartDate (formatted) = ', formattedStartDate);
    console.log('EndDate (formatted) = ', formattedEndDate);

    // Regular expression to check YYYY-MM-DD format
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    // Ensure dates are in the correct format before comparison
    if (
      datePattern.test(formattedStartDate) &&
      datePattern.test(formattedEndDate)
    ) {
      const startDate = new Date(formattedStartDate);
      const endDate = new Date(formattedEndDate);

      // Ensure the parsed dates are valid
      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        if (startDate > endDate) {
          // Reset the endDate if startDate is greater
          this.leaveForm.get('endDate')?.setValue('');
          this.leaveForm.get('endDate')?.markAsTouched();
          this.leaveForm.get('endDate')?.updateValueAndValidity();
        }
      }
    } else {
      console.error('Invalid date format. Dates must be in YYYY-MM-DD format.');
    }
  }

  // Convenience getter for easy access to form controls
  get formControls() {
    return this.leaveForm.controls;
  }

  getPolicyDetail(
    policy_id: any,
    financial_id: any,
    entity_id: any,
    employee_id: any
  ) {
    this.leaveManagementService
      .GetLeavePolicyDetail(policy_id, financial_id, entity_id, employee_id)
      .subscribe(
        (res: any) => {
          this.formData = res.data;
          if (this.formData && Object.keys(this.formData).length > 0) {
            this.showUpdateButton = true;
            this.setFormValues(this.formData);
          }

          if (this.pageMode === 'viewMode') {
            this.leaveForm.disable();
          }
        },
        (err: any) => {
          console.log('Policy Detail => ', err.error.message);
        }
      );
  }

  filterLeavemaster:any
  getData() {
    this.leaveManagementService
      .GetLeavePolicyList(0, this.financial_id, this.entity_id, this.employeeId)
      .subscribe(
        (res: any) => {
          this.leavesMaster = res.data;
          this.filterLeavemaster = [...this.leavesMaster]
          this.leavesMaster2 = res.data;
          this.leaves = this.leavesMaster2.map((res: any) => res.leave_name);
          // this.toaster.success(`Leave list fetched succesfully`);
        },
        (err: any) => {
          // this.toaster.error(`${err.error.message}`);
        }
      );
  }

  // Method to set form values
  setFormValues(data: any) {
    let setFormData = data[0];
    this.selectedLeave = setFormData.HRMS_LEAVE_MASTER.leaveId;
    this.selectedLeaveName = setFormData.HRMS_LEAVE_MASTER.leave_name;

    if (setFormData && Object.keys(setFormData).length > 0) {
      this.showUpdateButton = true;

      if (setFormData.policy_validity == '1') {
        this.checkBox = true;

        this.leaveForm = this.fb.group({
          leaveName: setFormData.HRMS_LEAVE_MASTER.leave_name,
          leaveInputName: `${setFormData.HRMS_LEAVE_MASTER.leave_name} (${setFormData.HRMS_LEAVE_MASTER.leave_code})`,
          leaveType: setFormData.leave_type,
          onceInServiceLeave: setFormData.onceInServiceLeave,
          isQuotaAllotedMonthly: setFormData.isQuotaAllotedMonthly,
          includeWeekendHoliday: setFormData.includeWeekendHoliday,
          isApplAftrProb: setFormData.isApplAftrProb,
          startDate: setFormData.startDate
            ? moment(setFormData.startDate).format('YYYY-MM-DD')
            : '',
          endDate: null,
          policyValidity: true,
        });
      }

      if (setFormData.policy_validity == '0') {
        this.checkBox = false;

        this.leaveForm = this.fb.group({
          leaveName: setFormData.HRMS_LEAVE_MASTER.leave_name,
          leaveInputName: `${setFormData.HRMS_LEAVE_MASTER.leave_name} -${setFormData.HRMS_LEAVE_MASTER.leave_code}`,
          leaveType: setFormData.leave_type,
          onceInServiceLeave: setFormData.onceInServiceLeave,
          isQuotaAllotedMonthly: setFormData.isQuotaAllotedMonthly,
          includeWeekendHoliday: setFormData.includeWeekendHoliday,
          isApplAftrProb: setFormData.isApplAftrProb,
          startDate: setFormData.startDate
            ? moment(setFormData.startDate).format('YYYY-MM-DD')
            : '',
          endDate: setFormData.endDate
            ? moment(setFormData.endDate).format('YYYY-MM-DD')
            : '',
          policyValidity: false,
        });
      }
    }
    this.isEndDateTouched = !!data.endDate;
  }

  leaveSearch(e: any) {
    const aa = e;
    let filteredVariable = this.leavesMaster2.filter((item: any) =>
      aa.includes(item.leave_name)
    );
    this.leavesMaster = filteredVariable;
  }

  // Method to handle form submission
  onSubmitForm() {
    let policyValidity;

    if (
      this.leaveForm.value.policyValidity == false &&
      this.leaveForm.value.endDate == null
    ) {
      return this.toaster.warning(
        'Please enter all the fields before proceeding.'
      );
    }

    this.leaveForm.value.leaveId = this.routeLeaveId;

    if (this.checkBox == true || this.leaveForm.value.policyValidity == '1') {
      policyValidity = '1';
      this.leaveForm.value.endDate = this.endDateValue;
    }

    if (this.checkBox == false || this.leaveForm.value.policyValidity == '0') {
      policyValidity = '0';
    }

    // PAYLOAD
    let body = {
      leaveId: this.routeLeaveId,
      leave_type: this.leaveForm.value.leaveType,
      onceInServiceLeave: this.leaveForm.value.onceInServiceLeave,
      isQuotaAllotedMonthly: this.leaveForm.value.isQuotaAllotedMonthly,
      includeWeekendHoliday: this.leaveForm.value.includeWeekendHoliday,
      isApplAftrProb: this.leaveForm.value.isApplAftrProb,
      policy_validity: policyValidity,
      startDate: this.leaveForm.value.startDate,
      endDate: this.leaveForm.value.endDate,
      financial_id: this.financial_id,
      entity_id: this.entity_id,////// For Checking Leave From Leave master
    };
    // return

    this.leaveManagementService.AddLeavePolicyDetail(body).subscribe(
      (res: any) => {
        if (this.showUpdateButton === true) {
          this.router.navigate(
            [
              'master/hrms/leave-management/leave-policy/policy-information/leave-entitlement',
            ],
            { queryParams: { leaveId: this.routeLeaveId, mode: this.pageMode } }
          );
          return this.toaster.success('Policy detail updated successfully');
        }

        this.router.navigate(
          [
            'master/hrms/leave-management/leave-policy/policy-information/leave-entitlement',
          ],
          { queryParams: { leaveId: this.routeLeaveId, mode: this.pageMode } }
        );
        return this.toaster.success('Policy detail added successfully');
      },
      (err: any) => {
        if (
          err.error.message ===
          'Leave not available in this financial year or entity'
        ) {
          this.router.navigate(['/master/hrms/leave-management/leave-master']);
          return this.toaster.error(err.error.message);
        }
        this.toaster.error(`${err.error.message}`);
      }
    );
  }

  // Method to handle policy validity change
  onPolicyValidityChange(event: any) {
    if (event.checked === true || this.leaveForm.value.policyValidity == '1') {
      this.checkBox = true;
      this.leaveForm.get('endDate')?.setValue(null);
      this.endDateValue = null;
    }

    if (event.checked === false) {
      this.checkBox = false;
    }

    this.isEndDateTouched = false; // Reset the touch state
  }
}
