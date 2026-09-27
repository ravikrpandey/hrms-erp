import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EsiRoutingModule } from './esi-routing.module';
import { EsiCreateComponent } from './esi-create/esi-create.component';
import { EsiListComponent } from './esi-list/esi-list.component';
import { EsiActionComponent } from './esi-action/esi-action.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';


@NgModule({
  declarations: [
    EsiCreateComponent,
    EsiListComponent,
    EsiActionComponent
  ],
  imports: [
    CommonModule,
    EsiRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EsiModule { }
