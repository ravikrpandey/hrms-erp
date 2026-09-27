import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlantMasterRoutingModule } from './plant-master-routing.module';
import { PlantMasterCreateComponent } from './plant-master-create/plant-master-create.component';
import { PlantMasterListComponent } from './plant-master-list/plant-master-list.component';
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
import { PlantMasterActionComponent } from './plant-master-action/plant-master-action.component';
import { MatSelectFilterModule } from 'mat-select-filter';
import { ActionStatusComponent } from './plant-master-list/action-status/action-status.component';
import { PlantMasterViewComponent } from './plant-master-view/plant-master-view.component';


@NgModule({
  declarations: [
    PlantMasterCreateComponent,
    PlantMasterListComponent,
    PlantMasterActionComponent,
    ActionStatusComponent,
    PlantMasterViewComponent
  ],
  imports: [
    CommonModule,
    PlantMasterRoutingModule,
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
    MatTooltipModule
  ]
})
export class PlantMasterModule { }
