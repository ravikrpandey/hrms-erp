import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchemeMasterListComponent } from './scheme-master-list/scheme-master-list.component';
import { SchemeMasterComponent } from './scheme-master.component';
// import { SchemeCreateNewComponent } from './scheme-status/scheme-status.component';

const routes: Routes = [
  {path: '',redirectTo:'scheme-list',pathMatch:'full'},
  {path:'scheme-list',component:SchemeMasterListComponent,
  children:[
  ]
},
{path:"scheme-create",component:SchemeMasterComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchemeMasterRoutingModule { }
