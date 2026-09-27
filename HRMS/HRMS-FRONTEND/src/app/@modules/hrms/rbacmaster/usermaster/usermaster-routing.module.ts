import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { menuMasterComponent } from './menu-master/menu-master.component';

const routes: Routes = [
 {path:'', component:menuMasterComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsermasterRoutingModule { }
