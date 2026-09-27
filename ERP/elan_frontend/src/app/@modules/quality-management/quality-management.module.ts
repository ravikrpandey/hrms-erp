import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QualityManagementRoutingModule } from './quality-management-routing.module';
import { QualityManagementComponent } from './quality-management.component';
import { QualityCheckComponent } from './quality-check/quality-check.component';
import { QualityControlComponent } from './quality-control/quality-control.component';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { QualityControlActionComponent } from './quality-control/quality-control-action/quality-control-action.component';
import { AgGridModule } from 'ag-grid-angular';
import { ActionComponent } from './quality-check/action/action.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { UpdateQuantityCheckComponent } from './quality-check/update-quantity-check/update-quantity-check.component';
import { ReactiveFormsModule } from '@angular/forms';
import { QuantityCheckChartComponent } from './quality-check/quantity-check-chart/quantity-check-chart.component';
import { AddSampleComponent } from './quality-control/quality-control-action/add-sample/add-sample.component';
import { PlantSampleListComponent } from './quality-control/quality-control-action/plant-sample-list/plant-sample-list.component';


@NgModule({
  declarations: [
    QualityManagementComponent,
    QualityCheckComponent,
    QualityControlComponent,
    QualityControlActionComponent,
    ActionComponent,
    QuantityCheckChartComponent,
    UpdateQuantityCheckComponent,
    AddSampleComponent,
    PlantSampleListComponent
  ],
  imports: [
    CommonModule,
    QualityManagementRoutingModule,
    ShairedModule,
    AgGridModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class QualityManagementModule { }
