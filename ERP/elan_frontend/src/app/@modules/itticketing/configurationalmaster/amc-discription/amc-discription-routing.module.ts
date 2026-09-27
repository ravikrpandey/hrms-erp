import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AmcDiscriptionComponent } from './amc-discription.component';

const routes: Routes = [
  {path: '', component: AmcDiscriptionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AmcDiscriptionRoutingModule { }
