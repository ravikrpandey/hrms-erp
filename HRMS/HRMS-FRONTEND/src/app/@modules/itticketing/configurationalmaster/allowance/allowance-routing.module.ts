import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AllowanceModule } from './allowance.module';
import { AllowanceCreateComponent } from './allowance-create/allowance-create.component';
import { AllowanceListComponent } from './allowance-list/allowance-list.component';

const routes: Routes = [
  {path:'' ,component:AllowanceListComponent},
  { path:"create", component:AllowanceCreateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllowanceRoutingModule { }
