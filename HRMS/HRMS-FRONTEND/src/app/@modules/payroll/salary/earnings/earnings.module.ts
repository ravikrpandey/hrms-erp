import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EarningsRoutingModule } from './earnings-routing.module';
import { EarningsCreateComponent } from './earnings-create/earnings-create.component';
import { EarningsListComponent } from './earnings-list/earnings-list.component';
import { EarningsActionComponent } from './earnings-action/earnings-action.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';


@NgModule({
  declarations: [
    EarningsCreateComponent,
    EarningsListComponent,
    EarningsActionComponent
  ],
  imports: [
    CommonModule,
    EarningsRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EarningsModule { }
