import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountDashboardRoutingModule } from './account-dashboard-routing.module';
import { AccountDashboardComponent } from './account-dashboard/account-dashboard.component';


@NgModule({
  declarations: [
    AccountDashboardComponent
  ],
  imports: [
    CommonModule,
    AccountDashboardRoutingModule
  ]
})
export class AccountDashboardModule { }
