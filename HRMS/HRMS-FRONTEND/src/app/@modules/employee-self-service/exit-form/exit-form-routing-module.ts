import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExitFormList } from './exit-form-list/exit-form-list';
import { ExitFormCreate } from './exit-form-create/exit-form-create';
import { ExitFormApproval } from './exit-form-approval/exit-form-approval';
import { ExitFormApproverList } from './exit-form-approver-list/exit-form-approver-list';

const routes: Routes = [
  {
    path: '', component:ExitFormList
  },
  {
    path: 'create', component:ExitFormCreate
  },
  {
    path: 'approval', component:ExitFormApproval
  },
  {
    path: 'approval-list', component:ExitFormApproverList
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExitFormRoutingModule { }
