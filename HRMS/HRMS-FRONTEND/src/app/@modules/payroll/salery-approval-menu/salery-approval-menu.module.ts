import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SaleryApprovalMenuRoutingModule } from './salery-approval-menu-routing.module';
import { PendingApprovalSaleryComponent } from './pending-approval-salery/pending-approval-salery.component';
import { SaleryApproverMainComponent } from './salery-approver-main.component';
import { SaleryApproverComponent } from './salery-approver/salery-approver.component';
import { SaleryRejectComponent } from './salery-reject/salery-reject.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MatIconModule } from '@angular/material/icon';
import { SaleryApprovActionComponent } from './salery-approv-action/salery-approv-action.component';
import { SaleryPendingListComponent } from './salery-pending-list/salery-pending-list.component';
import { SaleryApproverProcessComponent } from './salery-approver-process/salery-approver-process.component';
import { ApprovedSaleryProcessListComponent } from './approved-salery-process-list/approved-salery-process-list.component';
import { RejectEmployessComponent } from './reject-employess/reject-employess.component';
import { SearchFilterComponent } from 'src/app/@shared/components/search-filter/search-filter.component';

@NgModule({
  declarations: [
    PendingApprovalSaleryComponent,
    SaleryApproverMainComponent,
    SaleryApproverComponent,
    SaleryRejectComponent,
    SaleryApprovActionComponent,
    SaleryPendingListComponent,
    SaleryApproverProcessComponent,
    ApprovedSaleryProcessListComponent,
    RejectEmployessComponent
  ],
  imports: [
    CommonModule,
    SaleryApprovalMenuRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    MatSelectFilterModule,
    MatIconModule,
    ReactiveFormsModule,
    SearchFilterComponent

  ]
})
export class SaleryApprovalMenuModule { }
