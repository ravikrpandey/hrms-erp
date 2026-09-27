import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsesMasterRoutingModule } from './uses-master-routing.module';
import { AddUsesComponent } from './add-uses/add-uses.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { UsesActionComponent } from './uses-action/uses-action.component';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectFilterModule } from 'mat-select-filter';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { UsesMasterComponent } from './uses-master.component';
import { UsesStatusComponent } from './uses-status/uses-status.component';


@NgModule({
  declarations: [
    AddUsesComponent,
    UsesActionComponent,
    UsesMasterComponent,
    UsesStatusComponent
  ],
  imports: [
    CommonModule,
    UsesMasterRoutingModule,
    AgGridModule,
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
export class UsesMasterModule { }
