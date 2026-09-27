import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaxCalculationMasterRoutingModule } from './tax-calculation-master-routing-module';
import { TaxCalculationMaster } from './tax-calculation-master/tax-calculation-master';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    TaxCalculationMaster
  ],
  imports: [
    CommonModule,
    TaxCalculationMasterRoutingModule,
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ]
})
export class TaxCalculationMasterModule { }
