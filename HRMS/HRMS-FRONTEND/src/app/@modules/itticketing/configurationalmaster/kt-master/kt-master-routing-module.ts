import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KtMasterList } from './kt-master-list/kt-master-list';

const routes: Routes = [
   { path: "", component: KtMasterList  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KtMasterRoutingModule { }
