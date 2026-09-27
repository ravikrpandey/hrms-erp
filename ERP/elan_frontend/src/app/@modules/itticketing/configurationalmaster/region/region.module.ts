import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegionComponent } from './region.component';
import { RegionActionComponent } from './region-action/region-action.component';
import { RegionDialogComponent } from './region-dialog/region-dialog.component';
import { RegionStatusComponent } from './region-status/region-status.component';
import { RegistrationRoutingModule } from 'src/app/registration/registration-routing.module';
import { RegionRoutingModule } from './region-routing.module';


@NgModule({
  declarations: [
    RegionComponent,
    RegionActionComponent,
    RegionDialogComponent,
    RegionStatusComponent
  ],
  imports: [
    CommonModule,
    RegionRoutingModule,
    RegistrationRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class RegionModule { }
