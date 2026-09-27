import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentManagementSystem } from './document-management-system';
import { DocumentManagement } from './document-management/document-management';

const routes: Routes = [
  {
    path: "", component: DocumentManagementSystem,
    children: [
      {
        path: "document-management",
        component: DocumentManagement
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentManagementSystemRoutingModule { }
