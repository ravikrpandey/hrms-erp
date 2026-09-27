import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreDashboardRoutingModule } from './store-dashboard-routing.module';
import { StoreDashboardComponent } from './store-dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterOutlet } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { NgChartsModule } from 'ng2-charts';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { ComplaintModule } from '../../employee-self-service/complaint/complaint.module';
import { TimesheetModule } from '../../employee-self-service/timesheet/timesheet.module';


@NgModule({
  declarations: [
    StoreDashboardComponent
  ],
  imports: [
    CommonModule,
    StoreDashboardRoutingModule,
    NgChartsModule,
    RouterOutlet,
    MaterialModule,
    AgGridModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCardModule,
    // ComplaintModule,
    TimesheetModule,
    FormsModule,
    ShairedModule,
    MaterialModule,
    AgGridModule,
  ]
})
export class StoreDashboardModule { }
