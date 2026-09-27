import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WarehouseBifurcationRoutingModule } from './warehouse-bifurcation-routing.module';
import { WarehouseBifurcationComponent } from './warehouse-bifurcation.component';
import { WarehouseBifurcationActionComponent } from './warehouse-bifurcation-action/warehouse-bifurcation-action.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SetupWarehouseBifurcationComponent } from './setup-warehouse-bifurcation/setup-warehouse-bifurcation.component';
import { WarehouseDesignComponent } from './warehouse-design/warehouse-design.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatExpansionModule } from '@angular/material/expansion';


@NgModule({
  declarations: [
    WarehouseBifurcationComponent,
    WarehouseBifurcationActionComponent,
    SetupWarehouseBifurcationComponent,
    WarehouseDesignComponent
  ],
  imports: [
    CommonModule,
    WarehouseBifurcationRoutingModule,
    ShairedModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    MatExpansionModule,

  ]
})
export class WarehouseBifurcationModule { }
