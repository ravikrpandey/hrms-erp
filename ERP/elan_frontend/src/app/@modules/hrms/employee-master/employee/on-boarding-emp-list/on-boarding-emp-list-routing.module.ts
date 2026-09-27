import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnBoardingEmpListComponent } from './on-boarding-emp-list.component';

const routes: Routes = [
  {path:'', component:OnBoardingEmpListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnBoardingEmpListRoutingModule { }
