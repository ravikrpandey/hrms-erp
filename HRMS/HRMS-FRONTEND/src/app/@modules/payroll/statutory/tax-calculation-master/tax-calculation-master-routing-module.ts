import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaxCalculationMaster } from './tax-calculation-master/tax-calculation-master';

const routes: Routes = [
  {path:'',component:TaxCalculationMaster}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxCalculationMasterRoutingModule { }
