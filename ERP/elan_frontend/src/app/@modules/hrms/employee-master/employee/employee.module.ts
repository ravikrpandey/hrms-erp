import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { EmployeeCreateComponent } from './employee-create/employee-create.component';
import { BasicDetailsComponent } from './basic-details/basic-details.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { SalaryDetailsComponent } from './salary-details/salary-details.component';
import { PaymentDetailsComponent } from './payment-details/payment-details.component';
import { DocumentDetailsComponent } from './document-details/document-details.component';
import { ActionComponent } from './employee-list/action/action.component';
import { EmpListDialogComponent } from './employee-list/emp-list-dialog/emp-list-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AllowActionModule } from 'src/app/@shared/shaired/allow-action.module';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectFilterModule } from 'mat-select-filter';
import { ContractDetailsComponent } from './contract-details/contract-details.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { DownloadCsvDialogComponent } from './employee-list/download-csv-dialog/download-csv-dialog.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { SalaryTemplateModule } from 'src/app/@modules/payroll/salary-template/salary-template.module';
import { LoginHistoryComponent } from './login-history/login-history.component';
@NgModule({
  declarations: [
    EmployeeListComponent,
    EmployeeCreateComponent,
    BasicDetailsComponent,
    PersonalDetailsComponent,
    SalaryDetailsComponent,
    PaymentDetailsComponent,
    DocumentDetailsComponent,
    ContractDetailsComponent,
    ActionComponent,
    EmpListDialogComponent,
    DownloadCsvDialogComponent,
    LoginHistoryComponent,
    
  ],
   providers: [DatePipe],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    AgGridModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MaterialModule,
    ReactiveFormsModule,
    MatDialogModule,
    AllowActionModule,
    MatSelectModule,
    MatSelectFilterModule,
    MatTooltipModule,
    MatListModule,
    MatSelectFilterModule,
    MatSelectModule,
    NgxIntlTelInputModule,
    SalaryTemplateModule
  ]
})
export class EmployeeModule { }
