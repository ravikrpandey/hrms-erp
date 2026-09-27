import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ZoneTypeRoutingModule } from './zone-type-routing.module';

import { ZoneTypeComponent } from './zone-type.component';
import { CreateZoneTypeComponent } from './create-zone-type/create-zone-type.component';
import { ZoneTypedialogComponent } from './zone-typedialog/zone-typedialog.component';
import { ZoneTypestatusComponent } from './zone-typedialog/zone-typestatus/zone-typestatus.component';

import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/@shared/material/material.module';

import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [
    ZoneTypeComponent,
    CreateZoneTypeComponent,
    ZoneTypedialogComponent,
    ZoneTypestatusComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatDialogModule,
    MaterialModule,
    AgGridModule,
    ZoneTypeRoutingModule
  ]
})
export class ZoneTypeModule { }
