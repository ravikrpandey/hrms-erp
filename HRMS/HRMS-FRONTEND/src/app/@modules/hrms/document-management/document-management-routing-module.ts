import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentManagement } from './document-management-list/document-management';
import { add } from 'date-fns';
import { AddTemplate } from './add-template/add-template';
import { SendDownloadDocument } from './send-download-document/send-download-document';


const routes: Routes = [
  { path: '', component: DocumentManagement },
  { path: 'list', component: DocumentManagement },
  { path: 'add-template', component: AddTemplate },
  { path: 'send-download', component: SendDownloadDocument }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentManagementRoutingModule { }
