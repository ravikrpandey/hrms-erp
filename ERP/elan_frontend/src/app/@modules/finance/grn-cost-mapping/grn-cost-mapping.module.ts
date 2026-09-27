import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrnCostMappingRoutingModule } from './grn-cost-mapping-routing.module';
import { GrnCostMappingListComponent } from './grn-cost-mapping-list/grn-cost-mapping-list.component';

import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule, } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { GrnCostMappingActionComponent } from './grn-cost-mapping-action/grn-cost-mapping-action.component';

@NgModule({
  declarations: [
    GrnCostMappingListComponent,
    GrnCostMappingActionComponent
  ],
  imports: [
    CommonModule,
    GrnCostMappingRoutingModule,
    RouterModule,
    ShairedModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class GrnCostMappingModule { }
