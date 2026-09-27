import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PickListRoutingModule } from './pick-list-routing.module';
import { PickListComponent } from './pick-list.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ActionButtonComponent } from './action-button/action-button.component';


@NgModule({
  declarations: [
    PickListComponent,
    ActionButtonComponent
  ],
  imports: [
    CommonModule,
    PickListRoutingModule,
    ShairedModule,
    MaterialModule,
    AgGridModule,
    ReactiveFormsModule,
  ]
})
export class PickListModule { }
