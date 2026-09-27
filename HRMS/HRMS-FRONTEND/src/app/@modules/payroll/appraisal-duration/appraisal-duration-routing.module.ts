import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DurationListComponent } from './duration-list/duration-list.component';
import { DurationCreateComponent } from './duration-create/duration-create.component';

const routes: Routes = [
  {path:'',component:DurationListComponent},
  {path:'duration-create',component:DurationCreateComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppraisalDurationRoutingModule { }
