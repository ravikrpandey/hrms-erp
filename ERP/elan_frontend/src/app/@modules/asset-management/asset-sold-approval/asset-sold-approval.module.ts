import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetSoldApprovalRoutingModule } from './asset-sold-approval-routing.module';
import { ActionComponent } from './action/action.component';
import { ApprovalDialogComponent } from './approval-dialog/approval-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MaterialModule } from 'src/app/@shared/material/material.module';


@NgModule({
  declarations: [
    ActionComponent,
    ApprovalDialogComponent
  ],
  imports: [
    CommonModule,
    AssetSoldApprovalRoutingModule,
      AgGridModule,
      MaterialModule,
      FormsModule,
      ReactiveFormsModule,
      MatSelectFilterModule,
  ]
})
export class AssetSoldApprovalModule { }
