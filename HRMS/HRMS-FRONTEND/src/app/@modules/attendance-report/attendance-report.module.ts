import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AgGridModule } from 'ag-grid-angular';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { CKEditorModule } from 'ckeditor4-angular';
import { NgImageSliderModule } from 'ng-image-slider';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';

import { MatSelectFilterModule } from 'mat-select-filter';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AttendanceReportComponent } from './attendance-report.component';
import { AttandanceReportRoutingModule } from './attendance-report-routing.module';
import { InternalAnnouncementModule } from '../employee-self-service/internal-announcement/internal-announcement.module';
import { ComplaintModule } from '../employee-self-service/complaint/complaint.module';
import { TimesheetModule } from '../employee-self-service/timesheet/timesheet.module';
import { ReportsComponent } from './reports/reports.component';
import { SearchFilterComponent } from 'src/app/@shared/components/search-filter/search-filter.component';
import { LateReportComponent } from './late-reports/late-report.component';
import { AttedanceReportComponent } from './attedance-reports/attedance-report.component';
import { EarlyGoingReportComponent } from './early-going-reports/early-going-report.component';
import { AbsentReportComponent } from './absent-reports/absent-report.component';
import { LeaveReportComponent } from './leave-reports/leave-report.component';
import { EmployeeListReport } from './employee-entity-report/entity-report/entity-report';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { PayrollService } from 'src/app/@shared/services/payroll.service';
import { RequestInterceptor } from '../hrms/employee-master/request.interceptor';
import { EmployeeBranchReport } from './employee-branch-report/employee-branch-report';
import { EmployeeDepartmentReport } from './employee-department-report/employee-department-report';

@NgModule({
  declarations: [
    AttendanceReportComponent,
    ReportsComponent,
    AttedanceReportComponent,
    LateReportComponent,
    EarlyGoingReportComponent,
    AbsentReportComponent,
    LeaveReportComponent,
    EmployeeListReport,
    EmployeeBranchReport,
    EmployeeDepartmentReport
  ],
  imports: [
    CommonModule,
    AttandanceReportRoutingModule,
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
    NgxMaterialTimepickerModule,
    SearchFilterComponent,
  ],
   providers: [
      PayrollService,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: RequestInterceptor,
        multi: true
      },
    ]
})
export class AttendanceReportModule {}
