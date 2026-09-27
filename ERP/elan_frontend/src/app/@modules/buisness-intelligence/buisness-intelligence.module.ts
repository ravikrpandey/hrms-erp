import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuisnessIntelligenceRoutingModule } from './buisness-intelligence-routing.module';
import { BuisnessIntelligenceComponent } from './buisness-intelligence.component';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { ExcelDialogComponent } from './forecast-revenue/excel-dialog/excel-dialog.component';
import { MatSelectFilterModule } from 'mat-select-filter';

@NgModule({
  declarations: [
    BuisnessIntelligenceComponent,
    ExcelDialogComponent
  ],
  imports: [
    CommonModule,
    BuisnessIntelligenceRoutingModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    AgGridModule,
    HttpClientModule,
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
export class BuisnessIntelligenceModule { }
