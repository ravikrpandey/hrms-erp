import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {  ManpowerListComponent } from './manpower-list/manpower-list.component';

const routes: Routes = [
  { path: '', component: ManpowerListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManpowerRoutingModule { }
