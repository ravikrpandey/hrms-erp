import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceCenterRoutingModule } from './service-center-routing.module';
import { ServiceCenterCreateComponent } from './service-center-create/service-center-create.component';
import { ServiceCenterActionComponent } from './service-center-action/service-center-action.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgGridModule } from 'ag-grid-angular';
import { MatSelectFilterModule } from 'mat-select-filter';
import { ServicecenterStatusComponent } from './servicecenter-status/servicecenter-status.component';
import { ServiceCenterComponent } from './service-center.component';

@NgModule({
  declarations: [
    ServiceCenterCreateComponent,
    ServiceCenterActionComponent,
    ServicecenterStatusComponent,
    ServiceCenterComponent
  ],
  imports: [
    CommonModule,
    ServiceCenterRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatSidenavModule,
    MatTooltipModule,
    AgGridModule,
    MatSelectFilterModule
  ]
})
export class ServiceCenterModule { }
