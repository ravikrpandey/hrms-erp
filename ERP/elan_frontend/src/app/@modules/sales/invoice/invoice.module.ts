import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { InvoiceActionComponent } from './invoice-action/invoice-action.component';
import { InvoiceViewComponent } from './invoice-view/invoice-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    InvoiceListComponent,
    InvoiceActionComponent,
    InvoiceViewComponent
  ],
  imports: [
    CommonModule,
    InvoiceRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class InvoiceModule { }
