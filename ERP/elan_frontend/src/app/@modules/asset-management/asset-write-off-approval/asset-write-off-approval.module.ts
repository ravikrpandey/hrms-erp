import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetWriteOffApprovalRoutingModule } from './asset-write-off-approval-routing.module';
import { ActionComponent } from './action/action.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ApprovalDialogComponent } from './approval-dialog/approval-dialog.component';
import { MatSelectFilterModule } from 'mat-select-filter';


@NgModule({
  declarations: [
    ActionComponent,
    ApprovalDialogComponent
  ],
  imports: [
    CommonModule,
    AssetWriteOffApprovalRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectFilterModule,
  ]
})
export class AssetWriteOffApprovalModule { }
