import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationsComponent } from './notifications.component';
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
import { ComplaintModule } from '../employee-self-service/complaint/complaint.module';
import { InternalAnnouncementModule } from '../employee-self-service/internal-announcement/internal-announcement.module';
import { TimesheetModule } from '../employee-self-service/timesheet/timesheet.module';
import { AllNotificationsComponent } from './all-notifications/all-notifications.component';




@NgModule({
  declarations: [
    NotificationsComponent,
    AllNotificationsComponent,
  ],
  imports: [
    CommonModule,
    NotificationsRoutingModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    InternalAnnouncementModule,
    MatCardModule,
    ComplaintModule,
    TimesheetModule,
    ShairedModule,
    MaterialModule,
    AgGridModule,
    CKEditorModule,
    FullCalendarModule,
    NgImageSliderModule,
    IvyCarouselModule,
    MatExpansionModule, 
  ]
})
export class NotificationsModule { }
