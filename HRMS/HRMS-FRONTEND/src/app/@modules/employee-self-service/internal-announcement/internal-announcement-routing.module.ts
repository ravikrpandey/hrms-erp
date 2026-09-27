import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnnouncementCreateComponent } from './announcement-create/announcement-create.component';
import { AnnouncementListComponent } from './announcement-list/announcement-list.component';
import { AnnouncementViewComponent } from './announcement-view/announcement-view.component';

const routes: Routes = [
  {path:'', component: AnnouncementListComponent},
  {path:'announcement-create', component: AnnouncementCreateComponent},
  {path:'announment-view', component:AnnouncementViewComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InternalAnnouncementRoutingModule { }
