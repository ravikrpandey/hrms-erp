import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PmsDashboardRoutingModule } from './pms-dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { HrmsModule } from '../../hrms/hrms.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectFilterModule } from 'mat-select-filter';
import { IgxDoughnutChartModule, IgxRingSeriesModule, IgxLegendModule, IgxItemLegendModule } from "igniteui-angular-charts";
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { NgChartsModule } from 'ng2-charts';  

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    PmsDashboardRoutingModule,
    MaterialModule,
    HrmsModule,
    AgGridModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatCardModule,
    MatDialogModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    MatTooltipModule,
    ReactiveFormsModule,
    ShairedModule,
    MatSelectFilterModule,
    IgxDoughnutChartModule,
    IgxRingSeriesModule,
    IgxLegendModule,
    IgxItemLegendModule,
    CanvasJSAngularChartsModule,
    NgChartsModule
  ],
})
export class PmsDashboardModule {}
