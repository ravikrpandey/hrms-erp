import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllComplaintsComponent } from './all-complaints.component';

const routes: Routes = [
  {path:'', component:AllComplaintsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllComplaintsRoutingModule { }
