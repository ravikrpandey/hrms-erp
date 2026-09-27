import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeclarationFormListComponent } from './declaration-form-list/declaration-form-list.component';
import { DeclarationMainComponent } from './declaration-main.component';
import { UpdateDeclarationComponent } from './update-declaration/update-declaration.component';
import { ApprovedDeclarationListComponent } from './approved-declaration-list/approved-declaration-list.component';
import { RejectDeclarationListComponent } from './reject-declaration-list/reject-declaration-list.component';
import { UploadDeclarationCreateComponent } from './upload-declaration-create/upload-declaration-create.component';
const routes: Routes = [
  {path:'', component:DeclarationMainComponent,
children:[
  {path:'',redirectTo:'pending-declare',pathMatch:'full'},
  {path:'pending-declare',component:DeclarationFormListComponent},
  {path:'approved-list-declare',component:ApprovedDeclarationListComponent},
  {path:'reject-list-declare',component:RejectDeclarationListComponent},

]
},
{path:'update-declaration',component:UpdateDeclarationComponent},
{path:'view',component:UploadDeclarationCreateComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeclarationFormRoutingModule { }
