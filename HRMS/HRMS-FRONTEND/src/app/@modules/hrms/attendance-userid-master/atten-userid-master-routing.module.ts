import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttUseridComponent } from './atten-userid-master.component';

const routes: Routes = [{ path: '', component: AttUseridComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttUseridMasterRoutingModule { }
