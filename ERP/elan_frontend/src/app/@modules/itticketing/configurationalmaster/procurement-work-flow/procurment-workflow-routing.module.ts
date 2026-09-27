import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprovalLevelListComponent } from './approval-level-list/approval-level-list.component';


const routes: Routes = [
  {path:'', component:ApprovalLevelListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcurementWorkflowRoutingModule { }