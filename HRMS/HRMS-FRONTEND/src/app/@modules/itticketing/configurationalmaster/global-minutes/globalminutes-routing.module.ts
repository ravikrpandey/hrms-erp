import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GlobalMinutesComponent } from './globalminutes.component';

const routes: Routes = [{ path: '', component: GlobalMinutesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GlobalMinutesRoutingModule { }
