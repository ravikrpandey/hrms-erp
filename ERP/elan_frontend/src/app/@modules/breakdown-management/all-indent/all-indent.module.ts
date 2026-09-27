import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllIndentRoutingModule } from './all-indent-routing.module';
import { AllIndentComponent } from './all-indent/all-indent.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { IndentActionComponent } from './all-indent/indent-action/indent-action.component';


@NgModule({
  declarations: [
    AllIndentComponent,
    IndentActionComponent
  ],
  imports: [
    CommonModule,
    AllIndentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AgGridModule
  ]
})
export class AllIndentModule { }
