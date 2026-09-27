import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdjustmentVoucherRoutingModule } from './adjustment-voucher-routing.module';
import { AdjustmentVoucherListComponent } from './adjustment-voucher-list/adjustment-voucher-list.component';
import { AdjustmentVoucherActionComponent } from './adjustment-voucher-action/adjustment-voucher-action.component';
import { AddAdjustmentVoucherComponent } from './add-adjustment-voucher/add-adjustment-voucher.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AgGridModule } from 'ag-grid-angular';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MaterialModule } from 'src/app/@shared/material/material.module';


@NgModule({
  declarations: [
    AdjustmentVoucherListComponent,
    AdjustmentVoucherActionComponent,
    AddAdjustmentVoucherComponent
  ],
  imports: [
    CommonModule,
    AdjustmentVoucherRoutingModule,
    CommonModule,
    AgGridModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MaterialModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSelectFilterModule
  ]
})
export class AdjustmentVoucherModule { }
