import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TotalFgComponent } from './total-fg.component';

const routes: Routes = [{ path: '', component: TotalFgComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TotalFgRoutingModule { }
