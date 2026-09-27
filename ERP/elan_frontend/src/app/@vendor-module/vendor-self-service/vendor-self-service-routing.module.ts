import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorSelfServiceComponent } from './vendor-self-service.component';
import { VendorDashboardComponent } from './vendor-dashboard/vendor-dashboard.component';

const routes: Routes = [
  {path:'',component:VendorSelfServiceComponent,
     children:[
      {path:'dashboard',component:VendorDashboardComponent},
      {
        path:'vendor-details',
        loadChildren:()=>import('./vendor-details/vendor-details.module').then(
          (m)=>m.VendorDetailsModule
        )
      }
     ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorSelfServiceRoutingModule { }
