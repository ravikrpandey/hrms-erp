import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResolvedComplaintsComponent } from './resolved-complaints.component';

const routes: Routes = [
  {path:'', component:ResolvedComplaintsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResolvedComplaintsRoutingModule { }
