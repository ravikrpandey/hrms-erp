import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FundTransferComponent } from './fund-transfer.component';
import { RequestForCashbookComponent } from './request-for-cashbook/request-for-cashbook.component';

const routes: Routes = [
  { path: "", component: FundTransferComponent,
  children: [
    {
      path: '', redirectTo: 'all-fr-list', pathMatch: 'full'
    },
    {
      path:'all-fr-list',
      loadChildren:()=>import('./all-fr/all-fr.module').then(m=>m.AllFrModule)
    },
    {
      path:'to-be-approved',
      loadChildren:()=>import('./to-be-approved-fr/to-be-approved-fr.module').then(m=>m.ToBeApprovedFrModule)
    },
    {
      path:'approved-fr',
      loadChildren:()=>import('./approved-fr/approved-fr.module').then(m=>m.ApprovedFrModule)
    },
    {
      path:'rejected-fr',
      loadChildren:()=>import('./rejected-fr/rejected-fr.module').then(m=>m.RejectedFrModule)
    },
  ]},
  {path:"create-fr", component:RequestForCashbookComponent},
  // {path:'approved-pr-update',component:ApprovedPrUpdateComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FundTransferRoutingModule { }
