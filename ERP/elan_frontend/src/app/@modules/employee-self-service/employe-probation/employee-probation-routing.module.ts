import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProbationEditComponent } from './probation-create/probation-create.component';
import { EmployeProbationComponent } from './probation-list/employe-probation.component';

const routes: Routes = [
  {path:'',component:EmployeProbationComponent},
  {path:'probation_edit', component:ProbationEditComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProbationRoutingModule { }
