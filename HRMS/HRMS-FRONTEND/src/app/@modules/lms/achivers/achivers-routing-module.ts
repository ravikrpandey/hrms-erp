import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Achivers } from './achivers';

const routes: Routes = [
  {
    path:'',component:Achivers
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AchiversRoutingModule { }
