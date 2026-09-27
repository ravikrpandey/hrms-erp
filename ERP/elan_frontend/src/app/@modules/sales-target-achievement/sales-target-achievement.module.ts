import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SalesTargetAchievementRoutingModule } from './sales-target-achievement-routing.module';
import { SalesTargetAchievementComponent } from './sales-target-achievement.component';
import { AgGridModule } from 'ag-grid-angular';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SalesTargetComponent } from './sales-target/sales-target.component';
import { CreateTargetComponent } from './create-target/create-target.component';
import { TargetAchievementComponent } from './target-achievement/target-achievement.component';
import { AchievementDetailsComponent } from './target-achievement/achievement-details/achievement-details.component';


@NgModule({
  declarations: [
    SalesTargetAchievementComponent,
    DashboardComponent,
    SalesTargetComponent,
    CreateTargetComponent,
    TargetAchievementComponent,
    AchievementDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SalesTargetAchievementRoutingModule,
    AgGridModule,
    ShairedModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SalesTargetAchievementModule { }
