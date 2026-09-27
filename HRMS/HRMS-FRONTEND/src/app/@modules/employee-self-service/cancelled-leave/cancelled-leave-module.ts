import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CancelledLeaveRoutingModule } from './cancelled-leave-routing-module';
import { CancelledLeave } from './cancelled-leave/cancelled-leave';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgGridModule } from 'ag-grid-angular';
import { MatSelectFilterModule } from 'mat-select-filter';
import { SearchFilterComponent } from 'src/app/@shared/components/search-filter/search-filter.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';


@NgModule({
  declarations: [
    CancelledLeave
  ],
  imports: [
    CommonModule,
    CancelledLeaveRoutingModule,
    CommonModule,
            MaterialModule,
            AgGridModule,
            FormsModule,
            ReactiveFormsModule,
            MatFormFieldModule,
            MatInputModule,
            MatCardModule,
            MatDialogModule,
            MatExpansionModule,
            MatSidenavModule,
            MatListModule,
            MatSelectFilterModule,
            MatSelectModule,
            MatButtonModule,
            MatDatepickerModule,
            MatIconModule,
            MatTooltipModule,
            SearchFilterComponent
  ]
})
export class CancelledLeaveModule { }
