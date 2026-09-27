import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { LeaveCancellationRoutingModule } from './leave-cancellation-routing-module';
import { LeaveCancellationList } from './leave-cancellation-list/leave-cancellation-list';
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
import { MatSelectFilterModule } from 'mat-select-filter';
import { SearchFilterComponent } from 'src/app/@shared/components/search-filter/search-filter.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { LeaveCancellationAll } from './leave-cancellation-all/leave-cancellation-all';


@NgModule({
  declarations: [
    LeaveCancellationList,
    LeaveCancellationAll
  ],
  imports: [
    CommonModule,
    LeaveCancellationRoutingModule,
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
export class LeaveCancellationModule { }
