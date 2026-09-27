import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardMainRoutingModule } from './dashboard-main-routing.module';
import { DashboardMainComponent } from './dashboard-main.component';
import { SuperDashboardComponent } from './super-dashboard/super-dashboard.component';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    DashboardMainComponent,
    SuperDashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardMainRoutingModule,ShairedModule,
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
   
  ]
})
export class DashboardMainModule { }
