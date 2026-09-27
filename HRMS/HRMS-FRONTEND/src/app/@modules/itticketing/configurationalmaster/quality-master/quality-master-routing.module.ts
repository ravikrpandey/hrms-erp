import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QualityListComponent } from './quality-list/quality-list.component';
import { QualityCreateComponent } from './quality-create/quality-create.component';

const routes: Routes = [
  {
    path:'',component: QualityListComponent
  },
  {
    path:'create',component: QualityCreateComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QualityMasterRoutingModule { }
