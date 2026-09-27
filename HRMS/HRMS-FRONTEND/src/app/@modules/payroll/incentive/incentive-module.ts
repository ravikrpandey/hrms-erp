import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncentiveRoutingModule } from './incentive-routing-module';
import { IncentiveList } from './incentive-list/incentive-list';
import { CreateIncentive } from './create-incentive/create-incentive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectFilterModule } from 'mat-select-filter';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgGridModule } from 'ag-grid-angular';
import { MatIconModule } from '@angular/material/icon';
import { SearchFilterComponent } from 'src/app/@shared/components/search-filter/search-filter.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { IncentiveAction } from './incentive-action/incentive-action';



@NgModule({
  declarations: [
    IncentiveList,
    CreateIncentive,
    IncentiveAction
  ],
  imports: [
    CommonModule,
    IncentiveRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSelectFilterModule,
    MaterialModule,
    MatIconModule,
    // HrmsModule,
    AgGridModule,
    HttpClientModule,
    FormsModule,
    MatCardModule,
    MatDialogModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    MatTooltipModule,
    MatIconModule,
    ShairedModule,
    SearchFilterComponent
  ]
})
export class IncentiveModule { }
