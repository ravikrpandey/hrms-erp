import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehicleVendorMasterRoutingModule } from './vehicle-vendor-master-routing.module';
import { VehicleVendorMasterListComponent } from './vehicle-vendor-master-list/vehicle-vendor-master-list.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgGridModule } from 'ag-grid-angular';
import { CKEditorModule } from 'ckeditor4-angular';
import { MatSelectFilterModule } from 'mat-select-filter';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { VehicleVendorMasterCreateComponent } from './vehicle-vendor-master-create/vehicle-vendor-master-create.component';
import { VehicleVendorMasterActionComponent } from './vehicle-vendor-master-action/vehicle-vendor-master-action.component';
import { VehicleVendorMasterDialogComponent } from './vehicle-vendor-master-dialog/vehicle-vendor-master-dialog.component';


@NgModule({
  declarations: [
    VehicleVendorMasterListComponent,
    VehicleVendorMasterCreateComponent,
    VehicleVendorMasterActionComponent,
    VehicleVendorMasterDialogComponent
  ],
  imports: [
    CommonModule,
    VehicleVendorMasterRoutingModule,AgGridModule,
            HttpClientModule,
            FormsModule,
            MatIconModule,
            MatFormFieldModule,
            MatInputModule,
            MatCardModule,
            MatDialogModule,
            MatSidenavModule,
            MatExpansionModule,
            MatListModule,
            MatTooltipModule,
            ReactiveFormsModule,
            MaterialModule,
            MatCheckboxModule,
            MatProgressSpinnerModule,
            CKEditorModule,
            MatButtonModule,
            MatSelectFilterModule,
            NgxMatTimepickerModule
  ]

})
export class VehicleVendorMasterModule { }
