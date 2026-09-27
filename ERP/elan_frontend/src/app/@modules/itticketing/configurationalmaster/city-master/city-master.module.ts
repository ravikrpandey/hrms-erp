import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CityMasterRoutingModule } from './city-master-routing.module';
import { CityMasterComponent } from './city-master.component';
import { CityMasterDialogComponent } from './city-master-dialog/city-master-dialog.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CityMasterActionComponent } from './city-master-action/city-master-action.component';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { MatSelectFilterModule } from 'mat-select-filter';

@NgModule({
  declarations: [
    CityMasterDialogComponent,
    CityMasterComponent,
    CityMasterActionComponent,
  ],
  imports: [
    CommonModule,
    CityMasterRoutingModule,
    MaterialModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    ShairedModule,
    MatSelectFilterModule,
  ],
})
export class CityMasterModule {}
