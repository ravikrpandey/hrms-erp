import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AmcDiscriptionRoutingModule } from './amc-discription-routing.module';
import { AmcDiscriptionComponent } from './amc-discription.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AmcDailogComponent } from './amc-dailog/amc-dailog.component';
import { LaactionAmcDesComponent } from './laaction-amc-des/laaction-amc-des.component';
import { AmcDiscriptionStatusComponent } from './laaction-amc-des/amc-discription-status/amc-discription-status.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectFilterModule } from 'mat-select-filter';

@NgModule({
  declarations: [
    AmcDiscriptionComponent,
    AmcDailogComponent,
    LaactionAmcDesComponent,
    AmcDiscriptionStatusComponent
  ],
  imports: [
    CommonModule,
    AmcDiscriptionRoutingModule,
    AgGridModule,
    MaterialModule,
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
export class AmcDiscriptionModule { }
