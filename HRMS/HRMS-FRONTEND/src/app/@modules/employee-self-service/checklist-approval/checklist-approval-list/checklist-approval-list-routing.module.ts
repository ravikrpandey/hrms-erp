import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChecklistApprovalListComponent } from './checklist-approval-list/checklist-approval-list.component';

const routes: Routes = [
  {path:'',component:ChecklistApprovalListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChecklistApprovalListRoutingModule { }
