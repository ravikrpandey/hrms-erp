import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectFilterModule } from 'mat-select-filter';
import { AchiversRoutingModule } from './achivers-routing-module';
import { Achivers } from './achivers';

@NgModule({
  declarations: [
    Achivers
  ],
  imports: [
    CommonModule,
    AchiversRoutingModule,
    MatTabsModule,
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
            MatTooltipModule
  ]
})
export class AchiversModule { }
