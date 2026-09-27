import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LearningGalleryComponent } from './learning-gallery.component';

const routes: Routes = [
  // {path:'',component:LearningGalleryComponent},
  // {path:'common-course',component:CommonCourseListComponent}

  {path:'',component:LearningGalleryComponent, 
    children:[
      { path: '', redirectTo: 'common-course', pathMatch: 'full' },
      {
        path: 'common-course',
        loadChildren: () =>
          import('./common-course/common-course.module').then(
            (m) => m.CommonCourseModule
          ),
      },
      {
        path :'allocated-course',
        loadChildren :()=>
          import('./allocated-course/allocated-course.module').then(
            (m) => m.AllocatedCourseModule
          )
        
      },
      {
        path :'requested-course',
        loadChildren :()=>
          import('./requested-course/requested-course.module').then(
            (m) => m.RequestedCourseModule
          )
        
      }
     
    ]
 },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LearningGalleryRoutingModule { }
