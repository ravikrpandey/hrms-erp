import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdvancePaymentRoutingModule } from './advance-payment-routing-module';
import { AdvancePaymentList } from './advance-payment-list/advance-payment-list';
import { AdvancePaymentCreate } from './advance-payment-create/advance-payment-create';
import { AdvancePaymentAction } from './advance-payment-action/advance-payment-action';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectFilterModule } from 'mat-select-filter';

@NgModule({
  declarations: [
    AdvancePaymentList,
    AdvancePaymentCreate,
    AdvancePaymentAction
  ],
  imports: [
    CommonModule,
    AdvancePaymentRoutingModule,
    MaterialModule,
    AgGridModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatSelectFilterModule,
    ReactiveFormsModule
  ]
})
export class AdvancePaymentModule { }
