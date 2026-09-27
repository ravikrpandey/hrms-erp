import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LwfListComponent } from './lwf-list/lwf-list.component';
import { LwfCreateComponent } from './lwf-create/lwf-create.component';

const routes: Routes = [
  {path:'' , component:LwfListComponent},
  {path:'lwf-create', component:LwfCreateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LwfRoutingModule { }
