import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CityMasterRoutingModule } from './city-master-routing.module';
import { CityMasterComponent } from './city-master.component';
import { CityMasterDialogComponent } from './city-master-dialog/city-master-dialog.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CityMasterActionComponent } from './city-master-action/city-master-action.component';
import { UploadExcelDialogComponent } from './upload-excel-dialog/upload-excel-dialog.component';
import { SearchFilterComponent } from 'src/app/@shared/components/search-filter/search-filter.component';

@NgModule({
  declarations: [
    CityMasterDialogComponent,
    CityMasterComponent,
    CityMasterActionComponent,
    UploadExcelDialogComponent
  ],
  imports: [
    CommonModule,
    CityMasterRoutingModule,
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
    MatTooltipModule,
    SearchFilterComponent
  ]
})
export class CityMasterModule { }
