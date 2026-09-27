import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessUnitRoutingModule } from './business-unit-routing-module';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectFilterModule } from 'mat-select-filter';
import { BusinessUnit } from './business-unit';
import { BusinessUnitAction } from './business-unit-action/business-unit-action';
import { BusinessUnitDialog } from './business-unit-dialog/business-unit-dialog';
import { BusinessUnitStatus } from './business-unit-status/business-unit-status';


@NgModule({
  declarations: [
    BusinessUnit,
    BusinessUnitAction,
    BusinessUnitDialog,
    BusinessUnitStatus
  ],
  imports: [
    CommonModule,
    BusinessUnitRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule,
    MaterialModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatSidenavModule,
    MatTooltipModule,
    MatSelectFilterModule
  ]
})
export class BusinessUnitModule { }
