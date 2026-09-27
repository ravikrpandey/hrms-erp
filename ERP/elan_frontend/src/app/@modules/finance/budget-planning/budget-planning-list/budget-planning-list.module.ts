import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BudgetPlanningListRoutingModule } from './budget-planning-list-routing.module';
import { BudgetPlanningListComponent } from './budget-planning-list.component';


@NgModule({
  declarations: [
    BudgetPlanningListComponent,
  ],
  imports: [
    CommonModule,
    BudgetPlanningListRoutingModule
  ]
})
export class BudgetPlanningListModule { }