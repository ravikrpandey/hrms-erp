import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReimburseMasterComponent } from './reimbursement-master.component';
import { TravelTypeComponent } from './travel-type/travel-type.component';
import { RouterModule } from '@angular/router';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AddTravelTypeComponent } from './travel-type/add-travel-type/add-travel-type.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TravelTypeActionComponent } from './travel-type/travel-type-action/travel-type-action.component';
import { BudgetLimitComponent } from './budget-limit/budget-limit.component';
import { CreateTravelBudgetComponent } from './budget-limit/create-travel-budget/create-travel-budget.component';
import { BudgetActionComponent } from './budget-limit/budget-action/budget-action.component';
import { ReimbursementMasterComponent } from './reimbursement-master/reimbursement-master.component';
import { ReimbursementBudgetMasterComponent } from './reimbursement-budget-master/reimbursement-budget-master.component';
import { CreateReimbursementComponent } from './reimbursement-master/create-reimbursement/create-reimbursement.component';
import { ReimbursementActionComponent } from './reimbursement-master/reimbursement-action/reimbursement-action.component';
import { ReimbursementBudgetActionComponent } from './reimbursement-budget-master/reimbursement-budget-action/reimbursement-budget-action.component';
import { CreateReimbursementBudgetComponent } from './reimbursement-budget-master/create-reimbursement-budget/create-reimbursement-budget.component';
import { ReimbursementMasterRoutingModule } from './reimbursement-master-routing.module';

@NgModule({
  declarations: [
    ReimburseMasterComponent,
    TravelTypeComponent,
    AddTravelTypeComponent,
    TravelTypeActionComponent,
    BudgetLimitComponent,
    CreateTravelBudgetComponent,
    BudgetActionComponent,
    ReimbursementMasterComponent,
    ReimbursementBudgetMasterComponent,
    CreateReimbursementComponent,
    ReimbursementActionComponent,
    ReimbursementBudgetActionComponent,
    CreateReimbursementBudgetComponent,
  ],
  imports: [
    CommonModule,
    ReimbursementMasterRoutingModule,
    RouterModule,
    ShairedModule,
    AgGridModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
})
export class ReimbursementMasterModule {}
