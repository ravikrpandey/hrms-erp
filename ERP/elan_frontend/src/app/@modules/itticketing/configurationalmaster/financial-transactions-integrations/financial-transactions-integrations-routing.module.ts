import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinancialTransactionListComponent } from './financial-transaction-list.component';
import { AddFinancialTransactionsIntegrationsComponent } from './add-financial-transactions-integrations/add-financial-transactions-integrations.component';

const routes: Routes = [{
  path:'',
  redirectTo: 'financial-transactions-integrations-list',
  pathMatch:'full'
},
{
  path:'financial-transactions-integrations-list',
  component:FinancialTransactionListComponent
},{path:'add-financial-transactions-integrations',component:AddFinancialTransactionsIntegrationsComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinancialTransactionsIntegrationsRoutingModule { }
