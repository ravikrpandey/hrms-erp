import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncotermMasterRoutingModule } from './incoterm-master-routing.module';
import { IncotermMasterComponent } from './incoterm-master.component';
import { IncotermMasterFormComponent } from './incoterm-master-form/incoterm-master-form.component';
import { IncotermMasterActionComponent } from './incoterm-master-action/incoterm-master-action.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';


@NgModule({
  declarations: [
    IncotermMasterComponent,
    IncotermMasterFormComponent,
    IncotermMasterActionComponent
  ],
  imports: [
    CommonModule,
    IncotermMasterRoutingModule,
    RouterModule,
    ShairedModule,
    AgGridModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class IncotermMasterModule { }
