import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduledJournalsComponent } from './scheduled-journals.component';
import { ScheduledJournalDetailsComponent } from './scheduled-journal-details/scheduled-journal-details.component';

const routes: Routes = [
  {path:'',component:ScheduledJournalsComponent},
  {path:'details',component:ScheduledJournalDetailsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduledJournalsRoutingModule { }
