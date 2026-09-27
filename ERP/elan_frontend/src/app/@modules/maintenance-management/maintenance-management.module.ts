import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaintenanceManagementRoutingModule } from './maintenance-management-routing.module';
import { MaintenanceManagementComponent } from './maintenance-management.component';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { MaterialModule } from 'src/app/@shared/material/material.module';


@NgModule({
  declarations: [
    MaintenanceManagementComponent
  ],
  imports: [
    CommonModule,
    MaintenanceManagementRoutingModule,
    ShairedModule,
    MaterialModule
  ]
})
export class MaintenanceManagementModule { }
