import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectFilterModule } from 'mat-select-filter';
import { BonusDeductionRoutingModule } from './bonus-deduction-routing.module';
import { BonusDeductionListComponent } from './bonus-deduction-list/bonus-deduction-list.component';
import { BonusDeductionCreateComponent } from './bonus-deduction-create/bonus-deduction-create.component';
import { BonusDeductionActionComponent } from './bonus-deduction-action/bonus-deduction-action.component';
import { BonusDeductionStatusComponent } from './bonus-deduction-action/bonus-deduction-status/bonus-deduction-status.component';


@NgModule({
  declarations: [
    BonusDeductionListComponent,
    BonusDeductionCreateComponent,
    BonusDeductionActionComponent,
    BonusDeductionStatusComponent,
  ],
  imports: [
    CommonModule,
    BonusDeductionRoutingModule,
    MaterialModule,
    AgGridModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatSelectFilterModule,
    ReactiveFormsModule


  ]
})
export class BonusDeductionModule { }
