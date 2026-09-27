import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';

import { MatIconModule } from '@angular/material/icon';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MyExpenseRoleRoutingModule } from './my-expense-role-routing.module';
import { MyExpenseRoleComponent } from './my-expense-role/my-expense-role.component';


@NgModule({
  declarations: [
    MyExpenseRoleComponent
  ],
  imports: [
    CommonModule,
    MyExpenseRoleRoutingModule,
    AgGridModule,
    MaterialModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSlideToggleModule
  ]
})
export class MyExpenseRoleModule { }
