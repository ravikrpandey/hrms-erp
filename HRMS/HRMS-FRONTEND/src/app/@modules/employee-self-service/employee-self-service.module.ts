import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeSelfServiceRoutingModule } from './employee-self-service-routing.module';
import { EmployeeSelfServiceComponent } from './employee-self-service.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AchievementListComponent } from './achievement-list/achievement-list.component';
import { LeaveApplyListComponent } from './leave-apply-list/leave-apply-list.component';
import { LeaveApplyCreateComponent } from './leave-apply-create/leave-apply-create.component';
import { AchievementCreateComponent } from './achievement-create/achievement-create.component';
import { MatNativeDateModule } from '@angular/material/core';
import { InternalAnnouncementModule } from './internal-announcement/internal-announcement.module';
import { PaySlipComponent } from './pay-slip/pay-slip.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActionComponent } from './achievement-list/action/action.component';
import { AchievementDialogComponent } from './achievement-list/achievement-dialog/achievement-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { ResignationComponent } from './resignation/resignation.component';
import { ResignationCreateComponent } from './resignation-create/resignation-create.component';
import { LeaveApplyActionComponent } from './leave-apply-action/leave-apply-action.component';
import { ComplaintModule } from './complaint/complaint.module';
import { CalendarComponent } from './calendar/calendar-list.component';
import { ProbationActionComponent } from './employe-probation/probation-action/probation-action.component';
import { ProbationDialogComponent } from './employe-probation/probation-dialog/probation-dialog.component';
import { LeaveDialogComponent } from './leave-apply-create/leave-dialog/leave-dialog.component';
import { ActionComponentResignation } from './resignation/action/action.component';
import { TimesheetModule } from './timesheet/timesheet.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HRManagementComponent } from './pending-task/hr-management/hr-management.component';
import { ProcurementBudgetApprovalComponent } from './pending-task/procurement-budget-approval/procurement-budget-approval.component';
import { LMSComponent } from './pending-task/lms/lms.component';
import { AdminComponent } from './pending-task/admin/admin.component';
import { ItTicketingComponent } from './pending-task/it-ticketing/it-ticketing.component';
import { SidebarMenuComponent } from 'src/app/@shared/sidebar-menu/sidebar-menu.component';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { HeaderComponent } from 'ag-grid-community/dist/lib/components/framework/componentTypes';
import { CKEditorModule } from 'ckeditor4-angular';
import { FooterComponent } from 'src/app/@shared/footer/footer.component';
import { ApproveLeaveComponent } from './approve-leave/approve-leave.component';
import { ApprovedLeaveComponent } from './approved-leave/approved-leave.component';
import { RejectedLeaveComponent } from './rejected-leave/rejected-leave.component';
import { UnapprovedLeaveComponent } from './unapproved-leave/unapproved-leave.component';
import { ActionForUnaprovedLeaveComponent } from './unapproved-leave/action/action.component';
import { LeaveDetailsPopupComponent } from './unapproved-leave/leave-details-popup/leave-details-popup.component';
import { ContentDialogComponent } from './content-dialog/content-dialog.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgImageSliderModule } from 'ng-image-slider';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { NgxSlickJsModule } from 'ngx-slickjs';
import { AttendanceComponent } from './attendance/attendance.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { AttendanceDetailDialogComponent } from './attendance-detail-dialog/attendance-detail-dialog.component';
import { MatSelectFilterModule } from 'mat-select-filter';
import { ColleagueReviewListComponent } from './colleague-review/colleague-review-list/colleague-review-list.component';
import { ColleagueReviewComponent } from './colleague-review/colleague-review/colleague-review.component';
import { UploadDeclarationModule } from './upload-declaration/upload-declaration.module';
import { SearchFilterComponent } from 'src/app/@shared/components/search-filter/search-filter.component';
import { AgGridModule } from 'ag-grid-angular';
import { MyDocuments } from './my-documents/my-documents';
import { AttendanceVerificationDialogComponent } from './attendance-verification-dialog/attendance-verification-dialog.component';
@NgModule({
  declarations: [
    AttendanceVerificationDialogComponent,
    ContentDialogComponent,
    EmployeeSelfServiceComponent,
    AchievementListComponent,
    LeaveApplyListComponent,
    LeaveApplyListComponent,
    LeaveApplyCreateComponent,
    AchievementCreateComponent,
    PaySlipComponent,
    ActionComponent,
    AchievementDialogComponent,
    ResignationComponent,
    ResignationCreateComponent,
    LeaveApplyActionComponent,
    CalendarComponent,
    ProbationActionComponent,
    ProbationDialogComponent,
    LeaveDialogComponent,
    ActionComponentResignation,
    DashboardComponent,
    // For pending task start
    HRManagementComponent,
    ProcurementBudgetApprovalComponent,
    LMSComponent,
    AdminComponent,
    ItTicketingComponent,
    LeaveApplyListComponent,
    ApproveLeaveComponent,
    ApprovedLeaveComponent,
    RejectedLeaveComponent,
    UnapprovedLeaveComponent,
    ActionForUnaprovedLeaveComponent,
    LeaveDetailsPopupComponent,
    AttendanceComponent,
    AttendanceDetailDialogComponent,
    ColleagueReviewComponent,
    ColleagueReviewListComponent,
    // SidebarMenuComponent
    // For pending task end
    MyDocuments,
    
  ],
  imports: [
    CommonModule,
    SearchFilterComponent,
    EmployeeSelfServiceRoutingModule,
    MaterialModule,
    AgGridModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    InternalAnnouncementModule,
    MatCardModule,
    ComplaintModule,
    TimesheetModule,
    FormsModule,
    AgGridModule,
    ShairedModule,
    CommonModule,
    MaterialModule,
    AgGridModule,
    CKEditorModule,
    FullCalendarModule,
    NgImageSliderModule,
    IvyCarouselModule,
    MatExpansionModule,
    MatSelectFilterModule,
    UploadDeclarationModule,
    NgxSlickJsModule.forRoot({
      links: {
        jquery: 'https://code.jquery.com/jquery-3.4.0.min.js',
        slickJs:
          'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js',
        slickCss:
          'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css',
        slickThemeCss:
          'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css',
      },
    }),

    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
})
export class EmployeeSelfServiceModule {}
