import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { BudgetCategoryComponent } from './budget-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BudgetCategoryActionComponent } from './budget-category-action/budget-category-action.component';
import { BudgetCategoryDialogComponent } from './budget-category-dialog/budget-category-dialog.component';
import { BudgetCategoryStatusComponent } from './budget-category-status/budget-category-status.component';
import { BudgetCategoryRoutingModule } from './budget-category-routing.module';


@NgModule({
  declarations: [
    BudgetCategoryComponent,
    BudgetCategoryActionComponent,
    BudgetCategoryDialogComponent,
    BudgetCategoryStatusComponent
  ],
  imports: [
    CommonModule,
    BudgetCategoryRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class BudgetCategoryModule { }
