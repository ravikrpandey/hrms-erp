import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SealTypeComponent } from './seal-type.component';

const routes: Routes = [{ path: '', component: SealTypeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SealTypeRoutingModule { }
