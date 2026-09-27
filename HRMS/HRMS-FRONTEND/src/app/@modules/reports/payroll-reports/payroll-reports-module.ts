import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PayrollReportsRoutingModule } from './payroll-reports-routing-module';
import { PayRegister } from './pay-register/pay-register';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AdvanceRegister } from './advance-register/advance-register';
import { DeductionRegister } from './deduction-register/deduction-register';
import { EmployeeExpenses } from './employee-expenses/employee-expenses';
import { EqualRemuneration } from './equal-remuneration/equal-remuneration';
import { Esic } from './esic/esic';
import { FineRegister } from './fine-register/fine-register';
import { LeaveRegister } from './leave-register/leave-register';
import { MusterRoll } from './muster-roll/muster-roll';
import { OvertimeRegister } from './overtime-register/overtime-register';
import { PfEcr } from './pf-ecr/pf-ecr';
import { RegisterOfEmployee } from './register-of-employee/register-of-employee';
import { RegisterOfWorkman } from './register-of-workman/register-of-workman';
import { Reimbursement } from './reimbursement/reimbursement';
import { WageRegister } from './wage-register/wage-register';
import { HttpClientModule } from '@angular/common/http';
import { MatExpansionModule } from '@angular/material/expansion';
import { FullCalendarModule } from '@fullcalendar/angular';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { CKEditorModule } from 'ckeditor4-angular';
import { MatSelectFilterModule } from 'mat-select-filter';
import { NgImageSliderModule } from 'ng-image-slider';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { SearchFilterComponent } from 'src/app/@shared/components/search-filter/search-filter.component';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { AttandanceReportRoutingModule } from '../../attendance-report/attendance-report-routing.module';
import { ComplaintModule } from '../../employee-self-service/complaint/complaint.module';
import { InternalAnnouncementModule } from '../../employee-self-service/internal-announcement/internal-announcement.module';
import { TimesheetModule } from '../../employee-self-service/timesheet/timesheet.module';
import { StatutoryReports } from './statutory-reports/statutory-reports';
import { LabourWelfareReport } from './labour-welfare-fund-reports/labour-welfare-fund-reports';
import { NpsReports } from './nps-reports/nps-reports';
import { EdliReports } from './edli-reports/edli-reports';
import { BonusReports } from './bonus-reports/bonus-reports';
import { LeaveEncashmentReports } from './leave-encashment-reports/leave-encashment-reports';
import { AdhocDeductionReports } from './adhoc-deduction-reports/adhoc-deduction-reports';
import { SafReports } from './saf-reports/saf-reports';
import { PtReports } from './pt-reports/pt-reports';
import { TdsReports } from './tds-reports/tds-reports';
import { IncentiveReports } from './incentive-reports/incentive-reports';

@NgModule({
  declarations: [
    PayRegister,
    AdvanceRegister,
    DeductionRegister,
    EmployeeExpenses,
    EqualRemuneration,
    Esic,
    FineRegister,
    LeaveRegister,
    MusterRoll,
    OvertimeRegister,
    PfEcr,
    RegisterOfEmployee,
    RegisterOfWorkman,
    Reimbursement,
    WageRegister,
    StatutoryReports,
    LabourWelfareReport,
    NpsReports,
    EdliReports,
    BonusReports,
    LeaveEncashmentReports,
    AdhocDeductionReports,
    SafReports,
    PtReports,
    TdsReports,
    IncentiveReports
  ],
  imports: [
    CommonModule,
    PayrollReportsRoutingModule,
    MaterialModule,
    AgGridModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCardModule,
    FormsModule,
    HttpClientModule,
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
})
export class PayrollReportsModule {}
