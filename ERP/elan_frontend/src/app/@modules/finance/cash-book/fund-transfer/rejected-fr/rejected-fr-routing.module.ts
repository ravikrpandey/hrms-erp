import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RejectedFrComponent } from './rejected-fr.component';

const routes: Routes = [
  {path:'',component:RejectedFrComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RejectedFrRoutingModule { }
