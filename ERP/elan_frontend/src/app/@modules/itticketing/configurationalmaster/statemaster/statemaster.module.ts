import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatemasterRoutingModule } from './statemaster-routing.module';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ActionsComponent } from './actions/actions.component';
import { StatemasterdialogComponent } from './statemasterdialog/statemasterdialog.component';
import { StateMasterStatusComponent } from './actions/state-master-status/state-master-status.component';
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

@NgModule({
  declarations: [ActionsComponent, StatemasterdialogComponent, StateMasterStatusComponent],
  imports: [
    CommonModule,
    StatemasterRoutingModule,
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
export class StatemasterModule { }
