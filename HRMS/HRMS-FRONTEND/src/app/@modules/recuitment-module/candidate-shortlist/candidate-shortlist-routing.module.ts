import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidateShortCreateComponent } from './candidate-short-create/candidate-short-create.component';
import { CandidateShortListComponent } from './candidate-short-list/candidate-short-list.component';

const routes: Routes = [
  {path:'candidate-short-list', component : CandidateShortListComponent},
  {path:'candidate-short-create', component : CandidateShortCreateComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateShortlistRoutingModule { }
