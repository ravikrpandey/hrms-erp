import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndustrySectorMasterComponent } from './industry-sector-master.component';

const routes: Routes = [{ path: '', component: IndustrySectorMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndustrySectorMasterRoutingModule { }
