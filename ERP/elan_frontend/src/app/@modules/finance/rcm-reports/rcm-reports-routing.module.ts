import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RcmReportsListComponent } from './rcm-reports-list/rcm-reports-list.component';

const routes: Routes = [
  {
    path:'rcm-purchase-register',component:RcmReportsListComponent
  },
  {
    path:'rcm-liability-summary',component:RcmReportsListComponent
  },
  {
    path:'rcm-itc-summary',component:RcmReportsListComponent
  },
  {
    path:'vendor-wise-rcm-report',component:RcmReportsListComponent
  },  
  {
    path:'sac-wise-rcm-report',component:RcmReportsListComponent
  }, 
   {
    path:'rcm-payment-tracking-report',component:RcmReportsListComponent
  },
  {
    path:'rcm-gl-reconciliation-report',component:RcmReportsListComponent
  },
   {
    path:'rcm-compliance-report',component:RcmReportsListComponent
  },
];
 
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RcmReportsRoutingModule { }
