import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdsMasterRoutingModule } from './tds-master-routing.module';
import { TdsListComponent } from './tds-list/tds-list.component';
import { AddTdsComponent } from './add-tds/add-tds.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgGridModule } from 'ag-grid-angular';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { TdsActionComponent } from './tds-action/tds-action.component';
import { MapTdsAccountComponent } from './map-tds-account/map-tds-account.component';


@NgModule({
  declarations: [
    TdsListComponent,
    AddTdsComponent,
    TdsActionComponent,
    MapTdsAccountComponent
  ],
  imports: [
    CommonModule,
    TdsMasterRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    AgGridModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    MatTooltipModule,
    ReactiveFormsModule,
    ShairedModule,
    MatSelectFilterModule
  ]
})
export class TdsMasterModule { }
