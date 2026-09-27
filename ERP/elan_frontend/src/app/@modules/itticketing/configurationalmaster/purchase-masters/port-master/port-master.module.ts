import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortMasterRoutingModule } from './port-master-routing.module';
import { PortMasterComponent } from './port-master.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { PortMasterActionComponent } from './port-master-action/port-master-action.component';
import { PortMasterFormComponent } from './port-master-form/port-master-form.component';


@NgModule({
  declarations: [
    PortMasterComponent,
    PortMasterActionComponent,
    PortMasterFormComponent
  ],
  imports: [
    CommonModule,
    PortMasterRoutingModule,
    RouterModule,
    ShairedModule,
    AgGridModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class PortMasterModule { }
