import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobDescriptionCreateComponent } from '../job-description-main/job-description-create/job-description-create.component';
import { JobDescriptionListComponent } from './job-description-list/job-description-list.component';
import { JobDescriptionComponent } from './job-description.component';
import { ListJobDiscriptionComponent } from './list-job-discription/list-job-discription.component';

const routes: Routes = [
  { path: '', component: ListJobDiscriptionComponent },
  { path: 'job-list', component: JobDescriptionListComponent },
  { path: 'job-create', component: JobDescriptionCreateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobDescriptionRoutingModule { }
