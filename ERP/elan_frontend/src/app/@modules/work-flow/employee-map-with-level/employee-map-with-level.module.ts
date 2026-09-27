import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeMapWithLevelRoutingModule } from './employee-map-with-level-routing.module';
import { EmployeeMapWithLevelComponent } from './employee-map-with-level.component';
import { AgGridModule } from 'ag-grid-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { MatSelectFilterModule } from 'mat-select-filter';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { EmployeeMapWithLevelCreateComponent } from './employee-map-with-level-create/employee-map-with-level-create.component';
import { EmployeeMapWithLevelActionComponent } from './employee-map-with-level-action/employee-map-with-level-action.component';

@NgModule({
  declarations: [
    EmployeeMapWithLevelComponent,
    EmployeeMapWithLevelCreateComponent,
    EmployeeMapWithLevelActionComponent
  ],
  imports: [
    CommonModule,
    EmployeeMapWithLevelRoutingModule,
    AgGridModule,
    ReactiveFormsModule,
    MaterialModule,
    MatSelectFilterModule,
    NgxMatSelectSearchModule
  ]
})
export class EmployeeMapWithLevelModule { }
