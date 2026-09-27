import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinancialTransactionsIntegrationsRoutingModule } from './financial-transactions-integrations-routing.module';
import { AddFinancialTransactionsIntegrationsComponent } from './add-financial-transactions-integrations/add-financial-transactions-integrations.component';
import { FinancialTransactionListComponent } from './financial-transaction-list.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectFilterModule } from 'mat-select-filter';


@NgModule({
  declarations: [
    AddFinancialTransactionsIntegrationsComponent,
    FinancialTransactionListComponent
  ],
  imports: [
    CommonModule,
    FinancialTransactionsIntegrationsRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectFilterModule
  ]
})
export class FinancialTransactionsIntegrationsModule { }
