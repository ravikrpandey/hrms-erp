import { Component, OnInit, ɵɵtrustConstantResourceUrl } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LeaveApplyService } from 'src/app/@shared/services/ess/leave-apply.service';
import { Location, ViewportScroller } from '@angular/common';
import * as moment from 'moment';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';
import { LeaveManagementService } from 'src/app/@shared/services/leave-managemnet/leave-management.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import {
  AllLeaveInterface,
  AllLeavesByDepartmentResponse,
  EffectiveAppliedLeaveResponse,
  EmployeeForLeave,
  EmployeeForLeaveResponse,
  HRMSLeaveMaster,
  HRMSLeavePolicyDetail,
  HRMSLeavePolicyRestrictions,
  LeavePolicyByIdResponse,
  LeaveRestrictionsByIdResponse,
} from '../../../@shared/interface/leave-managenent.interface';
import { HrmServiceService } from 'src/app/@shared/services/service/hrmServices/hrm-service.service';

@Component({
  selector: 'app-leave-apply-create',
  templateUrl: './leave-apply-create.component.html',
  styleUrls: ['./leave-apply-create.component.scss'],
})
export class LeaveApplyCreateComponent implements OnInit {
  rowClass: any;
  now: any = new Date();
  startDateVld: any = new Date();
  endDateVld: any = new Date();
  min = moment().format('YYYY-MM-DD');
  private gridApi!: GridApi<any>;
  rowData: AllLeaveInterface[] = [];
  leavesMaster: any = [];
  leaveForm: FormGroup;
  approvalForm: FormGroup;
  leaveData: any;
  form: any;
  remainingLeave: any;
  too: any;
  date: any;
  date1: any;
  leaveType: any;
  employeeId: any;
  parm: any;
  getData: any;
  badReruest: any;
  loginUser: any;
  leaveTypes: any;
  departmentId: any;
  showUpdate: boolean = false;
  updateId: boolean = false;
  inputOnly: any = true;
  minDate = moment().format('YYYY-MM-DD');
  minDateObj: Date = moment().toDate();
  leaveId: any;
  mode: any;
  approvalEmployeeId: any;
  removeButton: boolean = false;
  fileArray: any[] = [];
  fileGetCheck: any;
  imagePath: any;
  fileGet: any;
  dateRange: string[];
  toDate: string;
  fromDate: string;
  dataSource: any;
  dateRangeString: string;
  policyDurations: any[] = [];
  leavesRestrictions!: HRMSLeavePolicyRestrictions;
  leavesDetail: HRMSLeavePolicyDetail;
  weekends: { leave_day: string }[];
  startDate: any;
  endDate: any;
  policy_validity: any;
  financialId: string | null;
  financial_id: string | null;
  entity_id: string | null;
  closeDisable: boolean = true;
  todayDate: string;
  today = moment();
  showEmployeeName: boolean;
  minPast: any = moment().format('YYYY-MM-DD');
  marital: any;
  userlocation: any;
  gender: any;
  designation: any;
  role_id: any;
  disableDates: any;
  totalLeaveDays: number;
  actionFrom: number;
  actionFor: any;
  approvalActinName: any;
  datePipe: any;
  status: any;
  listCheck: boolean = true;
  max: any;
  dateRange2: any = [];
  employeeList2: any;
  employees: any;
  leavesMaster2: any;
  leaves: any;
  employeeList: EmployeeForLeave[] = [];
  selectedLeaveData: HRMSLeaveMaster;
  remarks: string = '';
  upcomingHolidays: any[] = [];

  public gridOptions: any = { rowSelection: 'multiple', rowHeight: 55 };

  approved_start_date: string;
  approved_end_date: string;
  selectLeave_Name: string;

  goBack() {
    this.location.back();
  }

  public columnDefs: ColDef[] = [
    {
      headerName: 'S.NO',
      field: 'i',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      valueGetter: 'node.rowIndex + 1',
      flex: 1,
    },
    {
      headerName: 'Leave Name',
      field: 'leave_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      valueGetter: (params: any) =>
        `${params.data.leave_name} -${params.data.leave_code}`,
    },
    {
      headerName: 'Total Leave Count',
      field: 'total_available',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      valueFormatter: (params: any) =>
        params.value === 0 ? 'N/A' : params.value,
    },
    {
      headerName: 'Applied Leaves',
      field: 'total_leave_applied',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      valueFormatter: (params: any) =>
        params.value === null ? 'N/A' : params.value,
    },
    {
      headerName: 'Total Approved Count',
      field: 'total_approved_days',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      cellStyle: (params: any) => {
        const totalApproved = params.data.total_approved_days;
        const totalAvailable = params.data.total_available;
        if (
          totalAvailable !== null &&
          totalAvailable !== 'N/A' &&
          totalApproved > totalAvailable
        ) {
          return { color: 'red' };
        }
        return null;
      },
    },
    // {
    //   headerName: 'Applied Leaves',
    //   field: 'total_leave_applied',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    //   valueFormatter: (params: any) => params.value === null ? 'N/A' : params.value,
    //   cellStyle: (params: any) => {
    //     const totalAvailable = params.data.total_available;
    //     const totalApplied = params.data.total_leave_applied;

    //     if (totalAvailable !== null && totalAvailable !== 'N/A' && totalApplied > totalAvailable) {
    //       return { color: 'red' };
    //     }

    //     return null;
    //   }
    // },
    {
      headerName: 'Extra Applied Leaves',
      field: 'total_leave_applied',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      valueFormatter: (params: any) => {
        const totalAvailable = params.data.total_available;
        const totalApprovedDays = params.data.total_approved_days;
        const totalApplied = params.data.total_leave_applied;
        const extraLeave = totalAvailable - totalApprovedDays;

        return extraLeave < 0 ? -1 * Number(extraLeave) : '0';
      },
    },
  ];

  constructor(
    public dialog: MatDialog,
    private viewportScroller: ViewportScroller,
    private fb: FormBuilder,
    private leaveManagementService: LeaveManagementService,
    private toast: ToastrService,
    private router: Router,
    private activeroute: ActivatedRoute,
    private LeaveApplyService: LeaveApplyService,
    private location: Location,
    private _commonService: CommonService,
    private hrmService: HrmServiceService
  ) {
    // Retrieve the stored JSON string from localStorage
    const signInUser = localStorage.getItem('signInUser');
    if (signInUser) {
      const userObject = JSON.parse(signInUser);
      this.employeeId = userObject.employee_id;
    } else {
      console.error('No signInUser found in localStorage');
    }

    this.role_id = localStorage.getItem('role_master_id');
    this.departmentId = localStorage.getItem('department_id');
    this.financialId = localStorage.getItem('financial_id')!;
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.marital = localStorage.getItem('marital');
    this.userlocation = localStorage.getItem('location');
    this.gender = localStorage.getItem('gender');
    this.designation = localStorage.getItem('designation');
    this.startDate = new Date();
    // this.endDate is 30 days after from startdate
    this.endDate = new Date();
    this.endDate.setDate(this.startDate.getDate() + 50);

    this.rowClass = 'rowClass';

    this.leaveForm = this.fb.group({
      leaveId: new FormControl(null, [Validators.required]),
      employee_id: new FormControl(null, [Validators.required]),
      leaveName: new FormControl(null, [Validators.required]),
      leaveFor: new FormControl('ME', [Validators.required]),
      fromDate: new FormControl({ value: null, disabled: true }, [
        Validators.required,
      ]),
      toDate: new FormControl({ value: null, disabled: true }, [
        Validators.required,
      ]),
      days_difference: new FormControl(null, [Validators.required]),
      // employee_id: new FormControl(localStorage.getItem('EmpMainId')),
      leaveInputName: new FormControl(null),
      reason: new FormControl(null, [Validators.required]),
      file: new FormControl(null),
      days_details: new FormArray([
        new FormGroup({
          dayDate: new FormControl(),
          leave_day: new FormControl(),
          leave_date: new FormControl(),
          leave_period: new FormControl(),
        }),
      ]),
    });

    this.approvalForm = this.fb.group({
      approved_start_date: new FormControl(null, [Validators.required]),
      approved_end_date: new FormControl(null, [Validators.required]),
      approved_days: new FormControl(null),
    });

    this.fileArray.push({ imagePath: null, url: null });

    this.leaveForm.get('leaveName')?.valueChanges.subscribe((value) => {
      if (value && typeof value === 'number') {
        this.policyRestriction(value);
        this.leaveForm.get('leaveId')?.patchValue(value);
        this.leaveForm.get('fromDate')?.enable();
        this.leaveForm.get('toDate')?.enable();
      } else {
        // If leaveName is empty - disable fields
        this.leaveForm.get('fromDate')?.disable();
        this.leaveForm.get('toDate')?.disable();
      }
    });

    // FOR OTHER UI==============================================================>>
    this.leaveForm.get('leaveFor')?.valueChanges.subscribe((valueFor) => {
      if (valueFor == 'TEAMMATE') {
        this.showEmployeeName = true;
        this.leaveForm.get('leaveTotal')?.setValue(null);
        this.leaveForm.get('leaveTotal')?.setValidators([Validators.required]);
      } else {
        this.showEmployeeName = false;
        this.leaveForm.get('leaveTotal')?.clearValidators();
        this.leaveForm.get('leaveTotal')?.reset();
      }
    });
    // FOR OTHER UI==============================================================>>

    // date validation start
    this.leaveForm.get('fromDate')?.valueChanges.subscribe((fromDate) => {
      this.calculateDaysDifference();
      if (fromDate) {
        this.minDate = moment(fromDate).startOf('day').format('YYYY-MM-DD');
        this.getHolidayFromDate(fromDate);
      }
      this.fromDate = moment(fromDate).startOf('day').format('YYYY-MM-DD');
    });

    // this.leaveForm.get('days_difference')?.valueChanges.subscribe((days) => {
    //   if (days) {
    //     if (parseFloat(days) > this.leavesRestrictions.maxRequest) {
    //       // this.leaveForm.get("days_difference")?.setValue(null);
    //       this.leaveForm.get('days_difference')?.setErrors({
    //         maxRequest: {
    //           message: `Maximum ${this.leavesRestrictions.maxRequest} days allowed`, // Dynamic message
    //         },
    //       });
    //       this.leaveForm.get('days_difference')?.markAsTouched();
    //       // return;
    //     }
    //     if (parseFloat(days) < this.leavesRestrictions.minRequest) {
    //       // this.leaveForm.get("days_difference")?.setValue(null);
    //       this.leaveForm.get('days_difference')?.setErrors({
    //         minRequest: {
    //           message: `Minimum ${this.leavesRestrictions.minRequest} days required`, // Dynamic message
    //         },
    //       });
    //       this.leaveForm.get('days_difference')?.markAsTouched();
    //       // return;
    //     }
    //     if (parseFloat(days) > this.selectedLeaveData.remaining_leave!) {
    //       this.leaveForm.get('days_difference')?.setErrors({
    //         remainingLeave: {
    //           message: `You only have ${this.selectedLeaveData
    //             .remaining_leave!} remaining leaves available`, // Dynamic message
    //         },
    //       });
    //       this.leaveForm.get('days_difference')?.markAsTouched();
    //     }
    //   }
    // });

    this.leaveForm.get('days_difference')?.valueChanges.subscribe((days) => {
      const control = this.leaveForm.get('days_difference');
      if (!control) return;

      control.setErrors(null);

      if (days) {
        const isShortLeave =
          this.selectedLeaveData?.leave_name === 'Short Leave';
        const numDays = parseFloat(days);

        if (isShortLeave && numDays > 1) {
          control.setErrors({
            maxRequest: { message: `Maximum 1 day allowed for short leave` },
          });
          control.markAsTouched();
          return;
        }

        if (
          isShortLeave &&
          this.fromDate &&
          this.toDate &&
          this.fromDate !== this.toDate
        ) {
          control.setErrors({
            maxRequest: { message: 'Maximum 1 day allowed for short leave' },
          });
          control.markAsTouched();
          return;
        }

        if (!isShortLeave && numDays > this.leavesRestrictions.maxRequest) {
          control.setErrors({
            maxRequest: {
              message: `Maximum ${this.leavesRestrictions.maxRequest} days allowed`,
            },
          });
          control.markAsTouched();
          return;
        }

        if (numDays < this.leavesRestrictions.minRequest) {
          control.setErrors({
            minRequest: {
              message: `Minimum ${this.leavesRestrictions.minRequest} days required`,
            },
          });
          control.markAsTouched();
          return;
        }

        if (numDays > this.selectedLeaveData.remaining_leave!) {
          control.setErrors({
            remainingLeave: {
              message: `You only have ${this.selectedLeaveData
                .remaining_leave!} remaining leaves available`,
            },
          });
          control.markAsTouched();
        }
      }
    });

    this.leaveForm.get('toDate')?.valueChanges.subscribe((toDate) => {
      this.calculateDaysDifference();
      this.toDate = moment(toDate).startOf('day').format('YYYY-MM-DD');
      this.dateRange = this.getDatesInRange(this.fromDate, this.toDate);
      this.weekends = this.dateRange.map((item) => {
        const [day] = item.split(',');
        const leave_day =
          day.trim().charAt(0).toUpperCase() +
          day.trim().slice(1).toLowerCase();
        return { leave_day };
      });

      const daysDetails = this.dateRange.map((item) => {
        const [day] = item.split(',');
        let leaveDay =
          day.trim().charAt(0).toUpperCase() +
          day.trim().slice(1).toLowerCase();
        let leaveDate = moment(item, 'DD/MM/YYYY').format('YYYY-MM-DD');
        let combinedDayDate = this.combinedDayDate(leaveDay, leaveDate);
        return {
          dayDate: combinedDayDate,
          leave_day: leaveDay,
          leave_date: leaveDate,
          leave_period:
            leaveDay === 'Sat' || leaveDay === 'Sun'
              ? '0'
              : this.policyDurations.length === 0
              ? '0'
              : this.policyDurations.includes('FULL DAY')
              ? '0'
              : '1',
        };
      });

      if (this.mode === 'addMode') {
        this.addDaysDetails(daysDetails);
      }
      if (this.mode === 'editMode' && this.daysDetails.length == 0) {
        this.addDaysDetails(daysDetails);
      }
      this.onLeavePeriodChange('abc');
    });

    this.approvalDateValidation();
  }

  ngOnInit(): void {
    this.activeroute.queryParams.subscribe((params) => {
      this.leaveId = params['leave_ID'];
      this.mode = params['mode'];
      if (this.mode == 'editMode') {
        this.closeDisable = false;
      }
      this.status = params['status'];
      this.approvalEmployeeId = params['approvalEmployeeId'];
      this.actionFrom = params['actionFrom'];
      this.actionFor = params['actionFor'];
      if (this.actionFor === 'APPROVED') {
        this.approvalActinName = 'Approve';
      } else {
        this.approvalActinName = 'Reject';
      }
      if (this.approvalEmployeeId) {
        this.role_id = params['role'];
        this.departmentId = params['departmentId'];
        this.marital = params['marital'];
        this.userlocation = params['userlocation'];
        this.gender = params['gender'];
        this.designation = params['designation'];
      }
      if (this.leaveId) {
        this.getEmployeeLeaveDetails();
      }
    });
    this.todayDate = this.today.format('YYYY-MM-DD');

    this.get_allemployeeBY_managerID();
    this.changeLeaveFor();
  }

  resetDates(value: any) {
    this.leaveForm.get('fromDate')?.reset();
    this.leaveForm.get('toDate')?.reset();
    this.leaveForm.get('days_difference')?.reset();
    // this.policyRestriction(value);
    // this.policyDetail(value);
  }

  goToLeave() {
    this.viewportScroller.scrollToAnchor('create-leave');
  }

  getHolidayFromDate(fromDate: any) {
    this.hrmService
      .getHolidayFromDate(
        this.entity_id,
        this.financialId,
        fromDate,
        this.employeeId
      )
      .subscribe((res: any) => {
        this.upcomingHolidays = res.data;
      });
  }

  approvalDateValidation() {
    this.approvalForm
      .get('approved_start_date')
      ?.valueChanges.subscribe((approved_start_date) => {
        this.calculateDaysDifferenceForApproval();
        this.minDate = moment(approved_start_date)
          .startOf('day')
          .format('YYYY-MM-DD');
        this.approved_start_date = moment(approved_start_date)
          .startOf('day')
          .format('YYYY-MM-DD');
      });

    this.approvalForm
      .get('approved_end_date')
      ?.valueChanges.subscribe((approved_end_date) => {
        // this.calculateDaysDifferenceForApproval();
        this.approved_end_date = moment(approved_end_date)
          .startOf('day')
          .format('YYYY-MM-DD');
        this.dateRange = this.getDatesInRange(
          this.approved_start_date,
          this.approved_end_date
        );
        this.onLeavePeriodChange2();
      });
  }

  calculateDaysDifferenceForApproval(): void {
    const approved_start_date = this.approvalForm.get(
      'approved_start_date'
    )?.value;
    const toDate = this.approvalForm.get('approved_end_date')?.value;

    if (approved_start_date && toDate) {
      const start = moment(approved_start_date).startOf('day');
      const end = moment(toDate).startOf('day');
      const daysDifference = this.calculateDays(start, end);

      if (this.mode === 'addMode') {
        this.approvalForm.get('approved_days')?.patchValue(daysDifference);
      }
      this.approvalForm.get('approved_days')?.patchValue(daysDifference);
    }
  }

  // onLeavePeriodChange(event: any): void {
  //   const daysDetailsArray = this.leaveForm.get('days_details') as FormArray;
  //   let total = 0;
  //   // Loop through each form group and calculate the sum
  //   daysDetailsArray.controls.forEach((control) => {
  //     const leavePeriod = control.get('leave_period')?.value;
  //     if (leavePeriod === '0') {
  //       // Full Day
  //       total += 1.0;
  //     } else if (leavePeriod === '1' || leavePeriod === '2') {
  //       // Half Day
  //       total += 0.5;
  //     }
  //   });

  //   this.leaveForm.get('days_difference')?.setValue(total.toFixed(1));
  // }

  // onLeavePeriodChange2(): void {
  //   const daysDetailsArray = this.leaveForm.get('days_details') as FormArray;
  //   let total = 0;
  //   this.dateRange2 = [];
  //   this.dateRange.map((value, index) => {
  //     this.dateRange2[index] = value.substring(5);
  //   });

  //   // Loop through each form group and calculate the sum
  //   daysDetailsArray.controls.forEach((control) => {
  //     let x = control.get('dayDate')?.value?.substring(5);
  //     if (this.dateRange2.includes(x)) {
  //       const leavePeriod = control.get('leave_period')?.value;
  //       if (leavePeriod === '0') {
  //         // Full Day
  //         total += 1.0;
  //       } else if (leavePeriod === '1' || leavePeriod === '2') {
  //         // Half Day
  //         total += 0.5;
  //       }
  //     }
  //   });

  //   this.approvalForm.get('approved_days')?.setValue(total.toFixed(1));
  // }

  onLeavePeriodChange(event: any): void {
    const daysDetailsArray = this.leaveForm.get('days_details') as FormArray;
    let total = 0;

    daysDetailsArray.controls.forEach((control) => {
      const leavePeriod = control.get('leave_period')?.value;
      const dayDate = control.get('dayDate')?.value;

      if (this.isShortLeave) {
        total += 0.25;
      } else {
        if (leavePeriod === '0') {
          total += 1.0;
        } else if (leavePeriod === '1' || leavePeriod === '2') {
          total += 0.5;
        }
      }
    });

    this.leaveForm.get('days_difference')?.setValue(total.toFixed(2));
  }

  get isShortLeave(): boolean {
    const leaveName = this.leavesDetail?.HRMS_LEAVE_MASTER?.leave_name;

    if (!leaveName || typeof leaveName !== 'string') {
      console.warn('⚠️ Leave name missing or invalid:', leaveName);
      return false;
    }

    return leaveName.trim().toLowerCase().includes('short');
  }

  onLeavePeriodChange2(): void {
    const daysDetailsArray = this.leaveForm.get('days_details') as FormArray;
    let total = 0;

    this.dateRange2 = [];
    this.dateRange.map((value, index) => {
      this.dateRange2[index] = value.substring(5);
    });

    daysDetailsArray.controls.forEach((control) => {
      const dayDate = control.get('dayDate')?.value;
      let x = dayDate?.substring(5);

      if (this.dateRange2.includes(x)) {
        if (this.isShortLeave) {
          total += 0.25;
        } else {
          const leavePeriod = control.get('leave_period')?.value;
          if (leavePeriod === '0') {
            total += 1.0;
          } else if (leavePeriod === '1' || leavePeriod === '2') {
            total += 0.5;
          }
        }
      }
    });

    this.approvalForm.get('approved_days')?.setValue(total.toFixed(2));
  }

  onDateChange = (event: MatDatepickerInputEvent<Date>) => {
    this.calculateDaysDifference();
    this.toDate = moment(event.value).startOf('day').format('YYYY-MM-DD');
    this.dateRange = this.getDatesInRange(this.fromDate, this.toDate);

    this.weekends = this.dateRange.map((item) => {
      const [day] = item.split(',');
      const leave_day =
        day.trim().charAt(0).toUpperCase() + day.trim().slice(1).toLowerCase();
      return { leave_day };
    });

    const daysDetails = this.dateRange.map((item) => {
      const [day] = item.split(',');
      let leaveDay =
        day.trim().charAt(0).toUpperCase() + day.trim().slice(1).toLowerCase();
      let leaveDate = moment(item, 'DD/MM/YYYY').format('YYYY-MM-DD');
      let combinedDayDate = this.combinedDayDate(leaveDay, leaveDate);
      return {
        dayDate: combinedDayDate,
        leave_day: leaveDay,
        leave_date: leaveDate,
        leave_period:
          leaveDay === 'Sat' || leaveDay === 'Sun'
            ? '0'
            : this.policyDurations.length === 0
            ? '0'
            : this.policyDurations.includes('FULL DAY')
            ? '0'
            : '1',
      };
    });

    if (this.mode === 'addMode') {
      this.addDaysDetails(daysDetails);
    }
    if (this.mode === 'editMode') {
      this.addDaysDetails(daysDetails);
    }
    this.onLeavePeriodChange('abc');

    this.approvalDateValidation();
  };

  addDaysDetails(dayDetails: any[]) {
    const control = this.leaveForm.get('days_details') as FormArray;
    control.clear();
    dayDetails.forEach((item) => {
      const isHoliday = this.upcomingHolidays.some(
        (holiday: any) =>
          new Date(holiday.date).toISOString().split('T')[0] === item.leave_date
      );

      if (isHoliday) {
        console.log('Leave date is a holiday!');
      } else {
        console.log('Leave date is not a holiday.');
      }

      if (item.leave_day !== 'Sun' && !isHoliday) {
        control.push(
          this.fb.group({
            dayDate: this.mergeDayDate(item),
            leave_day: [item.leave_day],
            leave_date: [item.leave_date],
            leave_period: [item.leave_period],
          })
        );
      }
    });
  }

  calculateDaysDifference(): void {
    const fromDate = this.leaveForm.get('fromDate')?.value;
    const approved_end_date = this.leaveForm.get('approved_end_date')?.value;
    if (fromDate && approved_end_date) {
      const start = moment(fromDate).startOf('day');
      const end = moment(approved_end_date).startOf('day');
      const daysDifference = this.calculateDays(start, end);

      if (this.mode === 'addMode') {
        this.leaveForm.get('days_difference')?.patchValue(daysDifference);
      }
    }
  }

  calculateDays(start: moment.Moment, end: moment.Moment): number {
    let count = 0;
    let current = start.clone();

    if (end.isBefore(start)) {
      return 0;
    }

    while (current <= end) {
      // Skip Sunday (0 = Sunday)
      if (current.day() !== 0) {
        count++;
      }
      current.add(1, 'day');
    }

    return count;
  }

  employeeSearch(e: any) {
    const aa = e;
    let filteredVariable = this.employeeList2.filter((item: any) =>
      aa.includes(
        item?.first_name + ' ' + item?.last_name + ' ' + item?.employee_code
      )
    );
    this.employeeList = filteredVariable;
  }

  leavesSearch(e: any) {
    const aa = e;
    let filteredVariable = this.leavesMaster2.filter((item: any) =>
      aa.includes(item.leave_name + ' - ' + item.leave_code)
    );
    this.leavesMaster = filteredVariable;
  }

  getDatesInRange(start: string, end: string): string[] {
    const startDate = moment(start);
    const endDate = moment(end);
    const dates = [];

    let currentDate = startDate;
    while (currentDate <= endDate) {
      dates.push(
        currentDate.format('ddd').toUpperCase() +
          ' ,' +
          currentDate.format('DD-MM-YYYY')
      );
      currentDate = currentDate.add(1, 'days');
    }
    return dates;
  }

  isFullDayActive(): boolean {
    return this.policyDurations.includes('FULL DAY');
  }

  isHalfActive(): boolean {
    return this.policyDurations.includes('HALF DAY');
  }

  policyRestriction(leave_id: any) {
    this._commonService?.hideLoader();
    this.leaveManagementService
      .GetLeaveRestrictionsById(
        leave_id,
        this.financialId,
        this.entity_id,
        this.employeeId
      )
      .subscribe(
        (res: LeaveRestrictionsByIdResponse) => {
          this._commonService?.hideLoader();
          if (res && res.data) {
            this.leavesRestrictions = res.data;
            this.policyDurations = this.leavesRestrictions.durations!.map(
              (item: any) => item.duration
            );
            this.policyDetail(leave_id);
          }
        },
        (err: any) => {
          this._commonService?.hideLoader();
        }
      );
  }

  policyDetail(leave_id: any) {
    this._commonService?.showLoader(); // ✅ Show loader before request

    this.leaveManagementService
      .GetLeavePolicyDetail(
        leave_id,
        this.financialId,
        this.entity_id,
        this.employeeId
      )
      .subscribe(
        (res: LeavePolicyByIdResponse) => {
          this._commonService?.hideLoader();

          if (!res?.data?.length) {
            console.warn('⚠️ No leave policy data found');
            return;
          }

          this.leavesDetail = res.data[0];
          this.endDate = this.leavesDetail.endDate
            ? new Date(this.leavesDetail.endDate)
            : null;

          // Start from today's date by default
          const today = new Date();
          this.now = this.startDate ? new Date(this.startDate) : today;

          // Prevent using past dates
          if (this.now < today) {
            this.now = today;
          }

          // Set default date limits
          this.minDate = moment(this.now).startOf('day').format('YYYY-MM-DD');
          this.max = this.endDate ?? new Date(9999, 11, 31);

          // Apply restrictions if available
          if (this.leavesRestrictions) {
            const { past_days = 0, future_advanceDays = 0 } =
              this.leavesRestrictions;

            // Handle past date restriction
            if (past_days > 0) {
              this.minDate = moment()
                .subtract(past_days, 'days')
                .startOf('day')
                .format('YYYY-MM-DD');
            }

            // Handle future date restriction
            if (future_advanceDays > 0) {
              this.max = moment()
                .add(future_advanceDays, 'days')
                .endOf('day')
                .toDate();
            }
          }
          if (
            this.leavesDetail?.HRMS_LEAVE_MASTER?.leave_name!.toLowerCase().includes(
              'earned'
            )
          ) {
            this.setMinDateByLeaveCode(
              this.leavesDetail?.HRMS_LEAVE_MASTER?.leave_name!
            );
          }

          console.log('✅ Leave policy processed:', {
            startDate: this.startDate,
            endDate: this.endDate,
            minDate: this.minDate,
            maxDate: this.max,
            restrictions: this.leavesRestrictions,
          });
        },
        (err: any) => {
          this._commonService?.hideLoader();
          console.error('❌ Error loading leave policy detail:', err);
        }
      );
  }

  //   myHolidayFilter = (d: any): boolean => {
  //     const time=d.getTime();
  //     return !this.myHolidayDates.find((x:any)=>x.getTime()==time);
  // }

  routeToCreateLeave() {
    this.router.navigate(['master/ess/leave-apply']);
  }

  preventCopyPaste(event: ClipboardEvent): void {
    event.preventDefault();
    this.leaveForm.get('reason')?.setErrors({ copyPasteNotAllowed: true });
  }

  async getEmployeeLeaveDetails() {
    this._commonService?.showLoader();
    this.LeaveApplyService.getAppliedLeaveById(
      this.leaveId,
      this.financialId,
      this.entity_id,
      this.approvalEmployeeId ? this.approvalEmployeeId : this.employeeId,
      this.role_id
    ).subscribe(
      (res: any) => {
        this._commonService?.hideLoader();
        let formData = res.data[0];
        this.remarks = formData.remarks;

        this.setMinDateByLeaveCode(formData?.HRMS_LEAVE_MASTER?.leave_name);

        this.minDate = moment(formData.end_date)
          .subtract(1, 'day')
          .format('YYYY-MM-DD');

        this.leaveForm
          .get('fromDate')
          ?.patchValue(formData.start_date, { emitEvent: true });
        this.leaveForm
          .get('toDate')
          ?.patchValue(formData.end_date, { emitEvent: true });

        this.approvalForm
          .get('approved_start_date')
          ?.patchValue(formData.start_date, { emitEvent: true });
        this.approvalForm
          .get('approved_end_date')
          ?.patchValue(formData.end_date, { emitEvent: true });

        if (this.status == 'APPROVED') {
          this.approvalForm
            .get('approved_start_date')
            ?.patchValue(formData.approved_start_date, { emitEvent: true });
          this.approvalForm
            .get('approved_end_date')
            ?.patchValue(formData.approved_end_date, { emitEvent: true });
        }
        this.fileGet = formData?.documents[0]?.uploaded_document;

        this.leaveForm.patchValue(
          {
            leaveId: formData.leaveId,
            leaveName: formData.leaveId,
            leaveFor: formData.leave_for,
            days_difference: Number(formData.leave_days),
            employee_id: formData.employee_id,
            reason: formData.justification,
            file:
              formData.documents.length > 0
                ? formData.documents[0].uploaded_document
                : this.fileArray.push({
                    imagePath: null,
                    url: null,
                  }),
            leaveInputName: formData.HRMS_LEAVE_MASTER.leave_name,
          },
          { emitEvent: true }
        );

        this.startDateVld = new Date(formData?.start_date);
        this.endDateVld = new Date(formData?.end_date);

        this.approvalForm.patchValue(
          {
            approved_days: Number(formData.leave_days),
          },
          { emitEvent: true }
        );

        if (this.status == 'APPROVED') {
          this.approvalForm.patchValue(
            {
              approved_days: Number(formData.approved_days),
            },
            { emitEvent: true }
          );
        }

        if (this.leaveForm?.value?.leaveFor == 'TEAMMATE') {
          this.leaveForm.patchValue(
            {
              employee_id: formData?.employee_id,
            },
            { emitEvent: true }
          );
        }

        // Set file array with documents
        this.fileArray = formData.documents.map((doc: any) => ({
          imagePath: null,
          url: doc.uploaded_document,
          file: null,
        }));

        // this.policyRestriction(formData.leaveId);
        // this.policyDetail(formData.leaveId);
        if (formData.days_details?.length) {
          formData.days_details?.forEach((item: any, index: number) => {
            const formGroup = this.daysDetailsFormArray?.at(index) as FormGroup;
            if (formGroup) {
              formGroup.patchValue({
                dayDate: this.mergeDayDate(item),
                leave_day: item.leave_day,
                leave_date: item.leave_date,
                leave_period: item.leave_period,
              });
            } else {
              this.daysDetailsFormArray.push(
                this.fb.group({
                  dayDate: this.mergeDayDate(item),
                  leave_day: item.leave_day,
                  leave_date: item.leave_date,
                  leave_period: item.leave_period,
                })
              );
            }
          });
        }

        if (this.isShortLeave) {
          this.showUpdate = true;
          if (this.mode == 'viewMode') {
            this.removeButton = true;
          }
          return;
        }

        this.onLeavePeriodChange('abc');
        this.calculateDaysDifference();
        if (this.mode == 'viewMode') {
          this.removeButton = true;
        }
        this.showUpdate = true;
      },
      (err: any) => {
        console.error('Error fetching leave data', err);
        this._commonService?.hideLoader();
      }
    );
  }

  mergeDayDate(data: any) {
    const formattedDate = moment(data.leave_date).format('DD-MM-YYYY');
    return `${data.leave_day}, ${formattedDate}`;
  }

  combinedDayDate(day: any, date: any) {
    return `${day}, ${date}`;
  }

  get daysDetailsFormArray() {
    return this.leaveForm.get('days_details') as FormArray;
  }

  get formControls(): any {
    return this.leaveForm.controls;
  }

  get daysDetails(): FormArray {
    return this.leaveForm.get('days_details') as FormArray;
  }

  createDayDetailFormGroup(dayDetail: any): FormGroup {
    return this.fb.group({
      leave_day: [dayDetail.leave_day],
      leave_date: [dayDetail.leave_date],
      leave_period: [dayDetail.leave_period, Validators.required],
    });
  }

  getEntityUsers(financialId: any, employeeId: any, entity_id: any) {
    this.LeaveApplyService.getEntityUsers(
      this.financialId,
      employeeId,
      entity_id
    ).subscribe(
      (res: any) => {
        this.rowData = res.data;
        this.leavesMaster = res.data;
        this.leavesMaster2 = res.data;
        this.leaves = this.leavesMaster2.map((res: any) => {
          return res.leave_name + ' - ' + res.leave_code;
        });
      },
      (err: any) => {
        // this.toaster.error(${err.error.message});
        console.error('Error fetching leave data', err);
      }
    );
  }

  get_allemployeeBY_managerID() {
    this.LeaveApplyService.get_allemployeeBY_managerID(
      this.employeeId
    ).subscribe(
      (res: EmployeeForLeaveResponse) => {
        if (res && res.data) {
          this.employeeList = res.data;
          this.employeeList2 = res.data;
          this.employees = this.employeeList2.map((res: any) => {
            return (
              res?.first_name + ' ' + res?.last_name + ' ' + res?.employee_code
            );
          });
        }
      },
      (err: any) => {
        // this.toaster.error(${err.error.message});
        console.error('Error fetching leave data', err);
      }
    );
  }

  setMinDateByLeaveCode(leaveName: string) {
    if (leaveName.toLocaleLowerCase().includes('earned')) {
      // 14 days baad se select karne ka restriction

      this.minDateObj = moment().add(14, 'days').toDate();
      this.minDate = moment(this.minDateObj)
        .startOf('day')
        .format('YYYY-MM-DD');
      console.log(this.minDate, this.minDateObj);
    } else {
      // normal case - today se
      this.minDate = moment().format('YYYY-MM-DD');
    }
  }

  // onLeaveSelect(value: any) {
  //   this.leaveForm.get('fromDate')?.patchValue(null);
  //   this.leaveForm.get('toDate')?.patchValue(null);
  //   this.leaveForm.get('reason')?.patchValue(null);
  //   this.fileArray = [];
  //   this.fileArray.push({ imagePath: null, url: null });
  //   this.selectedLeave = Number(value);

  //   this.LeaveApplyService.getValidLeave(this.employeeId, this.entity_id, value).subscribe(
  //     (res: EffectiveAppliedLeaveResponse) => {
  //       if (res && res.data) {
  //         this.selectedLeaveData = res.data;
  //         this.selectLeave_Name = this.selectedLeaveData.leave_name;

  //         // for earned leave case ******
  //         if (this.selectedLeaveData.leave_code === "LV00003") {
  //           this.minDate = moment().add(14, 'days').format('YYYY-MM-DD');
  //           this.minDateObj = moment().add(14, 'days').toDate();
  //         } else {
  //           this.minDate = moment().format('YYYY-MM-DD');
  //           this.minDateObj = moment().toDate();
  //         }

  //         if (this.selectedLeaveData.remaining_leave! <= 0) {
  //           this.toast.error('No leave remaining');
  //           this.listCheck = false;
  //           this.leaveForm.get('leaveName')?.setErrors({ noLeave: true });
  //           this.leaveForm.get('leaveName')?.markAsTouched();
  //         }
  //         if (!res.flag && res.data) {
  //           this.toast.error(res.message);
  //           this.listCheck = false;
  //         } else {
  //           this.listCheck = true;
  //         }
  //       }
  //     },
  //     (err: any) => {
  //       // this.toaster.error(${err.error.message});
  //       console.error('Error fetching leave data', err);
  //     }
  //   );

  // }

  onLeaveSelect(value: any) {
    this.leaveForm.get('fromDate')?.patchValue(null);
    this.leaveForm.get('toDate')?.patchValue(null);
    this.leaveForm.get('reason')?.patchValue(null);
    this.fileArray = [];
    this.fileArray.push({ imagePath: null, url: null });
    // this.selectedLeave = Number(value);

    this.LeaveApplyService.getValidLeave(
      this.employeeId,
      this.entity_id,
      value
    ).subscribe(
      (res: EffectiveAppliedLeaveResponse) => {
        if (res && res.data) {
          this.selectedLeaveData = res.data;
          this.selectLeave_Name = this.selectedLeaveData.leave_name;

          // ✅ common function call
          this.setMinDateByLeaveCode(this.selectedLeaveData.leave_name);

          if (this.selectedLeaveData.remaining_leave! <= 0) {
            this.toast.error('No leave remaining');
            this.listCheck = false;
            this.leaveForm.get('leaveName')?.setErrors({ noLeave: true });
            this.leaveForm.get('leaveName')?.markAsTouched();
          }
          if (!res.flag && res.data) {
            this.toast.error(res.message);
            this.listCheck = false;
          } else {
            this.listCheck = true;
          }
        }
      },
      (err: any) => {
        console.error('Error fetching leave data', err);
      }
    );
  }

  getDepartmentLeaves(departmentId: any, employeeId: any, entity_id: any) {
    this._commonService?.showLoader();
    this.LeaveApplyService.getLeaveByDepartment(
      this.financialId,
      departmentId,
      employeeId,
      entity_id,
      this.marital,
      this.userlocation,
      this.gender,
      this.designation,
      this.role_id
    ).subscribe(
      (res: AllLeavesByDepartmentResponse) => {
        if (res && res.data) {
          this.rowData = res.data;
          this.leavesMaster = res.data;
          this.leavesMaster2 = res.data;
          this.leaves = this.leavesMaster2.map((res: AllLeaveInterface) => {
            return res.leave_name + ' - ' + res.leave_code;
          });
        }
        this._commonService?.hideLoader();
      },
      (err: any) => {
        this._commonService?.hideLoader();
        // this.toaster.error(${err.error.message});
        console.error('Error fetching leave data', err);
      }
    );
  }

  // ===================DOCUMENT UPLOADING CALLS======================================================================

  onChange(event: any, index: number): any {
    const file = event.target.files[0];
    if (file) {
      this.closeDisable = false;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imagePath =
          file.type === 'application/pdf'
            ? '/assets/icons/pdfimg.png'
            : e.target.result;
        this.fileArray[index].imagePath = imagePath;
        this.fileArray[index].valid = true;
        if (
          !(
            file.type == 'image/jpeg' ||
            file.type == 'image/png' ||
            file.type == 'image/gif' ||
            file.type == 'image/webp' ||
            file.type == 'image/svg+xml' ||
            file.type == 'image/tiff' ||
            file.type == 'application/pdf' ||
            file.type == 'application/msword' ||
            file.type ==
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            file.type == 'application/vnd.ms-excel' ||
            file.type ==
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          )
        ) {
          this.fileArray[index].valid = false;
          this.toast.error(`Invalid file, please upload a valid file`);
          return;
        }
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      this.fileGetCheck = formData;
      formData.append('file', file);

      this.LeaveApplyService.documentsUpdate(formData).subscribe(
        (res: any) => {
          this.fileArray[index].url = res?.url;
        },
        (err: any) => {
          // this.toast.error(`${err?.error?.message}`);
        }
      );
    }
  }

  // addFileInput(index: number) {
  //   if (this.fileArray.some(fileItem => !fileItem.imagePath && !fileItem.url)) {
  //     return
  //   }
  //   if (this.fileGetCheck !== undefined) {
  //     this.fileArray.splice(index + 1, 0, { imagePath: null, url: null });
  //     this.fileGetCheck = undefined;
  //   }
  //   else {
  //     this.toast.warning("Please upload the file first");
  //   }
  // }

  addFileInput(index: number) {
    if (
      this.fileArray.some((fileItem) => !fileItem.imagePath && !fileItem.url) &&
      this.mode != 'editMode'
    ) {
      return this.toast.warning('Please upload file first');
    }
    if (
      (this.fileGetCheck !== undefined ||
        this.fileArray.some((fileItem) => fileItem.url !== null)) &&
      this.mode == 'editMode'
    ) {
      if (
        this.fileArray.some((fileItem) => !fileItem.url && !fileItem.imagePath)
      ) {
        return this.toast.warning('Please upload the file first');
      }
      this.fileArray.splice(index + 1, 0, { imagePath: null, url: null });
      this.fileGetCheck = undefined;
      return;
    }
    if (
      this.fileGetCheck !== undefined ||
      this.fileArray.some(
        (fileItem) => fileItem.imagePath && fileItem.url !== null
      )
    ) {
      this.fileArray.splice(index + 1, 0, { imagePath: null, url: null });
      this.fileGetCheck = undefined;
      return;
    } else {
      return this.toast.warning('Please upload the file first');
    }
  }

  removeFileInput(index: number) {
    this.closeDisable = false;
    if (this.fileArray.length >= 0) {
      this.fileArray.splice(index, 1);
      if (this.fileArray.length === 0) {
        this.fileArray.push({ imagePath: null, url: null });
        this.closeDisable = true;
      }
    } else {
      // this.fileArray.push({ imagePath: null, url: null });
      this.toast.warning('At least one file input must be present.');
    }
  }

  sevralUrl() {
    return environment.servralUrl + '/uploaded_files/';
  }

  openFileInNewTab(url: string) {
    window.open(this.sevralUrl() + url, '_blank');
  }

  seePreview(path: string, imagePath: any) {
    if (!this.imagePath) {
      if (path) {
        Swal.fire({
          imageUrl: path,
          imageHeight: 250,
          imageAlt: 'Uploaded Document',
          confirmButtonText: 'Ok',
        });
      }
    } else {
      Swal.fire({
        imageUrl: imagePath,
        imageHeight: 250,
        imageAlt: 'Profile Image',
        confirmButtonText: 'Ok',
      });
    }
  }

  generateImageUrl(uploadDoc: any): string {
    const servralUrl = environment.servralUrl;
    return `${servralUrl}/${uploadDoc}`;
  }

  seePreviewTable(path: string) {
    if (path) {
      Swal.fire({
        imageUrl: path,
        imageHeight: 250,
        imageAlt: 'Document',
        confirmButtonText: 'Ok',
      });
    }
  }

  datesFormatChangeForFuture(noDay: any) {
    let today = moment();
    let newDate = today.add(noDay, 'days');
    return newDate.format('YYYY-MM-DD');
  }

  datesFormatChangeForPast(noDay: any) {
    let today = moment();
    let newDate = today.subtract(noDay, 'days');
    return newDate.format('YYYY-MM-DD');
  }

  // ===================================================================================================================

  formatDate(date: string): string {
    return moment(date).format('YYYY-MM-DD');
  }

  // onApplyLeave() {
  //   let flag = false;
  //   this.fileArray.map((value: any) => {
  //     if (value.valid == false) {
  //       flag = true;
  //     }
  //   });

  //   if (flag) {
  //     this.toast.error(`Invalid file, please upload a valid file`);
  //     return;
  //   }
  //   if (!this.listCheck) {
  //     this.toast.error('This leave policy not apply on you to this time.');
  //     return;
  //   }

  //   this.leaveForm.markAllAsTouched();
  //   if (this.leaveForm?.invalid) {
  //     return this.toast.error(
  //       'Required fields should not be invalid',
  //       'Fields Error'
  //     );
  //   }

  //   let formData = this.leaveForm.value;
  //   let rowObj = this.rowData.find((elem) => elem?.id == formData?.leaveId)!;
  //   let total_available = rowObj.total_available;
  //   let total = 0;
  //   formData?.days_details?.map((item: any) => {
  //     if (total_available > 0) {
  //       let leave_period = 0;
  //       if (item?.leave_period == '0') leave_period = 1;
  //       else leave_period = 0.5;
  //       total = total + leave_period;
  //       if (total <= total_available) {
  //         item.leave_type = 'PAID';
  //       } else {
  //         item.leave_type = 'UNPAID';
  //       }
  //     } else {
  //       item.leave_type = 'PAID';
  //     }
  //   });
  //   // Documents validations
  //   if (this.fileArray.length > 1) {
  //     if (
  //       this.fileArray.some(
  //         (doc: any) => doc.imagePath === null && doc.url === null
  //       )
  //     ) {
  //       this.toast.warning('Please upload all the documents');
  //       return;
  //     }
  //     if (
  //       this.fileArray.some(
  //         (doc: any) => (doc.imagePath || doc.url) && !doc.valid
  //       )
  //     ) {
  //       this.toast.warning('Please upload valid documents');
  //       return;
  //     }
  //   }

  //   const formStartDate = this.formatDate(formData.fromDate);
  //   const formEndDate = this.formatDate(formData.toDate);
  //   const selectedStartDate = this.formatDate(this.startDate);
  //   const selectedEndDate = this.formatDate(this.endDate);
  //   const formattedFutureAdv = this.datesFormatChangeForFuture(
  //     this.leavesRestrictions.future_advanceDays
  //   );
  //   const formattedPastDays = this.datesFormatChangeForPast(
  //     this.leavesRestrictions.past_days
  //   );

  //   // Weekend Leave Apply Check
  //   if (formData.days_difference === 0) {
  //     this.toast.warning('Please select other dates');
  //     return;
  //   }

  //   // Check if leave is selected or not
  //   const leaveTypeNotSelected = formData.leaveId === true;
  //   if (leaveTypeNotSelected) {
  //     const errorMessage = 'Please select the leave before applying';
  //     this.toast.warning(errorMessage);
  //     return;
  //   }

  //   // Past days Check
  //   if (this.leavesRestrictions.past_days > 0) {
  //     if (
  //       formStartDate < formattedPastDays ||
  //       formEndDate < formattedPastDays
  //     ) {
  //       this.toast.warning(
  //         `This leave can be only applied ${this.leavesRestrictions.past_days} days in past`
  //       );
  //       return;
  //     }
  //   }

  //   // Future Advance days Check
  //   if (this.leavesRestrictions.future_advanceDays > 0) {
  //     if (formEndDate > this.todayDate || formStartDate > this.todayDate) {
  //       if (
  //         formStartDate < formattedFutureAdv ||
  //         formEndDate < formattedFutureAdv
  //       ) {
  //         this.toast.warning(
  //           `This leave can be only applied ${this.leavesRestrictions.future_advanceDays} days in advance`
  //         );
  //         return;
  //       }
  //     }
  //   }

  //   // Check if any dates does not lie between the leave validation
  //   const invalidDates = formStartDate < selectedStartDate;
  //   const invalidDates2 =
  //     selectedEndDate !== null && formEndDate > selectedEndDate;
  //   // if (invalidDates || invalidDates2) {
  //   //   this.toast.warning(`Please select different dates to apply this leave.`)
  //   //   return;
  //   // }

  //   // Check for Min Request in a single time
  //   if (this.leavesRestrictions.minRequest > 0) {
  //     if (formData.days_difference < this.leavesRestrictions.minRequest) {
  //       this.toast.warning(
  //         `You have to apply ${this.leavesRestrictions.minRequest} leaves minimum in a single time.`
  //       );
  //       return;
  //     }
  //   }

  //   // Check for Max Request in a single time
  //   if (this.leavesRestrictions.maxRequest > 0) {
  //     if (formData.days_difference > this.leavesRestrictions.maxRequest) {
  //       this.toast.warning(
  //         `You can only apply ${this.leavesRestrictions.maxRequest} leaves maximum in a single time.`
  //       );
  //       return;
  //     }
  //   }

  //   const newArray: any = [];
  //   const invalidFiles = this.fileArray.some(
  //     (fileItem) => !fileItem.imagePath && !fileItem.url
  //   );
  //   if (!invalidFiles) {
  //     this.fileArray?.map((doc: any) => {
  //       newArray.push(doc?.url);
  //     });
  //   }

  //   let body = {
  //     leaveFor: formData.leaveFor,
  //     startDate: formStartDate,
  //     endDate: formEndDate,
  //     leaveDays: formData.days_difference,
  //     justification: formData.reason,
  //     leaveId: formData.leaveId,
  //     departmentId: this.departmentId,
  //     // "employee_id": formData.employee_id,
  //     documents: newArray.length == 0 ? [...newArray, null] : newArray,
  //     days_details: formData.days_details,
  //     isDeleted: false,
  //     financial_year_id: this.financialId,
  //     created_by: this.employeeId,
  //     employee_id: formData?.employee_id
  //       ? formData?.employee_id
  //       : this.employeeId,
  //   };
  //   this._commonService?.showLoader();
  //   this.LeaveApplyService.applyLeave(body).subscribe(
  //     (res: any) => {
  //       this.toast.success(res.message);
  //       this.router.navigate(['master/ess/leave-apply']);
  //       this._commonService?.hideLoader();
  //     },
  //     (err: any) => {
  //       // if (err.status == 409) {
  //       //   this.toast.warning(err.error.message);
  //       //   return
  //       // }
  //       this._commonService?.hideLoader();
  //       return this.toast.error(err.error.message);
  //     }
  //   );
  // }

  onApplyLeave() {
    // 1️⃣ File validation
    let flag = false;
    this.fileArray.map((value: any) => {
      if (value.valid == false) {
        flag = true;
      }
    });

    if (flag) {
      this.toast.error(`Invalid file, please upload a valid file`);
      return;
    }

    // 2️⃣ Leave policy eligibility
    if (!this.listCheck) {
      this.toast.error('This leave policy does not apply to you at this time.');
      return;
    }

    // 3️⃣ Form validation
    this.leaveForm.markAllAsTouched();
    if (this.leaveForm.invalid) {
      this.toast.error('Required fields should not be invalid', 'Fields Error');
      return;
    }

    const formData = this.leaveForm.value;
    const rowObj = this.rowData.find((elem) => elem?.id == formData?.leaveId);
    if (!rowObj) {
      this.toast.warning('Invalid leave selected');
      return;
    }

    const total_available = rowObj.total_available || 0;
    let total = 0;

    // 4️⃣ Calculate leave type
    formData.days_details?.forEach((item: any) => {
      const leave_period = item?.leave_period == '0' ? 1 : 0.5;
      total += leave_period;
      item.leave_type = total <= total_available ? 'PAID' : 'UNPAID';
    });

    // 5️⃣ File completeness validation
    if (this.fileArray.length > 1) {
      if (
        this.fileArray.some(
          (doc: any) => doc.imagePath === null && doc.url === null
        )
      ) {
        this.toast.warning('Please upload all the documents');
        return;
      }
      if (
        this.fileArray.some(
          (doc: any) => (doc.imagePath || doc.url) && !doc.valid
        )
      ) {
        this.toast.warning('Please upload valid documents');
        return;
      }
    }

    // 6️⃣ Date formatting
    const formStartDate = this.formatDate(formData.fromDate);
    const formEndDate = this.formatDate(formData.toDate);
    const formattedFutureAdv = this.datesFormatChangeForFuture(
      this.leavesRestrictions.future_advanceDays
    );
    const formattedPastDays = this.datesFormatChangeForPast(
      this.leavesRestrictions.past_days
    );

    const start = new Date(formStartDate);
    const end = new Date(formEndDate);
    const past = new Date(formattedPastDays);
    const future = new Date(formattedFutureAdv);

    console.log({
      start,
      end,
      past,
      future,
      condition: start > future || end > future,
    });
    // 7️⃣ Basic validations
    if (formData.days_difference === 0) {
      this.toast.warning('Please select valid dates');
      return;
    }

    if (!formData.leaveId) {
      this.toast.warning('Please select the leave before applying');
      return;
    }

    // 8️⃣ Short leave validation
    if (
      this.selectLeave_Name === 'Short Leave' &&
      parseFloat(formData.days_difference) !== 0.25
    ) {
      this.toast.warning('Short leave can only be applied for 0.25 day.');
      return;
    }

    // 9️⃣ Restriction checks
    if (this.leavesRestrictions.past_days > 0 && (start < past || end < past)) {
      this.toast.warning(
        `This leave can only be applied ${this.leavesRestrictions.past_days} days in the past`
      );
      return;
    }

    if (
      this.leavesRestrictions.future_advanceDays > 0 &&
      (start > future || end > future)
    ) {
      this.toast.warning(
        `This leave can only be applied ${this.leavesRestrictions.future_advanceDays} days in advance`
      );
      return;
    }

    if (
      this.leavesRestrictions.minRequest > 0 &&
      formData.days_difference < this.leavesRestrictions.minRequest
    ) {
      this.toast.warning(
        `You have to apply ${this.leavesRestrictions.minRequest} leaves minimum in a single time.`
      );
      return;
    }

    if (
      this.leavesRestrictions.maxRequest > 0 &&
      formData.days_difference > this.leavesRestrictions.maxRequest
    ) {
      this.toast.warning(
        `You can only apply ${this.leavesRestrictions.maxRequest} leaves maximum in a single time.`
      );
      return;
    }

    // 🔟 Prepare document URLs
    const newArray = this.fileArray.map((doc: any) => doc.url).filter(Boolean);

    // 11️⃣ Final payload
    const body = {
      leaveFor: formData.leaveFor,
      startDate: formStartDate,
      endDate: formEndDate,
      leaveDays: formData.days_difference,
      justification: formData.reason,
      leaveId: formData.leaveId,
      departmentId: this.departmentId,
      documents: newArray.length ? newArray : [null],
      days_details: formData.days_details,
      isDeleted: false,
      financial_year_id: this.financialId,
      created_by: this.employeeId,
      employee_id: formData.employee_id || this.employeeId,
    };

    // 12️⃣ API call
    this._commonService.showLoader();
    this.LeaveApplyService.applyLeave(body).subscribe({
      next: (res: any) => {
        this.toast.success(res.message);
        this.router.navigate(['master/ess/leave-apply']);
        this._commonService.hideLoader();
      },
      error: (err: any) => {
        this._commonService.hideLoader();
        this.toast.error(err.error.message);
      },
    });
  }

  // onUpdateLeave() {
  //   let invalidFields: any = [];
  //   Object.keys(this.leaveForm.controls).forEach((key) => {
  //     const control = this.leaveForm.get(key);
  //     if (control && control.invalid) {
  //       invalidFields.push(key);
  //     }
  //   });

  //   if (this.leaveForm?.invalid) {
  //     return this.toast.error(
  //       'Required fields should not be invalid',
  //       'Fields Error'
  //     );
  //   }
  //   let flag = false;
  //   this.fileArray.map((value: any) => {
  //     if (value.valid == false) {
  //       flag = true;
  //     }
  //   });

  //   if (flag) {
  //     this.toast.error(`Invalid file, please upload a valid file`);
  //     return;
  //   }

  //   if (!this.listCheck) {
  //     this.toast.error('This leave policy not apply on you to this time.');
  //     return;
  //   }

  //   let formData = this.leaveForm.value;
  //   let rowObj = this.rowData.find((elem) => elem?.id == formData?.leaveId)!;
  //   let total_available = rowObj.total_available;
  //   let total = 0;
  //   formData?.days_details?.map((item: any) => {
  //     if (total_available > 0) {
  //       let leave_period = 0;
  //       if (item?.leave_period == '0') leave_period = 1;
  //       else leave_period = 0.5;
  //       total = total + leave_period;
  //       if (total <= total_available) {
  //         item.leave_type = 'PAID';
  //       } else {
  //         item.leave_type = 'UNPAID';
  //       }
  //     } else {
  //       item.leave_type = 'PAID';
  //     }
  //   });

  //   // Documents validations
  //   if (this.fileArray.length > 1) {
  //     if (
  //       this.fileArray.some(
  //         (doc: any) => doc.imagePath === null && doc.url === null
  //       )
  //     ) {
  //       this.toast.warning('Please upload all the documents');
  //       return;
  //     }
  //   }

  //   const formStartDate = this.formatDate(formData.fromDate);
  //   const formEndDate = this.formatDate(formData.toDate);
  //   const leaveStartDate = this.formatDate(this.startDate);
  //   const leaveEndDate = this.formatDate(this.endDate);
  //   const formattedFutureAdv = this.datesFormatChangeForFuture(
  //     this.leavesRestrictions.future_advanceDays
  //   );
  //   const formattedPastDays = this.datesFormatChangeForPast(
  //     this.leavesRestrictions.past_days
  //   );

  //   // Weekend Leave Apply Check
  //   if (formData.days_difference === 0) {
  //     this.toast.warning(`Please select other dates`);
  //     return;
  //   }

  //   // Check if leave is selected or not
  //   const leaveTypeNotSelected = formData.leaveId === true;
  //   if (leaveTypeNotSelected) {
  //     const errorMessage = 'Please select the leave before applying';
  //     this.toast.warning(errorMessage);
  //     return;
  //   }

  //   // Check if any dates does not lie between the leave validation
  //   const invalidDates =
  //     formStartDate < leaveStartDate ||
  //     (leaveEndDate !== null && formEndDate > leaveEndDate);
  //   if (invalidDates) {
  //     if (!leaveEndDate) {
  //       this.toast.warning(`Th
  //       is leave is valid from ${leaveStartDate} only`);
  //     } else {
  //       this.toast.warning(
  //         `This leave is valid from ${leaveStartDate} to ${leaveEndDate} only`
  //       );
  //     }
  //     return;
  //   }

  //   // Check for Min Request in a single time
  //   if (this.leavesRestrictions.minRequest > 0) {
  //     if (formData.days_difference < this.leavesRestrictions.minRequest) {
  //       this.toast.warning(
  //         `You have to apply ${this.leavesRestrictions.minRequest} leaves minimum in a single time.`
  //       );
  //       return;
  //     }
  //   }
  //   // Check for Max Request in a single time
  //   if (this.leavesRestrictions.maxRequest > 0) {
  //     if (formData.days_difference > this.leavesRestrictions.maxRequest) {
  //       this.toast.warning(
  //         `You can only apply ${this.leavesRestrictions.maxRequest} leaves maximum in a single time.`
  //       );
  //       return;
  //     }
  //   }

  //   // Past days Check
  //   if (this.leavesRestrictions.past_days > 0) {
  //     if (
  //       formStartDate < formattedPastDays ||
  //       formEndDate < formattedPastDays
  //     ) {
  //       this.toast.warning(
  //         `This leave can be only applied ${this.leavesRestrictions.past_days} days in back`
  //       );
  //       return;
  //     }
  //   }

  //   // Future Advance days Check
  //   if (this.leavesRestrictions.future_advanceDays > 0) {
  //     if (formEndDate > this.todayDate || formStartDate > this.todayDate) {
  //       if (
  //         formStartDate < formattedFutureAdv ||
  //         formEndDate < formattedFutureAdv
  //       ) {
  //         this.toast.warning(
  //           `This leave can be only applied ${this.leavesRestrictions.future_advanceDays} days in advance`
  //         );
  //         return;
  //       }
  //     }
  //   }

  //   const newArray: any = [];
  //   this.fileArray?.map((doc: any) => {
  //     newArray.push(doc?.url);
  //   });

  //   let body = {
  //     leaveFor: formData.leaveFor,
  //     startDate: this.formatDate(formData.fromDate),
  //     endDate: this.formatDate(formData.toDate),
  //     leaveDays: formData.days_difference,
  //     justification: formData.reason,
  //     leaveId: formData.leaveId,
  //     departmentId: this.departmentId,
  //     employee_id: formData.employee_id,
  //     documents: newArray.length == 0 ? [...newArray, null] : newArray,
  //     days_details: formData.days_details,
  //     isDeleted: false,
  //   };
  //   this._commonService?.showLoader();
  //   this.LeaveApplyService.updateAppliedLeave(this.leaveId, body).subscribe(
  //     (res: any) => {
  //       this.toast.success(res.message);
  //       this._commonService?.hideLoader();
  //       this.router.navigate(['master/ess/leave-apply']);
  //     },
  //     (err: any) => {
  //       // if (err.status == 409) {
  //       //   this.toast.warning(err.error.message);
  //       //   return
  //       // }
  //       this._commonService?.hideLoader();
  //       return this.toast.error(err.error.message);
  //     }
  //   );
  // }

  onUpdateLeave() {
    // 1️⃣ Validate form fields
    const invalidFields: string[] = [];
    Object.keys(this.leaveForm.controls).forEach((key) => {
      const control = this.leaveForm.get(key);
      if (control && control.invalid) invalidFields.push(key);
    });

    this.leaveForm.markAllAsTouched();
    if (this.leaveForm.invalid) {
      this.toast.error('Required fields should not be invalid', 'Fields Error');
      console.warn('Invalid Fields:', invalidFields);
      return;
    }

    // 2️⃣ Validate uploaded files
    const invalidFile = this.fileArray.some((f: any) => f.valid === false);
    if (invalidFile) {
      this.toast.error('Invalid file, please upload a valid file');
      return;
    }

    // 3️⃣ Validate policy applicability
    if (!this.listCheck) {
      this.toast.error('This leave policy does not apply to you at this time.');
      return;
    }

    // 4️⃣ Extract and validate leave selection
    const formData = this.leaveForm.value;
    const rowObj = this.rowData.find((elem) => elem?.id == formData?.leaveId);
    if (!rowObj) {
      this.toast.warning('Invalid leave selected');
      return;
    }

    const total_available = rowObj.total_available || 0;
    let total = 0;

    // 5️⃣ Determine PAID / UNPAID leave type dynamically
    formData.days_details?.forEach((item: any) => {
      const leave_period = item?.leave_period == '0' ? 1 : 0.5;
      total += leave_period;
      item.leave_type = total <= total_available ? 'PAID' : 'UNPAID';
    });

    // 6️⃣ Ensure documents completeness
    if (
      this.fileArray.length > 1 &&
      this.fileArray.some((doc: any) => !doc.imagePath && !doc.url)
    ) {
      this.toast.warning('Please upload all the documents');
      return;
    }

    // 7️⃣ Prepare date objects
    const formStartDate = this.formatDate(formData.fromDate);
    const formEndDate = this.formatDate(formData.toDate);
    const formattedFutureAdv = this.datesFormatChangeForFuture(
      this.leavesRestrictions.future_advanceDays
    );
    const formattedPastDays = this.datesFormatChangeForPast(
      this.leavesRestrictions.past_days
    );

    const start = new Date(formStartDate);
    const end = new Date(formEndDate);
    const past = new Date(formattedPastDays);
    const future = new Date(formattedFutureAdv);

    console.log({
      start,
      end,
      past,
      future,
      today: this.todayDate,
      conditionPast: start < past || end < past,
      conditionFuture: start > future || end > future,
    });

    // 8️⃣ Core validations
    if (formData.days_difference === 0) {
      this.toast.warning('Please select valid dates');
      return;
    }

    if (!formData.leaveId) {
      this.toast.warning('Please select the leave before updating');
      return;
    }

    // 9️⃣ Short leave validation
    if (
      this.selectLeave_Name === 'Short Leave' &&
      parseFloat(formData.days_difference) !== 0.25
    ) {
      this.toast.warning('Short leave can only be applied for 0.25 day.');
      return;
    }

    // 🔟 Restriction checks
    if (this.leavesRestrictions.past_days > 0 && (start < past || end < past)) {
      this.toast.warning(
        `This leave can only be applied ${this.leavesRestrictions.past_days} days in the past`
      );
      return;
    }

    if (
      this.leavesRestrictions.future_advanceDays > 0 &&
      (start > future || end > future)
    ) {
      this.toast.warning(
        `This leave can only be applied ${this.leavesRestrictions.future_advanceDays} days in advance`
      );
      return;
    }

    if (
      this.leavesRestrictions.minRequest > 0 &&
      formData.days_difference < this.leavesRestrictions.minRequest
    ) {
      this.toast.warning(
        `You have to apply ${this.leavesRestrictions.minRequest} leaves minimum in a single time.`
      );
      return;
    }

    if (
      this.leavesRestrictions.maxRequest > 0 &&
      formData.days_difference > this.leavesRestrictions.maxRequest
    ) {
      this.toast.warning(
        `You can only apply ${this.leavesRestrictions.maxRequest} leaves maximum in a single time.`
      );
      return;
    }

    // 11️⃣ Prepare document URLs
    const newArray = this.fileArray.map((doc: any) => doc.url).filter(Boolean);

    // 12️⃣ Build final payload
    const body = {
      leaveFor: formData.leaveFor,
      startDate: formStartDate,
      endDate: formEndDate,
      leaveDays: formData.days_difference,
      justification: formData.reason,
      leaveId: formData.leaveId,
      departmentId: this.departmentId,
      employee_id: formData.employee_id || this.employeeId,
      documents: newArray.length ? newArray : [null],
      days_details: formData.days_details,
      isDeleted: false,
    };

    console.log('🧾 Update Payload:', body);

    // 13️⃣ API call
    this._commonService.showLoader();
    this.LeaveApplyService.updateAppliedLeave(this.leaveId, body).subscribe({
      next: (res: any) => {
        this.toast.success(res.message);
        this.router.navigate(['master/ess/leave-apply']);
        this._commonService.hideLoader();
      },
      error: (err: any) => {
        this._commonService.hideLoader();
        this.toast.error(err.error?.message || 'Update failed');
      },
    });
  }

  totalLeaveFormatter(params: any): string {
    return params.value === null ? 'N/A' : params.value;
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  changeLeaveFor() {
    // if (this.mode == 'viewMode') return;
    const employeeControl = this.leaveForm.get('employee_id');
    this.rowData = [];
    this.leaveForm.patchValue({
      employee_id: null,
      leaveName: null,
      fromDate: null,
      toDate: null,
      days_difference: null,
      leaveInputName: null,
      reason: null,
      file: null,
    });
    // this.leaveForm.patchValue
    if (this.leaveForm?.value?.leaveFor == 'ME') {
      employeeControl?.clearValidators();
      if (this.leaveId) {
        this.getEmployeeLeaveDetails();
      }
      this.role_id = localStorage.getItem('role_master_id');
      this.marital = localStorage.getItem('marital');
      this.userlocation = localStorage.getItem('location');
      this.gender = localStorage.getItem('gender');
      this.designation = localStorage.getItem('designation');
      this.getDepartmentLeaves(
        this.departmentId,
        this.approvalEmployeeId ? this.approvalEmployeeId : this.employeeId,
        this.entity_id
      );
    } else {
      employeeControl?.setValidators(Validators.required);
    }
    employeeControl?.updateValueAndValidity();
  }

  handleChange(e: any) {
    this.employeeList.forEach((value: any) => {
      if (value.employee_id == e.value) {
        this.marital = value.marital_status;
        this.userlocation = value.location_id;
        this.gender = value.gender;
        this.designation = value.designation_id;
        this.role_id = value.role_master_id;
        this.departmentId = value.department_id;
      }
    });

    this.getDepartmentLeaves(
      this.departmentId,
      this.leaveForm?.value?.employee_id,
      this.entity_id
    );
  }

  onApproveLeave() {
    let flag = false;
    this.fileArray.map((value: any) => {
      if (value.valid == false) {
        flag = true;
      }
    });

    if (flag) {
      this.toast.error(`Invalid file, please upload a valid file`);
      return;
    }

    if (this.approvalForm?.invalid) {
      return this.toast.error(
        'Required fields should not be invalid',
        'Fields Error'
      );
    }

    let val = this.approvalForm?.value;
    let req = {
      applied_leave_id: this.leaveId,
      approved_start_date: this.approved_start_date,
      approved_end_date: this.approved_end_date,
      approved_days: val?.approved_days,
      approval_status: this.actionFor,
      remarks: this.remarks,
    };
    this._commonService?.showLoader();
    this.LeaveApplyService.update_leave_approval_status(req).subscribe(
      (res: any) => {
        this.toast.success(res?.message);
        this.goBack();
        this._commonService?.hideLoader();
      },
      (err: any) => {
        console.error('Error fetching leave data', err);
        this._commonService?.hideLoader();
      }
    );
  }
}
