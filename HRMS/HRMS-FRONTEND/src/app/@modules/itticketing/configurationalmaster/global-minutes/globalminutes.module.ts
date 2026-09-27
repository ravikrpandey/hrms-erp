import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectFilterModule } from 'mat-select-filter';
import { GlobalMinutesComponent } from './globalminutes.component';
import { GlobalMinutesRoutingModule } from './globalminutes-routing.module';
import { GlobalMinutesActionComponent } from './global-minutes-action/globalminutes-action.component';
import { GlobalMinutesDialogComponent } from './global-minutes-dialog/globalminutes-dialog.component';
import { GlobalMinutesStatusComponent } from './global-minutes-status/globalminutes-status.component';
import { SearchFilterComponent } from 'src/app/@shared/components/search-filter/search-filter.component';

@NgModule({
  declarations: [
    GlobalMinutesComponent,
    GlobalMinutesActionComponent,
    GlobalMinutesDialogComponent,
    GlobalMinutesStatusComponent
  ],
  imports: [
    CommonModule,
    GlobalMinutesRoutingModule,
    MaterialModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
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
export class GlobalMinutesModule { }
