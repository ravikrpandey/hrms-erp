import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdditionalChargeComponent } from './additional-charge.component';

const routes: Routes = [
  {path : "", component : AdditionalChargeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdditionalChargeRoutingModule { }
