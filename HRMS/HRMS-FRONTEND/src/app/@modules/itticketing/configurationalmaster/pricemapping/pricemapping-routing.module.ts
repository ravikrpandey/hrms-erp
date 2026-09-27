import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PricemappingComponent } from './pricemapping.component';

const routes: Routes = [
  {
    path:'', component:PricemappingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PricemappingRoutingModule { }
