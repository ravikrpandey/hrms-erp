import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorModuleComponent } from './vendor-module.component';

const routes: Routes = [
  {path:'',component:VendorModuleComponent,
    children:[
      {
        path:'ess',
        loadChildren:()=>import('./vendor-self-service/vendor-self-service.module').then(
          (m)=>m.VendorSelfServiceModule
        )
      },
      {
        path:'recruitment',
        loadChildren:()=>import('./recruitment/recruitment.module').then(
          (m)=>m.RecruitmentModule
        )
      },
      {
        path:'manage-rfp',
        loadChildren:()=>import('./manage-rfp/manage-rfp.module').then(
          (m)=>m.ManageRfpModule
        )
      },{
        path:'report',
        loadChildren:()=>import('./report/report.module').then(m=>m.ReportModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorModuleRoutingModule { }
