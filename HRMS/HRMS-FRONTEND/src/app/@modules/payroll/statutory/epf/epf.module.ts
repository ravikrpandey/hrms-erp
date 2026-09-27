import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EpfRoutingModule } from './epf-routing.module';
import { EpfListComponent } from './epf-list/epf-list.component';
import { EpfActionComponent } from './epf-action/epf-action.component';
import { EpfCreateComponent } from './epf-create/epf-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';


@NgModule({
  declarations: [
    EpfListComponent,
    EpfActionComponent,
    EpfCreateComponent
  ],
  imports: [
    CommonModule,
    EpfRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EpfModule { }
