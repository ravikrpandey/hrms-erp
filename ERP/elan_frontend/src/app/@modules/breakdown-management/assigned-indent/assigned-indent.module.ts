import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssignedIndentRoutingModule } from './assigned-indent-routing.module';
import { AssignedIndentComponent } from './assigned-indent/assigned-indent.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AssignedActionComponent } from './assigned-indent/assigned-action/assigned-action.component';


@NgModule({
  declarations: [
    AssignedIndentComponent,
    AssignedActionComponent
  ],
  imports: [
    CommonModule,
    AssignedIndentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule,
    MaterialModule
  ]
})
export class AssignedIndentModule { }
