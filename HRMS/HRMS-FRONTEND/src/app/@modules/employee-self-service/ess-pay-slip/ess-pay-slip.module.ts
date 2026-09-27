import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EssPaySlipRoutingModule } from './ess-pay-slip-routing.module';
import { EssPaySlipComponent } from './ess-pay-slip/ess-pay-slip.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { MatSelectFilterModule } from 'mat-select-filter';
import { FormsModule } from '@angular/forms';
import { SearchFilterComponent } from 'src/app/@shared/components/search-filter/search-filter.component';

@NgModule({
  declarations: [
    EssPaySlipComponent
  ],
  imports: [
    CommonModule,
    EssPaySlipRoutingModule,
    AgGridModule,
    MaterialModule,
    MatSelectFilterModule,
    FormsModule,
    SearchFilterComponent
  ]
})
export class EssPaySlipModule { }
