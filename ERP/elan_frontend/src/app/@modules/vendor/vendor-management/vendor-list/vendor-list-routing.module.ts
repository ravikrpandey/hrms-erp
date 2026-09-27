import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorListComponent } from './vendor-list.component';
import { ApprovedListComponent } from './approved-list/approved-list.component';

const routes: Routes = [
  {
    path: '',
    component: VendorListComponent,
    children: [
      {
        path: '',
        redirectTo: 'unapproved-list',
        pathMatch: 'full',
      },
      {
        path: 'approved-list',
        loadChildren: () =>
          import('./approved-list/approved-list.module').then(
            (m) => m.ApprovedListModule
          ),
      },
      {
        path: 'unapproved-list',
        loadChildren: () =>
          import('./unapproved-list/unapproved-list.module').then(
            (m) => m.UnapprovedListModule
          ),
      },  
      {
        path: 'rejected-list',
        loadChildren: () =>
          import('./reject-vendor-list/reject-vendor-list.module').then(
            (m) => m.RejectVendorListModule
          ),
      },  
    ]
  },
  {
    path: 'create-vendor',
    loadChildren: () =>
      import('../create-vendor/create-vendor.module').then(
        (m) => m.CreateVendorModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendorListRoutingModule {}
