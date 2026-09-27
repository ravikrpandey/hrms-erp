import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';

import { AllResignationListingComponent } from './all-resignation-listing/all-resignation-listing.component';
import { AllResignationReviewComponent } from './all-resignation-review/all-resignation-review.component';

const routes: Routes = [
  {path:'',component:AllResignationListingComponent},

  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllResignationListRoutingModule { }
