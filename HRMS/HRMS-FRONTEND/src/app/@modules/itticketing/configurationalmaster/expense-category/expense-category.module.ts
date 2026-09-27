import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';

import { ExpenseCategoryRoutingModule } from './expense-category-routing.module';
import { ExpenseCategoryComponent } from './expense-category.component';
import { ExpenseCategoryActionComponent } from './expense-category-action/expense-category-action.component';
import { ExpenseCategoryDialogComponent } from './expense-category-dialog/expense-category-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ExpenseCategoryStatusComponent } from './expense-category-action/expense-category-status/expense-category-status.component';

@NgModule({
  declarations: [
    ExpenseCategoryComponent,
    ExpenseCategoryActionComponent,
    ExpenseCategoryDialogComponent,
    ExpenseCategoryStatusComponent
  ],
  imports: [
    CommonModule,
    ExpenseCategoryRoutingModule,
    AgGridModule,
    MaterialModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSlideToggleModule
  ]
})
export class ExpenseCategoryModule { }
