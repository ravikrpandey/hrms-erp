import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaxSlabRoutingModule } from './tax-slab-routing.module';
import { TaxSlabListComponent } from './tax-slab-list/tax-slab-list.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaxSlabActionComponent } from './tax-slab-action/tax-slab-action.component';
import { TaxSlabCreateComponent } from './tax-slab-create/tax-slab-create.component';
import { TaxSlabToggleComponent } from './tax-slab-toggle/tax-slab-toggle.component';

@NgModule({
  declarations: [
    TaxSlabListComponent,
    TaxSlabActionComponent,
    TaxSlabCreateComponent,
    TaxSlabToggleComponent
  ],
  imports: [
    CommonModule,
    TaxSlabRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TaxSlabModule { }
