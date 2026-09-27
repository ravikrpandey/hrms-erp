import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PricingLevelComponent } from './pricing-level.component';

const routes: Routes = [{ path: '', component: PricingLevelComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PricingLevelRoutingModule { }
