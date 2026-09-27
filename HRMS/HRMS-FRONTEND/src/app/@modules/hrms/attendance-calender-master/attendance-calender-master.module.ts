import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceCalenderTableComponent } from './attendance-calender-table/attendance-calender-table.component';
import { AttandanceCalenderRoutingModule } from './attendance-calender-master-routing.module';
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
import { ComplaintModule } from '../../employee-self-service/complaint/complaint.module';
import { InternalAnnouncementModule } from '../../employee-self-service/internal-announcement/internal-announcement.module';
import { TimesheetModule } from '../../employee-self-service/timesheet/timesheet.module';
import { AttendanceDetailDialogComponent } from './attendance-detail-dialog/attendance-detail-dialog.component';
import { AttendanceDialogComponent } from './attendance-dialog/attendance-dialog.component';
import { MissAttendanceDialogComponent } from './missing-attendance-dialog/missattendance-dialog.component';
import { MatSelectFilterModule } from 'mat-select-filter';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { SearchFilterComponent } from 'src/app/@shared/components/search-filter/search-filter.component';


@NgModule({
  declarations: [
    AttendanceCalenderTableComponent,
    AttendanceDetailDialogComponent,
    AttendanceDialogComponent,
    MissAttendanceDialogComponent
  ],
  imports: [
    CommonModule,
    AttandanceCalenderRoutingModule,
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
    SearchFilterComponent
  ]
})
export class AttendanceCalenderMasterModule { }
