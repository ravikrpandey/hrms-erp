import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchemeMasterRoutingModule } from './scheme-master-routing.module';
import { SchemeMasterListComponent } from './scheme-master-list/scheme-master-list.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { SchemeMasterComponent } from './scheme-master.component';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SchemeActionComponent } from './scheme-action/scheme-action.component';
import { SchemeStatusComponent } from './scheme-status/scheme-status.component';
// import { SchemeCreateNewComponent } from './scheme-status/scheme-status.component';


@NgModule({
  declarations: [
    SchemeMasterListComponent,
    SchemeMasterComponent,
    SchemeActionComponent,
    SchemeStatusComponent
  ],
  imports: [
    CommonModule,
    SchemeMasterRoutingModule,
    AgGridModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule

    
  ]
})
export class SchemeMasterModule { }
