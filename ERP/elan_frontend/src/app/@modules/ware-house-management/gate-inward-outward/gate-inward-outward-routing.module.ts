import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GateInwardOutwardComponent } from './gate-inward-outward.component';

const routes: Routes = [{ path: '', component: GateInwardOutwardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GateInwardOutwardRoutingModule { }
