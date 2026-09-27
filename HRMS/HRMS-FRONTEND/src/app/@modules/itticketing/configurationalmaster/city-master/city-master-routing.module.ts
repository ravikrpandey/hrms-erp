import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CityMasterComponent } from './city-master.component';

const routes: Routes = [
  {path:'', component:CityMasterComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CityMasterRoutingModule { }
