import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EpfListComponent } from './epf-list/epf-list.component'; 
import { EpfCreateComponent } from './epf-create/epf-create.component';

const routes: Routes = [
  {path:'' , component:EpfListComponent},
  {path:'epf-create', component:EpfCreateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EpfRoutingModule { }
