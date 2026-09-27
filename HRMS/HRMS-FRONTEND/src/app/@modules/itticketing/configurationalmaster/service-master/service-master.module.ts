import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceMasterRoutingModule } from './service-master-routing.module';
import { ServiceMasterListComponent } from './service-master-list/service-master-list.component';
import { ServiceMasterCreateComponent } from './service-master-create/service-master-create.component';
import { ServiceMasterActionComponent } from './service-master-action/service-master-action.component';
import { ServiceMasterStatusComponent } from './service-master-action/service-master-status/service-master-status.component';
import { ServiceMasterDialogComponent } from './service-master-dialog/service-master-dialog.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectFilterModule } from 'mat-select-filter';


@NgModule({
  declarations: [
    ServiceMasterListComponent,
    ServiceMasterCreateComponent,
    ServiceMasterActionComponent,
    ServiceMasterStatusComponent,
    ServiceMasterDialogComponent
  ],
  imports: [
    CommonModule,
    ServiceMasterRoutingModule,
    MaterialModule,
    AgGridModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatSelectFilterModule,
    ReactiveFormsModule


  ]
})
export class ServiceMasterModule { }
