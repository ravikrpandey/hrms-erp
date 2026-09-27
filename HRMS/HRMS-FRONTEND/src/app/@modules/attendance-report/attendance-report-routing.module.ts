import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceReportComponent } from './attendance-report.component';
import { ReportsComponent } from './reports/reports.component';
import { AttedanceReportComponent } from './attedance-reports/attedance-report.component';
import { EarlyGoingReportComponent } from './early-going-reports/early-going-report.component';
import { LateReportComponent } from './late-reports/late-report.component';
import { AbsentReportComponent } from './absent-reports/absent-report.component';
import { LeaveReportComponent } from './leave-reports/leave-report.component';
import { EmployeeListReport } from './employee-entity-report/entity-report/entity-report';
import { EmployeeBranchReport } from './employee-branch-report/employee-branch-report';
import { EmployeeDepartmentReport } from './employee-department-report/employee-department-report';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    children: [
      //{ path: 'attendance-report', component: AttendanceReportComponent },
      { path: 'attendance-report/attendance-reports', component: AttedanceReportComponent },
      { path: 'attendance-report/late-coming-reports', component: LateReportComponent },
      { path: 'attendance-report/early-going-reports', component: EarlyGoingReportComponent },
      { path: 'attendance-report/absent-reports', component: AbsentReportComponent },
      { path: 'leave-reports/leave-reports', component:LeaveReportComponent  },
      { path: 'employee-master-report/employee-report', component:EmployeeListReport  },
      { path: 'employee-master-report/employee-bank-report', component:EmployeeBranchReport },
      { path: 'employee-master-report/employee-manager-report', component:EmployeeDepartmentReport },
    ],
  }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttandanceReportRoutingModule {}
