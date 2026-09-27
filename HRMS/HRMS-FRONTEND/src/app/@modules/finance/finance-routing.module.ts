import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinanceComponent } from './finance.component';


// const routes: Routes = [{ path: '', component: FinanceComponent }];


const routes: Routes = [
  {
    path: '', component: FinanceComponent,
    children: [
      {
        path: 'cost-center',
        loadChildren: () =>
          import('./cost-center/cost-center.module').then(
            (m) => m.CostCenterModule
          ),
      },
      
    ]
  }
  
];







@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceRoutingModule { }

