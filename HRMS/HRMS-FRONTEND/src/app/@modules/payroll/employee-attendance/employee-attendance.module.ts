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
import { InternalAnnouncementModule } from 'src/app/@modules/employee-self-service/internal-announcement/internal-announcement.module';
import { ComplaintModule } from 'src/app/@modules/employee-self-service/complaint/complaint.module';
import { TimesheetModule } from 'src/app/@modules/employee-self-service/timesheet/timesheet.module';
import { MatSelectFilterModule } from 'mat-select-filter';
import { EmployeeAttendanceListComponent } from './employee-attendance-list/employee-attendance-list.component';
import { EmployeeAttendanceActionComponent } from './employee-attendance-action/employee-attendance-action.component';
import { EmployeeAttendanceRoutingModule } from './employee-attendance-routing.module';
import { EmployeeAttendanceDetailComponent } from './employee-attendance-detail/employee-attendance-detail.component';
import { PayrollService } from 'src/app/@shared/services/payroll.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RequestInterceptor } from '../../hrms/employee-master/request.interceptor';
import { SearchFilterComponent } from 'src/app/@shared/components/search-filter/search-filter.component';

@NgModule({
  declarations: [
    EmployeeAttendanceListComponent,
    EmployeeAttendanceDetailComponent,
    EmployeeAttendanceActionComponent,
  ],
  imports: [
    CommonModule,
    EmployeeAttendanceRoutingModule,
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
    SearchFilterComponent
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
export class EmployeeAttendanceModule { }
