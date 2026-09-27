import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BvgListComponent } from './bvg-list/bvg-list.component';
import { VarificationListComponent } from './varification-list/varification-list.component';

const routes: Routes = [
  {path:'verification-list', component : VarificationListComponent },
  {path:'bvg', component : BvgListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackgroundVarificationRoutingModule { }
