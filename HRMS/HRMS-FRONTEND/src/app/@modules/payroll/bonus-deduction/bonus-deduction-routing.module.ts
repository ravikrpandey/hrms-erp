import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BonusDeductionListComponent } from './bonus-deduction-list/bonus-deduction-list.component';
import { BonusDeductionCreateComponent } from './bonus-deduction-create/bonus-deduction-create.component';
import { BonusDeductionActionComponent } from './bonus-deduction-action/bonus-deduction-action.component';

const routes: Routes = [
  { path: "", component: BonusDeductionListComponent},
  { path: "create", component: BonusDeductionCreateComponent},
  { path: "action", component: BonusDeductionActionComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BonusDeductionRoutingModule { }
