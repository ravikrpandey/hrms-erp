import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoticePeriodList } from './notice-period-list';

const routes: Routes = [
{ path: "", component: NoticePeriodList  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoticePeriodListRoutingModule { }
