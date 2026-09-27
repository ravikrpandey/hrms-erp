import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { TypeOfExpenseComponent } from './type-of-expense.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TypeOfExpenseActionComponent } from './type-of-expense-action/type-of-expense-action.component';
import { TypeOfExpenseStatusComponent } from './type-of-expense-status/type-of-expense-status.component';
import { TypeOfExpenseDialogComponent } from './type-of-expense-dialog/type-of-expense-dialog.component';
import { TypeOfExpenseRoutingModule } from './type-of-expense-routing.module';


@NgModule({
  declarations: [
    TypeOfExpenseComponent,
    TypeOfExpenseActionComponent,
    TypeOfExpenseDialogComponent,
    TypeOfExpenseStatusComponent
  ],
  imports: [
    CommonModule,
    TypeOfExpenseRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TypeOfExpenseModule { }
