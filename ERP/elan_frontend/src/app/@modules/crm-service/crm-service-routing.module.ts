import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrmServiceComponent } from './crm-service.component';
import { ServiceCenterComplaintComponent } from './service-center-complaint/service-center-complaint/service-center-complaint.component';
import { MaterialRequestComponent } from './service-center-complaint/material-request/material-request.component';
import { AddMaterialItemComponent } from './service-center-complaint/add-material-item/add-material-item.component';

const routes: Routes = [
  {
    path: '',
    component: CrmServiceComponent,
    children: [
      {
        path: 'register-complain',
        loadChildren: () => import('./register-complain/register-complain.module').then((m) => m.RegisterComplainModule)
      },
      {
        path: 'open-complaints',
        loadChildren: () => import('./open-complaints/open-complaints.module').then((m) => m.OpenComplaintsModule)
      },
      {
        path: 'crm-service-dashboard',
        loadChildren: () => import('./crm-service-dashboard/crm-service-dashboard.module').then((m) => m.CrmServiceDashbardModule)
      },
      {
        path: 'assign-complain-list',
        loadChildren: () => import('./assign-complain-list/assign-complain-list.module').then((m) => m.AssignComplainListModule)
      },
      {
        path: 'service-center-complaint',
      component:ServiceCenterComplaintComponent
      },
      {
        path: 'material-request',
      component:MaterialRequestComponent
      },
      {
        path: 'add-material-item',
      component:AddMaterialItemComponent
      },
      {
        path: 'all-complaints',
        loadChildren: () => import('./all-complaints/all-complaints.module').then((m) => m.AllComplaintsModule)
      },
      {
        path: 'resolved-complaints',
        loadChildren: () => import('./resolve-complaints/resolved-complaints.module').then((m) => m.ResolvedComplaintsModule)
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrmServiceRoutingModule { }
