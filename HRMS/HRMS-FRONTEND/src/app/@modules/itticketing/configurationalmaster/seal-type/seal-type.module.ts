import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { SealTypeComponent } from './seal-type.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SealTypeActionComponent } from './seal-type-action/seal-type-action.component';
import { SealTypeDialogComponent } from './seal-type-dialog/seal-type-dialog.component';
import { SealTypeStatusComponent } from './seal-type-status/seal-type-status.component';
import { SealTypeRoutingModule } from './seal-type-routing.module';


@NgModule({
  declarations: [
    SealTypeComponent,
    SealTypeActionComponent,
    SealTypeDialogComponent,
    SealTypeStatusComponent
  ],
  imports: [
    CommonModule,
    SealTypeRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SealTypeModule { }
