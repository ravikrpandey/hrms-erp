import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardMainRoutingModule } from './dashboard-main-routing.module';
import { DashboardMainComponent } from './dashboard-main.component';
import { SuperDashboardComponent } from './super-dashboard/super-dashboard.component';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
// import { DashboardMainComponent } from './dashboard-main/dashboard-main.component';


@NgModule({
  declarations: [
    // DashboardMainComponent
  
    DashboardMainComponent,
    SuperDashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardMainRoutingModule,ShairedModule
  ]
})
export class DashboardMainModule { }
