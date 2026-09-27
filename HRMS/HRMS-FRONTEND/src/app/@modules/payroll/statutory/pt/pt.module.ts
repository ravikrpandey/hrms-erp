import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PtRoutingModule } from './pt-routing.module';
import { PtListComponent } from './pt-list/pt-list.component';
import { PtActionComponent } from './pt-action/pt-action.component';
import { PtCreateComponent } from './pt-create/pt-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [PtListComponent, PtActionComponent, PtCreateComponent],
  imports: [
    CommonModule,
    PtRoutingModule,
    AgGridModule,
    MaterialModule,
    MatSelectFilterModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class PtModule {}
