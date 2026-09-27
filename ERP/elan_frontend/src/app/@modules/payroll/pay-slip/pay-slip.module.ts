import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaySlipRoutingModule } from './pay-slip-routing.module';
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
import { PaySlipActionComponent } from './pay-slip-action/pay-slip-action.component';
import { InternalAnnouncementModule } from 'src/app/@modules/employee-self-service/internal-announcement/internal-announcement.module';
import { ComplaintModule } from 'src/app/@modules/employee-self-service/complaint/complaint.module';
import { TimesheetModule } from 'src/app/@modules/employee-self-service/timesheet/timesheet.module';
import { PaySlipListComponent } from './pay-slip-list/pay-slip-list.component';
import { PaySlipDetailComponent } from './pay-slip-detail/pay-slip-detail.component';
import { MatSelectFilterModule } from 'mat-select-filter';
import { PaySlipProcessedComponent } from './pay-slip-processed/pay-slip-processed.component';
import { SaleryUpdatedEmpComponent } from './salery-updated-emp/salery-updated-emp.component';


@NgModule({
  declarations: [
    PaySlipListComponent,
    PaySlipActionComponent,
    PaySlipDetailComponent,
    PaySlipProcessedComponent,
    SaleryUpdatedEmpComponent
  ],
  imports: [
    CommonModule,
    PaySlipRoutingModule,
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
    MatSelectFilterModule
  ]
})
export class PaySlipModule { }
