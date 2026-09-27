import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobDiscriptionListComponent } from './job-discription-list/job-discription-list.component';
import { JobDescriptionCreateComponent } from './job-description-create/job-description-create.component';

const routes: Routes = [
  { path: '', component: JobDiscriptionListComponent },
  { path: 'job-create', component: JobDescriptionCreateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobDescriptionMainRoutingModule { }
