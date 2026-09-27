import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubtypeRoutingModule } from './subtype-routing.module';
import { AddSubtypeComponent } from './add-subtype/add-subtype.component';
import { SubtypeActionComponent } from './subtype-action/subtype-action.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
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
import { SubtypeComponent } from './subtype.component';
import { SubtypeStatusComponent } from './subtype-action/subtype-status/subtype-status.component';
import { ViewSubtypeComponent } from './view-subtype/view-subtype.component';

@NgModule({
  declarations: [
    AddSubtypeComponent,
    SubtypeActionComponent,
    SubtypeComponent,
    SubtypeStatusComponent,
    ViewSubtypeComponent
  ],
  imports: [
    CommonModule,
    SubtypeRoutingModule,
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
    MatTooltipModule
  ]
})
export class SubtypeModule { }
