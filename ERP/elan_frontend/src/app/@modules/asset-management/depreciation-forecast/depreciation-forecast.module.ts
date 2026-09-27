import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { DepreciationForecastComponent } from './depreciation-forecast.component';
import { DepreciationForecastListComponent } from './depreciation-forecast-list/depreciation-forecast-list.component';
import { DepreciationForecastActionComponent } from './depreciation-forecast-action/depreciation-forecast-action.component';
import { DepreciationForecastCreateComponent } from './depreciation-forecast-create/depreciation-forecast-create.component';
import { DepreciationForecastRoutingModule } from './depreciation-forecast-routing.module';
import { MatSelectFilterModule } from 'mat-select-filter';


@NgModule({
  declarations: [
    DepreciationForecastComponent,
    DepreciationForecastListComponent,
    DepreciationForecastActionComponent,
    DepreciationForecastCreateComponent
  ],
  imports: [
    CommonModule,
    DepreciationForecastRoutingModule,
    MaterialModule,
    AgGridModule,
    ReactiveFormsModule,
    MatSelectFilterModule
  ]
})
export class DepreciationForecastModule { }
