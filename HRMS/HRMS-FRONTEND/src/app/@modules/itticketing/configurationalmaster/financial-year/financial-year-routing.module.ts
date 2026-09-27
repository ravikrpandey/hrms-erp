import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinancialListComponent } from './financial-list/financial-list.component';

const routes: Routes = [
  {path:'' ,component:FinancialListComponent},
  // { path:"create", component:AllowanceCreateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinancialYearRoutingModule { }
