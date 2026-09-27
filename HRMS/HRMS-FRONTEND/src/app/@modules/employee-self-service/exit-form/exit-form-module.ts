import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExitFormRoutingModule } from './exit-form-routing-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExitFormCreate } from './exit-form-create/exit-form-create';
import { ExitFormList } from './exit-form-list/exit-form-list';
import { ExitFormApproval } from './exit-form-approval/exit-form-approval';
import { AgGridModule } from 'ag-grid-angular';
import { ExitFormActionsComponent } from './exit-form-actions/exit-form-actions.component';
import { ExitFormRemarksComponent } from './exit-form-remarks/exit-form-remarks.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ExitFormApproverList } from './exit-form-approver-list/exit-form-approver-list';
import { ExitFormApproverActionsComponent } from './exit-form-approver-actions/exit-form-approver-actions.component';


@NgModule({
  declarations: [
    ExitFormList,
    ExitFormCreate,
    ExitFormApproval,
    ExitFormActionsComponent,
    ExitFormRemarksComponent,
    ExitFormApproverList,
    ExitFormApproverActionsComponent
  ],
  imports: [
    CommonModule,
    ExitFormRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
  ]
})
export class ExitFormModule { }
