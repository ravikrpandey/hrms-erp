import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KtAssignmentList } from './kt-assignment-list/kt-assignment-list';
import { KtAssignmentCreate } from './kt-assignment-create/kt-assignment-create';

const routes: Routes = [
  {path:'',component:KtAssignmentList},
  {path:'create-kt-assignment',component:KtAssignmentCreate}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KtAssignmentRoutingModule { }
