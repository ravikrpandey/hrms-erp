import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { AchievementFormComponent } from './achievement-form/achievement-form.component';
import { AchievementCreateComponent } from './achievement-create/achievement-create.component';
import { AchievementListComponent } from './achievement-list/achievement-list.component';
import { ComplaintCreateComponent } from './complaint/complaint-create/complaint-create.component';
import { ComplaintListComponent } from './complaint/complaint-list/complaint-list.component';
import { EmployeeSelfServiceComponent } from './employee-self-service.component';
import { LeaveApplyCreateComponent } from './leave-apply-create/leave-apply-create.component';
import { LeaveApplyListComponent } from './leave-apply-list/leave-apply-list.component';
import { PaySlipComponent } from './pay-slip/pay-slip.component';
import { ResignationComponent } from './resignation/resignation.component';
import { ResignationCreateComponent } from './resignation-create/resignation-create.component';
import { CalendarComponent } from './calendar/calendar-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ApproveLeaveComponent } from './approve-leave/approve-leave.component';
import { ApprovedLeaveComponent } from './approved-leave/approved-leave.component';
import { RejectedLeaveComponent } from './rejected-leave/rejected-leave.component';
import { UnapprovedLeaveComponent } from './unapproved-leave/unapproved-leave.component';
import { AgGridModule } from 'ag-grid-angular';
import { AttendanceComponent } from './attendance/attendance.component';
import { ChangePasswordComponent } from '../hrms/employee-master/change-password/change-password.component';
import { CompOffListComponent } from '../assign-comp-off/comp-off-list/comp-off-list.component';
import { MyDocuments } from './my-documents/my-documents';

const routes: Routes = [
  {
    path: '',
    component: EmployeeSelfServiceComponent,
    children: [
      { path: '', component: EmployeeSelfServiceComponent },
      { path: 'achievement', component: AchievementListComponent },
      { path: 'achievement-create', component: AchievementCreateComponent },
      { path: 'leave-apply', component: LeaveApplyListComponent },
      { path: 'leave-apply-form', component: LeaveApplyCreateComponent },
      { path: 'attendance', component: AttendanceComponent },
      { path: 'my-documents', component: MyDocuments },
      {
        path: 'leave-approval',
        component: ApproveLeaveComponent,
        children: [
          {
            path: '',
            redirectTo: 'unapproved-leave',
            pathMatch: 'full',
          },
          {
            path: 'unapproved-leave',
            component: UnapprovedLeaveComponent,
          },
          {
            path: 'approved-leave',
            component: ApprovedLeaveComponent,
          },
          {
            path: 'rejected-leave',
            component: RejectedLeaveComponent,
          },
        ],
      },
      { path: 'pay-slip', component: PaySlipComponent },
      { path: 'calendar', component: CalendarComponent },
      // { path: 'resignation', component: ResignationComponent },
      { path: 'resignation-create', component: ResignationCreateComponent },
      { path: 'complaint-list', component: ComplaintListComponent },
      { path: 'complaint-create', component: ComplaintCreateComponent },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
      },

      {
        path: 'employ',
        loadChildren: () =>
          import('./employee/employee.module').then((m) => m.EmployeeModule),
      },
      {
        path: 'resignation',
        loadChildren: () =>
          import('./resignation/resignation.module').then(
            (m) => m.ResignationModule
          ),
      },
      {
        path: 'checklist-approval',
        loadChildren: () =>
          import('./checklist-approval/checklist-approval.module').then(
            (m) => m.ChecklistApprovalModule
          ),
      },
      {
        path: 'employee-details',
        loadChildren: () =>
          import('./employee/employee.module').then((m) => m.EmployeeModule),
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'on-boarding-employ',
        loadChildren: () =>
          import(
            './employee/on-boarding-emp-list/on-boarding-emp-list.module'
          ).then((m) => m.OnBoardingEmpListModule),
      },

      {
        path: 'employee-probation',
        loadChildren: () =>
          import('./employe-probation/employee-probation.module').then(
            (m) => m.ProbationModule
          ),
      },
      {
        path: 'grievance',
        loadChildren: () =>
          import('./grievance/grievance/grievance.module').then(
            (m) => m.GrievanceModule
          ),
      },
      {
        path: 'upload-declaration',
        loadChildren: () =>
          import('./upload-declaration/upload-declaration.module').then(
            (m) => m.UploadDeclarationModule
          ),
      },
      {
        path: 'help-disk',
        loadChildren: () =>
          import('./help-desk/help-desk.module').then((m) => m.HelpDeskModule),
      },
      {
        path: 'announcement-list',
        loadChildren: () =>
          import('./internal-announcement/internal-announcement.module').then(
            (m) => m.InternalAnnouncementModule
          ),
      },
      {
        path: 'complaint-list',
        loadChildren: () =>
          import('./complaint/complaint.module').then((m) => m.ComplaintModule),
      },
      {
        path: 'apply-loan',
        loadChildren: () =>
          import('./advance-payment/advance-payment.module').then(
            (m) => m.AdvancePaymentModule
          ),
      },
      {
        path: 'manpower-request',
        loadChildren: () =>
          import('./manpower-request/manpower-request.module').then(
            (m) => m.ManpowerRequestModule
          ),
      },
      {
        path: 'self-assessment',
        loadChildren: () =>
          import('./self-assessment/self-assessment.module').then(
            (m) => m.SelfAssessmentModule
          ),
      },
      {
        path: 'cancelled-leaves',
        loadChildren: () =>
          import('./cancelled-leave/cancelled-leave-module').then(
            (m) => m.CancelledLeaveModule
          ),
      },
      {
        path: 'colleague-review',
        loadChildren: () =>
          import('./colleague-review/colleague-review.module').then(
            (m) => m.ColleagueReviewModule
          ),
      },
      {
        path: 'self-pay-slip',
        loadChildren: () =>
          import('./ess-pay-slip/ess-pay-slip.module').then(
            (m) => m.EssPaySlipModule
          ),
      },
      {
        path: 'learning-gallery',
        loadChildren: () =>
          import('./learning-gallery/learning-gallery.module').then(
            (m) => m.LearningGalleryModule
          ),
      },
      {
        path: 'course-approval',
        loadChildren: () =>
          import('./course-approval/course-approval.module').then(
            (m) => m.CourseApprovalModule
          ),
      },
      {
        path: 'exit-form',
        loadChildren: () =>
          import(
            './exit-form/exit-form-module'
          ).then((m) => m.ExitFormModule),
      },
      {
        path: 'my-tickets',
        loadChildren: () =>
          import('./my-tickets/my-tickets.module').then(
            (m) => m.MyTicketsModule
          ),
      },
      {
        path: 'overtime-request',
        loadChildren: () => import('./overtime-request/overtime-request.module').then(
          m => m.ExtraHourRequestModule
        )
      },
      {
        path: 'fnf-settlement',
        loadChildren: () =>
          import(
            './fnf-settlement/fnf-settlement.module'
          ).then((m) => m.FnfSettlementModule),
      },
      // {
      //   path: 'face-detection-list',
      //   loadChildren: () =>
      //     import(
      //       './face-detection/face-detection-module'
      //     ).then((m) => m.FaceDetectionModule),
      // },
      { path: 'assign-comp-off-list', component: CompOffListComponent },
      { path: 'attendance-request', loadChildren: () => import('./attendance-request/attendance-request-module').then(m => m.AttendanceRequestModule) },

      { path: 'attendance-approval', loadChildren: () => import('./attendance-approval/attendance-approval-module').then(m => m.AttendanceApprovalModule) },
      
      { path: 'kt-assignment', 
        loadChildren: () => import('./kt-assignment/kt-assignment-module').then(m => m.KtAssignmentModule) },

      { path: 'my-kt-request', 
        loadChildren: () => import('./my-kt-request/my-kt-request-module').then(m => m.MyKtRequestModule) },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeSelfServiceRoutingModule { }

// const routes: Routes = [
//   {
//     path: '',
//     component: HrmsComponent,
//     children: [
//       // {
//       //   path: '', redirectTo: 'employee-master', pathMatch: 'full'
//       // },

//       {
//         path: 'employee-master',
//         loadChildren: () =>
//           import('./employee-master/employee-master.module').then(
//             (m) => m.EmployeeMasterModule
//           ),
//       },

//       {
//         path: 'recuitment-module',
//         loadChildren: () =>
//           import('./recuitment-module/recuitment-module.module').then(
//             (m) => m.RecuitmentModuleModule
//           ),
//       },

//       {
//         path: 'DMS',
//         loadChildren: () => import('./dms/dms.module').then((m) => m.DMSModule),
//       },
//       {
//         path: 'rbacmaster',
//         loadChildren: () =>
//           import('./rbacmaster/rbacmaster.module').then(
//             (m) => m.RbacmasterModule
//           ),
//       },
//       {
//         path: 'email-request',
//         loadChildren: () =>
//           import('./email-request/email-request.module').then(
//             (m) => m.EmailRequestModule
//           ),
//       },
//       {
//         path: 'leave-master',
//         loadChildren: () =>
//           import('./leave-master/leave-master.module').then(
//             (m) => m.LeaveMasterModule
//           ),
//       },

//       {
//         path: 'payroll',
//         loadChildren: () =>
//           import('./payroll/payroll.module').then((m) => m.PayrollModule),
//       },
//       {
//         path: 'performance-management',
//         loadChildren: () =>
//           import('./performance-management/performance-management.module').then(
//             (m) => m.PerformanceManagementModule
//           ),
//       },
//       {
//         path: 'hrms-dashboard',
//         loadChildren: () =>
//           import('./hrms-dashboard/hrms-dashboard.module').then(
//             (m) => m.HrmsDashboardModule
//           ),
//       },
//     ],
//   },

// ];
