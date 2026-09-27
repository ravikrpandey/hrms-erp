import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendingListComponent } from './pending-list/pending-list.component';
import { AgGridModule } from 'ag-grid-angular';
import { ListFormComponent } from './list-form/list-form.component';

const routes: Routes = [
  {path: '', component:PendingListComponent},
  {path:'update-request',component:ListFormComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PendingForApprovalRoutingModule { }
