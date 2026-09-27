import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllResignationComponent } from './all-resignation.component';
import { AllResignationCreateComponent } from './all-resignation-list/all-resignation-create/all-resignation-create.component';
import { AllResignationReviewComponent } from './all-resignation-list/all-resignation-review/all-resignation-review.component';
import { AllResignationOffboardingComponent } from './all-resignation-list/all-resignation-offboarding/all-resignation-offboarding.component';

const routes: Routes = [
  { 
    path: '', 
    component: AllResignationComponent, 
    children: [
      { path: '', redirectTo: 'all-resignation', pathMatch: 'full' },
      {
        path: 'all-resignation', 
        loadChildren: () =>
          import('./all-resignation-list/all-resignation-list-routing.module').then(
            (m) => m.AllResignationListRoutingModule
          ),
      },
      {path:'all-resignation-offboarding',component:AllResignationOffboardingComponent},
    
      
    ]
  },
 {path:'all-resignation-create',component:AllResignationCreateComponent},
 {path:'all-resignation-review',component:AllResignationReviewComponent},
 {
  path: 'all-resignation-review/:id',
  component: AllResignationReviewComponent 
 },

 
//  {path:'off-boarding',component:MyListCreateComponent}
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllResignationRoutingModule { }
