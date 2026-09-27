import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaveApplicabilityComponent } from './leave-applicability/leave-applicability.component';
import { LeaveDetailsComponent } from './leave-details/leave-details.component';
import { LeaveEntitlementComponent } from './leave-entitlement/leave-entitlement.component';
import { LeaveRestrictionsComponent } from './leave-restrictions/leave-restrictions.component';
import { LeavePolicyComponent } from './leave-policy.component';
import { PolicyListComponent } from './policy-list/policy-list.component';
import { PolicyInformationComponent } from './policy-information/policy-information.component';





const routes: Routes = [
  { path: '', component: PolicyListComponent },
  {
    path: 'policy-information', component: PolicyInformationComponent,
    children: [
      { path: '', redirectTo: 'leave-details', pathMatch: 'full' }, // Default route
      { path: 'leave-details', component: LeaveDetailsComponent },
      // { path: 'leave-detailsleaveId', component: LeaveDetailsComponent },
      { path: 'leave-entitlement', component: LeaveEntitlementComponent },
      { path: 'leave-applicability', component: LeaveApplicabilityComponent },
      { path: 'leave-restrictions', component: LeaveRestrictionsComponent }
    ]
  },
  // {
  //   path: '',
  //   redirectTo: 'leave-policy',
  //   pathMatch: 'full'
  // }
];







@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class LeavePolicyRoutingModule { }
