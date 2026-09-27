import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrgTypeMasterComponent } from './org-type-master.component';

const routes: Routes = [{ path: '', component: OrgTypeMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrgTypeMasterRoutingModule { }
