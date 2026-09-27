import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';

import { TypeOfNeedRoutingModule } from './type-of-need-routing.module';
import { TypeOfNeedComponent } from './type-of-need.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TypeOfNeedActionComponent } from './type-of-need-action/type-of-need-action.component';
import { TypeOfNeedDialogComponent } from './type-of-need-dialog/type-of-need-dialog.component';
import { TypeOfNeedStatusComponent } from './type-of-need-status/type-of-need-status.component';


@NgModule({
  declarations: [
    TypeOfNeedComponent,
    TypeOfNeedActionComponent,
    TypeOfNeedDialogComponent,
    TypeOfNeedStatusComponent
  ],
  imports: [
    CommonModule,
    TypeOfNeedRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TypeOfNeedModule { }
