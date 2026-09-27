import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuditorListComponent } from './auditor-master-list/auditor-master-list.component';

const routes: Routes = [{ 
    path: '', component: AuditorListComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuditorMasterRoutingModule { }
