import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LwfRoutingModule } from './lwf-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MatSelectModule } from '@angular/material/select';
import { LwfListComponent } from './lwf-list/lwf-list.component';
import { LwfActionComponent } from './lwf-action/lwf-action.component';
import { LwfCreateComponent } from './lwf-create/lwf-create.component';

@NgModule({
  declarations: [LwfListComponent, LwfActionComponent, LwfCreateComponent],
  imports: [
    CommonModule,
    LwfRoutingModule,
    AgGridModule,
    MaterialModule,
    MatSelectFilterModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class LwfModule {}
