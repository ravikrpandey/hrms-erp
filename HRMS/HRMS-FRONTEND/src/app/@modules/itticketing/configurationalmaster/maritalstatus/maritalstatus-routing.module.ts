import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaritalstatusComponent } from './maritalstatus.component';

const routes: Routes = [{ path: '', component: MaritalstatusComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaritalstatusRoutingModule { }
