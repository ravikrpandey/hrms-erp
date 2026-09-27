import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BranchComponent } from './branch.component';
import { BranchFormComponent } from './branch-form/branch-form.component';

const routes: Routes = [
  { path: '', component: BranchComponent },
  { path: 'branch-form', component: BranchFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BranchRoutingModule {}
