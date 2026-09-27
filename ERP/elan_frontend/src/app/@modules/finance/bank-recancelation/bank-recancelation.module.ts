import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BankRecancelationRoutingModule } from './bank-recancelation-routing.module';
import { BankRecancelationComponent } from './bank-recancelation.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { MatDialogModule } from '@angular/material/dialog';
import { AgGridModule } from 'ag-grid-angular';
import { MatSelectFilterModule } from 'mat-select-filter';

@NgModule({
  declarations: [
    BankRecancelationComponent
  ],
  imports: [
    CommonModule,
    BankRecancelationRoutingModule,
    AgGridModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MaterialModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSelectFilterModule
  ]
})
export class BankRecancelationModule { }
