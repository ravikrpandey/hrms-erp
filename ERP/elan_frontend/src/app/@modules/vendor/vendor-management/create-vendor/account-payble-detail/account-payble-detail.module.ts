import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountPaybleDetailRoutingModule } from './account-payble-detail-routing.module';
import { AccountPayleComponent } from './account-payle/account-payle.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AgGridModule } from 'ag-grid-angular';
import { MatSelectFilterModule } from 'mat-select-filter';
import {MatCheckboxModule} from '@angular/material/checkbox';


@NgModule({
  declarations: [
    // AccountPayleComponent
  ],
  imports: [
    CommonModule,
    AccountPaybleDetailRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AgGridModule,
    MatSelectFilterModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatCheckboxModule,

  ]
})
export class AccountPaybleDetailModule { }
