import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ExpensesRoutingModule } from './expenses-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { ExpenseListComponent } from './components/expense-list/expense-list.component';
import { ExpenseDialogComponent } from './components/expense-dialog/expense-dialog.component';
import { ExpenseDetailDialogComponent } from './components/expense-detail-dialog/expense-detail-dialog.component';
import { ExpenseRejectDialogComponent } from './components/expense-reject-dialog/expense-reject-dialog.component';
import { ExpenseActionCellComponent } from './components/expense-action-cell/expense-action-cell.component';

@NgModule({
  declarations: [
    ExpenseListComponent,
    ExpenseDialogComponent,
    ExpenseDetailDialogComponent,
    ExpenseRejectDialogComponent,
    ExpenseActionCellComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AgGridModule,
    ExpensesRoutingModule,
  ],
})
export class ExpensesModule {}

