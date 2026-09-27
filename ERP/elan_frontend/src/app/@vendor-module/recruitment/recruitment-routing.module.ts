import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecruitmentComponent } from './recruitment.component';
import * as path from 'path';

const routes: Routes = [
  {path:'',component:RecruitmentComponent,
    children:[
     {
      path:'job-discription',
      loadChildren:()=>import('./job-description/job-description.module').then(
        (m)=>m.JobDescriptionModule
      )
     },
     {
      path:'candidate-profile',
      loadChildren:()=>import('./candidate-profile/candidate-profile.module').then(
        (m)=>m.CandidateProfileModule
      )
     }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecruitmentRoutingModule { }
