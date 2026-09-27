import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectFilterModule } from 'mat-select-filter';

import { LocationMasterRoutingModule } from './location-master-routing.module';
import { LocationMasterComponent } from './location-master.component';
import { LocationMasterCreateComponent } from './location-master-create/location-master-create.component';
import { LocationMasterActionComponent } from './location-master-action/location-master-action.component';


@NgModule({
  declarations: [
    LocationMasterComponent,
    LocationMasterCreateComponent,
    LocationMasterActionComponent
  ],
  imports: [
    CommonModule,
    LocationMasterRoutingModule,
    MaterialModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectFilterModule
  ]
})
export class LocationMasterModule { }
