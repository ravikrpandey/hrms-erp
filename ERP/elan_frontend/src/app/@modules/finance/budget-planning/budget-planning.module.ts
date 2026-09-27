import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BudgetPlanningComponent } from './budget-planning.component';
import { CostCenterRoutingModule } from './budget-planning-routing.module';
import { BudgetPlanningCreateComponent } from './budget-planning-create/budget-planning-create.component';
import { BudgetPlanningListComponent } from './budget-planning-list/budget-planning-list.component';
import { BudgetPlanningListModule } from './budget-planning-list/budget-planning-list.module';
import { PlanningComponent } from './budget-planning-list/planning/planning.component';
import { PlanningActionComponent } from './budget-planning-list/planning/budget-planning-action/planning-action.component';
import { PlanningStatusComponent } from './budget-planning-list/planning/budget-planning-action/planning-status/planning-status.component';

@NgModule({
  declarations: [
    BudgetPlanningComponent,
    BudgetPlanningCreateComponent,
    PlanningComponent,
    PlanningActionComponent,
    PlanningStatusComponent
  ],
  imports: [
    CommonModule,
    CostCenterRoutingModule,
    MaterialModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    BudgetPlanningListModule
  ]
})
export class BudgetPlanningModule { }
