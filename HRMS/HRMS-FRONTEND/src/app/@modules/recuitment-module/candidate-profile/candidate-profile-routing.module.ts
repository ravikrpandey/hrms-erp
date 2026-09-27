import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BvgListComponent } from './bvg-list/bvg-list.component';
import { CandidateProfileComponent1 } from './varification-list/varification-list.component';
import { CandidateProfileCreateComponent } from './candidate-profile-create/candidate-profile-create.component';
import { CandidateProfileListComponent } from './candidate-profile-list/candidate-profile-list.component';

const routes: Routes = [
  { path: '', component: CandidateProfileComponent1 },
  {
    path: 'profile-list',
    component: CandidateProfileListComponent,
  },
  {
    path: 'profile-create',
    component: CandidateProfileCreateComponent,
  },
  { path: 'bvg-list', component: BvgListComponent,},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidateProfileRoutingModule {}
