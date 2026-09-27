import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransportManagementRoutingModule } from './transport-management-routing.module';
import { TransportManagementComponent } from './transport-management.component';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { VehicalTypeComponent } from './vehical-type/vehical-type.component';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { VehicalFuelTypeComponent } from './vehical-fuel-type/vehical-fuel-type.component';
import { CreateVehicleTypeComponent } from './vehical-type/create-vehicle-type/create-vehicle-type.component';
import { TransporterTypeComponent } from './transporter-type/transporter-type.component';
import { TransportTypeComponent } from './transport-type/transport-type.component';
import { TransporterMasterComponent } from './transporter-master/transporter-master.component';
import { CreateTransporterComponent } from './transporter-master/create-transporter/create-transporter.component';
import { DriverVehicleMappingWithTransporterComponent } from './driver-vehicle-mapping-with-transporter/driver-vehicle-mapping-with-transporter.component';
import { CreateMappingComponent } from './driver-vehicle-mapping-with-transporter/create-mapping/create-mapping.component';
import { RateAgreementComponent } from './rate-agreement/rate-agreement.component';
import { CreateRateAgreementComponent } from './rate-agreement/create-rate-agreement/create-rate-agreement.component';
import { RfqRequestComponent } from './rfq-request/rfq-request.component';
import { RfqDetailsComponent } from './rfq-request/rfq-details/rfq-details.component';
import { DriverVehiclePlanningForDispatchComponent } from './driver-vehicle-planning-for-dispatch/driver-vehicle-planning-for-dispatch.component';
import { DeliveryRootPodComponent } from './driver-vehicle-planning-for-dispatch/delivery-root-pod/delivery-root-pod.component';


@NgModule({
  declarations: [
    TransportManagementComponent,
    VehicalTypeComponent,
    VehicalFuelTypeComponent,
    CreateVehicleTypeComponent,
    TransporterTypeComponent,
    TransportTypeComponent,
    TransporterMasterComponent,
    CreateTransporterComponent,
    DriverVehicleMappingWithTransporterComponent,
    CreateMappingComponent,
    RateAgreementComponent,
    CreateRateAgreementComponent,
    RfqRequestComponent,
    RfqDetailsComponent,
    DriverVehiclePlanningForDispatchComponent,
    DeliveryRootPodComponent
  ],
  imports: [
    CommonModule,
    TransportManagementRoutingModule,
    ShairedModule,
    AgGridModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule
  ]
})
export class TransportManagementModule { }
