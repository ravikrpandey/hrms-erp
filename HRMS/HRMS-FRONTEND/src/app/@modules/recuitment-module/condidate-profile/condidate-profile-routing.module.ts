import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CondidateProfileListComponent } from './condidate-profile-list/condidate-profile-list.component';
import { ProfileRequestComponent } from './profile-request/profile-request.component';
import { AddProfileComponent } from './add-profile/add-profile.component';
import { ViewInterviewDetailsComponent } from './view-interview-details/view-interview-details.component';
import { ViewAnswerDetailsComponent } from './view-answer-details/view-answer-details.component';

const routes: Routes = [
  { path: '', component: CondidateProfileListComponent },
  { path: 'profile-request', component: ProfileRequestComponent },
  { path: 'add-profile', component: AddProfileComponent },
  { path: 'view-interview-details', component: ViewInterviewDetailsComponent },
  { path: 'view-answer-details', component: ViewAnswerDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CondidateProfileRoutingModule { }
