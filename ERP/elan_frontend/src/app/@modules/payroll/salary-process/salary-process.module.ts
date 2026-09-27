import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalaryProcessRoutingModule } from './salary-process-routing.module';
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
import { SalaryProcessListComponent } from './salary-process-list/salary-process-list.component';
// import { SalaryProcessActionComponent } from './salary-process-action/salary-process-action.component';
// import { SalaryProcessDetailComponent } from './salary-process-detail/salary-process-detail.component';
import { ViewDetailComponent } from './view-detail/view-detail.component';
import { SalaryProcessActionComponent } from './salary-process-action/salary-process-action.component';
import { SalaryProcessDetailComponent } from './salary-process-detail/salary-process-detail.component';
import { ApprovalDialogComponent } from './approval-dialog/approval-dialog.component';
import { PaySlipMainComponent } from './pay-slip-main/pay-slip-main.component';
import { PaySlipPendingComponent } from './pay-slip-pending/pay-slip-pending.component';
import { PaySlipApproveComponent } from './pay-slip-approve/pay-slip-approve.component';
import { PaySlipRejectComponent } from './pay-slip-reject/pay-slip-reject.component';
import { SaleryApprverMainComponent } from './salery-approval-menu/salery-apprver-main.component';
// import { SalaryProcessDetailComponent } from './salary-process-detail/salary-process-detail.component';
// import { ViewDetailComponent } from './view-detail/view-detail.component';


@NgModule({
  declarations: [
    SalaryProcessListComponent,
    SalaryProcessActionComponent,
    SalaryProcessDetailComponent,
    ViewDetailComponent,
    ApprovalDialogComponent,
    PaySlipMainComponent,
    PaySlipPendingComponent,
    PaySlipApproveComponent,
    PaySlipRejectComponent,
    SaleryApprverMainComponent
  ],
  imports: [
    CommonModule,
    SalaryProcessRoutingModule,
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
export class SalaryProcessModule { }
