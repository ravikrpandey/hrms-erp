import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransportManagementComponent } from './transport-management.component';
import { VehicalTypeComponent } from './vehical-type/vehical-type.component';
import { VehicalFuelTypeComponent } from './vehical-fuel-type/vehical-fuel-type.component';
import { CreateVehicleTypeComponent } from './vehical-type/create-vehicle-type/create-vehicle-type.component';
import { TransporterTypeComponent } from './transporter-type/transporter-type.component';
import { TransporterMasterComponent } from './transporter-master/transporter-master.component';
import { TransportTypeComponent } from './transport-type/transport-type.component';
import { CreateTransporterComponent } from './transporter-master/create-transporter/create-transporter.component';
import { DriverVehicleMappingWithTransporterComponent } from './driver-vehicle-mapping-with-transporter/driver-vehicle-mapping-with-transporter.component';
import { CreateMappingComponent } from './driver-vehicle-mapping-with-transporter/create-mapping/create-mapping.component';
import { RateAgreementComponent } from './rate-agreement/rate-agreement.component';
import { CreateRateAgreementComponent } from './rate-agreement/create-rate-agreement/create-rate-agreement.component';
import { RfqRequestComponent } from './rfq-request/rfq-request.component';
import { DriverVehiclePlanningForDispatchComponent } from './driver-vehicle-planning-for-dispatch/driver-vehicle-planning-for-dispatch.component';

const routes: Routes = [
  {
    path: '', component: TransportManagementComponent,
    children: [
      {
        path: 'vehical-category',
        loadChildren: () => import('./vehical-category/vehical-category.module').then(
          (m) => m.VehicalCategoryModule
        )
      },
      {
        path: 'vehicle-master',
        loadChildren: () => import('./vehicle-master/vehicle-master.module').then(
          (m) => m.VehicleMasterModule
        )
      },
      {
        path: 'driver-master',
        loadChildren: () => import('./driver-master/driver-master.module').then(
          (m) => m.DriverMasterModule
        )
      },
      {
        path: 'transport-request',
        loadChildren: () => import('./transport-request/transport-request.module').then(
          (m) => m.TransportRequestModule
        )
      },
      {
        path: 'vendor-vehicle-master',
        loadChildren: () => import('./vehicle-vendor-master/vehicle-vendor-master.module').then(
          (m) => m.VehicleVendorMasterModule
        )
      },
      {
        path: 'all-trip',
        loadChildren: () => import('./all-trip/all-trip.module').then(
          (m) => m.AllTripModule
        )
      },
      { path: 'vehicle-type', component: VehicalTypeComponent },
      { path: 'fuel-type', component: VehicalFuelTypeComponent },
      { path: 'create-vehicle-type', component: CreateVehicleTypeComponent },
      { path: 'transporter-type', component: TransporterTypeComponent },
      { path: 'transporter-master', component: TransporterMasterComponent },
      { path: 'create-transporter', component: CreateTransporterComponent },
      { path: 'transport-type', component: TransportTypeComponent },
      { path: 'driver-vehicle-mapping', component: DriverVehicleMappingWithTransporterComponent },
      { path: 'create-mapping', component: CreateMappingComponent },
      { path: 'rate-agreement', component: RateAgreementComponent },
      { path: 'create-rate-agreement', component: CreateRateAgreementComponent },
      { path: 'rfq-request', component: RfqRequestComponent },
      { path: 'driver-vehicle-planning', component: DriverVehiclePlanningForDispatchComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransportManagementRoutingModule { }
