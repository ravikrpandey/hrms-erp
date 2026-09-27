import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorComponent } from './vendor.component';

const routes: Routes = [
  {
    // path:'', component:VendorComponent,
    // children:[
    //   {
    //     path: '', redirectTo: 'vendor-management', pathMatch: 'full'
    //   },
    //   {
    //     path:'vendor-management',
    //     loadChildren:()=>import('./vendor-management/vendor-management.module').then(m=>m.VendorManagementModule)
    //   }
    // ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorRoutingModule { }
