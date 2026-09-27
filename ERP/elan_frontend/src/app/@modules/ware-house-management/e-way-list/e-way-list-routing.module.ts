import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EWayListComponent } from './e-way-list.component';

const routes: Routes = [
  { 
    path: '', 
    component: EWayListComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EWayListRoutingModule { }
