import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkStationListComponent } from './work-station-list/work-station-list.component';
import { WorkStationCreateComponent } from './work-station-create/work-station-create.component';
import { WorkStationViewComponent } from './work-station-view/work-station-view.component';

const routes: Routes = [
  {path: '', component: WorkStationListComponent},
  {path: 'create', component: WorkStationCreateComponent},
  {path: 'view', component: WorkStationViewComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkStationRoutingModule { }
