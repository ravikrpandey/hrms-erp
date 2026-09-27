import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprovedFrComponent } from './approved-fr.component';

const routes: Routes = [
  {path:'',component:ApprovedFrComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovedFrRoutingModule { }
