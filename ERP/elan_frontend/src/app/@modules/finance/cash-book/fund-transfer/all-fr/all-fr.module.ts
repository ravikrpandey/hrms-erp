import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllFrRoutingModule } from './all-fr-routing.module';
import { AllFrComponent } from './all-fr.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AgGridModule } from 'ag-grid-angular';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MaterialModule } from 'src/app/@shared/material/material.module';


@NgModule({
  declarations: [
    AllFrComponent
  ],
  imports: [
    CommonModule,
    AllFrRoutingModule,
    AgGridModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MaterialModule,
    ReactiveFormsModule,
    MatSelectFilterModule,
    MatDialogModule,
  ]
})
export class AllFrModule { }
