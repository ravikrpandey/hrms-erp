import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItticketingComponent } from './itticketing.component';

const routes: Routes = [
  {path:'',component:ItticketingComponent,
 children:[
  // {
  //   path:'',redirectTo:'configurational-master', pathMatch:'full'
  // },
  // {
  //   path:'ticket-management',
  //   loadChildren:()=>import('./ticket-management/ticket-management.module').then(m=>m.TicketManagementModule)
  // },

  // {
  //   path:'export-data',
  //   loadChildren:()=>import('./export-data/export-data.module').then(m=>m.ExportDataModule)
  // },
  // {
  //   path:'configurational-master',
  //   loadChildren:()=>import('./configurationalmaster/configurationalmaster.module').then(m=>m.ConfigurationalmasterModule)
  // },
  // {
  // //   path:'expense-management',
  // //   loadChildren:()=>import('./expense-management/expense-management.module').then(m=>m.ExpenseManagementModule)
  // // },
  {
    path:'purchase-inventory',
    loadChildren:()=>import('./purchase-inventory/purchase-inventory.module').then(m=>m.PurchaseInventoryModule)
  },
 ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItticketingRoutingModule { }
