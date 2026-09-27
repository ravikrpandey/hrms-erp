import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HrDashboardRoutingModule } from './hr-dashboard-routing.module';
import { HrDashboardComponent } from './hr-dashboard-list/hr-dashboard-list.component';
import { BvgListComponent } from './bvg-list/bvg-list.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import {MatTableModule} from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { AppModule } from 'src/app/app.module';
import { HrDashboardPipePipe } from 'src/app/@shared/pipe/hr-dashboard-pipe.pipe';

@NgModule({
  declarations: [
    HrDashboardComponent,
    BvgListComponent,
    HrDashboardPipePipe
    
  ],
  imports: [
    CommonModule,
    MaterialModule,
    HrDashboardRoutingModule,
    AgGridModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    HttpClientModule,
    MatTableModule,
    FormsModule
  ]
})
export class HrDashboardListModule { }
