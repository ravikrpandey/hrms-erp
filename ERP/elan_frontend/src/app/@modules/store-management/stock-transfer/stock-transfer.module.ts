import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockTransferRoutingModule } from './stock-transfer-routing.module';
import { StockTransferComponent } from './stock-transfer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterOutlet } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { ComplaintModule } from '../../employee-self-service/complaint/complaint.module';
import { TimesheetModule } from '../../employee-self-service/timesheet/timesheet.module';
import { StockActionComponent } from './stock-action/stock-action.component';
import { MatSelectFilterModule } from 'mat-select-filter';
import { CreateStockTransferComponent } from './create-stock-transfer/create-stock-transfer.component';


@NgModule({
  declarations: [
    StockTransferComponent,
    CreateStockTransferComponent,
    StockActionComponent
  ],
  imports: [
    CommonModule,
    StockTransferRoutingModule,
    RouterOutlet,
    MaterialModule,
    AgGridModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCardModule,
    ComplaintModule,
    TimesheetModule,
    FormsModule,
    ShairedModule,
    MaterialModule,
    AgGridModule,
    MatSelectFilterModule
  ]
})
export class StockTransferModule { }
