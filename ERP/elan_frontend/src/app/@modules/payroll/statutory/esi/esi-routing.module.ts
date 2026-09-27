import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EsiListComponent } from './esi-list/esi-list.component';
import { EsiCreateComponent } from './esi-create/esi-create.component';

const routes: Routes = [
  {path:'', component:EsiListComponent},
  {path:'esi-create', component:EsiCreateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EsiRoutingModule { }
