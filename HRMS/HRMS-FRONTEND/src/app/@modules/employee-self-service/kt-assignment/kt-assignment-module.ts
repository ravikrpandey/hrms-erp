import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KtAssignmentRoutingModule } from './kt-assignment-routing-module';
import { KtAssignmentList } from './kt-assignment-list/kt-assignment-list';
import { KtAssignmentCreate } from './kt-assignment-create/kt-assignment-create';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectFilterModule } from 'mat-select-filter';
import { KtAssignmentAction } from './kt-assignment-action/kt-assignment-action';


@NgModule({
  declarations: [
    KtAssignmentList,
    KtAssignmentCreate,
    KtAssignmentAction
  ],
  imports: [
    CommonModule,
    KtAssignmentRoutingModule,
    MaterialModule,
    AgGridModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatSelectFilterModule,
    ReactiveFormsModule,
  ]
})
export class KtAssignmentModule { }
