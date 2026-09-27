import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectFilterModule } from 'mat-select-filter';

import { BrandingMasterRoutingModule } from './branding-master-routing.module';
import { BrandingMasterComponent } from './branding-master.component';
import { BrandingMasterCreateComponent } from './branding-master-create/branding-master-create.component';
import { BrandingMasterActionComponent } from './branding-master-action/branding-master-action.component';


@NgModule({
  declarations: [
    BrandingMasterComponent,
    BrandingMasterCreateComponent,
    BrandingMasterActionComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectFilterModule,
    BrandingMasterRoutingModule
  ]
})
export class BrandingMasterModule { }
