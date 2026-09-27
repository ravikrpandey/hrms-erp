import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BreakdownIndentRoutingModule } from './breakdown-indent-routing.module';
import { BreakdownIndentComponent } from './breakdown-indent.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateBreakdownIndentComponent } from './create-breakdown-indent/create-breakdown-indent.component';


@NgModule({
  declarations: [
    BreakdownIndentComponent,
    CreateBreakdownIndentComponent
  ],
  imports: [
    CommonModule,
    BreakdownIndentRoutingModule,
    MaterialModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class BreakdownIndentModule { }
