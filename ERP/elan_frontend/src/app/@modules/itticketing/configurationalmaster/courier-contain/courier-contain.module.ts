import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourierContainRoutingModule } from './courier-contain-routing.module';
import { CourierContainComponent } from './courier-contain.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ContainActionComponent } from './contain-action/contain-action.component';
import { ContainDailogComponent } from './contain-dailog/contain-dailog.component';
import { CourierContainStatusComponent } from './contain-action/courier-contain-status/courier-contain-status.component';
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
    CourierContainComponent,
    ContainActionComponent,
    ContainDailogComponent,
    CourierContainStatusComponent
  ],
  imports: [
    CommonModule,
    CourierContainRoutingModule,
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
export class CourierContainModule { }
