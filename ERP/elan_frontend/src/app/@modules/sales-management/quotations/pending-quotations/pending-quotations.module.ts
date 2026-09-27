import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PendingQuotationsRoutingModule } from './pending-quotations-routing.module';
import { PendingQuotationsComponent } from './pending-quotations.component';
import { AgGridModule } from 'ag-grid-angular';


@NgModule({
  declarations: [
    PendingQuotationsComponent
  ],
  imports: [
    CommonModule,
    PendingQuotationsRoutingModule,
    AgGridModule,

  ]
})
export class PendingQuotationsModule { }
