import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesReturnRoutingModule } from './sales-return-routing.module';

import { CreateSalesReturnComponent } from './create-sales-return/create-sales-return.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SerialSelectionModalComponent } from './serial-selection-modal/serial-selection-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { SharedModule } from 'src/app/@shared/shared.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { SalesReturnComponent } from './sales-return.component';
import { CreateSoReturnComponent } from './create-so-return/create-so-return.component';
import { SalesReturnActionComponent } from './sales-return-action/sales-return-action.component';
import { ViewReturnComponent } from './view-return/view-return.component';


@NgModule({
  declarations: [    
    CreateSalesReturnComponent, SerialSelectionModalComponent,SalesReturnComponent, CreateSoReturnComponent, SalesReturnActionComponent, ViewReturnComponent
  ],
  imports: [
    CommonModule,
    SalesReturnRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MaterialModule,
    // SharedModule,
    AgGridModule
  ], providers: [
      { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
    ]
})
export class SalesReturnModule { }
