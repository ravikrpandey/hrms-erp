import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryDashboardRoutingModule } from './inventory-dashboard-routing.module';
import { InventoryDashboardComponent } from './inventory-dashboard.component';
import { NgChartsModule } from 'ng2-charts';
import { RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { ComplaintModule } from '../../employee-self-service/complaint/complaint.module';
import { TimesheetModule } from '../../employee-self-service/timesheet/timesheet.module';
 
@NgModule({
  declarations: [
    InventoryDashboardComponent
  ],
  imports: [
    CommonModule,
    InventoryDashboardRoutingModule,
     NgChartsModule,
     RouterOutlet,
     MaterialModule,
     AgGridModule,
     MatNativeDateModule,
     FormsModule,
     ReactiveFormsModule,
     MatDialogModule,
     MatCardModule,
     ComplaintModule,
     TimesheetModule,
     FormsModule,
     ShairedModule,
     MaterialModule,
     AgGridModule,
  ]
})
export class InventoryDashboardModule { }
