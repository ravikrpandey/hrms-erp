import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PayrollCycleRoutingModule } from './payroll-cycle-routing.module';
import { PayrollCycleCreateComponent } from './payroll-cycle-create/payroll-cycle-create.component';
import { PayrollCycleListComponent } from './payroll-cycle-list/payroll-cycle-list.component';
import { PayrollCycleActionComponent } from './payroll-cycle-action/payroll-cycle-action.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';


@NgModule({
  declarations: [
    PayrollCycleCreateComponent,
    PayrollCycleListComponent,
    PayrollCycleActionComponent
    
  ],
  imports: [
    CommonModule,
    PayrollCycleRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PayrollCycleModule { }
