import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PriceMasterRoutingModule } from './price-master-routing.module';
import { PriceMasterComponent } from './price-master.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PriceActionComponent } from './price-action/price-action.component';
import { PriceCreateComponent } from './price-create/price-create.component';
import { PriceStatusComponent } from './price-status/price-status.component';
import { MatSelectFilterModule } from 'mat-select-filter';


@NgModule({
  declarations: [
    PriceMasterComponent,
    PriceActionComponent,
    PriceCreateComponent,
    PriceStatusComponent
  ],
  imports: [
    CommonModule,
    PriceMasterRoutingModule,
    AgGridModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    MatSelectFilterModule
  ]
})
export class PriceMasterModule { }
