import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncomeStatementListComponent } from '../income-statement-list/income-statement-list.component';
import { IncomeStatementComponent } from '../income-statement.component';
import { IncomeStatementTabComponent } from './income-statement-tab.component';

const routes: Routes = [
  {
    path:'', component:IncomeStatementTabComponent,
    children:[
      {
        path: '', redirectTo: 'list', pathMatch: 'full'
      },
      {
        path: 'list',
        component: IncomeStatementListComponent
      },
      {
        path: 'pending-for-approval',
        component: IncomeStatementListComponent
      },
      {
        path: 'approved-by-me',
        component: IncomeStatementListComponent
      },
      {
        path: 'rejected',
        component: IncomeStatementListComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncomeStatementTabRoutingModule { }