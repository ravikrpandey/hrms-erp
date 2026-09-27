import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SanctionCreditLimitComponent } from './sanction-credit-limit.component';

const routes: Routes = [
  { path: '', component: SanctionCreditLimitComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SanctionCreditLimitRoutingModule { }
