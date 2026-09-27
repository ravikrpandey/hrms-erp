import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TravelManagementComponent } from './travel-management.component';
 

const routes: Routes = [
  {
    path: '', component: TravelManagementComponent,
    children: [
      {
        path: 'upload-tickets',
        loadChildren: () => import('./upload-tickets/upload-tickets.module').then(m => m.UploadTicketsModule),
      },
      {
        path: 'reports',
        loadChildren: () => import('./travel-reports/travel-reports.module').then(m=>m.TravelReportsModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TravelManagementRoutingModule { }
