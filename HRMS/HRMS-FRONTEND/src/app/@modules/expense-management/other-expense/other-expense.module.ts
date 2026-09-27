import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OtherExpenseRoutingModule } from './other-expense-routing.module';

import { ActionsComponent } from './actions/actions.component';
import { RemarkDilogueComponent } from './add-other-expense/remark-dilogue/remark-dilogue.component';
import { OtherExpenseWorkflowLevelComponent } from './other-expense-workflow-level/other-expense-workflow-level.component';
import { OtherExpenseListComponent } from './other-expense-list.component';
import { AddOtherExpenseComponent } from './add-other-expense/add-other-expense.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { AgGridModule } from 'ag-grid-angular';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { DirectExpenseDialogueComponent } from './add-other-expense/direct-expense-dialogue/direct-expense-dialogue.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { MatRadioModule } from '@angular/material/radio';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';




@NgModule({
  declarations: [
       ActionsComponent,
       RemarkDilogueComponent,
       OtherExpenseWorkflowLevelComponent,
       OtherExpenseListComponent,
       AddOtherExpenseComponent,
      
       DirectExpenseDialogueComponent
  ],
  imports: [
    CommonModule,
    OtherExpenseRoutingModule,
    FormsModule,
    MatTabsModule,
    AgGridModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,  // Add MatDatepickerModule here
    MatNativeDateModule,
    MatIconModule,  
    ReactiveFormsModule ,
    MaterialModule,
    MatRadioModule,
    ShairedModule
  ]
})
export class OtherExpenseModule { }
