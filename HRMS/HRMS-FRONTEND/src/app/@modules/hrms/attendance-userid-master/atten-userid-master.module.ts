import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttUseridMasterRoutingModule } from './atten-userid-master-routing.module';
import { AttUseridComponent } from './atten-userid-master.component';
import { AttUseridMasterActionComponent } from './atten-userid-master-action/attan_userid-action.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { AttUseridMasterDialogComponent } from './atten-userid-master-dialog/attuserid-master-dialog.component';
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
import { SearchFilterComponent } from 'src/app/@shared/components/search-filter/search-filter.component';
@NgModule({
  declarations: [
    AttUseridComponent,
    AttUseridMasterActionComponent,
    AttUseridMasterDialogComponent
  ],
  imports: [
    CommonModule,
    AttUseridMasterRoutingModule,
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
export class AttendanceUserIDMaster { }
