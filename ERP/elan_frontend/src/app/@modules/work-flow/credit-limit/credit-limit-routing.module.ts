import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreditLimitComponent } from './credit-limit.component';

const routes: Routes = [
  { path: '', component: CreditLimitComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditLimitRoutingModule { }
