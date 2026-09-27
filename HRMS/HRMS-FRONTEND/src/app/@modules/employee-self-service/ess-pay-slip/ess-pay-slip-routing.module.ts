import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EssPaySlipComponent } from './ess-pay-slip/ess-pay-slip.component';

const routes: Routes = [
  {path:'',component:EssPaySlipComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EssPaySlipRoutingModule { }
