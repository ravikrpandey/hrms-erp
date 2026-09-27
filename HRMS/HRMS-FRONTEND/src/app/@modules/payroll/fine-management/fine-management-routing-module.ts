import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FineManagementList } from './fine-management-list/fine-management-list';
import { FineManagementCreate } from './fine-management-create/fine-management-create';

const routes: Routes = [
  { path: "", component: FineManagementList },
  { path: "create", component: FineManagementCreate },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FineManagementRoutingModule { }
