import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VariableEarningCreateComponent } from './variable-earning-create/variable-earning-create.component';
import { VariableEarningActionComponent } from './variable-earning-action/variable-earning-action.component';
import { VariableEarningToggleComponent } from './variable-earning-toggle/variable-earning-toggle.component';
import { VariableEarningListComponent } from './variable-earning-list/variable-earning-list.component';
import { VariableEarningRoutingModule } from './variable-earning-routing.module';
import { SearchFilterComponent } from 'src/app/@shared/components/search-filter/search-filter.component';

@NgModule({
  declarations: [
    VariableEarningListComponent,
    VariableEarningActionComponent,
    VariableEarningCreateComponent,
    VariableEarningToggleComponent
  ],
  imports: [
    CommonModule,
    VariableEarningRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SearchFilterComponent
  ]
})
export class VariableEarningModule { }
