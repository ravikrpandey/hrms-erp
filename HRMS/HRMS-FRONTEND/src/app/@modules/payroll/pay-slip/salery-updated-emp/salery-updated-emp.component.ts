import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { Location } from '@angular/common';
import { HeadService } from 'src/app/@shared/services/head.service';
import Swal from 'sweetalert2';
import { ShortlistedCandidateService } from 'src/app/@shared/services/service/recruitment/shortlisted-candidate.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { AttendanceService } from 'src/app/@shared/services/service/attendance/attendance.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { MatDialog } from '@angular/material/dialog';
import { AttendanceDetailDialogComponent } from 'src/app/@modules/employee-self-service/attendance-detail-dialog/attendance-detail-dialog.component';
import { SalaryDetailService } from 'src/app/@shared/services/payroll/salary-detail.service';

@Component({
  selector: 'app-salery-updated-emp',
  templateUrl: './salery-updated-emp.component.html',
  styleUrls: ['./salery-updated-emp.component.scss'],
})
export class SaleryUpdatedEmpComponent {
  salaryForm: FormGroup;
  id: any;
  salaryData: any;
  salaryGetData: any;
  // employee_id: any = 2
  empId: any;
  // years: string[] = [];
  percentIncrement: number = 0;
  salaryId: any;
  employee_id: any;
  index: any;
  action_type: any;
  // months: any = [];
  getAllDesignation: any;
  get_all_grade: any;
  loginUser: any;
  entity_Id: any;
  entity_id: any;

  earningCompList: any = [];
  deductionCompList: any;
  riembursementCompList: any;
  totalMonthlyCTC: any = 0;
  totalAnnualCTC: any = 0;
  basicComp: boolean = true;
  earningCompListReference: any;
  deductionCompListReference: any;
  riembursementCompListReference: any;
  negativeAlert: boolean = false;
  negativeMonthly: any = 0;
  negativeAnualy: any = 0;

  // calender start

  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  years: number[] = [];
  selectedMonth: string = this.months[new Date().getMonth()];
  selectedYear: number = new Date().getFullYear();
  calendarDays: any[] = [];
  daysOfWeek: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  attendanceData: any[] = [];
  mainId: string | null = null;
  selectedEmployee: any;
  employees: any[] = [];
  allowanceDetail: any;
  financial_id: string | null;
  loginUserDetails: any;
  month: any;

  constructor(
    private fb: FormBuilder,
    private _empoloyeeService: EmpRegistrationService,
    private _shortListedCandidate: ShortlistedCandidateService,
    private head: HeadService,
    private route: Router,
    private toastr: ToastrService,
    private _activeRoute: ActivatedRoute,
    private locatin: Location,
    public common: CommonService,
    private services: AttendanceService,
    public dialog: MatDialog,
    private $miscellaneous: MiscellaneousService,
    private _salaryDetailService: SalaryDetailService
  ) {
    this.salaryForm = this.fb.group({
      // basic_salary: new FormControl(null),
      // salary_per_day: new FormControl(null),
      // salary_per_hr: new FormControl(null),
      // total_monthly_hr: new FormControl(null),
      // weekly_hour: new FormControl(null),

      // // PRIVIUS EMPOYER DETAILS

      // annualCTC: [0, Validators.required],
      // monthlyCTC: new FormControl(),
      // earningComponentList: this.fb.array([]),
      // deductionComponentList: this.fb.array([]),
      // reiembursementComponentList: this.fb.array([]),
      total_P: new FormControl(null),
      total_A: new FormControl(null),
      total_DP: new FormControl(null),
      total_PL: new FormControl(null),
      total_UL: new FormControl(null),
      total_DA: new FormControl(null),
      total_HD: new FormControl(null),
      total_PHL: new FormControl(null),
      total_UHL: new FormControl(null),
      total_CO: new FormControl(null),
      total_WFO: new FormControl(null),
      total_WHO: new FormControl(null),
      total_PFD:  new FormControl(null),
      total_PHD:  new FormControl(null),
      total_HPFD:  new FormControl(null),
      total_HPHD: new FormControl(null),
      total_NPFD:  new FormControl(null),
      total_NPHD:  new FormControl(null),
      total_H:  new FormControl(null),
    });
    // ,[Validators.required,Validators.pattern(/^[0-9]*$/), Validators.maxLength(10)]

    this.salaryForm.get('annualCTC')?.valueChanges.subscribe((value) => {
      this.updateCalculations(value);
    });
  }
  ngOnInit(): void {
    this.localStorage();
    this.getAllDesignation_dropDown();
    this.get_all_active_grade();
    this.getAllEarningComponentList();
    this.getAllRiembursementComponentList();
    this.getAllDeductionComponentList();

    this._activeRoute.queryParams.subscribe((params: any) => {
      this.id = params;
      // this.months = [{ name: 'January', id: 1 }, { name: 'February', id: 2 }, { name: 'March', id: 3 }, { name: 'April', id: 4 }, { name: 'May', id: 5 }, { name: 'June', id: 6 }, { name: 'July', id: 7 }, { name: 'August', id: 8 }, { name: 'September', id: 9 }, { name: 'October', id: 10 }, { name: 'November', id: 11 }, { name: 'December', id: 12 }]
      this.salaryId = this.id.employee_id;
      this.employee_id = this.id.employee_id;
      this.action_type = this.id.action_type;
      this.month = params?.month;

      if (params.employee_id) {
        this.salaryGetBy(params.employee_id);
      }
    });
    this._empoloyeeService.setEmpTitle('SALARY DETAILS');
    this.getActive_Allowance();
    this.generateYears();
    this.get_attendanceBYmonth();
    this.loadEmployees();
    this.getFinancialYear();
    this.get_employeesdetails();
  }

  get_employeesdetails() {
    let req = {
      employee_id: this.employee_id,
      entity_id: this.entity_id,
      financial_year_id: this.financial_id,
      att_month: this.month,
    };
    this._salaryDetailService
      .employee_salary_Details_BYID(req)
      .subscribe((res: any) => {
        console.log(res, 'res<<<<<<<<');

        if (res) {
          this.allowanceDetail = {
            ...res?.data[0],
            allowance_details: res?.allowance_details,
          };
        }
        console.log(this.allowanceDetail, 'this.allowanceDetail>>>>>>>');

        this.salaryForm.patchValue({
          total_P: this.allowanceDetail?.total_P,
          total_DP: this.allowanceDetail?.total_DP,
          total_A: this.allowanceDetail?.total_A,
          total_PL: this.allowanceDetail?.total_PL,
          total_UL: this.allowanceDetail?.total_UL,
          total_DA: this.allowanceDetail?.total_DA,
          total_HD: this.allowanceDetail?.total_HD,
          total_PHL: this.allowanceDetail?.total_PHL,
          total_UHL: this.allowanceDetail?.total_UHL,
          total_CO: this.allowanceDetail?.total_CO,
          total_WFO: this.allowanceDetail?.total_WFO,
          total_WHO: this.allowanceDetail?.total_WHO,
          total_PFD: this.allowanceDetail?.total_PFD,
          total_PHD: this.allowanceDetail?.total_PHD,
          total_HPFD: this.allowanceDetail?.total_HPFD,
          total_HPHD: this.allowanceDetail?.total_HPHD,
          total_NPFD: this.allowanceDetail?.total_NPFD,
          total_NPHD:this.allowanceDetail?.total_NPHD, 
          total_H:this.allowanceDetail?.total_H, 
        });
        //     this.allDetails=res?.data[0]?.salary_data;
        //     const totalSalary = this.allDetails?.earningComponentList.reduce((total:any, item:any) => {
        //       return total + parseFloat(item.salary_amt || '0');
        //   }, 0);

        //   console.log("Total salary_amt: ", totalSalary.toFixed(2));
        //   this.totalEarningCal=totalSalary.toFixed(2);
        //   const totalGrossSalary = this.allDetails?.earningComponentList.reduce((total:any, item:any) => {
        //     return total + parseFloat(item?.monthlyBasic || item?.fixedAllowanceMonthly || '0');
        // }, 0);

        // console.log("Total salary_amt: ", totalGrossSalary.toFixed(2));
        // this.totalEarningGrossCal=totalGrossSalary.toFixed(2)
      });
  }
  generateYears() {
    const startYear = 1990;
    const endYear = new Date().getFullYear() + 30;
    this.years = Array.from(
      { length: endYear - startYear + 1 },
      (_, i) => startYear + i
    );
  }

  onMonthChange() {
    this.generateCalendar();
  }

  onYearChange() {
    this.generateCalendar();
  }

  generateCalendar() {
    const monthIndex = this.months.indexOf(this.selectedMonth);
    const firstDayOfMonth = new Date(this.selectedYear, monthIndex, 1).getDay();
    const daysInMonth = new Date(
      this.selectedYear,
      monthIndex + 1,
      0
    ).getDate();

    this.calendarDays = [];
    let week: any[] = [];

    // Fill initial empty days for alignment
    for (let i = 0; i < firstDayOfMonth; i++) {
      week.push({ date: '', color: '' });
    }

    // Fill the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      week.push({ date: day, color: '' });
      if ((firstDayOfMonth + day) % 7 === 0) {
        this.calendarDays.push(week);
        week = [];
      }
    }

    // Add the last week if it has remaining days
    if (week.length) {
      this.calendarDays.push(week);
    }
    console.log(week, 'week<<<<<<<<<<<<<');
  }

  get_attendanceBYmonth() {
    try {
      const monthIndex = this.months?.findIndex(
        (month: any) => month === this.selectedMonth
      );
      console.log(this.selectedMonth);
      console.log(this.selectedYear);
      this.attendanceData = [];
      let entity_id = localStorage.getItem('selectedEntityId');
      this.mainId = localStorage.getItem('EmpMainId');
      let financial_id = localStorage.getItem('financial_id'); // Assuming financial_id is stored in local storage.
      const employeeId = this.selectedEmployee
        ? this.selectedEmployee
        : this.mainId;

      let req = {
        att_month: monthIndex + 1,
        att_year: this.selectedYear,
        entity_id: entity_id,
        employee_id: employeeId,
        financial_year_id: financial_id,
      };
      this.generateCalendar();
      this.services.get_attendanceBYmonth(req).subscribe(
        (response) => {
          console.log('API Response Data:', response);
          if (response && response.data) {
            this.attendanceData = response.data;
            this.applyAttendanceData();
          } else {
            console.error(
              'No attendance data found for the given month and year.'
            );
          }
        },
        (error) => {
          console.error('Error fetching attendance data:', error);
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  applyAttendanceData() {
    this.attendanceData.forEach((entry) => {
      const attendanceDate: any = new Date(entry?.att_datetime);
      const date = attendanceDate.getDate();
      const month = attendanceDate.toLocaleString('default', { month: 'long' });
      const year = attendanceDate.getFullYear();

      let color = '';

      switch (entry?.attendance_status) {
        case 'P':
          color = '#28a745';
          break;
        case 'A':
          color = '#dc3545';
          break;
        case 'PL':
          color = '#007bff';
          break;
        case 'UL':
          color = '#fd7e14';
          break;
        case 'DA':
          color = '#6c757d';
          break;
        case 'DP':
          color = '#d4edda';
          break;
        case 'HD':
          color = '#ffc107';
          break;
        case 'PHL':
          color = '#cce5ff';
          break;
        case 'UHL':
          color = '#ffe5b4';
          break;
        default:
          color = 'white';
      }
      // Present , Absent , Paid_leave, Unpaid_leave, Default_Absent, Default_present, Half_day, Paid_halfDay_leave, Unpaid_HalfDay_leave

      this.calendarDays.forEach((week) => {
        week.forEach(
          (dayCell: { date: number; color: string; details: [] }) => {
            if (dayCell.date === date) {
              dayCell.color = color;
              dayCell.details = entry?.in_out_details;
            }
          }
        );
      });
    });
    console.log(this.calendarDays);
  }

  attendanceStatuses = [
    { value: 'present', label: 'Present', color: '#28a745' },
    { value: 'absent', label: 'Absent', color: '#dc3545' },
    { value: 'paidLeave', label: 'Paid Leave', color: '#007bff' },
    { value: 'unpaidLeave', label: 'Unpaid Leave', color: '#fd7e14' },
    { value: 'defaultAbsent', label: 'Default Absent', color: '#6c757d' },
    { value: 'defaultPresent', label: 'Default Present', color: '#d4edda' },
    { value: 'halfDay', label: 'Half Day', color: '#ffc107' },
    {
      value: 'paidHalfDayLeave',
      label: 'Paid HalfDay Leave',
      color: '#cce5ff',
    },
    {
      value: 'unpaidHalfDayLeave',
      label: 'Unpaid HalfDay Leave',
      color: '#ffe5b4',
    },
  ];

  selectedAttendancePayload: any[] = [];

  // Handle attendance status change
  onAttendanceChange(day: any) {
    const selectedStatus = this.attendanceStatuses.find(
      (status) => status.value === day.attendanceStatus
    );

    if (selectedStatus) {
      // Update the color of the day based on selected status
      day.color = selectedStatus.color;

      // Collect the payload (date + status)
      const payload = {
        date: day.date,
        status: day.attendanceStatus,
      };

      // Add to the selected attendance payload array
      this.updateAttendancePayload(payload);
    }
  }

  // Update the payload (you can add additional logic here if needed)
  updateAttendancePayload(payload: any) {
    // Check if this date's payload already exists
    const existingPayloadIndex = this.selectedAttendancePayload.findIndex(
      (item) => item.date === payload.date
    );

    if (existingPayloadIndex > -1) {
      // Update existing payload
      this.selectedAttendancePayload[existingPayloadIndex] = payload;
    } else {
      // Add new payload
      this.selectedAttendancePayload.push(payload);
    }

    console.log('Updated Payload:', this.selectedAttendancePayload);
  }

  dataStatic() {
    let data = [
      [
        { id: 1, date: 1, status: 'present' },
        { id: 2, date: 2, status: 'absent' },
        { id: 3, date: 3, status: 'paidLeave' },
        { id: 4, date: 4, status: 'unpaidLeave' },
        { id: 5, date: 5, status: 'absent' },
        { id: 6, date: 6, status: 'paidLeave' },
        { id: 7, date: 7, status: 'paidLeave' },
      ],
      [
        { id: 8, date: 8, status: 'unpaidLeave' },
        { id: 9, date: 9, status: 'present' },
        { id: 10, date: 10, status: 'present' },
        { id: 11, date: 11, status: 'unpaidLeave' },
        { id: 12, date: 12, status: 'present' },
        { id: 13, date: 13, status: 'Paid Leave' },
        { id: 14, date: 14, status: 'paidLeave' },
      ],
      [
        { id: 15, date: 15, status: 'present' },
        { id: 16, date: 16, status: 'unpaidLeave' },
        { id: 17, date: 17, status: 'absent' },
        { id: 18, date: 18, status: 'present' },
        { id: 19, date: 19, status: 'absent' },
        { id: 20, date: 20, status: 'unpaidLeave' },
        { id: 21, date: 21, status: 'paidLeave' },
      ],
      [
        { id: 22, date: 22, status: 'absent' },
        { id: 23, date: 23, status: 'unpaidLeave' },
        { id: 24, date: 24, status: 'present' },
        { id: 25, date: 25, status: 'paidLeave' },
      ],
    ];
  }

  showFullDetail(data: any) {
    if (data?.details?.length) {
      const dialogRef = this.dialog.open(AttendanceDetailDialogComponent, {
        width: '40%',
        data: { data: data },
      });

      dialogRef.afterClosed().subscribe((result) => {});
    }
  }

  loadEmployees() {
    let selectedEntityId = localStorage.getItem('selectedEntityId');
    this.services.get_all_employe(selectedEntityId).subscribe(
      (response) => {
        console.log('Employee Data:', response);
        if (response && response.data) {
          this.employees = response.data;
          this.selectedEmployee = Number(localStorage.getItem('EmpMainId'));
        } else {
          console.error('No employee data found.');
        }
      },
      (error) => {
        console.error('Error fetching employee data:', error);
      }
    );
  }

  onEmployeeChange() {
    this.get_attendanceBYmonth();
  }

  // Financ year get start
  financialYearList: any = [];
  getFinancialYear() {
    this.$miscellaneous.getAllActivefinancial_year().subscribe((res) => {
      if (res) {
        this.financialYearList = res?.data;
        this.financialYearList?.map(
          (item: any) => (item.financial_year = item?.financial_year)
        );
      }
    });
  }

  localStorage() {
    let a: any = localStorage.getItem('signInUser');
    let entity: any = localStorage.getItem('selectedEntityId');
    this.loginUser = JSON.parse(a);
    this.entity_Id = JSON.parse(entity);
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_id = localStorage.getItem('financial_id');

    let loginUserDetails: any = localStorage.getItem('loginUserDetails');
    this.loginUserDetails = JSON.parse(loginUserDetails);
  }

  // get allowanaceFormArray() {
  //   return this.salaryForm.get('allowanace_details') as FormArray;
  // }
  get SL(): any {
    return this.salaryForm.controls;
  }

  salaryGetBy(id: any) {
    this._empoloyeeService.getByUserId(id).subscribe((res: any) => {
      this.salaryGetData = res.data;
      console.log(this.salaryGetData, 'this.salaryGetData<<<<< get by user');
      if (this.salaryGetData?.gradeSalaryData?.length) {
        this.salaryForm?.patchValue({
          annualCTC: this.salaryGetData?.gradeSalaryData[0]?.ctc,
          monthlyCTC: this.salaryGetData?.gradeSalaryData[0]?.ctc / 12,
        });
        let data = {
          earningComponentList:
            this.salaryGetData?.gradeSalaryData[0]?.earningComponentList,
          deductionComponentList:
            this.salaryGetData?.gradeSalaryData[0]?.deductionComponentList,
          reiembursementComponentList:
            this.salaryGetData?.gradeSalaryData[0]?.reiembursementComponentList,
        };
        this.setEarningComponentList(data);
      } else {
        this.getSalaryTemplateByGradeId();
      }
    });
  }

  allowanceList: any = [];
  getActive_Allowance() {
    let entity_id = localStorage.getItem('selectedEntityId');
    let financial_id = localStorage.getItem('financial_id');
    let req = {
      entity_id: entity_id,
      fy_id: financial_id,
    };

    this._shortListedCandidate
      .getActive_Allowancenw(req)
      .subscribe((res: any) => {
        if (res) {
          this.allowanceList = res?.data;
        }
      });
  }

  prevTab = () => {
    this.route.navigate(
      ['master/hrms/employee-master/employ/employee-create/personal-details'],
      { queryParams: { employee_id: this.salaryId } }
    );
  };

  onSubmitForm() {
    let val = this.salaryForm.value;
    console.log(val, 'valll');
    //   const totalDeductSalary = val?.deductionComponentList?.reduce((total:any, item:any) => {
    //     return total + parseFloat(item?.fixedAllowanceMonthly || item?.monthlyBasic || '0');
    // }, 0);

    // console.log("Total totalDeductSalary salary_amt: ", totalDeductSalary.toFixed(2));
    // const totalDeduct=totalDeductSalary.toFixed(2);
    // if (this.salaryForm.invalid) {
    //   // Display error message using toastr or any other method
    //   this.toastr.error("Required fields should not be empty");
    //   // Return or perform further actions if needed
    //   return;
    // }
    let financial_id = localStorage.getItem('financial_id');
    let empMainId = localStorage.getItem('EmpMainId');
    let gradeSalaryData = this.salaryGetData?.gradeSalaryData[0];

    let req = {
      ...val,
      // monthly_ctc:val?.monthlyCTC,
      // deduction_amt:Number(totalDeduct),
      // tab_type: "Salary",
      // totalMonthlyCTC: this.totalMonthlyCTC,
      // totalAnnualCTC: this.totalAnnualCTC,

      financial_year_id: financial_id,
      entity_id: this.entity_Id,
      attendance_id: this.allowanceDetail?.id,
      start_date: this.allowanceDetail?.payroll_cycle_start_date,
      end_date: this.allowanceDetail?.payroll_cycle_end_date,
      salary_process_month: this.allowanceDetail?.salary_process_month,
      att_month: this.allowanceDetail?.att_month,
      att_year: this.allowanceDetail?.att_year,
      total_present_day: this.allowanceDetail?.working_days,

      // company: this.gradIdDetail?.entity_name,
      // branch: this.gradIdDetail?.branch_name,
      // grade: this.gradIdDetail?.grade_name,
      // description: this.gradIdDetail?.description,
      // created_by: empMainId,
      // template_name: this.gradIdDetail?.template_name,
    };
    if (this.employee_id) {
      req.employee_id = this.employee_id;
    }

    // if (gradeSalaryData) {
    //   req.grade_template_id = gradeSalaryData?.id;
    //   req.grade_pay = false;
    // }
    // else {
    //   req.grade_pay = true;
    // }
    // req?.earningComponentList?.map((item: any) => {
    //   if (item?.calculation_type == "Flat Amount") item.componenet_type = 'flat'
    //   else item.componenet_type = 'percentage'
    // })
    // req?.deductionComponentList?.map((item: any) => {
    //   if (item?.calculation_type == "Flat Amount") item.componenet_type = 'flat'
    //   else item.componenet_type = 'percentage'
    // })
    // req?.reiembursementComponentList?.map((item: any) => {
    //   if (item?.calculation_type == "Flat Amount") item.componenet_type = 'flat'
    //   else item.componenet_type = 'percentage'
    // })
    this._empoloyeeService.updateAttaindance(req).subscribe(
      (res: any) => {
        if (res) {
          this.salaryData = res;
          this.route.navigate([
            'master/payroll/process-salary/hold-slip-detail',
          ]);
          this.toastr.success('Attaindance Updated successfully..');
        }
      },
      (err) => {
        this.toastr.error(
          'Someting went wron please try again',
          'Error Message'
        );
      }
    );
  }

  Skip() {
    this.route.navigate(['master/payroll/process-salary/hold-slip-detail']);
  }

  // table start
  addFamilyDisable: boolean = false;
  allFamilyData: any;
  allEmployeerData: any;
  deletedFamilyData: any = [];

  get CF_1(): any {
    return this.salaryForm.controls;
  }

  getAllDesignation_dropDown() {
    this._empoloyeeService.getAllDesignation_dropDown().subscribe((res) => {
      this.getAllDesignation = res.data.filter(
        (res: any) => res.status === 'ACTIVE'
      );
    });
  }

  get_all_active_grade() {
    this._empoloyeeService
      .get_all_active_grade(this.entity_Id)
      .subscribe((res) => {
        this.get_all_grade = res.data;
      });
  }

  onMonthlyAmountKeyup(index: number) {
    const reimbursementArray = this.salaryForm.get(
      'reiembursementComponentList'
    ) as FormArray;
    console.log(reimbursementArray, 'reimbursementArray<<<<<');

    const reimbursementGroup = reimbursementArray.at(index) as FormGroup;

    const fixedAmountLimit = reimbursementGroup.get('fixedAmountLimit')?.value;
    let monthlyAmount = reimbursementGroup.get('fixedAllowanceMonthly')?.value;

    console.log(fixedAmountLimit, 'fixedAmountLimit<<<<<<<<');
    console.log(monthlyAmount, 'monthlyAmount<<<<<<<<');

    // Ensure the monthly amount does not exceed the fixed amount limit
    if (monthlyAmount > fixedAmountLimit) {
      monthlyAmount = fixedAmountLimit;
      reimbursementGroup
        .get('fixedAllowanceMonthly')
        ?.setValue(fixedAmountLimit);
      this.toastr.warning('Amount Limit is fixed.');
    } else {
      this.totalCountCreate();
    }

    // Update the annual amount based on the monthly amount
    const annualAmount = monthlyAmount * 12;
    reimbursementGroup
      .get('fixedAllowanceAnnual')
      ?.setValue(annualAmount.toFixed(2));

    this.updateFixedAllowancee();
  }

  updateFixedEarningAmount(index: number) {
    const earningArray = this.salaryForm.get(
      'earningComponentList'
    ) as FormArray;
    const earningGroup = earningArray.at(index) as FormGroup;

    // Get the current monthly and annual values
    let monthlyAmount = earningGroup.get('fixedAllowanceMonthly')?.value || 0;
    let annualAmount = monthlyAmount * 12;
    console.log(monthlyAmount, 'monthlyAmount');

    // Update the monthly and annual values for the specific index
    earningGroup.get('fixedAllowanceAnnual')?.setValue(annualAmount);
    earningGroup.get('fixedAllowanceMonthly')?.setValue(monthlyAmount);

    this.updateFixedAllowancee();
  }

  updateFixedAllowancee() {
    const annualCTC = this.salaryForm.get('annualCTC')?.value;

    // Step 1: Calculate total reimbursement amount
    const reimbursementArray = this.salaryForm.get(
      'reiembursementComponentList'
    ) as FormArray;
    let totalReimbursementAmount = 0;
    reimbursementArray.controls.forEach((reimbursement) => {
      const reimbursementAnnual =
        reimbursement.get('fixedAllowanceAnnual')?.value || 0;
      totalReimbursementAmount += parseFloat(reimbursementAnnual);
    });

    // Step 2: Calculate total earnings excluding Fixed Allowance
    const earningArray = this.salaryForm.get(
      'earningComponentList'
    ) as FormArray;
    let totalEarningsExcludingFixedAllowance = 0;

    // First loop: calculate total earnings (excluding Fixed Allowance)
    earningArray.controls.forEach((control) => {
      const earningTypeCode = control.get('earningTypeCode')?.value;

      // Include HRA and all other earnings except Fixed Allowance
      if (earningTypeCode !== 'FIXE33') {
        let annualValue: any = 0;
        if (control.get('annualBasic')?.value) {
          annualValue = control.get('annualBasic')?.value || 0;
        } else {
          annualValue = control.get('fixedAllowanceAnnual')?.value || 0;
        }
        totalEarningsExcludingFixedAllowance += parseFloat(annualValue);
      }
    });

    // Step 2: Calculate total deduction
    const deductionArray = this.salaryForm.get(
      'deductionComponentList'
    ) as FormArray;
    let totalDeductionAmount = 0;
    deductionArray.controls.forEach((control) => {
      let annualValue: any = 0;
      if (control.get('annualBasic')?.value) {
        annualValue = control.get('annualBasic')?.value || 0;
      } else {
        annualValue = control.get('fixedAllowanceAnnual')?.value || 0;
      }
      totalDeductionAmount += parseFloat(annualValue);
    });

    // Step 3: Calculate remaining CTC for Fixed Allowance
    let totalUsedAmount =
      totalEarningsExcludingFixedAllowance +
      totalReimbursementAmount +
      totalDeductionAmount;
    let remainingCTCForFixedAllowance = annualCTC - totalUsedAmount;

    // Step 4: Update Fixed Allowance
    earningArray.controls.forEach((control) => {
      const earningTypeCode = control.get('earningTypeCode')?.value;

      if (earningTypeCode === 'FIXE33') {
        let monthlyAmount = remainingCTCForFixedAllowance / 12;
        let annualAmount = monthlyAmount * 12;

        // Update the Fixed Allowance amounts
        control.get('fixedAllowanceAnnual')?.setValue(annualAmount.toFixed(2));
        control
          .get('fixedAllowanceMonthly')
          ?.setValue(monthlyAmount.toFixed(2));
        if (monthlyAmount < 0) {
          this.negativeAlert = true;
          this.negativeMonthly = monthlyAmount.toFixed(2);
          this.negativeAnualy = annualAmount.toFixed(2);
        } else {
          this.negativeAlert = false;
        }
      }
    });
    // this.totalCountCreate()
  }

  onMonthlyDeductionAmountKeyup(index: number) {
    const deductionArray = this.salaryForm.get(
      'deductionComponentList'
    ) as FormArray;
    const deductionGroup = deductionArray.at(index) as FormGroup;

    const fixedAmountLimit = deductionGroup.get('fixedAmountLimit')?.value;
    let monthlyAmount = deductionGroup.get('fixedAllowanceMonthly')?.value;

    // Ensure the monthly amount does not exceed the fixed amount limit
    if (monthlyAmount > fixedAmountLimit) {
      monthlyAmount = fixedAmountLimit;
      deductionGroup.get('fixedAllowanceMonthly')?.setValue(fixedAmountLimit);
      this.toastr.warning('Amount Limit is fixed.');
    }

    // Update the annual amount based on the monthly amount
    const annualAmount = monthlyAmount * 12;
    deductionGroup
      .get('fixedAllowanceAnnual')
      ?.setValue(annualAmount.toFixed(2));
    this.calculateTotalCTC();
    this.updateFixedAllowancee();
  }

  totalCountCreate() {
    const earningComponentList = this.salaryForm.get(
      'earningComponentList'
    ) as FormArray;
    const deductionArray = this.salaryForm.get(
      'deductionComponentList'
    ) as FormArray;
    const reiembursementComponentList = this.salaryForm.get(
      'reiembursementComponentList'
    ) as FormArray;
    let obj = {
      earningComponentList: earningComponentList?.value,
      deductionArray: deductionArray?.value,
      reiembursementComponentList: reiembursementComponentList?.value,
    };
    this.setEarningComponentList(obj);
  }

  createEarningComponent(
    name: string,
    type: 'value-based' | 'fixed',
    data?: any
  ): FormGroup {
    if (type === 'value-based') {
      return this.fb.group({
        componentName: [name, Validators.required],
        calculationType: [data?.earning_type],
        basicPercentage: [
          { value: data?.calculation_percentage, disabled: true },
          Validators.required,
        ],
        monthlyBasic: [{ value: 0, disabled: true }],
        earningTypeCode: [data?.earning_type_code],
        annualBasic: [{ value: 0, disabled: true }],
        calculationTypeCode: [data.calculation_type_code],
      });
    } else if (type === 'fixed') {
      return this.fb.group({
        componentName: [name, Validators.required],
        fixedAllowanceMonthly: [0, Validators.required],
        earningTypeCode: [data?.earning_type_code],
        fixedAllowanceAnnual: [{ value: 0, disabled: true }],
      });
    }
    throw new Error('Invalid component type specified');
  }

  createDeductionComponent(
    name: string,
    type: 'value-based' | 'fixed',
    data?: any
  ): FormGroup {
    if (type === 'value-based') {
      let calculationType =
        name === 'EPF'
          ? 'PF Wages'
          : name === 'ESI'
          ? 'ESI Wages'
          : data?.deduction_type;
      let calculation_type_code =
        name === 'EPF'
          ? 'EPF'
          : name === 'ESI'
          ? 'ESI'
          : data?.calculation_type_code;
      let basicPercent;
      if (
        data?.employer_contribution != undefined ||
        data?.employer_contribution != null
      ) {
        basicPercent = parseFloat(data?.employer_contribution);
      } else if (
        data?.calculation_percentage != undefined ||
        data?.calculation_percentage != null
      ) {
        basicPercent = parseFloat(data?.calculation_percentage);
      }
      const isOverrideAtEmployeeLevel =
        data?.override_at_employee_level == 1
          ? false
          : data?.override_at_employee_level == 0
          ? true
          : true;
      return this.fb.group({
        componentName: [name, Validators.required],
        calculationType: [calculationType],
        basicPercentage: [
          { value: basicPercent || 0, disabled: isOverrideAtEmployeeLevel },
          Validators.required,
        ],
        monthlyBasic: [{ value: 0, disabled: true }],
        annualBasic: [{ value: 0, disabled: true }],
        calculationTypeCode: [calculation_type_code],
      });
    } else if (type === 'fixed') {
      return this.fb.group({
        componentName: [name, Validators.required],
        fixedAllowanceMonthly: [0, Validators.required],
        fixedAllowanceAnnual: [{ value: 0, disabled: true }],
        fixedAmountLimit: [data?.calculation_amount || 0],
      });
    }
    // return this.fb.group({
    //   componentName: [name, Validators.required],
    //   fixedAllowanceMonthly: [0, Validators.required],
    //   fixedAllowanceAnnual: [{ value: 0, disabled: true }]
    // });
    throw new Error('Invalid component type specified');
  }

  get earningComponentList(): FormArray {
    return this.salaryForm.get('earningComponentList') as FormArray;
  }

  get deductionComponentList(): FormArray {
    return this.salaryForm.get('deductionComponentList') as FormArray;
  }

  get reiembursementComponentList(): FormArray {
    return this.salaryForm.get('reiembursementComponentList') as FormArray;
  }

  addEarningComponent(name: string, type: 'value-based' | 'fixed') {
    const earningComponent = this.createEarningComponent(name, type);
    this.earningComponentList.push(earningComponent);
  }

  removeEarningComponent(index: number) {
    const earningTypeCode = this.earningComponentList
      .at(index)
      .get('earningTypeCode')?.value;
    if (earningTypeCode !== 'BASIC1') {
      this.earningComponentList.removeAt(index);
      const restoredComponent = this.earningCompListReference.find(
        (item: any) => item.earning_type_code === earningTypeCode
      );
      if (restoredComponent) {
        this.earningCompList.push(restoredComponent);
      }
      this.updateFixedAllowancee();
    } else {
      console.error('Cannot remove Basic or Fixed Allowance components');
    }
    this.totalCountCreate();
  }

  addEarningComp(data: any) {
    console.log(data, 'klklkl');
    let selecteddata = data;

    let type: any =
      data.calculation_type === 'Flat Amount' ||
      data.calculation_type === 'Not Applicable'
        ? 'fixed'
        : 'value-based';
    this.earningCompList = this.earningCompList.filter(
      (item: any) => item !== selecteddata
    );
    this.earningComponentList.push(
      this.createEarningComponent(selecteddata.earning_name, type, selecteddata)
    );
    this.updateEarnings();
    // this.totalCountCreate();
  }

  createReiembursementComponent(name: string, data?: any): FormGroup {
    return this.fb.group({
      componentName: [name, Validators.required],
      fixedAllowanceMonthly: [0, Validators.required],
      fixedAllowanceAnnual: [{ value: 0, disabled: true }],
      fixedAmountLimit: [data?.max_limit || 0],
    });
  }

  getAllEarningComponentList() {
    const entityType: any = localStorage.getItem('selectedEntityId');
    const financialYear: any = localStorage.getItem('financial_id');
    this._empoloyeeService
      .getAllEarningCompList(entityType, financialYear)
      .subscribe(
        (res: any) => {
          if (res && res.data) {
            this.earningCompList = res.data;
            this.earningCompListReference = [...this.earningCompList];

            this.earningCompList.forEach((erData: any) => {
              if (
                erData.earning_type_code == 'BASIC1' ||
                erData.earning_type_code == 'FIXE33'
              ) {
                // this.addEarningComp(erData);
              }
            });
          }
        },
        (err) => {
          this.toastr.error(err.error.message);
        }
      );
  }

  getAllDeductionComponentList() {
    const entityType: any = localStorage.getItem('selectedEntityId');
    const financialYear: any = localStorage.getItem('financial_id');
    this._empoloyeeService
      .getAllDeductionCompList(entityType, financialYear)
      .subscribe(
        (res: any) => {
          if (res && res.data) {
            this.deductionCompList = res.data;
            this.deductionCompListReference = [...this.deductionCompList];
          }
        },
        (err) => {
          this.toastr.error(err.error.message);
        }
      );
  }

  getAllRiembursementComponentList() {
    const entityType: any = localStorage.getItem('selectedEntityId');
    const financialYear: any = localStorage.getItem('financial_id');
    this._empoloyeeService
      .getAllRiembursementCompList(entityType, financialYear)
      .subscribe(
        (res: any) => {
          if (res && res.data) {
            this.riembursementCompList = res.data;
            this.riembursementCompListReference = [
              ...this.riembursementCompList,
            ];
          }
        },
        (err) => {
          this.toastr.error(err.error.message);
        }
      );
  }

  addDeductionComp(data: any) {
    console.log(data, 'klklkl');
    let selecteddata = data;
    let type: any =
      data.calculation_type === 'Flat Amount' ? 'fixed' : 'value-based';
    this.deductionCompList = this.deductionCompList.filter(
      (item: any) => item !== selecteddata
    );
    this.deductionComponentList.push(
      this.createDeductionComponent(selecteddata.deduction_plan, type, data)
    );
    this.updateDeduction();
  }

  removeDeductionComponent(index: number) {
    const componentName = this.deductionComponentList
      .at(index)
      .get('componentName')?.value;
    this.deductionComponentList.removeAt(index);
    const restoredComponent = this.deductionCompListReference.find(
      (item: any) => item.deduction_plan === componentName
    );
    if (restoredComponent) {
      this.deductionCompList.push(restoredComponent);
    }
    this.updateFixedAllowancee();
    this.calculateTotalCTC();
  }

  addRiembursementComp(data: any) {
    console.log(data, 'klklkl');
    let selecteddata = data;
    this.riembursementCompList = this.riembursementCompList.filter(
      (item: any) => item !== selecteddata
    );
    this.reiembursementComponentList.push(
      this.createReiembursementComponent(
        selecteddata.reimbursement_type,
        selecteddata
      )
    );
  }

  removeRiembursementComponent(index: number) {
    const componentName = this.reiembursementComponentList
      .at(index)
      .get('componentName')?.value;
    this.reiembursementComponentList.removeAt(index);
    const restoredComponent = this.riembursementCompListReference.find(
      (item: any) => item.reimbursement_type === componentName
    );
    if (restoredComponent) {
      this.riembursementCompList.push(restoredComponent);
    }
    this.updateFixedAllowancee();
    this.totalCountCreate();
  }

  // formSubmit() {
  //   console.log(this.salaryForm.getRawValue(), 'klklklklkl');
  //   let data = this.salaryForm.getRawValue();
  //   let payload = {
  //     ...data,
  //     created_by:this.singInUser.employee_id,
  //     totalMonthlyCTC: this.totalMonthlyCTC,
  //     totalAnnualCTC: this.totalAnnualCTC
  //   }

  //   this._empoloyeeService.saveSalaryTemplate(payload).subscribe((res:any) => {
  //     if(res && res.data){
  //       console.log(res.data);
  //       this.toastr.success('Salary Template Created successfully.');
  //       this.route.navigateByUrl('master/payroll/salary-templates')
  //     }
  //   }, err=>{
  //     this.toastr.error(err.error.message);
  //   })

  // }

  // Method to update all components based on the Annual CTC
  updateCalculations(annualCTC: number) {
    this.updateEarnings();
    this.calculateTotalCTC();
    this.updateDeduction();
  }

  // Method to handle earnings
  updateEarnings() {
    let annualCTC = this.salaryForm.get('annualCTC')?.value;
    const earningArray = this.salaryForm.get(
      'earningComponentList'
    ) as FormArray;
    earningArray.controls.forEach((earning: any) => {
      const calculationTypeCode = earning.get('calculationTypeCode')?.value; // Could be '% of CTC', '% of Basic Salary', or Fixed
      const percentage = earning.get('basicPercentage')?.value;
      const basicSalary = this.getAnnualBasic();

      let annualAmount = 0;
      let monthlyAmount = 0;

      if (calculationTypeCode === 'CTC') {
        annualAmount = (annualCTC * percentage) / 100;
        monthlyAmount = annualAmount / 12;
      } else if (calculationTypeCode === 'BASIC1') {
        annualAmount = (basicSalary * percentage) / 100;
        monthlyAmount = annualAmount / 12;
      }

      earning.get('annualBasic')?.setValue(annualAmount.toFixed(2));
      earning.get('monthlyBasic')?.setValue(monthlyAmount.toFixed(2));
    });
    this.updateFixedAllowancee();
  }

  updateDeduction() {
    let annualCTC = this.salaryForm.get('annualCTC')?.value;
    const deductionArray = this.salaryForm.get(
      'deductionComponentList'
    ) as FormArray;
    let grossMonthlySalary = annualCTC / 12;
    deductionArray.controls.forEach((deduction: any) => {
      const calculationType = deduction.get('calculationType')?.value; // Could be '% of CTC', '% of Basic Salary', or Fixed
      const percentage = deduction.get('basicPercentage')?.value;
      const calculationTypeCode = deduction.get('calculationTypeCode')?.value;
      const basicSalary = this.getAnnualBasic();
      let annualAmount = 0;
      let monthlyAmount = 0;

      if (calculationTypeCode === 'CTC') {
        annualAmount = (annualCTC * percentage) / 100;
        monthlyAmount = annualAmount / 12;
      } else if (
        calculationTypeCode === 'EPF' ||
        calculationTypeCode === 'ESI' ||
        calculationTypeCode === 'BASIC1'
      ) {
        annualAmount = (basicSalary * percentage) / 100;
        monthlyAmount = annualAmount / 12;
      }

      if (
        deduction.get('componentName')?.value === 'ESI' &&
        grossMonthlySalary > 21000
      ) {
        annualAmount = 0; // Set annual amount to 0 if ESI and gross monthly salary exceeds ₹21,000
        monthlyAmount = 0; // Set monthly amount to 0 if ESI and gross monthly salary exceeds ₹21,000
      }

      deduction.get('annualBasic')?.setValue(annualAmount.toFixed(2));
      deduction.get('monthlyBasic')?.setValue(monthlyAmount.toFixed(2));
    });
    this.updateFixedAllowancee();
  }

  // Get Basic Salary from dynamic earnings list
  getAnnualBasic(): number {
    const earningArray = this.salaryForm.get(
      'earningComponentList'
    ) as FormArray;

    // Find Basic Salary component if it exists
    const basicSalaryComponent = earningArray.controls.find(
      (control) => control.get('earningTypeCode')?.value === 'BASIC1'
    );

    return basicSalaryComponent
      ? basicSalaryComponent.get('annualBasic')?.value
      : 0;
  }

  updateEarningsPercent(earning: any) {
    let annualCTC = this.salaryForm.get('annualCTC')?.value;
    const earningArray = this.salaryForm.get(
      'earningComponentList'
    ) as FormArray;
    let grossMonthlySalary = annualCTC / 12;
    earningArray.controls.forEach((earning: any) => {
      const calculationType = earning.get('calculationType')?.value; // Could be '% of CTC', '% of Basic Salary', or Fixed
      const percentage = earning.get('basicPercentage')?.value;
      const calculationTypeCode = earning.get('calculationTypeCode')?.value;
      const basicSalary = this.getAnnualBasic();
      let tempList = this.earningComponentList.value.find(
        (elem: any) => elem.componentName == earning.value.calculationType
      );
      if (!tempList) {
        tempList = this.deductionComponentList.value.find(
          (elem: any) => elem.componentName == earning.value.calculationType
        );
      }
      if (!tempList) {
        tempList = this.reiembursementComponentList.value.find(
          (elem: any) => elem.componentName == earning.value.calculationType
        );
      }

      let annualAmount = 0;
      let monthlyAmount = 0;

      if (tempList) {
        annualAmount = (tempList.annualBasic * percentage) / 100;
        monthlyAmount = annualAmount / 12;
      } else {
        annualAmount = (annualCTC * percentage) / 100;
        monthlyAmount = annualAmount / 12;
      }

      // if (calculationTypeCode === 'CTC') {
      //   annualAmount = (annualCTC * percentage) / 100;
      //   monthlyAmount = annualAmount / 12;
      // } else if (calculationTypeCode === 'EPF' || calculationTypeCode === 'ESI' || calculationTypeCode === 'BASIC1') {
      //   annualAmount = (basicSalary * percentage) / 100;
      //   monthlyAmount = annualAmount / 12;
      // }

      // if (deduction.get('componentName')?.value === 'ESI' && grossMonthlySalary > 21000) {
      //   annualAmount = 0; // Set annual amount to 0 if ESI and gross monthly salary exceeds ₹21,000
      //   monthlyAmount = 0; // Set monthly amount to 0 if ESI and gross monthly salary exceeds ₹21,000
      // }

      earning.get('annualBasic')?.setValue(annualAmount.toFixed(2));
      earning.get('monthlyBasic')?.setValue(monthlyAmount.toFixed(2));
    });
    this.updateFixedAllowancee();
    this.calculateTotalCTC();
  }

  calculateTotalCTC() {
    // Get raw values from form arrays to ensure all values are included, even if inputs are disabled
    const earningArray = this.salaryForm.get(
      'earningComponentList'
    ) as FormArray;
    console.log(earningArray, 'earningArray<<<<<<<');

    const deductionArray = this.salaryForm.get(
      'deductionComponentList'
    ) as FormArray;
    const reimbursementArray = this.salaryForm.get(
      'reiembursementComponentList'
    ) as FormArray;

    let totalMonthlyCTC = 0;
    let totalAnnualCTC = 0;

    // Add all earnings (both 'value-based' and 'fixed')
    earningArray.getRawValue().forEach((earning: any) => {
      if (earning.monthlyBasic) {
        // This is a 'value-based' earning
        totalMonthlyCTC += parseFloat(earning.monthlyBasic || '0');
        totalAnnualCTC += parseFloat(earning.annualBasic || '0');
      } else if (earning.fixedAllowanceMonthly) {
        // This is a 'fixed' earning
        totalMonthlyCTC += parseFloat(earning.fixedAllowanceMonthly || '0');
        totalAnnualCTC += parseFloat(earning.fixedAllowanceAnnual || '0');
      }
    });

    // Subtract deductions
    deductionArray.getRawValue().forEach((deduction: any) => {
      if (deduction.monthlyBasic) {
        // This is a 'value-based' earning
        totalMonthlyCTC -= parseFloat(deduction.monthlyBasic || '0');
        totalAnnualCTC -= parseFloat(deduction.annualBasic || '0');
      } else if (deduction.fixedAllowanceMonthly) {
        // This is a 'fixed' earning
        totalMonthlyCTC -= parseFloat(deduction.fixedAllowanceMonthly || '0');
        totalAnnualCTC -= parseFloat(deduction.fixedAllowanceAnnual || '0');
      }
    });

    // Add reimbursements
    reimbursementArray.getRawValue().forEach((reimbursement: any) => {
      totalMonthlyCTC += parseFloat(reimbursement.fixedAllowanceMonthly || '0');
      totalAnnualCTC += parseFloat(reimbursement.fixedAllowanceAnnual || '0');
    });

    // Update form controls or display total CTC wherever needed
    this.totalMonthlyCTC = totalMonthlyCTC.toFixed(2);
    this.totalAnnualCTC = totalAnnualCTC.toFixed(2);
  }

  // start
  gradIdDetail: any;
  getSalaryTemplateByGradeId() {
    let entity_id: any = localStorage.getItem('selectedEntityId');
    let financial_id: any = localStorage.getItem('financial_id');

    let req = {
      id: this.salaryGetData?.grade_id,
      entityType: entity_id,
      financialYear: financial_id,
    };

    this._empoloyeeService.salaryTemplateByGradeId(req).subscribe((res) => {
      let data = res.data;
      console.log(
        res.data.earningComponentList,
        'res.data<<<<<<<<<< slaery res'
      );
      console.log(this.earningCompList, 'res.data<<<<<<<<<< slaery res2');
      const matchedIds = res.data.earningComponentList.map(
        (item: any) => item.id
      );

      const unmatchedDataArray = this.earningCompList.filter(
        (item: any) => !matchedIds.includes(item.id)
      );

      this.earningCompList = unmatchedDataArray;
      console.log(unmatchedDataArray, 'res.data<<<<<<<<<< slaery res3');
      this.salaryForm?.patchValue({ annualCTC: data?.ctc });
      this.gradIdDetail = data;

      this.setEarningComponentList(data);
      // this.setDeductionComponentList(data)
      // this.setReiembursementComponentList(data)
    });
  }

  setEarningComponentList(data: any) {
    console.log(data, 'earning Data<<<<<<<<<<<');
    let temp = this.earningCompList;
    let temp2 = this.deductionCompList;
    let temp3 = this.riembursementCompList;

    let totalMonthlyCTC = 0;
    let totalAnnualCTC = 0;
    this.enterSalary('fromAnnualCtc');

    let totalDeductionMonthlyCTC = 0;
    let totalDeductionAnnualCTC = 0;
    if (data?.earningComponentList?.length) {
      data?.earningComponentList?.forEach((item: any, index: number) => {
        if (item?.calculation_type == 'Flat Amount') {
          if (item?.fixedAllowanceMonthly)
            totalMonthlyCTC =
              totalMonthlyCTC + Number(item?.fixedAllowanceMonthly);
          if (item?.fixedAllowanceAnnual)
            totalAnnualCTC =
              totalAnnualCTC + Number(item?.fixedAllowanceAnnual);
        } else {
          if (item?.monthlyBasic)
            totalMonthlyCTC = totalMonthlyCTC + Number(item?.monthlyBasic);
          if (item?.annualBasic)
            totalAnnualCTC = totalAnnualCTC + Number(item?.annualBasic);
        }
        this.earningCompList.forEach((value: any, i: any) => {
          if (value.earning_name == item?.componentName) {
            temp.splice(i, 1);
          }
        });

        const formGroup = this.earningComponentList?.at(index) as FormGroup;
        if (formGroup) {
          if (item?.calculation_type == 'Flat Amount') {
            formGroup.patchValue({
              earningTypeCode: item?.earningTypeCode,
              componentName: item?.componentName,
              calculationType: item?.calculationType,
              calculationTypeCode: item?.calculationTypeCode,
              fixedAllowanceMonthly: item?.fixedAllowanceMonthly,
              fixedAllowanceAnnual: item?.fixedAllowanceAnnual,
              calculation_type: item?.calculation_type,
              id: item?.id,
            });
          } else {
            formGroup.patchValue({
              earningTypeCode: item?.earningTypeCode,
              componentName: item?.componentName,
              basicPercentage: item?.basicPercentage,
              annualBasic: item?.annualBasic,
              monthlyBasic: item?.monthlyBasic,
              // basicPercentage: [{ value: item?.basicPercentage || 0, disabled: true }, Validators.required],
              // annualBasic: [{ value: item?.annualBasic || 0, disabled: true }],
              // monthlyBasic: [{ value: item?.monthlyBasic || 0, disabled: true }],
              calculationType: item?.calculationType,
              calculationTypeCode: item?.calculationTypeCode,
              calculation_type: item?.calculation_type,
              id: item?.id,
            });
          }
        } else {
          if (item?.calculation_type == 'Flat Amount') {
            this.earningComponentList.push(
              this.fb.group({
                earningTypeCode: item?.earningTypeCode,
                componentName: item?.componentName,
                calculationType: item?.calculationType,
                calculationTypeCode: item?.calculationTypeCode,
                fixedAllowanceMonthly: item?.fixedAllowanceMonthly,
                fixedAllowanceAnnual: item?.fixedAllowanceAnnual,
                calculation_type: item?.calculation_type,
                id: item?.id,
              })
            );
          } else {
            this.earningComponentList.push(
              this.fb.group({
                earningTypeCode: item?.earningTypeCode,
                componentName: item?.componentName,
                basicPercentage: item?.basicPercentage,
                annualBasic: item?.annualBasic,
                monthlyBasic: item?.monthlyBasic,
                calculationType: item?.calculationType,
                calculationTypeCode: item?.calculationTypeCode,
                calculation_type: item?.calculation_type,
                id: item?.id,
              })
            );
          }
        }
      });
    }

    // ****************
    if (data?.deductionComponentList?.length || data?.deductionArray?.length) {
      let deductData = data?.deductionComponentList || data?.deductionArray;
      deductData?.forEach((item: any, index: number) => {
        this.deductionCompList.forEach((value: any, i: any) => {
          if (value.deduction_plan == item?.componentName) {
            temp2.splice(i, 1);
          }
        });

        if (item?.calculation_type == 'Flat Amount') {
          if (item?.fixedAllowanceMonthly)
            totalDeductionMonthlyCTC =
              totalDeductionMonthlyCTC + Number(item?.fixedAllowanceMonthly);
          if (item?.fixedAllowanceAnnual)
            totalDeductionAnnualCTC =
              totalDeductionAnnualCTC + Number(item?.fixedAllowanceAnnual);
        } else {
          if (item?.monthlyBasic)
            totalDeductionMonthlyCTC =
              totalDeductionMonthlyCTC + Number(item?.monthlyBasic);
          if (item?.annualBasic)
            totalDeductionAnnualCTC =
              totalDeductionAnnualCTC + Number(item?.annualBasic);
        }

        const formGroup = this.deductionComponentList?.at(index) as FormGroup;
        if (formGroup) {
          if (item?.calculation_type == 'Flat Amount') {
            formGroup.patchValue({
              earningTypeCode: item?.earningTypeCode,
              componentName: item?.componentName,
              calculationType: item?.calculationType,
              calculationTypeCode: item?.calculationTypeCode,
              fixedAllowanceMonthly: item?.fixedAllowanceMonthly,
              fixedAllowanceAnnual: item?.fixedAllowanceAnnual,
              calculation_type: item?.calculation_type,
              id: item?.id,
            });
          } else {
            formGroup.patchValue({
              earningTypeCode: item?.earningTypeCode,
              componentName: item?.componentName,
              basicPercentage: item?.basicPercentage,
              annualBasic: item?.annualBasic,
              monthlyBasic: item?.monthlyBasic,
              calculationType: item?.calculationType,
              calculationTypeCode: item?.calculationTypeCode,
              calculation_type: item?.calculation_type,
              id: item?.id,
            });
          }
        } else {
          if (item?.calculation_type == 'Flat Amount') {
            this.deductionComponentList.push(
              this.fb.group({
                earningTypeCode: item?.earningTypeCode,
                componentName: item?.componentName,
                // basicPercentage: item?.basicPercentage,
                calculationType: item?.calculationType,
                calculationTypeCode: item?.calculationTypeCode,
                fixedAllowanceMonthly: item?.fixedAllowanceMonthly,
                fixedAllowanceAnnual: item?.fixedAllowanceAnnual,
                calculation_type: item?.calculation_type,
                id: item?.id,
              })
            );
          } else {
            this.deductionComponentList.push(
              this.fb.group({
                earningTypeCode: item?.earningTypeCode,
                componentName: item?.componentName,
                basicPercentage: item?.basicPercentage,
                annualBasic: item?.annualBasic,
                monthlyBasic: item?.monthlyBasic,
                calculationType: item?.calculationType,
                calculationTypeCode: item?.calculationTypeCode,
                calculation_type: item?.calculation_type,
                id: item?.id,
              })
            );
          }
        }
      });
    }

    // ***********************
    if (data?.reiembursementComponentList?.length) {
      data?.reiembursementComponentList?.forEach((item: any, index: number) => {
        this.riembursementCompList.forEach((value: any, i: any) => {
          if (value.reimbursement_name == item?.componentName) {
            temp3.splice(i, 1);
          }
        });

        if (item?.fixedAllowanceMonthly)
          totalMonthlyCTC =
            totalMonthlyCTC + Number(item?.fixedAllowanceMonthly);
        if (item?.fixedAllowanceAnnual)
          totalAnnualCTC = totalAnnualCTC + Number(item?.fixedAllowanceAnnual);
        const formGroup = this.reiembursementComponentList?.at(
          index
        ) as FormGroup;
        if (formGroup) {
          formGroup.patchValue({
            componentName: item?.componentName,
            fixedAllowanceAnnual: item?.fixedAllowanceAnnual,
            fixedAllowanceMonthly: item?.fixedAllowanceMonthly,
            fixedAmountLimit: item?.fixedAmountLimit,
          });
        } else {
          this.reiembursementComponentList.push(
            this.fb.group({
              componentName: item?.componentName,
              fixedAllowanceAnnual: item?.fixedAllowanceAnnual,
              fixedAllowanceMonthly: item?.fixedAllowanceMonthly,
              fixedAmountLimit: item?.fixedAmountLimit,
            })
          );
        }
      });
    }
    console.log(
      totalMonthlyCTC,
      'totalMonthlyCTC<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>'
    );

    this.totalMonthlyCTC = totalMonthlyCTC - totalDeductionMonthlyCTC;
    console.log(this.totalMonthlyCTC, 'this.totalMonthlyCTC<<<<<<<<<<<<');

    this.totalAnnualCTC = totalAnnualCTC - totalDeductionAnnualCTC;
    console.log(this.salaryForm);
    this.earningCompList = temp;
    this.deductionCompList = temp2;
    this.riembursementCompList = temp3;
  }

  enterSalary(actionType: any) {
    if (actionType == 'fromAnnualCtc') {
      let annualCTC = this.salaryForm?.value?.annualCTC;
      let annualCTCAll = annualCTC / 12;

      let salary_per_day = annualCTCAll / 30;
      let salary_per_hr = salary_per_day / 8;
      this.salaryForm?.patchValue({
        salary_per_day: salary_per_day?.toFixed(2),
        salary_per_hr: salary_per_hr?.toFixed(2),
        basic_salary: annualCTCAll?.toFixed(2),
        monthlyCTC: annualCTC / 12,
      });
    } else {
      let basic_salary = this.salaryForm?.value?.basic_salary;
      let salary_per_day = basic_salary / 30;
      let salary_per_hr = salary_per_day / 8;
      this.salaryForm?.patchValue({
        salary_per_day: salary_per_day?.toFixed(2),
        salary_per_hr: salary_per_hr?.toFixed(2),
        annualCTC: basic_salary,
      });
    }
  }
}
