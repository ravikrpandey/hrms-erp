import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobDescriptionComponent } from './job-description.component';
import { ViewJobDescriptionComponent } from './view-job-description/view-job-description.component';

const routes: Routes = [
  {path:'',component:JobDescriptionComponent},
  {path:'job-view',component:ViewJobDescriptionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobDescriptionRoutingModule { }
