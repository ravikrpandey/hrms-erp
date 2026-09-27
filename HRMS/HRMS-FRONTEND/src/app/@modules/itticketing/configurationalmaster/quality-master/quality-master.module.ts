import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QualityMasterRoutingModule } from './quality-master-routing.module';
import { QualityListComponent } from './quality-list/quality-list.component';
import { QualityActionComponent } from './quality-action/quality-action.component';
import { QualityStatusComponent } from './quality-action/quality-status/quality-status.component';
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
import { QualityCreateComponent } from './quality-create/quality-create.component';

@NgModule({
  declarations: [
    QualityListComponent,
    QualityActionComponent,
    QualityStatusComponent,
    QualityCreateComponent
  ],
  imports: [
    CommonModule,
    QualityMasterRoutingModule,
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
export class QualityMasterModule { }
