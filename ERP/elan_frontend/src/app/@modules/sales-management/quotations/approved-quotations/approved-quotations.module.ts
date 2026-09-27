import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApprovedQuotationsRoutingModule } from './approved-quotations-routing.module';
import { AgGridModule } from 'ag-grid-angular';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ApprovedQuotationsRoutingModule,
    AgGridModule
  ]
})
export class ApprovedQuotationsModule { }
