import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/@shared/material/material.module';

import { ProjectManagementRoutingModule } from './project-management-routing.module';
import { ProjectManagementComponent } from './project-management.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { ProjectCreateComponent } from './components/project-create/project-create.component';
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';
import { TaskManagementComponent } from './components/task-management/task-management.component';
import { TaskDialogComponent } from './components/task-dialog/task-dialog.component';
import { TaskReviewDialogComponent } from './components/task-review-dialog/task-review-dialog.component';

import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';

@NgModule({
  declarations: [
    ProjectManagementComponent,
    ProjectListComponent,
    ProjectCreateComponent,
    ProjectDetailComponent,
    TaskManagementComponent,
    TaskDialogComponent,
    TaskReviewDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ShairedModule,
    ProjectManagementRoutingModule
  ]
})
export class ProjectManagementModule { }

