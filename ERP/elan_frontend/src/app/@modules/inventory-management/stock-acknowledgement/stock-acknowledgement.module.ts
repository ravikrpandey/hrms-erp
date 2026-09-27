import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockAcknowledgementRoutingModule } from './stock-acknowledgement-routing.module';
import { StockAcknowledgementComponent } from './stock-acknowledgement.component';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [StockAcknowledgementComponent],
  imports: [
    CommonModule,
    StockAcknowledgementRoutingModule,
    RouterModule,
    ShairedModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class StockAcknowledgementModule {}
