import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreditLimitRoutingModule } from './credit-limit-routing.module';
import { CreditLimitComponent } from './credit-limit.component';
import { AgGridModule } from 'ag-grid-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { MatSelectFilterModule } from 'mat-select-filter';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    CreditLimitComponent
  ],
  imports: [
    CommonModule,
    CreditLimitRoutingModule,
    AgGridModule,
    ReactiveFormsModule,
    MaterialModule,
    MatSelectFilterModule,
    NgxMatSelectSearchModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule
  ]
})
export class CreditLimitModule { }
