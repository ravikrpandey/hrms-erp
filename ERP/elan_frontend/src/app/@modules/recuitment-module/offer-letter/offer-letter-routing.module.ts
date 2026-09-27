import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfferLetterComponent } from './offer-letter/offer-letter.component';

const routes: Routes = [
  { path: '', component: OfferLetterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfferLetterRoutingModule { }
