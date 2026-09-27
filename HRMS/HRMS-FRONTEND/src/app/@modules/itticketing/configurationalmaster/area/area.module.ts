import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { AreaStatusActionComponent } from './area-action/area-status-action/area-status-action.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AreaActionComponent } from './area-action/area-action.component';
import { AreaDilogComponent } from './area-dilog/area-dilog.component';
import { AreaComponent } from './area.component';
import { AreaRoutingModule } from './area-routing.module';

@NgModule({
  declarations: [
    AreaComponent,
    AreaActionComponent,
    AreaDilogComponent,
    AreaStatusActionComponent
  ],
  imports: [
    CommonModule,
    AreaRoutingModule,
    MaterialModule,
    AgGridModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatExpansionModule,
    MatSidenavModule,
    MatListModule,
    MatSelectFilterModule,
    MatSelectModule,
    MatDatepickerModule,
    MatIconModule,
    MatTooltipModule,

  ]
})
export class AreaModule { }
