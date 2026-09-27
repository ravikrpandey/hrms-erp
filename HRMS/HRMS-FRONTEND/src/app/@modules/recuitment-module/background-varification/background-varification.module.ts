import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackgroundVarificationRoutingModule } from './background-varification-routing.module';
import { VarificationListComponent } from './varification-list/varification-list.component';
import { BvgListComponent } from './bvg-list/bvg-list.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PdfBgComponent } from '../candidate-profile/pdf-download/pdf-bg.component';
import { ActionComponent } from './varification-list/action/action.component';
import { MatSelectFilterModule } from 'mat-select-filter';

@NgModule({
  declarations: [
    VarificationListComponent,
    BvgListComponent,
    PdfBgComponent,
    ActionComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    BackgroundVarificationRoutingModule,
    AgGridModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSelectFilterModule
  ]
})
export class BackgroundVarificationModule { }
