import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReceiveStockTransferRoutingModule } from './receive-stock-transfer-routing.module';
import { ReceiveStockTransferComponent } from './receive-stock-transfer.component';
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
import { CreateReceiveStockTransferComponent } from './create-receive-stock-transfer/create-receive-stock-transfer.component';
import { RecieveTransferActionComponent } from './recieve-transfer-action/recieve-transfer-action.component';


@NgModule({
  declarations: [
    ReceiveStockTransferComponent,
    CreateReceiveStockTransferComponent,
    RecieveTransferActionComponent
  ],
  imports: [
    CommonModule,
    ReceiveStockTransferRoutingModule,
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
  ]
})
export class ReceiveStockTransferModule { }
