import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalaryProcessListComponent } from './salary-process-list/salary-process-list.component';
import { SalaryProcessDetailComponent } from './salary-process-detail/salary-process-detail.component';
import { ViewDetailComponent } from './view-detail/view-detail.component';

const routes: Routes = [
  {
    path: '', component: SalaryProcessListComponent,
  },
  {
    path: 'salary-process-detail', component: SalaryProcessDetailComponent,
  },
  {
    path: 'view-detail', component: ViewDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalaryProcessRoutingModule { }
