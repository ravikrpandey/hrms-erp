import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetMaintenanceRoutingModule } from './asset-maintenance-routing.module';
import { AssetMaintenanceComponent } from './asset-maintenance/asset-maintenance.component';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { MaterialModule } from 'src/app/@shared/material/material.module';


@NgModule({
  declarations: [
    AssetMaintenanceComponent,
  ],
  imports: [
    CommonModule,
    AssetMaintenanceRoutingModule,
    ShairedModule,
    MaterialModule
  ]
})
export class AssetMaintenanceModule { }
