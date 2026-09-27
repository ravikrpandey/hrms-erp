import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransportRequestRoutingModule } from './transport-request-routing.module';
import { TransportRequestComponent } from './transport-request.component';
import { AgGridModule } from 'ag-grid-angular';
import { CreateTransportRequestComponent } from './create-transport-request/create-transport-request.component';
import { MatIconModule } from '@angular/material/icon';
import { TransportRequestActionComponent } from './transport-request-action/transport-request-action.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CKEditorModule } from 'ckeditor4-angular';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { TransposrtRequestListComponent } from './transposrt-request-list/transposrt-request-list.component';
import { PendingRequestComponent } from './pending-request/pending-request.component';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { ApprovedTransportRequestComponent } from './approved-transport-request/approved-transport-request.component';
import { RejectedTransportRequestComponent } from './rejected-transport-request/rejected-transport-request.component';
import { TransportDialogComponent } from './transport-dialog/transport-dialog.component';
import { AddVendorVehicleComponent } from './add-vendor-vehicle/add-vendor-vehicle.component';
import { VehicleDetailsComponent } from './vehicle-details/vehicle-details.component';

@NgModule({
  declarations: [
    TransportRequestComponent,
    TransportRequestActionComponent,
    CreateTransportRequestComponent,
    TransposrtRequestListComponent,
    PendingRequestComponent,
    ApprovedTransportRequestComponent,
    RejectedTransportRequestComponent,
    TransportDialogComponent,
    AddVendorVehicleComponent,
    VehicleDetailsComponent,
  ],
  imports: [
    CommonModule,
    TransportRequestRoutingModule,
    AgGridModule,
    MatIconModule,
    AgGridModule,
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
    NgxMatTimepickerModule,
  ],
})
export class TransportRequestModule {}
