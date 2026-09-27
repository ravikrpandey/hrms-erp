import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkFlowPrpoRoutingModule } from './work-flow-prpo-routing.module';
import { WorkFlowPrpoActionComponent } from './work-flow-prpo-action/work-flow-prpo-action.component';
import { AddWorkFlowPrpoComponent } from './add-work-flow-prpo/add-work-flow-prpo.component';
import { ViewWorkFlowPrpoComponent } from './view-work-flow-prpo/view-work-flow-prpo.component';
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
import { AgGridModule } from 'ag-grid-angular';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MaterialModule } from 'src/app/@shared/material/material.module';

@NgModule({
  declarations: [
    WorkFlowPrpoActionComponent,
    AddWorkFlowPrpoComponent,
    ViewWorkFlowPrpoComponent
  ],
  imports: [
    CommonModule,
    WorkFlowPrpoRoutingModule,
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
  ]
})
export class WorkFlowPrpoModule { }
