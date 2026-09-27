import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuspenseAccountCustomerRoutingModule } from './suspense-account-customer-routing.module';
import { SuspenseAccountListComponent } from './suspense-account-list/suspense-account-list.component';
import { AddSuspenseAccountComponent } from './add-suspense-account/add-suspense-account.component';
import { MatSelectFilterModule } from 'mat-select-filter';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterOutlet } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { ComplaintModule } from 'src/app/@modules/employee-self-service/complaint/complaint.module';
import { TimesheetModule } from 'src/app/@modules/employee-self-service/timesheet/timesheet.module';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { SuspenceAccountActionComponent } from './suspence-account-action/suspence-account-action.component';


@NgModule({
  declarations: [
    SuspenseAccountListComponent,
    AddSuspenseAccountComponent,
    SuspenceAccountActionComponent
  ],
  imports: [
    CommonModule,
    SuspenseAccountCustomerRoutingModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    RouterOutlet,
    MaterialModule,
    MatDialogModule,
    MatCardModule,
    ComplaintModule,
    TimesheetModule,
    ShairedModule,
    MatSelectFilterModule,
    MaterialModule,
  ]
})
export class SuspenseAccountCustomerModule { }
