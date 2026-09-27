import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArearSalaryList } from './arear-salary-list/arear-salary-list';
import { ArearSalaryCreate } from './arear-salary-create/arear-salary-create';
import { ArearSalaryAction } from './arear-salary-action/arear-salary-action';

const routes: Routes = [
  { path: "", component: ArearSalaryList },
  { path: "create", component: ArearSalaryCreate },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArearSalaryRoutingModule { }
