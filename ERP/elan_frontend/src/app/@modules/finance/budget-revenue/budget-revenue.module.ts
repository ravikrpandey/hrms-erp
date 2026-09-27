import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BudgetRevenueComponent } from './budget-revenue.component';
import { BudgetRevenueActionComponent } from './budget-revenue-action/budget-revenue-action.component';
import { BudgetRevenueDialogComponent } from './budget-revenue-dialog/budget-revenue-dialog.component';
import { RegistrationRoutingModule } from 'src/app/registration/registration-routing.module';
import { BudgetRevenueRoutingModule } from './budget-revenue-routing.module';

@NgModule({
  declarations: [
    BudgetRevenueComponent,
    BudgetRevenueActionComponent,
    BudgetRevenueDialogComponent,
  ],
  imports: [
    CommonModule,
    BudgetRevenueRoutingModule,
    RegistrationRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class BudgetRevenueModule { }
