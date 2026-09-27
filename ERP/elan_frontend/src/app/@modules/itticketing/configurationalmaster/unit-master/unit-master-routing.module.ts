import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnitMasterComponent } from './unit-master.component';

const routes: Routes = [{ path: '', component: UnitMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnitMasterRoutingModule { }
