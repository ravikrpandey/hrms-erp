import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BranchSetupListComponent } from './branch-setup-list/branch-setup-list.component';
import { BranchSetupCreateComponent } from './branch-setup-create/branch-setup-create.component';
import { BranchSetupActionComponent } from './branch-setup-action/branch-setup-action.component';

const routes: Routes = [
  {path: '', component:BranchSetupListComponent},
  {path: 'create', component:BranchSetupCreateComponent},
  {path:'action', component:BranchSetupActionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchSetupRoutingModule { }
