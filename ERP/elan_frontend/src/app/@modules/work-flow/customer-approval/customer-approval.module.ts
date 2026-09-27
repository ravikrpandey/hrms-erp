import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerApprovalRoutingModule } from './customer-approval-routing.module';
import { CustomerApprovalComponent } from './customer-approval.component';
import { AgGridModule } from 'ag-grid-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { MatSelectFilterModule } from 'mat-select-filter';
import { CustomerApprovalCreateComponent } from './customer-approval-create/customer-approval-create.component';
import { CustomerApprovalActionComponent } from './customer-approval-action/customer-approval-action.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
  declarations: [
    CustomerApprovalComponent,
    CustomerApprovalCreateComponent,
    CustomerApprovalActionComponent
  ],
  imports: [
    CommonModule,
    CustomerApprovalRoutingModule,
    AgGridModule,
    ReactiveFormsModule,
    MaterialModule,
    MatSelectFilterModule,
    NgxMatSelectSearchModule
  ]
})
export class CustomerApprovalModule { }
