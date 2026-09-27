import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OvertimeMasterComponent } from './overtime-master/overtime-master.component';

const routes: Routes = [{ path: '', component: OvertimeMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OvertimeMasterRoutingModule {}
