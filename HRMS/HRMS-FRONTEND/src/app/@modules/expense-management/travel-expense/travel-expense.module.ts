import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { AgGridModule } from 'ag-grid-angular';
import { CKEditorModule } from 'ckeditor4-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { TravelExpenseRoutingModule } from './travel-expense-routing.module';
import { TravelExpenseListComponent } from './travel-expense-list.component';
import { AddTravelExpenseComponent } from './add-travel-expense/add-travel-expense.component';
import { IndirectExpenseDialogueComponent } from './add-travel-expense/indirect-expense-dialogue/indirect-expense-dialogue.component';
import { ActionsComponent } from './actions/actions.component';
import { RemarkDilogComponent } from './add-travel-expense/remark-dilog/remark-dilog.component';
import { TravelExpenseWorkflowLevelDialogComponent } from './travel-expense-workflow-level/travel-expense-workflow-level-dialog.component';
import { MatSelectFilterModule } from 'mat-select-filter';


@NgModule({
  declarations: [
    TravelExpenseListComponent,
    AddTravelExpenseComponent,
    IndirectExpenseDialogueComponent,
    ActionsComponent,
    RemarkDilogComponent,
    TravelExpenseWorkflowLevelDialogComponent
  ],
  imports: [
    CommonModule,
    TravelExpenseRoutingModule,
    MaterialModule,
    AgGridModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCardModule,
    FormsModule,
    ShairedModule,
    MaterialModule,
    AgGridModule,
    CKEditorModule,
    MatSelectFilterModule
  ]
})
export class TravelExpenseModule { }
