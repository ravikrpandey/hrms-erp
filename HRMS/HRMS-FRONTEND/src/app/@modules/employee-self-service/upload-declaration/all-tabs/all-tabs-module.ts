import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllTabsRoutingModule } from './all-tabs-routing-module';
import { AllTabs } from './all-tabs/all-tabs';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExemptionsSection } from './exemptions-section/exemptions-section';
import { DeductionChargeCreate } from './deduction-charge-create/deduction-charge-create';
import { ItStatement } from './it-statement/it-statement';
import { OtherSection } from './other-section/other-section';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { Submission } from './submission/submission';


@NgModule({
  declarations: [
    AllTabs,
    DeductionChargeCreate,
    ExemptionsSection,
    ItStatement,
    OtherSection,
    Submission

  ],
  imports: [
    CommonModule,
    AllTabsRoutingModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule
  ]
})
export class AllTabsModule { }
