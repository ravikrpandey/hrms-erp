import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReimbursementListComponent } from './reimbursement-list/reimbursement-list.component';
import { ReimbursementCreateComponent } from './reimbursement-create/reimbursement-create.component';

const routes: Routes = [
  {path:'', component:ReimbursementListComponent},
  {path:'reimbursement-create', component:ReimbursementCreateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReimbursementsRoutingModule { }
