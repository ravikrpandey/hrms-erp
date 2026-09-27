import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaintenanceDashboardRoutingModule } from './maintenance-dashboard-routing.module';
import { MaintenanceDashboardComponent } from './maintenance-dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { FullCalendarModule } from '@fullcalendar/angular';


@NgModule({
  declarations: [
    MaintenanceDashboardComponent
  ],
  imports: [
    CommonModule,
    MaintenanceDashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FullCalendarModule
  ]
})
export class MaintenanceDashboardModule { }
