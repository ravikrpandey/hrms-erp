import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShortlistedCandidateListComponent } from './shortlisted-candidate-list/shortlisted-candidate-list.component';
import { CreateCandidateOfferLetterComponent } from './create-candidate-offer-letter/create-candidate-offer-letter.component';

const routes: Routes = [
  { path: '', component: ShortlistedCandidateListComponent },
  { path: 'create-candidate-offer-letter', component: CreateCandidateOfferLetterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShortlistedCondidateRoutingModule { }
