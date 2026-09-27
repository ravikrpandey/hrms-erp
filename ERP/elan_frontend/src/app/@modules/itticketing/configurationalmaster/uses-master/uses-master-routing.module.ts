import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsesMasterComponent } from './uses-master.component';

const routes: Routes = [
  {path:'',component:UsesMasterComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsesMasterRoutingModule { }
