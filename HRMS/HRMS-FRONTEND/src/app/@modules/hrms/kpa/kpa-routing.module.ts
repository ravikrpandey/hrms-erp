import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KpaListComponent } from './kpa-list/kpa-list.component';
import { CreateKpaComponent } from './create-kpa/create-kpa.component';

const routes: Routes = [
  {path:'' ,component:KpaListComponent},
  {path:'createkpa-master' ,component:CreateKpaComponent},
  {path:'updatekpa-master' ,component:CreateKpaComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KpaRoutingModule { }
