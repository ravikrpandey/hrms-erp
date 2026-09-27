import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeavetypeComponent } from './leavetype.component';

const routes: Routes = [{ path: '', component: LeavetypeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeavetypeRoutingModule { }
