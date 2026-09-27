import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JournalEntryComponent } from './journal-entry.component';
// import { QuickEntryComponent } from '../quick-entry/quick-entry.component';
import { GeneralListComponent } from './general-list/general-list.component';
const routes: Routes = [
  {path:'',component:GeneralListComponent},
  {path:'journal-entry',component:JournalEntryComponent},
  // {path:'quick-entry',component:QuickEntryComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JournalEntryRoutingModule { }
