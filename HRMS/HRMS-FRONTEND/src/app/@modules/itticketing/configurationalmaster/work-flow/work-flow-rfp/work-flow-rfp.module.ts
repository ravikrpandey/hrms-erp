import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkFlowRfpRoutingModule } from './work-flow-rfp-routing.module';
import { AddWorkFlowRfpComponent } from './add-work-flow-rfp/add-work-flow-rfp.component';
import { ViewWorkFlowRfpComponent } from './view-work-flow-rfp/view-work-flow-rfp.component';
import { WorkFlowRfpActionComponent } from './work-flow-rfp-action/work-flow-rfp-action.component';
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
    AddWorkFlowRfpComponent,
    ViewWorkFlowRfpComponent,
    WorkFlowRfpActionComponent
  ],
  imports: [
    CommonModule,
    WorkFlowRfpRoutingModule,
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
export class WorkFlowRfpModule { }
