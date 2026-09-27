import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShiftMasterRoutingModule } from './shift-master-routing.module';
import { ShiftMasterCreateComponent } from './shift-master-create/shift-master-create.component';
import { ShiftMasterActionComponent } from './shift-master-action/shift-master-action.component';
import { ShiftMasterListComponent } from './shift-master-list/shift-master-list.component';
import { ShiftMasterStatusComponent } from './shift-master-action/shift-master-status/shift-master-status.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AgGridModule } from 'ag-grid-angular';
import { MatSelectModule} from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatSelectFilterModule } from 'mat-select-filter';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';

@NgModule({
  declarations: [
    ShiftMasterCreateComponent,
    ShiftMasterActionComponent,
    ShiftMasterListComponent,
    ShiftMasterStatusComponent
  ],
  imports: [
    CommonModule,
    ShiftMasterRoutingModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatExpansionModule,
    MatSidenavModule,
    MatListModule,
    MatSelectFilterModule,
    AgGridModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
    MatTooltipModule,
    HttpClientModule,
    NgxMatTimepickerModule
  ]
})
export class ShiftMasterModule { }
