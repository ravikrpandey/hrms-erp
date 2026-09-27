import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HrmsDashboardRoutingModule } from './hrms-dashboard-routing.module';
import { HrmsDashboardComponent } from './hrms-dashboard/hrms-dashboard.component';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { MatSelectFilterModule } from 'mat-select-filter';
import { IframeDashboard } from './iframe-dashboard/iframe-dashboard';

@NgModule({
  declarations: [
    HrmsDashboardComponent,
    IframeDashboard
  ],
  imports: [
    CommonModule,
    HrmsDashboardRoutingModule,
    ShairedModule,
    AgGridModule,
    CommonModule,
    MaterialModule,
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatSelectFilterModule,
  ]
})
export class HrmsDashboardModule { }
