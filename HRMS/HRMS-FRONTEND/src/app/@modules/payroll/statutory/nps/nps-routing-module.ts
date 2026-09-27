import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Component } from 'ag-grid-community';
import { Nps } from './nps';

const routes: Routes = [
  {path:'',component:Nps}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NpsRoutingModule { }
