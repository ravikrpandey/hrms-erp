import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectFilterModule } from 'mat-select-filter';
import { leaveEncashmentRoutingModule } from './leave-encashment-routing.module';
import { LeaveEnCashmentList } from './leave-encashment-list/leave-encashment-list.component';
import { LeaveEnCashmentCreateComponent } from './leave-encashment-create/leave-encashment-create.component';
import { LeaveEnCashmentActionComponent } from './leave-encashment-action/leave-encashment-action.component';


@NgModule({
  declarations: [
    LeaveEnCashmentList,
    LeaveEnCashmentCreateComponent,
    LeaveEnCashmentActionComponent,
  ],
  imports: [
    CommonModule,
    leaveEncashmentRoutingModule,
    MaterialModule,
    AgGridModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatSelectFilterModule,
    ReactiveFormsModule


  ]
})
export class leaveEncashmentModule { }
