import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReimbursementExpenseRoutingModule } from './reimbursement-expense-routing.module';
import { ReimbursementExpenseComponent } from './reimbursement-expense.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { CreateReimburesementExpenseComponent } from './create-reimburesement-expense/create-reimburesement-expense.component';
import { ReimbursementExpenseActionComponent } from './reimbursement-expense-action/reimbursement-expense-action.component';
import { ReimbursementApprovalDialogComponent } from './reimbursement-approval-dialog/reimbursement-approval-dialog.component';


@NgModule({
  declarations: [
    ReimbursementExpenseComponent,
    CreateReimburesementExpenseComponent,
    ReimbursementExpenseActionComponent,
    ReimbursementApprovalDialogComponent
  ],
  imports: [
    CommonModule,
    ReimbursementExpenseRoutingModule,
    FormsModule,
    AgGridModule,
    MatDatepickerModule,  // Add MatDatepickerModule here
    MatNativeDateModule,
    ReactiveFormsModule,
    MaterialModule,
    ShairedModule
  ]
})
export class ReimbursementExpenseModule { }
