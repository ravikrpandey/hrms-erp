import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FundTransferRoutingModule } from './fund-transfer-routing.module';

import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { MatDialogModule } from '@angular/material/dialog';
import { RequestForCashbookComponent } from './request-for-cashbook/request-for-cashbook.component';
import { MatSelectFilterModule } from 'mat-select-filter';
import { RejectedFrModule } from './rejected-fr/rejected-fr.module';
import { ToBeApprovedFrModule } from './to-be-approved-fr/to-be-approved-fr.module';
import { ApprovedFrModule } from './approved-fr/approved-fr.module';
import { AllFrModule } from './all-fr/all-fr.module';
import { FundTransferStatusComponent } from './fund-transfer-status/fund-transfer-status.component';
import { FundTransferActionComponent } from './fund-transfer-action/fund-transfer-action.component';
@NgModule({
  declarations: [
    RequestForCashbookComponent,
    FundTransferStatusComponent,
    FundTransferActionComponent,
  ],
  imports: [
    CommonModule,
    FundTransferRoutingModule,
    CommonModule,
    AgGridModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MaterialModule,
    ReactiveFormsModule,
    MatSelectFilterModule,
    MatDialogModule,
    RejectedFrModule,
    ToBeApprovedFrModule,
    ApprovedFrModule,
    AllFrModule
  ]
})
export class FundTransferModule { }
