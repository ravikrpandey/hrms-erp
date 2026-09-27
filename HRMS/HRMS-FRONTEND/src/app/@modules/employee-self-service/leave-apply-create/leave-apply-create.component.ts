import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { GridApi, GridReadyEvent, ValueFormatterService } from 'ag-grid-community';
import 'ag-grid-enterprise';
import { MatDialog } from '@angular/material/dialog';
import { ActionComponent } from '../employee/employee-list/action/action.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LeaveApplyService } from 'src/app/@shared/services/ess/leave-apply.service';
import { Location } from '@angular/common';
import moment from 'moment';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';
import { LeaveManagementService } from 'src/app/@shared/services/leave-managemnet/leave-management.service';
import { MatRadioChange } from '@angular/material/radio';
import { CommonService } from 'src/app/@shared/services/common.service';


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
  rowData: any[] = [];
  leavesMaster: any = []; // Example leave types
  selectedLeave: any;
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
  leaveId: any;
  mode: any;
  approvalEmployeeId: any;
  removeButton: boolean = false;
  fileArray: any[] = [];
  fileGetCheck: any;
  imagePath: any;
  fileGet: any;
  dateRange: Array<{ date: string, displayDate: string, leave_day: string, weekOffType: any }> = [];
  toDate: string;
  fromDate: string;
  dataSource: any;
  dateRangeString: string;
  // daysDetails: FormArray;
  policyPastDays: any
  policyFutureDays: any
  policyFutureAdvance: any
  policyMinRequest: any
  policyMaxRequest: any
  policyDurations: any[] = [];
  leavesRestrictions: any;
  leavesDetail: any;
  weekends: { leave_day: string; }[];

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


  employees: any[] = [];       // fetched from backend
  employeeList2: any[] = [];   // unfiltered full list
  employeeList: any[] = [];

  leavesMaster2: any;
  leaves: any;
  employee_id: any;
  weekOff: any;
  weekOffList: any;
  holidayList: any;
  back() {
    history.back();
  }


  goBack() {
    this.location.back();
  }

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private leaveManagementService: LeaveManagementService,
    private toast: ToastrService,
    private router: Router,
    private activeroute: ActivatedRoute,
    private LeaveApplyService: LeaveApplyService,
    private location: Location,
    private _commonService: CommonService
  ) {
    // Retrieve the stored JSON string from localStorage

    const signInUser = localStorage.getItem('signInUser');

    if (signInUser) {
      // Parse the JSON string to get the JavaScript object
      const userObject = JSON.parse(signInUser);
      // Access the employee_id field from the parsed object
      this.employeeId = userObject.employee_id;
    } else {
      console.error("No signInUser found in localStorage");
    }

    this.role_id = localStorage.getItem('role_master_id');
    this.departmentId = localStorage.getItem('department_id');
    this.financialId = localStorage.getItem('financial_id');
    this.entity_id = localStorage.getItem('selectedEntityId')
    this.marital = localStorage.getItem('marital');
    this.userlocation = localStorage.getItem('location');
    this.gender = localStorage.getItem('gender');
    this.designation = localStorage.getItem('designation')

    this.activeroute.queryParams.subscribe(params => {
      this.leaveId = params['leave_ID'];
      this.mode = params['mode'];
      if (this.mode == 'editMode') {
        this.closeDisable = false;
      }
      this.status = params['status'];
      this.approvalEmployeeId = params['approvalEmployeeId'];
      this.actionFrom = params['actionFrom'];
      this.actionFor = params['actionFor'];

      if (this.approvalEmployeeId) {
        this.role_id = params['role'];;
        this.departmentId = params['departmentId'];;
        this.marital = params['marital'];;
        this.userlocation = params['userlocation'];;
        this.gender = params['gender'];;
        this.designation = params['designation'];
      }
      if (this.leaveId) {
        this.getEmployeeLeaveDetails()
      }
    });

    if (this.actionFor == 'APPROVED') {
      this.approvalActinName = 'Approve'
    }
    else {
      this.approvalActinName = 'Reject'
    }



    this.rowClass = 'rowClass';

    this.leaveForm = this.fb.group({
      leaveId: new FormControl(null, [Validators.required]),
      employee_id: new FormControl(null, [Validators.required]),
      leaveName: new FormControl(null),
      leaveFor: new FormControl('ME', [Validators.required]),
      fromDate: new FormControl(null, [Validators.required]),
      toDate: new FormControl(null, [Validators.required]),
      days_difference: new FormControl(null),
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
          tempp_leave_period: new FormControl(),
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
      this.policies(value);

      if (value) {
        this.leaveForm.get('leaveId')?.patchValue(value);
      }

    });




    this.getDepartmentLeaves(this.departmentId, this.approvalEmployeeId ? this.approvalEmployeeId : this.employeeId, this.entity_id)


    // FOR OTHER UI==============================================================>>
    this.leaveForm.get('leaveFor')?.valueChanges.subscribe((valueFor) => {
      if (valueFor == 'TEAMMATE') {
        this.showEmployeeName = true;
        this.leaveForm.get('leaveTotal')?.setValue(null)
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
      }
      ;
      this.fromDate = moment(fromDate).startOf('day').format('YYYY-MM-DD');
    });


    this.leaveForm.get('toDate')?.valueChanges.subscribe((toDate) => {
      this.calculateDaysDifference();
      this.toDate = moment(toDate).startOf('day').format('YYYY-MM-DD');
      this.dateRange = this.getDatesInRange(this.fromDate, this.toDate);


      // this.weekends = this.dateRange.map(item => {
      //   const [day] = item.split(',');
      //   const leave_day = day.trim().charAt(0).toUpperCase() + day.trim().slice(1).toLowerCase();  // Capitalize the first letter and make the rest lowercase
      //   return { leave_day };
      // });


      console.log('this.dateRange:', this.dateRange);
      const daysDetails = this.dateRange.map(item => {
        console.log('Raw item:', item);

        // Use the date field directly
        const dateStr = item.date;  // e.g. "2025-05-27"
        console.log('Using date string:', dateStr);

        // Parse date with moment - ISO format is default recognized
        const momentDate = moment(dateStr);
        console.log('Parsed momentDate:', momentDate.format(), 'isValid:', momentDate.isValid());

        if (!momentDate.isValid()) {
          console.error('Invalid date encountered:', dateStr);
        }

        const leaveDate = momentDate.format('YYYY-MM-DD');
        console.log('Formatted leaveDate:', leaveDate);

        // Use the leave_day field or derive day name from moment if you want
        const dayName = item.leave_day || momentDate.format('dddd');
        console.log('Day name:', dayName);

        const leaveDay = dayName.substring(0, 3);
        console.log('Leave day (3-letter):', leaveDay);

        const weekOfMonth = this.getWeekOfMonth(momentDate);
        console.log('Week of month:', weekOfMonth);

        const combinedDayDate = this.combinedDayDate(leaveDay, leaveDate);
        console.log('Combined dayDate:', combinedDayDate);

        const isHoliday = (this.holidayList || []).some((h: any) => {
          const isActive = h.status === 'ACTIVE';
          const notDeleted = !h.isDeleted;
          const isSameDate = h.date === leaveDate;
          const result = isActive && notDeleted && isSameDate;
          return result;
        });
        console.log('Is holiday:', isHoliday);

        const weeklyOff = (this.weekOffList || []).find((off: any) => {
          const dayMatch = off.day === dayName;
          const weekMatch = off.week === weekOfMonth;
          const found = dayMatch && weekMatch;
          console.log(`Checking weeklyOff: day=${off.day}, week=${off.week}, dayMatch=${dayMatch}, weekMatch=${weekMatch} => ${found}`);
          return found;
        });
        console.log('Weekly off found:', weeklyOff);

        let leavePeriod = '0'; // Default to full day
        if (isHoliday || (weeklyOff && weeklyOff.type === 'Full Day')) {
          leavePeriod = '0';
        } else if (weeklyOff && weeklyOff.type === '1st Half') {
          leavePeriod = '2'; // Only 2nd half allowed
        } else if (weeklyOff && weeklyOff.type === '2nd Half') {
          leavePeriod = '1'; // Only 1st half allowed
        } else {
          if (this.policyDurations.includes('FULL DAY')) {
            leavePeriod = '0';
          } else if (this.policyDurations.includes('HALF DAY')) {
            leavePeriod = '1';
          }
        }
        console.log('Final leavePeriod:', leavePeriod);

        return {
          dayDate: combinedDayDate,
          leave_day: leaveDay,
          leave_date: leaveDate,
          leave_period: leavePeriod,
        };
      });





      // if (this.mode === 'addMode') {
      //   this.addDaysDetails(daysDetails);
      // } else if (this.mode === 'editMode') {
      //   const oldDates = (this.leaveForm.get('days_details') as FormArray).controls
      //     .map(control => control.get('leave_date')?.value)
      //     .join(',');
      //   const newDates = daysDetails.map(d => d.leave_date).join(',');

      //   if (oldDates !== newDates) {
      //     this.addDaysDetails(daysDetails);
      //   }
      // }
      if (this.mode === 'addMode') {
        this.addDaysDetails(daysDetails);
      } else if (this.mode === 'editMode') {
        const control = this.leaveForm.get('days_details') as FormArray;

        // Step 1: Map existing leave_date to its leave_period
        const existingLeavePeriods: { [date: string]: string } = {};
        control.controls.forEach(ctrl => {
          const date = ctrl.get('leave_date')?.value;
          const period = ctrl.get('leave_period')?.value;
          if (date) {
            existingLeavePeriods[date] = period;
          }
        });

        // Step 2: Patch while preserving old leave_period if date matches
        const updatedDays = daysDetails.map(day => {
          const preservedPeriod = existingLeavePeriods[day.leave_date];
          return {
            ...day,
            leave_period: preservedPeriod !== undefined ? preservedPeriod : day.leave_period
          };
        });

        // Step 3: Apply updatedDays
        this.addDaysDetails(updatedDays);
      }


      this.onLeavePeriodChange('abc')
    })

    this.approvalDateValidation();

  }


  policies(value: any) {
    this.policyRestriction(value);
  }


  resetDates(value: any) {
    this.leaveForm.get('fromDate')?.reset();
    this.leaveForm.get('toDate')?.reset();
    this.leaveForm.get('days_difference')?.reset();

    // this.policyRestriction(value);
    // this.policyDetail(value);
  }



  ngOnInit(): void {

    let lg: any = localStorage.getItem('signInUser')
    let loginUser = JSON.parse(lg);
    this.employee_id = loginUser.employee_id;
    this.todayDate = this.today.format('YYYY-MM-DD');

    if (this.mode === 'viewMode' || 'editMode') {
      // Disable the form
      if (this.leaveId) {
        this.getEmployeeLeaveDetails()
      }
      // this.leaveForm.disable();
    }

    this.get_allemployeeBY_managerID();
    this.changeLeaveFor();
  }



  // approval date validation start
  approved_start_date: string;
  approved_end_date: string;
  approvalDateValidation() {
    this.approvalForm.get('approved_start_date')?.valueChanges.subscribe((approved_start_date) => {
      this.calculateDaysDifferenceForApproval();
      this.minDate = moment(approved_start_date).startOf('day').format('YYYY-MM-DD');
      this.approved_start_date = moment(approved_start_date).startOf('day').format('YYYY-MM-DD');
    });


    this.approvalForm.get('approved_end_date')?.valueChanges.subscribe((approved_end_date) => {
      // this.calculateDaysDifferenceForApproval();
      this.approved_end_date = moment(approved_end_date).startOf('day').format('YYYY-MM-DD');
      this.dateRange = this.getDatesInRange(this.approved_start_date, this.approved_end_date);
      // this.onLeavePeriodChange2()
    })
  }

  calculateDaysDifferenceForApproval(): void {
    const approved_start_date = this.approvalForm.get('approved_start_date')?.value;
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
  // approval date validation end


  onLeavePeriodChange(event: any): void {
    const daysDetailsArray = this.leaveForm.get('days_details') as FormArray;
    let total = 0;

    daysDetailsArray.controls.forEach(control => {
      const leavePeriod = control.get('leave_period')?.value;
      const weekOffType = control.get('weekOffType')?.value;

      // Skip if leave period is not applicable due to weekly off
      if ((leavePeriod === '0' && weekOffType === 'Full Day') ||
        (leavePeriod === '1' && weekOffType === '1st Half') ||
        (leavePeriod === '2' && weekOffType === '2nd Half')) {
        return; // skip this day
      }
      // this.weekOff = weekOffType;
      if (leavePeriod === '0') {
        total += 1.0;
      } else if (leavePeriod === '1' || leavePeriod === '2') {
        total += 0.5;
      }
    });

    this.leaveForm.get('days_difference')?.setValue(total.toFixed(1));
  }


  // onLeavePeriodChange2(): void {
  //   const daysDetailsArray = this.leaveForm.get('days_details') as FormArray;
  //   let total = 0;
  //   ;
  //   this.dateRange2 = []
  //   this.dateRange.map((value, index) => {
  //     this.dateRange2[index] = value.substring(5);
  //   })

  //   // Loop through each form group and calculate the sum
  //   daysDetailsArray.controls.forEach(control => {
  //     let x = control.get('dayDate')?.value?.substring(5);
  //     console.log(this.dateRange2)
  //     if (this.dateRange2.includes(x)) {
  //       const leavePeriod = control.get('leave_period')?.value;
  //       if (leavePeriod === '0') {  // Full Day
  //         total += 1.0;
  //       } else if (leavePeriod === '1' || leavePeriod === '2') {  // Half Day
  //         total += 0.5;
  //       }
  //     }
  //   });

  //   this.approvalForm.get('approved_days')?.setValue(total.toFixed(1))
  // }


  // List of Leave Available according to the Department  
  public columnDefs = [
    {
      headerName: 'S.No.',
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
      valueGetter: (params: any) => `${params.data.leave_name} -${params.data.leave_code}`,
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
      valueFormatter: (params: any) => params.value === 0 ? 'N/A' : params.value,
    },
    {
      headerName: 'Leaves In Quota',
      field: 'no_of_days',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      valueFormatter: (params: any) => params.value == 0.00 ? 'N/A' : params.value,
    },
    {
      headerName: 'Available',
      field: 'available_days',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      valueFormatter: (params: any) => params.value == 0.00 ? 'N/A' : params.value,
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
      valueFormatter: (params: any) => params.value === null ? 'N/A' : params.value,
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

        if (totalAvailable !== null && totalAvailable !== 'N/A' && totalApproved > totalAvailable) {
          return { color: 'red' };
        }

        return null;
      }
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
      headerName: 'Extra Approved Leaves',
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
    }];


  addDaysDetails(dayDetails: any[]) {
    const control = this.leaveForm.get('days_details') as FormArray;
    control.clear();  // Clear existing controls if needed
    ;
    dayDetails.forEach(item => {
      control.push(this.fb.group({
        dayDate: this.mergeDayDate(item),
        leave_day: [item.leave_day],
        leave_date: [item.leave_date],
        leave_period: [item.leave_period]
      }));
    });
  }


  calculateDaysDifference(): void {
    const fromDate = this.leaveForm.get('fromDate')?.value;
    const approved_end_date = this.leaveForm.get('approved_end_date')?.value;
    ;
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
      count++; // Count every day
      current.add(1, 'day');
    }

    return count;
  }

employeeSearch(e: any): void {
  this.employeeList = e?.data ?? [];
}

  // employeeSearch(e: any) {
  //   const aa = e
  //   let filteredVariable = this.employeeList2.filter((item: any) => aa.includes(item?.first_name + ' ' + item?.last_name + ' ' + item?.employee_code));
  //   this.employeeList = filteredVariable
  // }

  leavesSearch(e: any) {
    const aa = e
    let filteredVariable = this.leavesMaster2.filter((item: any) => aa.includes(item.leave_name + " - " + item.leave_code));
    this.leavesMaster = filteredVariable
  }

  // getDatesInRange(start: string, end: string): string[] {
  //   const startDate = moment(start);
  //   const endDate = moment(end);
  //   const dates = [];

  //   let currentDate = startDate;
  //   while (currentDate <= endDate) {
  //     dates.push(currentDate.format('ddd').toUpperCase() + ' ,' + currentDate.format('DD-MM-YYYY'));
  //     currentDate = currentDate.add(1, 'days');
  //   }
  //   return dates;
  // }


  isFullDayActive(): boolean {
    return this.policyDurations.includes('FULL DAY');
  }

  isHalfActive(): boolean {
    return this.policyDurations.includes('HALF DAY');
  }
  isWeeklyOffDay(control: FormGroup): boolean {
    const leaveDayShort = control.get('leave_day')?.value || '';
    const leavePeriod = control.get('leave_period')?.value?.toString();

    // Convert short day to full day
    const dayMap: { [key: string]: string } = {
      Mon: 'Monday',
      Tue: 'Tuesday',
      Wed: 'Wednesday',
      Thu: 'Thursday',
      Fri: 'Friday',
      Sat: 'Saturday',
      Sun: 'Sunday'
    };
    const fullLeaveDay = dayMap[leaveDayShort] || '';

    const weeklyOff = this.weekOffList.find((off: any) => off.day === fullLeaveDay);

    return !!weeklyOff && (leavePeriod === '1' || leavePeriod === '2');
  }



  policyRestriction(leave_id: any) {
    // this._commonService?.hideLoader()
    this.leaveManagementService.GetLeaveRestrictionsById(leave_id, this.financialId, this.entity_id, this.employeeId).subscribe((res: any) => {
      // this._commonService?.hideLoader()
      this.leavesRestrictions = res.data;
      this.policyPastDays = this.leavesRestrictions.past_days
      this.policyFutureDays = this.leavesRestrictions.future_next
      this.policyFutureAdvance = this.leavesRestrictions.future_advanceDays
      this.policyMinRequest = this.leavesRestrictions.minRequest
      this.policyMaxRequest = this.leavesRestrictions.maxRequest
      this.policyDurations = this.leavesRestrictions.durations.map((item: any) => item.duration);
      this.policyDetail(leave_id)
    }, (err: any) => {
      // this._commonService?.hideLoader()
    })
  }



  policyDetail(leave_id: any) {
    let formData = this.leaveForm.value;

    // this._commonService?.hideLoader()
    this.leaveManagementService.GetLeavePolicyDetail(leave_id, this.financialId, this.entity_id, formData?.employee_id ? formData?.employee_id : this.employeeId).subscribe((res: any) => {
      console.log("8888888888888888888888888888888888", res)
      this.holidayList = res.holidays
      this.weekOffList = res.result
      // this._commonService?.hideLoader()
      this.leavesDetail = res.data[0];
      this.startDate = this.leavesDetail.startDate
      this.endDate = this.leavesDetail.endDate
      this.policy_validity = this.leavesDetail.policy_validity
      this.leaveType = this.leavesDetail.leave_type
      this.now = new Date(this.startDate);
      if (this.endDate) {
        this.max = new Date(this.endDate);
      } else {
        this.max = new Date(9999, 11, 31);
      }
      ;
      if (this.now < new Date()) {
        this.now = new Date(); // Set this.now to today
      }
      this.minDate = moment(this.now).startOf('day').format('YYYY-MM-DD');
      if (this.leavesRestrictions?.past_days > 0) {
        ;
        this.now = moment().subtract(this.leavesRestrictions?.past_days, 'days').toDate();
        if (this.now > new Date(this.startDate)) {
          // all good
        } else {
          this.now = new Date(this.startDate);
        }
      }
      this.minDate = moment(this.now).startOf('day').format('YYYY-MM-DD');

    }, (err: any) => {
      // this._commonService?.hideLoader()
    })
  }


  //   myHolidayFilter = (d: any): boolean => {
  //     const time=d.getTime();
  //     return !this.myHolidayDates.find((x:any)=>x.getTime()==time);
  // }

  routeToCreateLeave() {
    this.router.navigate(['master/ess/leave-apply'])
  }

  preventCopyPaste(event: ClipboardEvent): void {
    event.preventDefault();
    this.leaveForm.get('reason')?.setErrors({ copyPasteNotAllowed: true });
  }


  // Get employee leave details by ID.
  async getEmployeeLeaveDetails() {
    this.LeaveApplyService.getAppliedLeaveById(
      this.leaveId, this.financialId, this.entity_id, this.approvalEmployeeId ? this.approvalEmployeeId : this.employeeId, this.role_id).subscribe(
        (res: any) => {
          // this._commonService?.hideLoader()
          let formData = res.data[0];

          this.minDate = moment(formData.end_date).subtract(1, 'day').format('YYYY-MM-DD');
          const dateParts = formData?.start_date.split('-');
          formData.start_date = new Date(formData.start_date + 'T00:00:00');
          formData.end_date = new Date(formData.end_date + 'T00:00:00');

          this.leaveForm.get('fromDate')?.patchValue(formData.start_date);
          this.leaveForm.get('toDate')?.patchValue(formData.end_date);

          this.approvalForm.get('approved_start_date')?.patchValue(formData.start_date, { emitEvent: true });
          this.approvalForm.get('approved_end_date')?.patchValue(formData.end_date, { emitEvent: true });

          if (this.status == 'APPROVED') {
            formData.approved_start_date = new Date(formData.approved_start_date + 'T00:00:00');
            formData.approved_end_date = new Date(formData.approved_end_date + 'T00:00:00');
            this.approvalForm.get('approved_start_date')?.patchValue(formData.approved_start_date, { emitEvent: true });
            this.approvalForm.get('approved_end_date')?.patchValue(formData.approved_end_date, { emitEvent: true });
          }
          this.fileGet = formData?.documents[0]?.uploaded_document;


          // Update the existing form instance with new values
          this.leaveForm.patchValue({
            leaveId: formData.leaveId,
            leaveName: formData.leaveId,
            leaveFor: formData.leave_for,
            days_difference: Number(formData.leave_days),
            employee_id: formData.employee_id,
            reason: formData.justification,
            file: formData.documents.length > 0 ? formData.documents[0].uploaded_document : this.fileArray.push({ imagePath: null, url: null }),
            leaveInputName: formData.HRMS_LEAVE_MASTER.leave_name
          }, { emitEvent: true });

          this.startDateVld = new Date(formData?.start_date);
          this.endDateVld = new Date(formData?.end_date);
          console.log(this.startDateVld, this.endDateVld)

          this.approvalForm.patchValue({
            approved_days: Number(formData.leave_days),
          }, { emitEvent: true });

          if (this.status == 'APPROVED') {
            this.approvalForm.patchValue({
              approved_days: Number(formData.approved_days),
            }, { emitEvent: true });
          }

          if (this.leaveForm?.value?.leaveFor == 'TEAMMATE') {
            this.leaveForm.patchValue({
              employee_id: formData?.employee_id
            }, { emitEvent: true });
          }

          // Set file array with documents
          this.fileArray = formData.documents.map((doc: any) => ({
            imagePath: null,
            url: doc.uploaded_document,
            file: null
          }));

          // this.policyRestriction(formData.leaveId);
          // this.policyDetail(formData.leaveId);
          ;
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
            })
          }



          this.onLeavePeriodChange('abc');
          this.calculateDaysDifference();

          if (this.mode == "viewMode") {
            this.removeButton = true;
          }
          this.showUpdate = true;
        },
        (err: any) => {
          console.error('Error fetching leave data', err);
          // this._commonService?.hideLoader()
        }
      );
  }


  mergeDayDate(data: any) {
    const formattedDate = moment(data.leave_date).format('DD-MM-YYYY');
    const mergedDayDate = `${data.leave_day}, ${formattedDate}`;
    return mergedDayDate
  }

  combinedDayDate(day: any, date: any) {
    const mergedDayDate2 = `${day}, ${date}`;
    return mergedDayDate2
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
      leave_period: [dayDetail.leave_period, Validators.required]
    });
  }




  getEntityUsers(financialId: any, employeeId: any, entity_id: any) {
    this.LeaveApplyService.getEntityUsers(this.financialId, employeeId, entity_id).subscribe(
      (res: any) => {
        this.rowData = res.data;
        this.leavesMaster = res.data;
        this.leavesMaster2 = res.data;
        this.leaves = this.leavesMaster2.map((res: any) => { return res.leave_name + " - " + res.leave_code });
      },
      (err: any) => {
        // this.toaster.error(${err.error.message});
        console.error('Error fetching leave data', err);
      }
    );
  }


  get_allemployeeBY_managerID() {
    this.LeaveApplyService.get_allemployeeBY_managerID(this.employeeId).subscribe(
      (res: any) => {

         this.employeeList = res.data;
      this.employeeList2 = res.data;
      this.employees = [...this.employeeList2]
        // this.employeeList = res.data;
        // this.employeeList2 = res.data;
        // this.employees = this.employeeList2.map((res: any) => { return res?.first_name + ' ' + res?.last_name + ' ' + res?.employee_code });
        console.log("+++++", this.employeeList)
      },
      (err: any) => {
        // this.toaster.error(${err.error.message});
        console.error('Error fetching leave data', err);
      }
    );
  }

  onLeaveSelect(value: any) {
    this.leaveForm.get('fromDate')?.patchValue(null)
    this.leaveForm.get('toDate')?.patchValue(null)
    this.leaveForm.get('reason')?.patchValue(null)
    this.fileArray = []
    this.fileArray.push({ imagePath: null, url: null });
    this.LeaveApplyService.getValidLeave(this.employeeId, this.entity_id, value).subscribe(
      (res: any) => {
        ;
        if (!res.flag) {
          this.toast.error(res.message)
          this.listCheck = false;
        } else {
          this.listCheck = true;
        }
      },
      (err: any) => {
        this.toast.error(err.error.message);
        this.inputOnly = null;

      }
    );
  }

  filterLeaveType: any;
  getDepartmentLeaves(departmentId: any, employeeId: any, entity_id: any) {
    // this._commonService?.showLoader()
    this.LeaveApplyService.getLeaveByDepartment(this.financialId, departmentId, employeeId, entity_id,
      this.marital, this.userlocation, this.gender, this.designation, this.role_id).subscribe(
        (res: any) => {
          this.rowData = res.data;
          this.leavesMaster = res.data;
          this.filterLeaveType = [...this.leavesMaster]
          this.leavesMaster2 = res.data;
          this.leaves = this.leavesMaster2.map((res: any) => { return res.leave_name + " - " + res.leave_code });
          // this._commonService?.hideLoader()
        },
        (err: any) => {
          // this._commonService?.hideLoader()
          // this.toaster.error(${err.error.message});
          console.error('Error fetching leave data', err);
        }
      );
  }




  // ===================DOCUMENT UPLOADING CALLS======================================================================



  onChange(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      this.closeDisable = false
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imagePath = file.type === 'application/pdf' ? "/assets/icons/pdfimg.png" : e.target.result;
        this.fileArray[index].imagePath = imagePath;
        this.fileArray[index].valid = true;
        if (!(file.type == 'image/jpeg' ||
          file.type == 'image/png' ||
          file.type == 'image/gif' ||
          file.type == 'image/webp' ||
          file.type == 'image/svg+xml' ||
          file.type == 'image/tiff' ||
          file.type == 'application/pdf' ||
          file.type == 'application/msword' ||
          file.type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          file.type == 'application/vnd.ms-excel' ||
          file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
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

      this.LeaveApplyService.documentsUpdate(formData).subscribe((res: any) => {
        this.fileArray[index].url = res?.url;
      }, (err: any) => {
        // this.toast.error(`${err?.error?.message}`);
      });
    }
  }


  // addFileInput(index: number) {
  //   console.log('fileArray', this.fileArray);

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
    // console.log('fileArray', this.fileArray);
    if (this.fileArray.some(fileItem => !fileItem.imagePath && !fileItem.url) && this.mode != 'editMode') {
      return this.toast.warning("Please upload file first");
    }
    if ((this.fileGetCheck !== undefined || this.fileArray.some(fileItem => fileItem.url !== null)) && this.mode == 'editMode') {
      if (this.fileArray.some(fileItem => !fileItem.url && !fileItem.imagePath)) {
        return this.toast.warning("Please upload the file first");
      }
      this.fileArray.splice(index + 1, 0, { imagePath: null, url: null });
      this.fileGetCheck = undefined;
      return
    }
    if (this.fileGetCheck !== undefined || this.fileArray.some(fileItem => fileItem.imagePath && fileItem.url !== null)) {
      this.fileArray.splice(index + 1, 0, { imagePath: null, url: null });
      this.fileGetCheck = undefined;
      return
    }
    else {
      return this.toast.warning("Please upload the file first");
    }
  }

  removeFileInput(index: number) {
    this.closeDisable = false
    if (this.fileArray.length >= 0) {
      this.fileArray.splice(index, 1);
      console.log('fileArray', this.fileArray);

      if (this.fileArray.length === 0) {
        this.fileArray.push({ imagePath: null, url: null });
        this.closeDisable = true
      }

    } else {
      // this.fileArray.push({ imagePath: null, url: null });
      this.toast.warning("At least one file input must be present.");
    }
  }

  sevralUrl() {
    return environment.serverUrl + '/uploaded_files/';
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
    const serverUrl = environment.serverUrl;
    return `${serverUrl}/${uploadDoc}`;
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
    let formattedDate = newDate.format('YYYY-MM-DD');
    return formattedDate
  }
  datesFormatChangeForPast(noDay: any) {
    let today = moment();
    let newDate = today.subtract(noDay, 'days');
    let formattedDate = newDate.format('YYYY-MM-DD');
    return formattedDate
  }


  // ===================================================================================================================



  formatDate(date: string): string {
    return moment(date).format('YYYY-MM-DD');
  }


  onApplyLeave() {
    let flag = false;
    this.fileArray.map((value: any) => {
      if (value.valid == false) {
        flag = true;
      }
    })

    if (flag) {
      this.toast.error(`Invalid file, please upload a valid file`);
      return;
    }
    if (!this.listCheck) {
      this.toast.error("This leave policy not apply on you to this time.")
      return;
    }

    if (this.leaveForm?.invalid) {
      return this.toast.error('Required fields should not be invalid', 'Fields Error');
    }

    let formData = this.leaveForm.value;
    // let rowObj = this.rowData?.find((elem) => elem?.id == formData?.leaveId);
    // let total_available = rowObj?.total_available;
    // let total = 0;
    formData?.days_details?.map((item: any) => {
      item.leave_type = this.leaveType

    })
      ;
    // Documents validations
    if (this.fileArray.length > 1) {
      if (this.fileArray.some((doc: any) => doc.imagePath === null && doc.url === null)) {
        this.toast.warning('Please upload all the documents');
        return
      }
      if (this.fileArray.some((doc: any) => (doc.imagePath || doc.url) && !doc.valid)) {
        this.toast.warning('Please upload valid documents');
        return
      }
    }
    if (formData.days_difference == 0) {
      this.toast.warning('Invalid date for this leave!');
      return;
    }

    const formStartDate = this.formatDate(formData.fromDate);
    const formEndDate = this.formatDate(formData.toDate);
    const selectedStartDate = this.formatDate(this.startDate)
    const selectedEndDate = this.formatDate(this.endDate);
    const formattedFutureAdv = this.datesFormatChangeForFuture(this.policyFutureAdvance);
    const formattedPastDays = this.datesFormatChangeForPast(this.policyPastDays);

    // Weekend Leave Apply Check
    if (formData.days_difference === 0) {
      this.toast.warning('Please select other dates');
      return;
    }

    // Check if leave is selected or not
    const leaveTypeNotSelected = formData.leaveId === true;
    if (leaveTypeNotSelected) {
      const errorMessage = 'Please select the leave before applying';
      this.toast.warning(errorMessage)
      return;
    }


    // Past days Check 
    if (this.policyPastDays > 0) {
      if ((formStartDate) < formattedPastDays || (formEndDate) < formattedPastDays) {
        this.toast.warning(`This leave can be only applied ${this.policyPastDays} days in past`)
        return;
      }
    }


    // Future Advance days Check 
    if (this.policyFutureAdvance > 0) {
      if ((formEndDate) > this.todayDate || (formStartDate) > this.todayDate) {
        if ((formStartDate) < formattedFutureAdv || (formEndDate) < formattedFutureAdv) {
          this.toast.warning(`This leave can be only applied ${this.policyFutureAdvance} days in advance`);
          return;
        }
      }
    }


    ;
    // Check if any dates does not lie between the leave validation 
    const invalidDates = formStartDate < selectedStartDate;
    const invalidDates2 = selectedEndDate !== null && formEndDate > selectedEndDate;
    // if (invalidDates || invalidDates2) {
    //   this.toast.warning(`Please select different dates to apply this leave.`)
    //   return;
    // }

    // Check for Min Request in a single time
    if (this.policyMinRequest > 0) {
      if (formData.days_difference < this.policyMinRequest) {
        this.toast.warning(`You have to apply ${this.policyMinRequest} leaves minimum in a single time.`)
        return;
      }
    }

    // Check for Max Request in a single time
    if (this.policyMaxRequest > 0) {
      if (formData.days_difference > this.policyMaxRequest) {
        this.toast.warning(`You can only apply ${this.policyMaxRequest} leaves maximum in a single time.`)
        return;
      }
    }

    const newArray: any = []
    const invalidFiles = this.fileArray.some(fileItem => !fileItem.imagePath && !fileItem.url);
    if (!invalidFiles) {
      this.fileArray?.map((doc: any) => {
        newArray.push(doc?.url)
      })
    }

    let body = {
      "leaveFor": formData.leaveFor,
      "startDate": formStartDate,
      "endDate": formEndDate,
      "leaveDays": formData.days_difference,
      "justification": formData.reason,
      "leaveId": formData.leaveId,
      "departmentId": this.departmentId,
      // "employee_id": formData.employee_id,
      "documents": newArray.length == 0 ? [...newArray, null] : newArray,
      "days_details": formData.days_details,
      "isDeleted": false,
      "financial_year_id": this.financialId,
      created_by: this.employeeId,
      employee_id: formData?.employee_id ? formData?.employee_id : this.employeeId,
    }

    this.LeaveApplyService.applyLeave(body).subscribe(
      (res: any) => {
        this.toast.success(res.message);
        this.router.navigate(['master/ess/leave-apply'])
        // this._commonService?.hideLoader()
      },
      (err: any) => {
        // if (err.status == 409) {
        //   this.toast.warning(err.error.message);
        //   return
        // }
        // this._commonService?.hideLoader()
        return this.toast.error(err.error.message);
      });
  }


  onUpdateLeave() {

    let invalidFields: any = []
    Object.keys(this.leaveForm.controls).forEach((key) => {
      const control = this.leaveForm.get(key);
      if (control && control.invalid) {
        invalidFields.push(key);
      }
    });

    if (this.leaveForm?.invalid) {
      return this.toast.error('Required fields should not be invalid', 'Fields Error');
    }

    console.log('Invalid fields:', invalidFields);
    let flag = false;
    this.fileArray.map((value: any) => {
      if (value.valid == false) {
        flag = true;
      }
    })

    if (flag) {
      this.toast.error(`Invalid file, please upload a valid file`);
      return;
    }

    if (!this.listCheck) {
      this.toast.error("This leave policy not apply on you to this time.")
      return;
    }

    let formData = this.leaveForm.value;
    let rowObj = this.rowData?.find((elem) => elem?.id == formData?.leaveId);
    let total_available = rowObj?.total_available;
    let total = 0;
    formData?.days_details?.map((item: any) => {
      item.leave_type = this.leaveType

    })

    // Documents validations
    if (this.fileArray.length > 1) {
      if (this.fileArray.some((doc: any) => doc.imagePath === null && doc.url === null)) {
        this.toast.warning('Please upload all the documents');
        return
      }
    }

    const formStartDate = this.formatDate(formData.fromDate);
    const formEndDate = this.formatDate(formData.toDate);
    const leaveStartDate = this.formatDate(this.startDate)
    const leaveEndDate = this.formatDate(this.endDate);
    const formattedFutureAdv = this.datesFormatChangeForFuture(this.policyFutureAdvance);
    const formattedPastDays = this.datesFormatChangeForPast(this.policyPastDays);


    // Weekend Leave Apply Check
    if (formData.days_difference === 0) {
      this.toast.warning(`Please select other dates`)
      return;
    }

    // Check if leave is selected or not
    const leaveTypeNotSelected = formData.leaveId === true;
    if (leaveTypeNotSelected) {
      const errorMessage = 'Please select the leave before applying';
      this.toast.warning(errorMessage)
      return;
    }



    // Check if any dates does not lie between the leave validation 

    const invalidDates = formStartDate < leaveStartDate ||
      (leaveEndDate !== null && formEndDate > leaveEndDate);
    if (invalidDates) {
      if (!leaveEndDate) {
        this.toast.warning(`Th 
        is leave is valid from ${leaveStartDate} only`)
      } else {
        this.toast.warning(`This leave is valid from ${leaveStartDate} to ${leaveEndDate} only`)
      }
      return;
    }

    // Check for Min Request in a single time
    if (this.policyMinRequest > 0) {
      if (formData.days_difference < this.policyMinRequest) {
        this.toast.warning(`You have to apply ${this.policyMinRequest} leaves minimum in a single time.`)
        return;
      }
    }
    // Check for Max Request in a single time
    if (this.policyMaxRequest > 0) {
      if (formData.days_difference > this.policyMaxRequest) {
        this.toast.warning(`You can only apply ${this.policyMaxRequest} leaves maximum in a single time.`)
        return;
      }
    }

    // Past days Check 
    if (this.policyPastDays > 0) {
      if ((formStartDate) < formattedPastDays || (formEndDate) < formattedPastDays) {
        this.toast.warning(`This leave can be only applied ${this.policyPastDays} days in back`)
        return;
      }
    }


    // Future Advance days Check 
    if (this.policyFutureAdvance > 0) {
      if ((formEndDate) > this.todayDate || (formStartDate) > this.todayDate) {
        if ((formStartDate) < formattedFutureAdv || (formEndDate) < formattedFutureAdv) {
          this.toast.warning(`This leave can be only applied ${this.policyFutureAdvance} days in advance`);
          return;
        }
      }
    }



    const newArray: any = []
    this.fileArray?.map((doc: any) => { newArray.push(doc?.url) })

    let body = {
      "leaveFor": formData.leaveFor,
      "startDate": this.formatDate(formData.fromDate),
      "endDate": this.formatDate(formData.toDate),
      "leaveDays": formData.days_difference,
      "justification": formData.reason,
      "leaveId": formData.leaveId,
      "departmentId": this.departmentId,
      "employee_id": formData.employee_id,
      "documents": newArray.length == 0 ? [...newArray, null] : newArray,
      "days_details": formData.days_details,
      "isDeleted": false
    }

    // this._commonService?.showLoader()
    this.LeaveApplyService.updateAppliedLeave(this.leaveId, body).subscribe(
      (res: any) => {
        this.toast.success(res.message);
        // this._commonService?.hideLoader()
        this.router.navigate(['master/ess/leave-apply'])
      },
      (err: any) => {
        // if (err.status == 409) {
        //   this.toast.warning(err.error.message);
        //   return
        // }
        // this._commonService?.hideLoader()
        return this.toast.error(err.error.message);
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
    if (this.mode == "viewMode") return;
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
    })
    // this.leaveForm.patchValue
    if (this.leaveForm?.value?.leaveFor == "ME") {
      employeeControl?.clearValidators();
      if (this.leaveId) {
        this.getEmployeeLeaveDetails();
      }
      this.role_id = localStorage.getItem('role_master_id');
      this.marital = localStorage.getItem('marital');
      this.userlocation = localStorage.getItem('location');
      this.gender = localStorage.getItem('gender');
      this.designation = localStorage.getItem('designation')
      this.getDepartmentLeaves(this.departmentId, this.approvalEmployeeId ? this.approvalEmployeeId : this.employeeId, this.entity_id)
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
    })
    this.getDepartmentLeaves(this.departmentId, this.leaveForm?.value?.employee_id, this.entity_id)
  }

  onApproveLeave() {
    let flag = false;
    this.fileArray.map((value: any) => {
      if (value.valid == false) {
        flag = true;
      }
    })

    if (flag) {
      this.toast.error(`Invalid file, please upload a valid file`);
      return;
    }

    if (this.approvalForm?.invalid) {
      return this.toast.error('Required fields should not be invalid', 'Fields Error');
    }

    let val = this.approvalForm?.value;

    let req = {
      applied_leave_id: this.leaveId,
      approved_start_date: this.approved_start_date,
      approved_end_date: this.approved_end_date,
      approved_days: val?.approved_days,
      approval_status: this.actionFor,
      employee_id: this.employee_id,
    }
    console.log(req)

    this.LeaveApplyService.update_leave_approval_status(req).subscribe(
      (res: any) => {
        if (res.code == 201) {
          this.toast.warning(res?.message);
          return
        }
        this.toast.success(res?.message);

        // this._commonService?.hideLoader();
        if (req?.approval_status === "APPROVED") {
          this.router.navigate(['master/ess/leave-approval/approved-leave'])

        } else {
          this.router.navigate(['master/ess/leave-approval/rejected-leave'])

        }

      },
      (err: any) => {
        console.error('Error fetching leave data', err);
        // this._commonService?.hideLoader()
      }
    );
  }

  ////////////////////////
  getDatesInRange(start: string, end: string): any[] {
    const startDate = moment(start);
    const endDate = moment(end);
    const holidayDates = (this.holidayList || [])
      .filter((h: { status: string; isDeleted: any; }) => h.status === 'ACTIVE' && !h.isDeleted)
      .map((h: { date: any; }) => h.date);

    const weeklyOffs = this.weekOffList || [];
    const results: any[] = [];

    let currentDate = startDate.clone();
    while (currentDate <= endDate) {
      const formattedDate = currentDate.format('YYYY-MM-DD');
      const dayName = currentDate.format('dddd');
      const weekOfMonth = this.getWeekOfMonth(currentDate);

      const isHoliday = holidayDates.includes(formattedDate);
      const weekOffMatch = weeklyOffs.find((off: { day: string; week: any; }) =>
        off.day === dayName && off.week === weekOfMonth
      );

      const type = weekOffMatch?.type ?? null;

      if (!isHoliday && type !== 'Full Day') {
        results.push({
          date: formattedDate,
          displayDate: currentDate.format('ddd').toUpperCase() + ' ,' + currentDate.format('DD-MM-YYYY'),
          leave_day: dayName,
          weekOffType: type // can be null | "1st Half" | "2nd Half"
        });
      }

      currentDate.add(1, 'days');
    }

    return results;
  }
  getWeekOfMonth(date: moment.Moment): string {
    const firstDay = date.clone().startOf('month');
    const offset = firstDay.day(); // 0 (Sun) to 6 (Sat)
    const adjustedDate = date.date() + offset;
    const weekNumber = Math.ceil(adjustedDate / 7);
    return `week_${['0', '1st', '2nd', '3rd', '4th', '5th'][weekNumber]}`;
  }


}