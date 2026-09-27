import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkStationRoutingModule } from './work-station-routing.module';
import { WorkStationListComponent } from './work-station-list/work-station-list.component';
import { WorkStationCreateComponent } from './work-station-create/work-station-create.component';
import { WorkStationActionComponent } from './work-station-action/work-station-action.component';
import { WorkStationStausComponent } from './work-station-action/work-station-staus/work-station-staus.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AgGridModule } from 'ag-grid-angular';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectFilterModule } from 'mat-select-filter';
import { WorkStationViewComponent } from './work-station-view/work-station-view.component';

@NgModule({
  declarations: [
    WorkStationListComponent,
    WorkStationCreateComponent,
    WorkStationActionComponent,
    WorkStationStausComponent,
    WorkStationViewComponent,
  ],
  imports: [
    CommonModule,
    WorkStationRoutingModule,
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
  ],
})
export class WorkStationModule {}
