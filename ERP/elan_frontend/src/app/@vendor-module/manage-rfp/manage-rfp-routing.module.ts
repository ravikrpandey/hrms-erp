import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageRfpComponent } from './manage-rfp.component';

const routes: Routes = [
{path:'',component:ManageRfpComponent,
  children:[
    {
      path:'live-rfp',
      loadChildren:()=>import('./live-rfp/live-rfp.module').then(m=>m.LiveRfpModule)
    },
    {
      path:'closed-rfp',
      loadChildren:()=>import('./closed-rfp/closed-rfp.module').then(m=>m.ClosedRfpModule)
    }
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRfpRoutingModule { }
