import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClosedRfpRoutingModule } from './closed-rfp-routing.module';
import { ClosedRfpComponent } from './closed-rfp.component';
import { AgGridModule } from 'ag-grid-angular';


@NgModule({
  declarations: [
    ClosedRfpComponent
  ],
  imports: [
    CommonModule,
    ClosedRfpRoutingModule,
    AgGridModule
  ]
})
export class ClosedRfpModule { }
