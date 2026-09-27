import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GateInwardOutwardRoutingModule } from './gate-inward-outward-routing.module';
import { GateInwardOutwardComponent } from './gate-inward-outward.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { ReactiveFormsModule } from '@angular/forms';
import { GateActionButtonComponent } from './gate-action-button/gate-action-button.component';
import { AddDriverComponent } from './add-driver/add-driver.component';


@NgModule({
  declarations: [
    GateInwardOutwardComponent,
    GateActionButtonComponent,
    AddDriverComponent
  ],
  imports: [
    CommonModule,
    GateInwardOutwardRoutingModule,
    ShairedModule,
    MaterialModule,
    AgGridModule,
    ReactiveFormsModule,
  ]
})
export class GateInwardOutwardModule { }
