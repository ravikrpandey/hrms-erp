import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenerateIrnListComponent } from './generate-irn-list/generate-irn-list.component';

const routes: Routes = [{ path: '' ,component: GenerateIrnListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenerateIrnRoutingModule { }
