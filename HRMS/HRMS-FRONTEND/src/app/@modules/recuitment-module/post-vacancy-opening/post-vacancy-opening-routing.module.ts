import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostOpeningCreateComponent } from './post-opening-create/post-opening-create.component';
import { PostOpeningListComponent } from './post-opening-list/post-opening-list.component';

const routes: Routes = [
  {path:'',redirectTo:'post-opening-list',pathMatch:'full'},
  {path:'post-opening-list', component:PostOpeningListComponent},
  {path:'post-opening-create',component:PostOpeningCreateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostVacancyOpeningRoutingModule { }
