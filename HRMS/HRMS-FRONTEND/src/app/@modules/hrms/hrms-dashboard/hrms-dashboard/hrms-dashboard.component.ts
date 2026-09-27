import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HrmsdashboardService } from 'src/app/@shared/services/hrmsDashboard/hrmsdashboard.service';

@Component({
  selector: 'app-hrms-dashboard',
  templateUrl: './hrms-dashboard.component.html',
  styleUrls: ['./hrms-dashboard.component.scss'],
})
export class HrmsDashboardComponent {

  constructor(private hrmsdashboard: HrmsdashboardService,
        private router: Router,
  ) {
    
  }

  attedenceCount: any = {};  
  selectedMonth: string = ''; 
  showSelecteduser: any;
  employeeData: any = [];
  entity_id: any;
  leavename: any;
  countholiday: any;
  attendanceDetailsdata: any;
  leaveAppliedEmployeeCount: any = [];
  meLeaveCount: number = 0;
  teammateLeaveCount: number = 0;
  getAllnewJoinandBirthdaydata: any = [];
  birthdayCountsByMonth: { [key: string]: number } = {};
  birthdayList: any[] = []; 
  newJoinList:any []=[]
  newJoinCount: number = 0;
  WFHEmployeeListData:any []=[]
  getAllHolidayListdata: any[] = [];


  ngOnInit() {
    this.getAllLeaveApplyUserData();
    this.getAllleaveAppliedEmployeeApprovedOrPending()
    this.get_AllBirthDayAndOtherAnnouncementdata()
    this.getOnlyWorkFromhomeEmployeeList()
    this.getAllHolidayList()
  }

  getAllLeaveApplyUserData() {
    const entityList = JSON.parse(localStorage.getItem('entityList') || '[]');
    if (entityList && entityList.length > 0) {
      this.entity_id = entityList[0].entity_id;
      this.hrmsdashboard
        .getAllEmployeeLeavedata(this.entity_id)
        .subscribe((res: any) => {
          this.showSelecteduser = this.removeDuplicateEmployees(
            res.data.leaveDetails
          );
          this.employeeData = res.data.leaveDetails;
          this.attendanceDetailsdata = res.data.attendanceDetails;
        });
    }
  }

  removeDuplicateEmployees(data: any[]) {
    return data.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.employee_id === value.employee_id)
    );
  }

  onUserSelect(event: any) {
    const selectedValue = event.value;
    this.leavename = this.employeeData.filter((item: any) => {
      return item.employee_id === selectedValue;
    });
    this.countholiday = this.leavename
      .filter((item: any) => item.approval_status === 'APPROVED')
      .reduce((total: number, item: any) => {
        return total + parseInt(item.approved_days || 0);
      }, 0);
    this.leavename = this.removeDuplicateLeaveIds(this.leavename);
    this.leavename = this.leavename.map((item: any) => {
      let usedDays = 0;
      if (item.approved_days && !isNaN(parseInt(item.approved_days))) {
        usedDays = parseInt(item.approved_days);
      } else {
        console.log(
          `Warning: approved_days not found or invalid for leaveId ${item.leave_id}`
        );
      }
      return {
        ...item,
        usedDays: usedDays,
      };
    });
    this.CountTheAttandence(selectedValue);
  }

  attendanceStatusCount: any = {
    P: 0,
    A: 0,
    PL: 0,
    UL: 0,
    DA: 0,
    DP: 0,
    HD: 0,
    PHL: 0,
    UHL: 0,
    CO: 0,
    WFO: 0,
    WHO: 0,
    H: 0,
  };




  
 
    objectKeys(obj: any): string[] {
      return obj ? Object.keys(obj) : [];
    }
  
    
    statusLabels:any=[]
    CountTheAttandence(selectedValue: any) {
      const filteredAttendance = this.attendanceDetailsdata.filter((item: any) => {
        return item.employee_id === selectedValue;
      });
      const monthAbbreviations: any = {
        January: 'JAN', February: 'FEB', March: 'MAR', April: 'APR',
        May: 'MAY', June: 'JUNE', July: 'JULY', August: 'AUG',
        September: 'SEP', October: 'OCT', November: 'NOV', December: 'DEC'
      };
      const statusTypes = [
        'P', 'A', 'PL', 'UL', 'DA', 'HD', 'PHL', 'UHL', 'H', 'WFO', 'CO'
      ];
      const statusLabels: any = {
        'P':'Present',
        'A':'Absent',
        'PL':'Paid Leave',
        'UL':'Unpaid Leave',
        'DA':'Default Absent',
        'HD':'Half Day',
        'PHL':'Paid HalfDay Leave',
        'UHL':'Unpaid HalfDay Leave',
        'H':'Holiday',
        'WFO':'Week Off',
        'CO':'Comp Off'
      };
      
      const attendanceByMonth = filteredAttendance.reduce((acc: any, item: any) => {
        const attDate = new Date(item.att_date);
        const fullMonthName = attDate.toLocaleString('default', { month: 'long' });
        const monthName = monthAbbreviations[fullMonthName] || fullMonthName;
        if (!acc[monthName]) {
          acc[monthName] = {
            total: 0,
            statusCount: {}
          }
          statusTypes.forEach(status => {
            acc[monthName].statusCount[status] = 0;
          });
        }
        const status = item.attendance_status;
        acc[monthName].total++;
        if (acc[monthName].statusCount[status] !== undefined) {
          acc[monthName].statusCount[status]++;
        }
        return acc;
      }, {});
      const predefinedMonths = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUNE', 'JULY', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      predefinedMonths.forEach((month) => {
        if (!attendanceByMonth[month]) {
          attendanceByMonth[month] = {
            total: 0,
            statusCount: {}
          };
          statusTypes.forEach(status => {
            attendanceByMonth[month].statusCount[status] = 0;
          });
        }
      });
      this.attedenceCount = attendanceByMonth;
      this.statusLabels = statusLabels;
    }
    
    selectMonth(month: string) {
      this.selectedMonth = month;
    }
  
  removeDuplicateLeaveIds(data: any[]) {
    return data.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.leaveId == value.leaveId)
    );
  }





getAllleaveAppliedEmployeeApprovedOrPending() {
  const entityList = JSON.parse(localStorage.getItem('entityList') || '[]');
  if (entityList && entityList.length > 0) {
    this.entity_id = entityList[0].entity_id;
    this.hrmsdashboard.getAllEmployeeAppliedLeave(this.entity_id).subscribe((res: any) => {
      this.leaveAppliedEmployeeCount = res.data;
      this.filterLeaveCounts();
    });
  }
}

filterLeaveCounts() {
  const currentDate = new Date().toISOString().split('T')[0]; 
  this.meLeaveCount = this.leaveAppliedEmployeeCount.filter((leave: any) =>
    leave.leave_for === 'ME' &&
    leave.approval_status &&
    (leave.approval_status.toUpperCase() === 'APPROVED' || leave.approval_status.toUpperCase() === 'PENDING') &&
    (leave.approved_end_date ? (currentDate >= leave.approved_start_date && currentDate <= leave.approved_end_date) : leave.approval_status.toUpperCase() === 'PENDING')
  ).length;

  this.teammateLeaveCount = this.leaveAppliedEmployeeCount.filter((leave: any) =>
    leave.leave_for === 'TEAMMATE' &&
    leave.approval_status &&
    (leave.approval_status.toUpperCase() === 'APPROVED' || leave.approval_status.toUpperCase() === 'PENDING') &&
    (leave.approved_end_date ? (currentDate >= leave.approved_start_date && currentDate <= leave.approved_end_date) : leave.approval_status.toUpperCase() === 'PENDING')
  ).length;

}





get_AllBirthDayAndOtherAnnouncementdata() {
  const entityList = JSON.parse(localStorage.getItem('entityList') || '[]');
  if (entityList && entityList.length > 0) {
    this.entity_id = entityList[0].entity_id;
    this.hrmsdashboard.get_AllBirthDayAndOtherAnnouncementdata(this.entity_id).subscribe((res: any) => {
      this.getAllnewJoinandBirthdaydata = res.data;
      this.newJoinList = res.data
      this.countTodayBirthdays();
      this.prepareTodayBirthdayList();
      this.countNewJoinees();
    });
  }
}



countTodayBirthdays() {
  const today = new Date().toISOString().slice(5, 10);
  let count = 0;
  this.getAllnewJoinandBirthdaydata.forEach((person: any) => {
    if (person.date_of_birth) {
      const dob = person.date_of_birth.slice(5, 10); 
      if (dob === today) {
        count++;
      }
    }
  });
  //console.log("Today's Birthday Count:", count);

}


prepareTodayBirthdayList() {
  const today = new Date().toISOString().slice(5, 10); 
  this.birthdayList = this.getAllnewJoinandBirthdaydata
    .filter((person: any) => {
      if (person.date_of_birth) {
        return person.date_of_birth.slice(5, 10) === today;
      }
      return false;
    })
    .map((person: any) => ({
      firstName: person.first_name || "N/A",
      middleName: person.middle_name || "N/A",
      lastName: person.last_name || "N/A",
      dateOfJoining: person.date_of_joining || "N/A",
      dateOfBirth: person.date_of_birth || "N/A",
    }));

  // console.log("Today's Birthday List:", this.birthdayList);
}


isValidDate(date: any): boolean {
  return date && !isNaN(new Date(date).getTime());
}



countNewJoinees() {
  const currentDate = new Date();
  const tenDaysLater = new Date(currentDate);
  tenDaysLater.setDate(currentDate.getDate() + 365);
  const filtered = this.newJoinList.filter((emp: any) => {
    if (emp.emp_join_date) {
      const joinDate = new Date(emp.emp_join_date);
      return joinDate >= currentDate && joinDate <= tenDaysLater;
    }
    return false;
  });
  this.newJoinCount = filtered.length;
  //console.log("New Join Count (next 10 days):", this.newJoinCount);
}

get filteredNewJoinees() {
  const currentDate = new Date();
  const tenDaysLater = new Date(currentDate);
  tenDaysLater.setDate(currentDate.getDate() + 365);
  return this.newJoinList.filter((emp: any) => {
    if (emp.emp_join_date) {
      const joinDate = new Date(emp.emp_join_date);
      return joinDate >= currentDate && joinDate <= tenDaysLater;
    }
    return false;
  });
}

getOnlyWorkFromhomeEmployeeList(){
  const entityList = JSON.parse(localStorage.getItem('entityList') || '[]');
  if (entityList && entityList.length > 0) {
    this.entity_id = entityList[0].entity_id;
    this.hrmsdashboard.getOnlyWFHEmployeeList(this.entity_id).subscribe((res: any) => {
      this.WFHEmployeeListData= res.data;
    })
  }
}




getAllHolidayList() {
  const entityList = JSON.parse(localStorage.getItem('entityList') || '[]');
  if (entityList && entityList.length > 0) {
    this.entity_id = entityList[0].entity_id;
    this.hrmsdashboard.getAllHolidayView(this.entity_id).subscribe((res: any) => {
      const allHolidays = res.data;
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      this.getAllHolidayListdata = allHolidays.filter((holiday: any) => {
        const holidayDate = new Date(holiday.date);
        holidayDate.setHours(0, 0, 0, 0);
        return holidayDate >= currentDate;
      });
     // console.log("Filtered Holiday Data:", this.getAllHolidayListdata);
    });
  }
}

Applyleave() {
  this.router.navigate(['/master/ess/leave-apply-form']);
}


Attendance(){
  this.router.navigate(['/master/hrms/attendance-calendar']);

}

}