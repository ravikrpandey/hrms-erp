import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidateOfferLetterReceiveComponent } from './candidate-offer-letter-receive.component';

const routes: Routes = [
  {path:'',component:CandidateOfferLetterReceiveComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateOfferLetterReceiveRoutingModule { }
