import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectManagementComponent } from './project-management.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { ProjectCreateComponent } from './components/project-create/project-create.component';
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';
import { TaskManagementComponent } from './components/task-management/task-management.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectManagementComponent,
    children: [
      {
        path: '',
        redirectTo: 'projects',
        pathMatch: 'full'
      },
      {
        path: 'projects',
        component: ProjectListComponent
      },
      {
        path: 'projects/create',
        component: ProjectCreateComponent
      },
      {
        path: 'projects/edit/:id',
        component: ProjectCreateComponent
      },
      {
        path: 'projects/:id',
        component: ProjectDetailComponent
      },
      {
        path: 'tasks',
        component: TaskManagementComponent
      },
      {
        path: 'timesheet',
        redirectTo: 'projects',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectManagementRoutingModule { }

