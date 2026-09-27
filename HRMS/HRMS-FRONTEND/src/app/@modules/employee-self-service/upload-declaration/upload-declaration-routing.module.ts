import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadDeclarationListComponent } from './upload-declaration-list/upload-declaration-list.component';
import { UploadDeclarationCreateComponent } from './upload-declaration-create/upload-declaration-create.component';

const routes: Routes = [
  {path:'', component:UploadDeclarationListComponent},
  {path:'create-upload-declaration',component:UploadDeclarationCreateComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UploadDeclarationRoutingModule { }
