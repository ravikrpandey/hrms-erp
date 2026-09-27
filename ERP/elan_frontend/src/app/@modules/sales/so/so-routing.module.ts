import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SoListComponent } from './so-list.component';
import { CreateSoComponent } from './create-so/create-so.component';
import { SoHistoryComponent } from './so-history/so-history.component';
import { SoInvoiceComponent } from './so-invoice/so-invoice.component';

const routes: Routes = [
  {
    path: '', component: SoListComponent,

  },
  {
    path: 'create-so',
    component: CreateSoComponent
  },
  {
    path: 'so-history',
    component: SoHistoryComponent
  },
  {
    path: 'so-invoice',
    component: SoInvoiceComponent
  },
  {
    path: 'invoice',
    loadChildren: () => import('./so-invoice/so-invoice.module').then((m) => m.SoInvoiceModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SoRoutingModule { }
