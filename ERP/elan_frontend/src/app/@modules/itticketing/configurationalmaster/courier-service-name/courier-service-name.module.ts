import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourierServiceNameRoutingModule } from './courier-service-name-routing.module';
import { CourierServiceNameComponent } from './courier-service-name.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { CourierDailogComponent } from './courier-dailog/courier-dailog.component';
import { CourierActionComponent } from './courier-action/courier-action.component';
import { CourierServiceStatusComponent } from './courier-action/courier-service-status/courier-service-status.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectFilterModule } from 'mat-select-filter';

@NgModule({
  declarations: [
    CourierServiceNameComponent,
    CourierDailogComponent,
    CourierActionComponent,
    CourierServiceStatusComponent
  ],
  imports: [
    CommonModule,
    CourierServiceNameRoutingModule,
    AgGridModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatExpansionModule,
    MatSidenavModule,
    MatListModule,
    MatSelectFilterModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
    MatTooltipModule
  ]
})
export class CourierServiceNameModule { }
