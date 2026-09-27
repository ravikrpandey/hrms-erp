import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncomeStatementComponent } from './income-statement.component';
import { GenerateIncomeStatementComponent } from './generate-income-statement/generate-income-statement.component';
import { TotalRevenueComponent } from './total-revenue/total-revenue.component'
import { OperatingExpenseComponent } from './operating-expense/operating-expense.component'
import { EbitdaComponent } from './ebitda/ebitda.component'
import { DepreciationAmortizationComponent } from './depreciation-amortization/depreciation-amortization.component';
import { VariableCostComponent } from './variable-cost/variable-cost.component'
import { IncomeStatementListComponent } from './income-statement-list/income-statement-list.component';
const routes: Routes = [
  {
    path:'',
    loadChildren: () =>
      import('./income-statement-tab/income-statement-tab.module').then(
        (m) => m.IncomeStatementTabModule
      ),
  },
  {
    path: 'generate-income-statement',
    component: GenerateIncomeStatementComponent,
  },
  {
    path: 'total-revenue',
    component: TotalRevenueComponent,
  },
  {
    path: 'operating-expense',
    component: OperatingExpenseComponent,
  },
  {
    path: 'ebitda',
    component: EbitdaComponent
  },
  {
    path : 'depreciation-amortization',
    component: DepreciationAmortizationComponent
  },
  {
    path : 'variable-cost',
    component: VariableCostComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncomeStatementRoutingModule { }
