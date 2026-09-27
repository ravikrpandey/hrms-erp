import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RejectedQuotationsRoutingModule } from './rejected-quotations-routing.module';
import { AgGridModule } from 'ag-grid-angular';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RejectedQuotationsRoutingModule,
    AgGridModule
  ]
})
export class RejectedQuotationsModule { }

