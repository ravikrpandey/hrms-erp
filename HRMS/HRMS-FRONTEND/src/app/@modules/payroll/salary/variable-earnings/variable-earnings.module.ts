import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {VariableEarningsRoutingModule} from './variable-earnings-routing.module'
import { VariableEarningsCreateComponent } from './variable-earnings-create/variable-earnings-create.component';
import { VariableEarningsListComponent } from './variable-earnings-list/variable-earnings-list.component';
import { VariableEarningsActionComponent } from './variable-earnings-action/variable-earnings-action.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';


@NgModule({
  declarations: [
    VariableEarningsCreateComponent,
    VariableEarningsListComponent,
    VariableEarningsActionComponent
  ],
  imports: [
    CommonModule,
    VariableEarningsRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EarningsModule { }
