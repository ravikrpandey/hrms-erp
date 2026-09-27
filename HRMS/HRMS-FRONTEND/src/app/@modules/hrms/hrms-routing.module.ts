import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HrmsComponent } from './hrms.component';
import { DashboardComponent } from './webinar-session/dashboard/dashboard.component';
import { SessionManagmentComponent } from './webinar-session/session-managment/session-managment.component';
import { CreateSessionComponent } from './webinar-session/session-managment/create-session/create-session.component';
import { RecordingComponent } from './webinar-session/recording/recording.component';
import { WebinarSessionComponent } from './webinar-session/webinar-session.component';
import { AttendenceComponent } from './webinar-session/attendence/attendence.component';
import { DeductionRules } from './deduction-rules/deduction-rules';
import { DeductionRuleList } from './deduction-rules/deduction-rule-list/deduction-rule-list';
import { AttendanceWorkingHours } from './attendance-working-hours/attendance-working-hours';
import { ViewAttendanceWorkingHours } from './view-attendance-working-hours/view-attendance-working-hours';

const routes: Routes = [
  {
    path: '',
    component: HrmsComponent,
    children: [
      // {
      //   path: '', redirectTo: 'employee-master', pathMatch: 'full'
      // },

      { path: 'webinar-dashboard', component: DashboardComponent },
      { path: 'session-managment', component: SessionManagmentComponent },
      {
        path: 'webnar-session/create/session-managment',
        component: CreateSessionComponent,
      },
      {
        path: 'webnar-session/view/session-managment/:id',
        component: CreateSessionComponent,
      },
      {
        path: 'webnar-session/edit/session-managment/:id',
        component: CreateSessionComponent,
      },
      { path: 'webnar-Attendance', component: AttendenceComponent },
      { path: 'webnar-recording', component: RecordingComponent },
      { path: 'webnar-session', component: WebinarSessionComponent },


      {
        path: 'employee-master',
        loadChildren: () =>
          import('./employee-master/employee-master.module').then(
            (m) => m.EmployeeMasterModule
          ),
      },
      {
        path: 'document-management',
        loadChildren: () =>
          import('./document-management/document-management-module').then(
            (m) => m.DocumentManagementModule
          ),
      },
      {
        path: 'rbacmaster',
        loadChildren: () =>
          import('./rbacmaster/rbacmaster.module').then(
            (m) => m.RbacmasterModule
          ),
      },
      // ------------------------------------------------------
      {
        path: 'leave-management',
        loadChildren: () =>
          import('./leave-management/leave-management.module').then(
            (m) => m.LeaveManagementModule
          ),
      },
      // ------------------------------------------------------
      {
        path: 'hrms-dashboard',
        loadChildren: () =>
          import('./hrms-dashboard/hrms-dashboard.module').then(
            (m) => m.HrmsDashboardModule
          ),
      },
      // {
      //   path: 'kpa-master',
      //   loadChildren: () => import('./kpa/kpa.module').then((m) => m.KpaModule),
      // },
      {
        path: 'all-resignation',
        loadChildren: () =>
          import('./all-resignation/all-resignation.module').then(
            (m) => m.AllResignationModule
          ),
      },
      {
        path: 'shift-master',
        loadChildren: () =>
          import('./shift-master/shift-master.module').then(
            (m) => m.ShiftMasterModule
          ),
      },
      {
        path: 'holiday-master',
        loadChildren: () =>
          import('./holiday-master/holiday-master.module').then(
            (m) => m.HolidayMasterModule
          ),
      },
      {
        path: 'setup-work-calender',
        loadChildren: () =>
          import('./setup-work-calender/setup-work-calender.module').then(
            (m) => m.SetupWorkCalenderModule
          ),
      },
      {
        path: 'attend-user-master',
        loadChildren: () =>
          import('./attendance-userid-master/atten-userid-master.module').then(
            (m) => m.AttendanceUserIDMaster
          ),
      },
      {
        path: 'attendance-calendar',
        loadChildren: () =>
          import(
            './attendance-calender-master/attendance-calender-master.module'
          ).then((m) => m.AttendanceCalenderMasterModule),
      },


      {
        path: 'complaint',
        loadChildren: () =>
          import('./hrms-complaint/hrms-complaint.module').then(
            (m) => m.HrmsComplaintModule
          ),
      },

      {
        path: 'employee-transfer',
        loadChildren: () =>
          import('./employee-transfer/employee-transfer.module').then(
            (m) => m.EmployeeTransferModule
          ),
      },
      {
        path:'announcement',
        loadChildren:()=>
          import('./announcement/announcement.module').then(
          (m)=>m.AnnouncementModule
          )
      },
      {
        path: 'shift-allocation',
        loadChildren: () =>
          import('./shift-allocation/shift-allocation.module').then(
            (m) => m.ShiftAllocationModule
          ),
      },
      {
        path: 'leave-cancellation',
        loadChildren: () =>
          import('./leave-cancellation/leave-cancellation-module').then(
            (m) => m.LeaveCancellationModule
          ),
      },
      {
        path: 'overtime-master',
        loadChildren: () =>
          import('./overtime-master/overtime-master.module').then(
            (m) => m.OvertimeMasterModule
          ),
      },
      {
        path: 'excel-bulk-upload',
        loadChildren: () =>
          import('./excel-upload/excel-upload.module').then(
            (m) => m.ExcelUploadModule
          )
      },
      {
        path: 'leave-encashment',
        loadChildren: () =>
          import('./leave-encashment/leave-encashment-module').then(
            (m) => m.leaveEncashmentModule
          )
      },
      {
        path: 'apply-loan',
        loadChildren: () =>
          import('./advance-payment/advance-payment-module').then(
            (m) => m.AdvancePaymentModule
          )
      },
            {
        path: 'deduction-rules-form',
        component:DeductionRules
      },
       {
        path: 'deduction-rule-list',
        component:DeductionRuleList     
      },
       {
        path: 'attendance-working-hours',
        component:AttendanceWorkingHours     
      },
        {
        path: 'view-attendance-working-hours',
        component:ViewAttendanceWorkingHours
      },
    ],
  },
  { path: 'document_management', loadChildren: () => import('./document-management/document-management-module').then(m => m.DocumentManagementModule) },
  { path: 'document_management', loadChildren: () => import('./document-management/document-management-module').then(m => m.DocumentManagementModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HrmsRoutingModule { }
