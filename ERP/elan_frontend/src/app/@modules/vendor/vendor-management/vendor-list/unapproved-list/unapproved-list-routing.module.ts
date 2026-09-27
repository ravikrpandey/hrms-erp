import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnapprovedListComponent } from './unapproved-list.component';

const routes: Routes = [
  { path: "", component: UnapprovedListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnapprovedListRoutingModule { }
