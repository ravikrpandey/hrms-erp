import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReimbursementsRoutingModule } from './reimbursements-routing.module';
import { ReimbursementCreateComponent } from './reimbursement-create/reimbursement-create.component';
import { ReimbursementListComponent } from './reimbursement-list/reimbursement-list.component';
import { ReimbursementActionComponent } from './reimbursement-action/reimbursement-action.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';


@NgModule({
  declarations: [
    ReimbursementCreateComponent,
    ReimbursementListComponent,
    ReimbursementActionComponent
  ],
  imports: [
    CommonModule,
    ReimbursementsRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ReimbursementsModule { }
