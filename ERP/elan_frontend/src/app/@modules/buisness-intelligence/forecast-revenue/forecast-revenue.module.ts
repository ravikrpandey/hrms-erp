import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForecastRevenueRoutingModule } from './forecast-revenue-routing.module';
import { ForecastRevenueListComponent } from './forecast-revenue-list/forecast-revenue-list.component';
import { ForecastRevenueCreateComponent } from './forecast-revenue-create/forecast-revenue-create.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { ForecastRevenueActionComponent } from './forecast-revenue-action/forecast-revenue-action.component';
import { ForecastRevenueComponent } from './forecast-revenue.component';
import { MatSelectFilterModule } from 'mat-select-filter';


@NgModule({
  declarations: [
    ForecastRevenueComponent,
    ForecastRevenueListComponent,
    ForecastRevenueCreateComponent,
    ForecastRevenueActionComponent,
  ],
  imports: [
    CommonModule,
    ForecastRevenueRoutingModule,
    MaterialModule,
    AgGridModule,
    ReactiveFormsModule,
    MatSelectFilterModule
  ]
})
export class ForecastRevenueModule { }
