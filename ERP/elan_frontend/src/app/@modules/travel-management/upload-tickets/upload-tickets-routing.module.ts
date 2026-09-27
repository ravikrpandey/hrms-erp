import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadTicketsModuleListComponent } from './upload-tickets-list.component';
 

const routes: Routes = [
{path:'',redirectTo:'uploaded-tickets-list',pathMatch:'full'},
{path:'uploaded-tickets-list',component:UploadTicketsModuleListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UploadTicketsModuleRoutingModule { }
