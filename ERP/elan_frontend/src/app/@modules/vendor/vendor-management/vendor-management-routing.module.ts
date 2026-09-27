import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorManagementComponent } from './vendor-management.component';

const routes: Routes = [
  {
    path: '', component: VendorManagementComponent,
    children: [

      {
        path: 'vendor-list',
        loadChildren: () => import('./vendor-list/vendor-list.module').then(m => m.VendorListModule),
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorManagementRoutingModule { }
