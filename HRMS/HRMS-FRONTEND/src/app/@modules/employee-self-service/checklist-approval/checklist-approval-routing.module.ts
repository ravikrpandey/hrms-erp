import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChecklistApprovalComponent } from './checklist-approval.component';
import { ChecklistApprovalCreateComponent } from './checklist-approval-list/checklist-approval-create/checklist-approval-create.component';
import { ChecklistApprovedComponent } from './checklist-approval-list/checklist-approved/checklist-approved.component';

const routes: Routes = [
  { 
    path: '',
    component: ChecklistApprovalComponent, 
    children: [
      { path: '', redirectTo: 'checklist-approval', pathMatch: 'full' },
      {
        path: 'checklist-approval', 
        loadChildren: () =>
          import('./checklist-approval-list/checklist-approval-list-routing.module').then(
            (m) => m.ChecklistApprovalListRoutingModule
          ),
      },
      {path:'approved-checklist',component:ChecklistApprovedComponent}
      
    ]
  },
 {path:'checklist-approval-create',component:ChecklistApprovalCreateComponent}, 


 
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChecklistApprovalRoutingModule { }
